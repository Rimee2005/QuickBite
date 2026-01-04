// pages/_app.tsx
// Note: This file is kept for compatibility but Socket.IO is now handled by server.js
import type { AppProps } from 'next/app'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  )
}
