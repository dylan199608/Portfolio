/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Deployed site URL exactly as configured (may be empty or end in a slash); vite.config.ts normalizes it for index.html. */
  readonly VITE_SITE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
