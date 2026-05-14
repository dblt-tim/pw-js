"use client"

import '@/app/styles/pages/voyager.css'
import '@/app/styles/pages/voyager/itineraire.css'
import { useTheme } from 'next-themes'
import Map from '@/app/ui/map_travel.jsx'
import { HouseIcon, GithubLogoIcon, LaptopIcon, SunHorizonIcon, MoonStarsIcon } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Itineraire() {
	const router = useRouter();

	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)
  
	useEffect(() => {  // useEffect only works on the client
    	setMounted(true) // -> we can retrieve the client's system theme
  	}, [])
	if (!mounted) {
    	return null // don't render on server's side
  	}
	
	const themes = ["system", "light", "dark"]
  	const themeIndex = themes.indexOf(theme)
  	function handle_TS_Click() { // change theme state every click
   		setTheme(themes[(themeIndex + 1) % themes.length])
  	}

	return <main id="map">
		<div>
			<Map selectedStyle={theme}/>
		</div>
		
		<button id="home-btn" onClick={() => {router.push("/")}}>
			<HouseIcon />
		</button>
		
		<button id="github-repo" onClick={() => {window.open("https://github.com/dblt-tim/pw-js", "_blank", "noopener,noreferrer")}}>
			<GithubLogoIcon />
		</button>
		<button id="theme-switcher" onClick={handle_TS_Click}>
			{theme === "system" && <LaptopIcon weight="fill" />} 
			{theme === "light" && <SunHorizonIcon weight="fill" />}
			{theme === "dark" && <MoonStarsIcon weight="fill" />}
		</button>
      
  </main>
}