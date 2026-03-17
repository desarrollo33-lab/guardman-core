/**
 * GUARDMAN - API Route: Sitemap XML
 * GET /api/guardman/sitemap.xml
 * 
 * Genera sitemap dinámico basado en las colecciones
 */

import { NextRequest, NextResponse } from 'next/server'

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.SITE_URL || 'https://guardman.cl'

    // Obtener datos de Payload
    const [locationsRes, servicesRes, seoPagesRes, blogRes] = await Promise.all([
      fetch(`${PAYLOAD_URL}/api/locations?limit=100`, { headers: { 'Content-Type': 'application/json' } }),
      fetch(`${PAYLOAD_URL}/api/services?limit=50`, { headers: { 'Content-Type': 'application/json' } }),
      fetch(`${PAYLOAD_URL}/api/seo-pages?where[status][equals]=published&limit=100`, { headers: { 'Content-Type': 'application/json' } }),
      fetch(`${PAYLOAD_URL}/api/blog?where[status][equals]=published&limit=50`, { headers: { 'Content-Type': 'application/json' } }),
    ])

    const [locations, services, seoPages, blog] = await Promise.all([
      locationsRes.json() as Promise<{ docs?: Array<{ slug: string }> }>,
      servicesRes.json() as Promise<{ docs?: Array<{ slug: string }> }>,
      seoPagesRes.json() as Promise<{ docs?: Array<{ slug: string }> }>,
      blogRes.json() as Promise<{ docs?: Array<{ slug: string }> }>,
    ])

    // Construir URLs
    const urls: Array<{ loc: string; changefreq: string; priority: string }> = [
      { loc: '/', changefreq: 'daily', priority: '1.0' },
      { loc: '/servicios', changefreq: 'weekly', priority: '0.9' },
      { loc: '/industrias', changefreq: 'weekly', priority: '0.8' },
      { loc: '/personas', changefreq: 'weekly', priority: '0.8' },
      { loc: '/zonas', changefreq: 'weekly', priority: '0.8' },
      { loc: '/contacto', changefreq: 'monthly', priority: '0.8' },
      { loc: '/blog', changefreq: 'daily', priority: '0.8' },
    ]

    // Agregar comunas
    locations.docs?.forEach((loc) => {
      urls.push({ loc: `/zonas/${loc.slug}`, changefreq: 'weekly', priority: '0.8' })
    })

    // Agregar servicios
    services.docs?.forEach((svc) => {
      urls.push({ loc: `/servicios/${svc.slug}`, changefreq: 'weekly', priority: '0.8' })
    })

    // Agregar páginas SEO
    seoPages.docs?.forEach((page) => {
      urls.push({ loc: `/${page.slug}`, changefreq: 'weekly', priority: '0.7' })
    })

    // Agregar blog posts
    blog.docs?.forEach((post) => {
      urls.push({ loc: `/blog/${post.slug}`, changefreq: 'monthly', priority: '0.6' })
    })

    // Generar XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error('[API] Error generating sitemap:', error)
    
    // Sitemap básico en caso de error
    const baseUrl = process.env.SITE_URL || 'https://guardman.cl'
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

    return new NextResponse(sitemap, {
      status: 200,
      headers: { 'Content-Type': 'application/xml' },
    })
  }
}
