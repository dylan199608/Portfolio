/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin, type ResolvedConfig } from 'vite'

const PLACEHOLDER = '%VITE_SITE_URL%'

/**
 * The deployed site URL, without a trailing slash: VITE_SITE_URL first, then the production URL that Vercel or
 * Netlify expose at build time. Returns '' when none is known.
 */
function resolveSiteUrl(env: Record<string, string>): string {
  const raw =
    env.VITE_SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
    (env.NETLIFY === 'true' ? (env.URL ?? '') : '')
  const siteUrl = raw.trim().replace(/\/+$/, '')
  if (siteUrl && !/^https?:\/\/[^/\s]+/.test(siteUrl)) {
    throw new Error(`VITE_SITE_URL must be an absolute http(s) URL, such as https://your-domain.com (got "${raw}").`)
  }
  return siteUrl
}

/**
 * Fills the %VITE_SITE_URL% placeholders in index.html (canonical, og:url, og:image, twitter:image, JSON-LD url).
 * Without a site URL it removes those tags, and the image metadata that depends on them, rather than shipping
 * root-relative URLs that crawlers reject.
 */
function siteUrlPlugin(siteUrl: string): Plugin {
  let config: ResolvedConfig | undefined

  return {
    name: 'site-url',
    configResolved(resolved) {
      config = resolved
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (siteUrl) return html.replaceAll(PLACEHOLDER, siteUrl)

        if (config?.command === 'build') {
          config.logger.warn(
            '(!) VITE_SITE_URL is not set: canonical, og:url, og:image, twitter:image and JSON-LD url are omitted.',
          )
        }

        const stripped = html
          // Tags whose URL needs the site URL: canonical, og:url, og:image, twitter:image.
          .replace(/^[ \t]*<(?:link|meta)\b[^>]*%VITE_SITE_URL%[^>]*>[ \t]*\r?\n/gm, '')
          // Image details that make no sense without the image (including multi-line tags).
          .replace(/^[ \t]*<meta\s+(?:property="og:image:[\w:]+"|name="twitter:image:alt")[^>]*>[ \t]*\r?\n/gm, '')
          .replace('content="summary_large_image"', 'content="summary"')
          // The JSON-LD "url" line; its trailing comma keeps the JSON valid.
          .replace(/^[ \t]*"url": "%VITE_SITE_URL%\/",[ \t]*\r?\n/m, '')

        if (stripped.includes(PLACEHOLDER)) {
          throw new Error(`index.html has a ${PLACEHOLDER} placeholder that the site-url plugin does not handle.`)
        }
        return stripped
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [siteUrlPlugin(resolveSiteUrl(loadEnv(mode, process.cwd(), ''))), react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    clearMocks: true,
  },
}))
