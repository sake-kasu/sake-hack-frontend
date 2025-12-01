/// <reference types="vite/client" />

type ImportMetaEnv = {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
}

type ImportMeta = {
  readonly env: ImportMetaEnv
}
