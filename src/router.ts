// guardman-gateway - Router Worker
// Routing based on: https://developers.cloudflare.com/workers/framework-guides/web-apps/microfrontends/

export interface Env {
  // Service bindings
  CMS: any
  PUBLIC: any
  // Vars
  ENVIRONMENT: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname

    // Route configuration
    // CMS handles: /admin/* and /api/*
    // PUBLIC handles: /* (everything else)
    
    const routes = [
      { pattern: /^\/admin(\/.*)?$/, binding: 'CMS', prefix: '/admin' },
      { pattern: /^\/api(\/.*)?$/, binding: 'CMS', prefix: '/api' },
      { pattern: /^\/.*$/, binding: 'PUBLIC', prefix: '' }
    ]

    for (const route of routes) {
      if (route.pattern.test(path)) {
        // Get the service binding
        const service = env[route.binding as keyof Env]
        
        if (!service) {
          return new Response(`Service binding ${route.binding} not configured`, {
            status: 500
          })
        }

        // Remove the prefix from the path
        const newPath = route.prefix 
          ? path.replace(new RegExp(`^${route.prefix}`), '') || '/'
          : path

        // Create new URL with the modified path
        const newUrl = new URL(request.url)
        newUrl.pathname = newPath

        // Forward the request to the microfrontend
        const newRequest = new Request(newUrl.toString(), {
          method: request.method,
          headers: request.headers,
          body: request.body,
          redirect: 'manual'
        })

        try {
          const response = await service.fetch(newRequest)
          
          // If it's HTML, rewrite links for smooth experience
          if (response.headers.get('content-type')?.includes('text/html')) {
            return await this.rewriteHTML(response, route.prefix)
          }
          
          return response
        } catch (err) {
          console.error(`Error forwarding to ${route.binding}:`, err)
          return new Response(`Error calling ${route.binding}`, { status: 502 })
        }
      }
    }

    return new Response('No route matched', { status: 404 })
  },

  async rewriteHTML(response: Response, prefix: string): Promise<Response> {
    if (!prefix) return response

    const html = await response.text()
    
    // Rewrite absolute paths to include prefix
    // This is a simplified version - full implementation would use HTMLRewriter
    const rewritten = html.replace(
      new RegExp(`(href|src)=["'](/[^"']*)["']`, 'g'),
      `$1="${prefix}$2"`
    )

    return new Response(rewritten, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers),
        'content-type': 'text/html'
      }
    })
  }
}
