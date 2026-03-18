"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

/* documentation MapBox : https://docs.mapbox.com/mapbox-gl-js/guides/get-started/use-with-npm/
 * attention à utiliser le code pour React
 */

function Map() {
  const mapRef = useRef();
  const mapContainerRef = useRef();

  useEffect(() => {
    mapboxgl.accessToken = process.env.SUPER_SECRET_MAP_ACCESS_KEY;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [2.349014, 48.864716],
      zoom: 9,
    });
    return () => mapRef.current.remove();
  }, []);
  
  return <section id='map-container' ref={mapContainerRef} />
}

export default Map