import { createThirdwebClient } from "thirdweb";

// Create the thirdweb client with your client ID from the dashboard
export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "your-client-id-here",
});

// Chiliz Chain configuration
export const chilizChain = {
  id: 88888,
  name: "Chiliz Chain",
  network: "chiliz",
  nativeCurrency: {
    decimals: 18,
    name: "CHZ",
    symbol: "CHZ",
  },
  rpc: "https://rpc.ankr.com/chiliz",
  rpcUrls: {
    default: {
      http: ["https://rpc.ankr.com/chiliz"],
    },
    public: {
      http: ["https://rpc.ankr.com/chiliz"],
    },
  },
  blockExplorers: [
    { name: "ChilizScan", url: "https://chiliscan.com" },
  ],
};

// Chiliz Spicy Testnet configuration
export const chilizSpicyChain = {
  id: 88882,
  name: "Chiliz Spicy Testnet",
  network: "chiliz-spicy",
  nativeCurrency: {
    decimals: 18,
    name: "CHZ",
    symbol: "CHZ",
  },
  rpcUrls: {
    default: {
      http: ["https://spicy-rpc.chiliz.com"],
    },
    public: {
      http: ["https://spicy-rpc.chiliz.com"],
    },
  },
  blockExplorers: {
    default: { name: "Chiliz Spicy Explorer", url: "https://spicy-explorer.chiliz.com" },
  },
  testnet: true,
};
