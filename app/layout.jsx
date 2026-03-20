"use client"

import { ThemeProvider } from 'next-themes'
import NavBar from '@/app/ui/navbar'
import localFont from 'next/font/local'

import '@/app/styles/globals.css'


const googleSansFlex = localFont({
  src: './fonts/GoogleSansFlex.ttf',
  variable: '--font-google-sans-flex',
  weight: '100 900', // variable font
})


export default function Layout({ children }) {
  return <html suppressHydrationWarning className={googleSansFlex.variable}>
    <body>
      <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
        <NavBar />
        {children}
      </ThemeProvider>
    </body>
  </html>
}
