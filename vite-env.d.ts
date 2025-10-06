/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_TAITA_EMAIL: string;
  // Agrega aquí otras variables si las necesitas
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
