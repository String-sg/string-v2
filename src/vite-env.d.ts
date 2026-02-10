/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GA_MEASUREMENT_ID: string;
  readonly VITE_ENABLE_GA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}