"use client"

import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';

import 'dotenv/config'

mapboxgl.accessToken = process.env.MAPBOXGL_PUBLIC_TOKEN

export default function Map() {
  const mapRef = useRef(null)
  const mapContainerRef = useRef(null)

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-71.06776, 42.35816], // starting position [lng, lat]. Note that lat must be set between -90 and 90
      zoom: 9 // starting zoom
    });

    return () => {
        if (mapRef.current) {
            mapRef.current.remove()
        }
    }
  }, [])

  return (
    <>
      <div id='map-container' ref={mapContainerRef}/>
    </>
  )
}