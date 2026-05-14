"use client"

import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import dataset from '@/prixCarburant/dataset.json'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOXGL_PUBLIC_TOKEN

export default function MapFuel({ selectedStyle, selectedFuel }) {

  const mapRef = useRef(null)
  const mapContainerRef = useRef(null)

  //Initialisation de la carte
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [2.348417, 47.202833],
      zoom: 5.5
    })

    mapRef.current = map

    mapRef.current.on("load", () => {

      // Ajout de la source 
      mapRef.current.addSource("fuel", {
        type: "geojson",
        data: dataset
      })

      // Ajout du layer
      mapRef.current.addLayer({
        id: "gas-station",
        type: "circle",
        source: "fuel",
        filter: ['!=', ['get', selectedFuel], null],
        paint: {
          "circle-radius": 6,
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", selectedFuel],
            1.5, "#2c7bb6",
            1.7, "#abd9e9",
            1.9, "#ffffbf",
            2.1, "#fdae61",
            2.3, "#d7191c"
          ]
        }
      })

      mapRef.current.addInteraction('places-click-interaction', {
        type: 'click',
        target: { layerId: 'gas-station' },
        handler: (e) => {
          // Copy coordinates array.
          const coordinates = e.feature.geometry.coordinates.slice();
          const address = e.feature.properties.adresse;
          const town = e.feature.properties.ville;
          const gazole = e.feature.properties.gazole_prix;
          const sp95 = e.feature.properties.sp95_prix;
          const e85 = e.feature.properties.e85_prix;
          const gplc = e.feature.properties.gplc_prix;
          const e10 = e.feature.properties.e10_prix;
          const sp98 = e.feature.properties.sp98_prix;

          const format = (value) => (value ? `${value} €` : "---");

          const html = `<div style="color:black">
            <strong>${town}</strong> <br>
            ${address} <br>
            <hr>
            Gazole: ${format(gazole)} <br>
            E85: ${format(e85)} <br>
            GPLc: ${format(gplc)} <br>
            E10: ${format(e10)} <br>
            SP98: ${format(sp98)} <br>
            SP95: ${format(sp95)} <br>
          </div>`
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(html)
            .addTo(mapRef.current);
        }
      })

      // Change the cursor to a pointer when the mouse is over a POI.
      mapRef.current.addInteraction('places-mouseenter-interaction', {
        type: 'mouseenter',
        target: { layerId: 'gas-station' },
        handler: () => {
          mapRef.current.getCanvas().style.cursor = 'pointer';
        }
      })

      // Change the cursor back to a pointer when it stops hovering over a POI.
      mapRef.current.addInteraction('places-mouseleave-interaction', {
        type: 'mouseleave',
        target: { layerId: 'gas-station' },
        handler: () => {
          mapRef.current.getCanvas().style.cursor = '';
        }
      })

    })
    return () => map.remove()
  }, [])

  // Mise à jour du style (mode light/dark/system)
  useEffect(() => {
    if (!mapRef.current) return

    let styleName = "gazole_prix"
    switch (selectedStyle) {
      case "system": 
        styleName = "standard"; 
        break
      case "light": 
        styleName = "navigation-day-v1"; 
        break
      case "dark": 
        styleName = "navigation-night-v1"; 
        break
    }

    mapRef.current.setStyle(`mapbox://styles/mapbox/${styleName}`)

    // Mise à jour du layer après changement de style
    mapRef.current.once("style.load", () => {

      if (!mapRef.current.getSource("fuel")){ // Si la source n'existe pas
        mapRef.current.addSource("fuel", {
          type: "geojson",
          data: dataset,
        })
      }

      if (mapRef.current.getSource("fuel")){ // Si la source existe
        mapRef.current.addLayer({
          id: "gas-station",
          type: "circle",
          source: "fuel",
          filter: ['!=', ['get', selectedFuel], null],
          paint: {
            "circle-radius": 6,
            "circle-color": [
              "interpolate",
              ["linear"],
              ["get", selectedFuel],
              1.5, "#2c7bb6",
              1.7, "#abd9e9",
              1.9, "#ffffbf",
              2.1, "#fdae61",
              2.3, "#d7191c"
            ]
          },
        })
      }
    })

  }, [selectedStyle])

  // Mise à jour du type carburant
  useEffect(() => {
    if (!mapRef.current) return

    if (mapRef.current.getLayer("gas-station")) {
      mapRef.current.setPaintProperty("gas-station",
        "circle-color", [
          "interpolate",
          ["linear"],
          ["get", selectedFuel],
          1.5, "#2c7bb6",
          1.7, "#abd9e9",
          1.9, "#ffffbf",
          2.1, "#fdae61",
          2.3, "#d7191c"
        ]
      )
      
      mapRef.current.setFilter("gas-station",
        ["!=", ["get", selectedFuel], null]
      )
    }

  }, [selectedFuel])

  return <div id="map-container" ref={mapContainerRef} />
}
