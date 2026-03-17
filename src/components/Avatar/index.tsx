'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'
import './avatar.css'
export const CustomAvatar: React.FC = () => {
  const { user } = useAuth()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchAvatar = async () => {
      // If it's already populated
      if (user.avatar && typeof user.avatar === 'object' && 'url' in user.avatar) {
        setAvatarUrl((user.avatar as any).url as string)
        return
      }

      // If it's just an ID
      if (user.avatar && (typeof user.avatar === 'string' || typeof user.avatar === 'number')) {
        try {
          const res = await fetch(`/api/media/${user.avatar}`)
          if (res.ok) {
            const data = (await res.json()) as any;
            if (data?.url) {
              setAvatarUrl(data.url)
            }
          }
        } catch (error) {
          console.error('Error fetching avatar:', error)
        }
      }
    }

    fetchAvatar()
  }, [user])

  const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    sales: 'Vendedor',
    seo_manager: 'SEO Manager',
    support: 'Atención al Cliente'
  }

  const userName = user?.name || user?.email || 'Usuario'
  const userRoleStr = user?.role as string
  const userRole = userRoleStr ? roleLabels[userRoleStr] || userRoleStr : ''

  const renderTextBlock = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '12px', textDecoration: 'none' }}>
      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--theme-text)', lineHeight: '1.2', textDecoration: 'none' }}>{userName}</span>
      {userRole && <span style={{ fontSize: '11px', color: 'var(--theme-elevation-400)', lineHeight: '1.2', marginTop: '2px', textDecoration: 'none' }}>{userRole}</span>}
    </div>
  )

  if (avatarUrl) {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {renderTextBlock()}
        <div style={{ width: '32px', height: '32px', flexShrink: 0 }}>
          <img
            src={avatarUrl}
            alt={userName}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>
    )
  }

  // Fallback to initial
  const initial = user?.name ? user.name.charAt(0) : (user?.email?.charAt(0) || '?')

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {renderTextBlock()}
      <div
        style={{
          width: '32px',
          height: '32px',
          flexShrink: 0,
          borderRadius: '50%',
          backgroundColor: 'var(--theme-elevation-200, #eee)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          color: 'var(--theme-text, #333)',
        }}
      >
        {initial}
      </div>
    </div>
  )
}
