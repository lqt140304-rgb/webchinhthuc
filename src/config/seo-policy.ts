/**
 * SEO Policy by Environment
 * Sourced according to CEO Directive 055-A Section VII (H10).
 *
 * Distinguishes Local/Spike vs Vercel Preview vs Production environments.
 */

declare const __APP_ENV__: string | undefined
declare const process: { env?: Record<string, string | undefined> } | undefined

export type AppEnvironment = 'local' | 'preview' | 'production'

export function getAppEnvironment(): AppEnvironment {
  // 1. Statically injected build-time constant (injected by Vite define, identical in SSR prerender & client bundle)
  if (typeof __APP_ENV__ !== 'undefined' && __APP_ENV__) {
    if (__APP_ENV__ === 'production' || __APP_ENV__ === 'preview') {
      return __APP_ENV__ as AppEnvironment
    }
    return 'local'
  }

  // 2. Node.js runtime fallback (for standalone unit tests or scripts running outside Vite)
  if (typeof process !== 'undefined' && process?.env) {
    const envVal = process.env.VERCEL_ENV || process.env.VITE_APP_ENV || process.env.APP_ENV
    if (envVal === 'production') {
      return 'production'
    }
    if (envVal === 'preview') {
      return 'preview'
    }
  }

  // 3. Browser meta.env fallback if present
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> })?.env
    if (metaEnv?.VITE_VERCEL_ENV === 'production' || metaEnv?.VITE_APP_ENV === 'production') {
      return 'production'
    }
    if (metaEnv?.VITE_VERCEL_ENV === 'preview' || metaEnv?.VITE_APP_ENV === 'preview') {
      return 'preview'
    }
  } catch {
    // fallback to local
  }

  return 'local'
}

export interface RouteSeoPolicy {
  robots: string
  isIndexable: boolean
  canonicalUrl?: string
}

export function getRouteSeoPolicy(pathname: string): RouteSeoPolicy {
  const env = getAppEnvironment()

  // 1. Local & Preview Environments:
  // ALWAYS enforce noindex, nofollow to protect non-production deployments from search engine crawler indexing.
  // Never publish unverified canonical URLs.
  if (env !== 'production') {
    return {
      robots: 'noindex, nofollow',
      isIndexable: false,
      canonicalUrl: undefined,
    }
  }

  // 2. Production Environment (Future Specification - Not activated in Spike):
  // Private / internal routes are ALWAYS protected by noindex regardless of environment.
  if (pathname.startsWith('/tai-khoan') || pathname.startsWith('/quan-ly')) {
    return {
      robots: 'noindex, nofollow',
      isIndexable: false,
      canonicalUrl: undefined,
    }
  }

  // Public pages on Production: only indexable after passing Content Evidence Gate
  // Only the homepage is tentatively candidate for indexing once approved by the project owner.
  const APPROVED_PRODUCTION_ROUTES = ['/']
  const isApproved = APPROVED_PRODUCTION_ROUTES.includes(pathname)

  if (isApproved) {
    return {
      robots: 'index, follow',
      isIndexable: true,
      canonicalUrl: undefined, // Only use official domain confirmed by owner
    }
  }

  // Default for pending / unverified pages in production: noindex
  return {
    robots: 'noindex, nofollow',
    isIndexable: false,
    canonicalUrl: undefined,
  }
}
