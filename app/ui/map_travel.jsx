"use client"

import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import 'dotenv/config'

import dataset from '@/prixCarburant/dataset.json'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOXGL_PUBLIC_TOKEN

export default function Map({selectedStyle}) {
	
  const mapRef = useRef(null)
  const mapContainerRef = useRef(null)

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      //style : 'mapbox://styles/mapbox/dark-v11',
      style : `mapbox://styles/mapbox/light-v11`,
      center: [2.348417, 47.202833], // starting position [lng, lat]. Note that lat must be set between -90 and 90
      zoom: 5.5 // starting zoom
    });

    return () => {
        if (mapRef.current) {
            mapRef.current.remove()
            
        }
    }
    
  }, [])

  useEffect(() => {
      if(selectedStyle && mapRef.current) {
        let styleName = selectedStyle
        switch (selectedStyle) {
          case "system" :
            styleName = "standard"
            break
          case "light" :
            styleName = "navigation-day-v1"
            break
          case "dark" :
            styleName = "navigation-night-v1"
            break
        }
        
        mapRef.current.setStyle(`mapbox://styles/mapbox/${styleName}`)
      }
      
  }, [selectedStyle])

  return (
    <>
      <div id='map-container' ref={mapContainerRef}/>
    </>
  )
}