"use client"

import { ThemeProvider } from 'next-themes'

import '@/app/styles/globals.css'


export default function Layout({ children }) {
  return <html suppressHydrationWarning>
    <body>
      <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </body>
  </html>
}
