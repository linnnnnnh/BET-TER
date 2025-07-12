import { createThirdwebClient, defineChain } from "thirdweb";

// Create the thirdweb client with your client ID from the dashboard
export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "your-client-id-here",
});


// Chiliz Spicy Testnet configuration
export const chilizSpicyChain = defineChain({
  id: 88882,
  name: "Chiliz Spicy Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "CHZ",
    symbol: "CHZ",
  },
  rpc: "https://spicy-rpc.chiliz.com/",
  blockExplorers: [
    { name: "Chiliz Spicy Explorer", url: "https://spicy-explorer.chiliz.com" },
  ],
  testnet: true,
});
