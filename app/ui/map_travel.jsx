"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOXGL_PUBLIC_TOKEN;

/**
 * --- Utils ---
 */

// Debounce simple
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// Géocodage simple (adresse -> coords)
async function geocode(address) {
    const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/` +
        `${encodeURIComponent(address)}.json?limit=1&access_token=${mapboxgl.accessToken}`
    );

    const data = await res.json();

    if (!data.features?.length) {
        throw new Error("Adresse introuvable");
    }

    return data.features[0].center;
}

// Suggestions autocomplete
async function fetchPlaces(query) {
    if (!query || query.length < 3) return [];

    const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/` +
        `${encodeURIComponent(query)}.json` +
        `?autocomplete=true&limit=5&access_token=${mapboxgl.accessToken}`
    );

    const data = await res.json();
    return data.features || [];
}

/**
 * --- Component ---
 */

export default function MapRoute() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markers = useRef([]);

    // Inputs
    const [startAddress, setStartAddress] = useState("");
    const [endAddress, setEndAddress] = useState("");

    // Suggestions
    const [startSuggestions, setStartSuggestions] = useState([]);
    const [endSuggestions, setEndSuggestions] = useState([]);

    // Coords sélectionnées
    const [startCoords, setStartCoords] = useState(null);
    const [endCoords, setEndCoords] = useState(null);

    /**
     * --- Init map ---
     */
    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [2.3522, 48.8566],
            zoom: 11,
        });
    }, []);

    /**
     * --- Debounced search ---
     */
    const searchStart = useRef(
        debounce(async (value) => {
            const results = await fetchPlaces(value);
            setStartSuggestions(results);
        }, 300)
    ).current;

    const searchEnd = useRef(
        debounce(async (value) => {
            const results = await fetchPlaces(value);
            setEndSuggestions(results);
        }, 300)
    ).current;

    /**
     * --- Handlers input ---
     */
    const handleStartChange = (value) => {
        setStartAddress(value);
        searchStart(value);
    };

    const handleEndChange = (value) => {
        setEndAddress(value);
        searchEnd(value);
    };

    /**
     * --- Select suggestion ---
     */
    const selectStart = (place) => {
        setStartAddress(place.place_name);
        setStartCoords(place.center);
        setStartSuggestions([]);
    };

    const selectEnd = (place) => {
        setEndAddress(place.place_name);
        setEndCoords(place.center);
        setEndSuggestions([]);
    };

    /**
     * --- Route ---
     */
    const createRoute = async () => {
        try {
            const start =
                startCoords || await geocode(startAddress);
            const end =
                endCoords || await geocode(endAddress);

            // cleanup markers
            markers.current.forEach((m) => m.remove());
            markers.current = [];

            // remove old route
            if (map.current.getLayer("route")) {
                map.current.removeLayer("route");
            }
            if (map.current.getSource("route")) {
                map.current.removeSource("route");
            }

            // fetch directions
            const res = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/` +
                `${start[0]},${start[1]};${end[0]},${end[1]}` +
                `?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`
            );

            const data = await res.json();
            const route = data.routes[0].geometry;

            // draw route
            map.current.addSource("route", {
                type: "geojson",
                data: {
                    type: "Feature",
                    properties: {},
                    geometry: route,
                },
            });

            map.current.addLayer({
                id: "route",
                type: "line",
                source: "route",
                paint: {
                    "line-color": "#2563eb",
                    "line-width": 5,
                },
            });

            // markers
            const startMarker = new mapboxgl.Marker({ color: "green" })
                .setLngLat(start)
                .addTo(map.current);

            const endMarker = new mapboxgl.Marker({ color: "red" })
                .setLngLat(end)
                .addTo(map.current);

            markers.current.push(startMarker, endMarker);

            // fit bounds
            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend(start);
            bounds.extend(end);

            map.current.fitBounds(bounds, { padding: 80 });

        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    /**
     * --- UI ---
     */
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* INPUTS */}
            <div style={{ display: "flex", gap: 10 }}>

                {/* START */}
                <div style={{ position: "relative", flex: 1 }}>
                    <input
                        value={startAddress}
                        placeholder="Adresse de départ"
                        onChange={(e) =>
                            handleStartChange(e.target.value)
                        }
                        style={{ width: "100%", padding: 10 }}
                    />

                    {startSuggestions.length > 0 && (
                        <div style={dropdownStyle}>
                            {startSuggestions.map((p) => (
                                <div
                                    key={p.id}
                                    style={itemStyle}
                                    onClick={() => selectStart(p)}
                                >
                                    {p.place_name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* END */}
                <div style={{ position: "relative", flex: 1 }}>
                    <input
                        value={endAddress}
                        placeholder="Adresse d'arrivée"
                        onChange={(e) =>
                            handleEndChange(e.target.value)
                        }
                        style={{ width: "100%", padding: 10 }}
                    />

                    {endSuggestions.length > 0 && (
                        <div style={dropdownStyle}>
                            {endSuggestions.map((p) => (
                                <div
                                    key={p.id}
                                    style={itemStyle}
                                    onClick={() => selectEnd(p)}
                                >
                                    {p.place_name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button onClick={createRoute}>
                    Calculer
                </button>
            </div>

            {/* MAP */}
            <div
                ref={mapContainer}
                style={{
                    height: 600,
                    width: "100%",
                    borderRadius: 12,
                }}
            />
        </div>
    );
}

/**
 * --- Styles ---
 */
const dropdownStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "white",
    border: "1px solid #ddd",
    zIndex: 1000,
    maxHeight: 200,
    overflowY: "auto",
};

const itemStyle = {
    padding: 10,
    cursor: "pointer",
    borderBottom: "1px solid #eee",
};