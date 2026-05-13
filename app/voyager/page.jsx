"use client"

import '@/app/styles/pages/voyager.css'
import { useTheme } from 'next-themes'
import Map from '@/app/ui/map_fuel.jsx'


export default function Travel() {

    const { theme, setTheme } = useTheme()

    return <main>
        <Map selectedStyle={theme} selectedFuel={fuelType}/>
    </main>
}