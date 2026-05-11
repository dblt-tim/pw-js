"use client"

import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import 'dotenv/config'

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

    mapRef.current.addControl(new mapboxgl.NavigationControl());
    mapRef.current.scrollZoom.disable();

    return () => {
        if (mapRef.current) {
            mapRef.current.remove()
            
        }
    }
    
  }, [])

  useEffect(() => {
      if(selectedStyle && mapRef.current) {
        switch (selectedStyle) {
          case "system" :
            selectedStyle = "standard"
            break
          case "light" :
            selectedStyle = "navigation-day-v1"
            break
          case "dark" :
            selectedStyle = "navigation-night-v1"
            break
        }
        mapRef.current.setStyle(`mapbox://styles/mapbox/${selectedStyle}`)

        mapRef.current.on('load', () => {
                // Add a geojson point source.
                // Heatmap layers also work with a vector tile source.
                mapRef.current.addSource('earthquakes', {
                    'type': 'geojson',
                    'data': 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
                });

                mapRef.current.addLayer({
                    'id': 'earthquakes-heat',
                    'type': 'heatmap',
                    'source': 'earthquakes',
                    'maxzoom': 9,
                    'paint': {
                        // Increase the heatmap weight based on frequency and property magnitude
                        'heatmap-weight': [
                            'interpolate',
                            ['linear'],
                            ['get', 'mag'],
                            0,
                            0,
                            6,
                            1
                        ],
                        // Increase the heatmap color weight weight by zoom level
                        // heatmap-intensity is a multiplier on top of heatmap-weight
                        'heatmap-intensity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            0,
                            1,
                            9,
                            3
                        ],
                        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
                        // Begin color ramp at 0-stop with a 0-transparancy color
                        // to create a blur-like effect.
                        'heatmap-color': [
                            'interpolate',
                            ['linear'],
                            ['heatmap-density'],
                            0,
                            'rgba(33,102,172,0)',
                            0.2,
                            'rgb(103,169,207)',
                            0.4,
                            'rgb(209,229,240)',
                            0.6,
                            'rgb(253,219,199)',
                            0.8,
                            'rgb(239,138,98)',
                            1,
                            'rgb(178,24,43)'
                        ],
                        // Adjust the heatmap radius by zoom level
                        'heatmap-radius': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            0,
                            2,
                            9,
                            20
                        ],
                        // Transition from heatmap to circle layer by zoom level
                        'heatmap-opacity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            7,
                            1,
                            9,
                            0
                        ]
                    },
                    slot: 'top'
                });

                mapRef.current.addLayer({
                    'id': 'earthquakes-point',
                    'type': 'circle',
                    'source': 'earthquakes',
                    'minzoom': 7,
                    'paint': {
                        // Size circle radius by earthquake magnitude and zoom level
                        'circle-radius': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            7,
                            ['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
                            16,
                            ['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
                        ],
                        'circle-emissive-strength': 0.75,
                        // Color circle by earthquake magnitude
                        'circle-color': [
                            'interpolate',
                            ['linear'],
                            ['get', 'mag'],
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
                        'circle-stroke-color': 'white',
                        'circle-stroke-width': 1,
                        // Transition from heatmap to circle layer by zoom level
                        'circle-opacity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            7,
                            0,
                            8,
                            1
                        ]
                    },
                    slot: 'top'
                });
            });
      }
  })

  return (
    <>
      <div id='map-container' ref={mapContainerRef}/>
    </>
  )
}