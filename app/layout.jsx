"use client"

import { ThemeProvider } from 'next-themes'
import NavBar from '@/app/ui/navbar'
import Footer from '@/app/ui/footer'

import { Lora, Outfit } from 'next/font/google'

import '@/app/styles/globals.css'

const lora = Lora({
	subsets: ['latin']
})
const outfit = Outfit({
	subsets: ['latin']
})


export default function Layout({ children }) {
  return <html suppressHydrationWarning >
    <body className={`${lora.variable} ${outfit.variable} font-sans`}>
      <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
        <NavBar />
        {children}
        <Footer />
      </ThemeProvider>
    </body>
  </html>
}
