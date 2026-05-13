"use client"

import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import 'dotenv/config'

import dataset from '@/prixCarburant/dataset.json'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOXGL_PUBLIC_TOKEN

export default function Map({selectedStyle, selectedFuel}) {
	
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

        mapRef.current.on('load', () => {
            /*mapRef.current.addInteraction('map-click', {
                type: 'click',
                handler: onMapClick
            })*/

            if (!mapRef.current.getSource("fuel")) {
                mapRef.current.addSource("fuel", {
                    type: "geojson",
                    data: dataset
                })
            }

            mapRef.current.addLayer({
                id: 'gas-station',
                type: 'circle',
                source: 'fuel',
                paint: {
                    'circle-radius': 6,
                    'circle-color': [
                      'interpolate',
                      ['linear'],
                      ['get', `${selectedFuel}`],
                      1,
                      'rgba(33,102,172,0)',
                      2,
                      'rgb(103,169,207)',
                      3,
                      'rgb(209,229,240)',
                      4,
                      'rgb(253,219,199)',
                      5,
                      'rgb(239,138,98)',
                      6,
                      'rgb(178,24,43)'
                    ],
                }
            })
        });
        mapRef.current.setStyle(`mapbox://styles/mapbox/${styleName}`)
      }
      
  }, [selectedStyle])

  return (
    <>
      <div id='map-container' ref={mapContainerRef}/>
    </>
  )
}