import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'

import '../styles/index.css'
import 'focus-visible'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <Head>
        <title>Commit - Open-source Git client for macOS minimalists</title>
        <meta
          name="description"
          content="Commit is a lightweight Git client you can open from anywhere any time you’re ready to commit your work with a single keyboard shortcut. It’s fast, beautiful, and completely unnecessary."
        />
      </Head>
      <SessionProvider session={session}>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    </>
  )
}
