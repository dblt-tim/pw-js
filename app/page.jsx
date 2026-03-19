"use client"

import { MapMouseEvent } from 'mapbox-gl'
import { useRouter } from 'next/navigation'

import { PathIcon, CarIcon, TrainIcon } from '@phosphor-icons/react'

import NavBar from '@/app/ui/navbar'

import '@/app/styles/pages/landing_page.css'

export default function LandingPage() {
  
  const router = useRouter()

  return <main>
    <NavBar />

    <h1 id="mainTitle">GamMap</h1>
    <h2 id="mainSubtitle">Planifiez vos trajets, voyagez en toute sérénité</h2>

    <section id="travel-btns">
      <button onClick={() => router.push("/voyager")}> <PathIcon weight="fill" /> Voyager </button>
      <button onClick={() => router.push("/voyager/itineraire")}> <CarIcon weight="fill" /></button>
      <button onClick={() => router.push("/voyager/train")}> <TrainIcon weight="fill" /></button>
    </section>
  </main>
}