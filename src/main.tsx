import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { WagmiProvider } from "wagmi"
import { baseSepolia } from "viem/chains"
import { http, createConfig } from "wagmi"
import { hashFn } from "@wagmi/core/query"
import { metaMask } from "wagmi/connectors"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
const config = createConfig({
  connectors: [
    metaMask({
      dappMetadata: {
        name: "PredX-miniapp",
        url: window.location.protocol + "//" + window.location.host,
      },
      useDeeplink: false,
    }),
  ],
  multiInjectedProviderDiscovery: false,
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: hashFn,
    },
  },
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
