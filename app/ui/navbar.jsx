"use client"

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import {SunIcon, MoonStarsIcon, LaptopIcon, GithubLogoIcon } from '@phosphor-icons/react'

import '@/app/styles/components/navbar.css'
import { useRouter } from 'next/navigation'

function LeftElements() {

  const router = useRouter()

  return <section className="l-elements">
    <button className="title-btn" onClick={() => {router.push("/")}}>
      <h1>GamMap</h1>
    </button>
  </section>
}

function RightElements() {

  // theme switcher
  // source doc : https://github.com/pacocoursey/next-themes?tab=readme-ov-file#avoid-hydration-mismatch
  const { theme, setTheme } = useTheme()
  const [ mounted, setMounted ] = useState(false)

  useEffect(() => {  // useEffect only works on the client
    setMounted(true) // -> we can retrieve the client's system theme
  }, [])

  if (!mounted) {
    return null // don't render on server's side
  }

  // theme switcher button state handling
  const themes = ["system", "light", "dark"]
  const themeIndex = themes.indexOf(theme)
  function handle_TS_Click() { // change theme state every click
    setTheme(themes[(themeIndex + 1) % themes.length])
  }

  return <section className="r-elements">

    <button className="icon-btn" onClick={() => {window.open("https://github.com/dblt-tim/pw-js", "_blank", "noopener,noreferrer")}}>
      <GithubLogoIcon weight="fill" />
    </button>

    <button onClick={handle_TS_Click} className="icon-btn"> 
      {theme === "system" && <LaptopIcon weight="fill" />} {/* TODO : switch icons in a cleaner way */}
      {theme === "light" && <SunIcon weight="fill" />}
      {theme === "dark" && <MoonStarsIcon weight="fill" />}
    </button>
  </section>
}


export default function NavBar() {


  return <nav id="navbar">
    <LeftElements /> <RightElements />
  </nav>
}