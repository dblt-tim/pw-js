"use client"

import '@/app/styles/pages/voyager.css'
import '@/app/styles/pages/voyager/fuel.css'
import { useTheme } from 'next-themes'
import MapFuel from '@/app/ui/map_fuel'
import { HouseIcon, GithubLogoIcon, LaptopIcon, SunHorizonIcon, MoonStarsIcon } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Itineraire() {
	
	const router = useRouter();

	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)
	const [fuelType, setFuelType] = useState("gazole_prix")
  
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
		<div id="map">
			<MapFuel selectedStyle={theme} selectedFuel={fuelType}/>
		</div>
		
		<form id="fuel-search">
			<select value={fuelType} selected="Gazole" onChange={(e) => setFuelType(e.target.value)}>
				<option value="gazole_prix">Gazole</option>
				<option value="e85_prix">E85</option>
				<option value="gplc_prix">GPLc</option>
				<option value="e10_prix">E10</option>
				<option value="sp98_prix">SP98</option>
				<option value="sp95_prix">SP95</option>
			</select>
		</form>
		
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