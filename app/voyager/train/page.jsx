"use client"

import { useState } from "react"
import { MagnifyingGlassIcon } from '@phosphor-icons/react'

import '@/app/styles/pages/voyager/train.css'

export default function Train() {
  
  const [depart, setDepart] = useState("")
  const [arrivee, setArrivee] = useState("")
  
  function handleSubmit(e) {
    e.preventDefault()
    
    const form = e.target
    const formData = new FormData(form)
    
    console.log(formData)
  }

  return <main>
    <form id="train-search-bar" onSubmit={handleSubmit} method="post">
      <input name="depart" type="search" value={depart} onChange={e => setDepart(e.target.value)} placeholder="D'où venez-vous ?" required />
      
      <span className="separator">|</span>
      
      <input name="arrivee" type="search" value={arrivee} onChange={e => setArrivee(e.target.value)} placeholder="Où allez-vous ?" required />
      
      <span className="separator">|</span>
      
      <select name="format-date" required>
        <option value="1">Partir le</option>
        <option value="2">Arriver le</option>
      </select>
      <div id="date">
        <input type="number" name="date-day" placeholder="1" required />
        <select name="date-month" required>
          <option value="1">Janvier</option>
          <option value="2">Février</option>
          <option value="3">Mars</option>
          <option value="4">Avril</option>
          <option value="5">Mai</option>
          <option value="6">Juin</option>
          <option value="7">Juillet</option>
          <option value="8">Août</option>
          <option value="9">Septembre</option>
          <option value="10">Octobre</option>
          <option value="11">Novembre</option>
          <option value="12">Décembre</option>
        </select>
        <input type="number" name="date-year" placeholder={new Date().getFullYear()} />
      </div>
      <span className="date-time-separator">à</span>
      <input type="number" name="time-hour" />
      <input type="number" name="time-minutes" />
      <MagnifyingGlassIcon weight="duotone" onClick={handleSubmit} />
    </form>
  </main>
}