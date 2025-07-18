/// <reference types="vite/client" />

// Environment variables type definitions
interface ImportMetaEnv {
  readonly VITE_THIRDWEB_CLIENT_ID: string
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_AI_VIDEO_API_KEY: string
  readonly VITE_CONTRACT_ADDRESS: string
  readonly VITE_PSG_TOKEN_ADDRESS: string
  readonly VITE_HEATMAP_CONTRACT_ADDRESS: string
  readonly VITE_TREASURY_CONTRACT_ADDRESS: string
  readonly VITE_BACKEND_API_URL: string
  readonly VITE_PYTH_ENDPOINT: string
  readonly VITE_USE_TESTNET: string
  readonly VITE_NETWORK_ENV: string
  readonly VITE_ENABLE_DEBUG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
