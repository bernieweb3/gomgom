"use client"
import { http, createConfig } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors"

// Define Lisk Sepolia chain
const liskSepolia = {
  id: 4202,
  name: 'Lisk Sepolia',
  network: 'lisk-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
    public: {
      http: ['https://rpc.sepolia-api.lisk.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Lisk Sepolia Explorer', url: 'https://sepolia-blockscout.lisk.com' },
  },
  testnet: true,
} as const

// Ensure WalletConnect Project ID is provided via env.
const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID;
if (!WC_PROJECT_ID) {
  throw new Error(
    "NEXT_PUBLIC_WC_PROJECT_ID env variable is missing. Please create one in WalletConnect Cloud and set it in .env.local"
  );
}

export const config = createConfig({
  chains: [mainnet, sepolia, liskSepolia],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({
      projectId: WC_PROJECT_ID,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [liskSepolia.id]: http('https://rpc.sepolia-api.lisk.com'),
  },
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
