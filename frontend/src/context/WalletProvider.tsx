// import { useMemo } from 'react'
// import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
// import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
// import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
// import { clusterApiUrl, type Cluster } from '@solana/web3.js'
// import '@solana/wallet-adapter-react-ui/styles.css'

// const NETWORK = (import.meta.env.VITE_SOLANA_NETWORK ?? 'devnet') as Cluster

// export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
//   const endpoint = useMemo(() => clusterApiUrl(NETWORK), [])
//   const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [])

//   return (
//     <ConnectionProvider endpoint={endpoint}>
//       <WalletProvider wallets={wallets} autoConnect>
//         <WalletModalProvider>{children}</WalletModalProvider>
//       </WalletProvider>
//     </ConnectionProvider>
//   )
// }


import { useMemo } from 'react'

import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'

import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'

import { clusterApiUrl } from '@solana/web3.js'

import '@solana/wallet-adapter-react-ui/styles.css'

export function SolanaWalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const endpoint = useMemo(() => {
    return (
      import.meta.env.VITE_SOLANA_RPC_URL ||
      clusterApiUrl('devnet')
    )
  }, [])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}