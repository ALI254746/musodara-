// src/App.js
"use client";
import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";

function App() {
  const globeEl = useRef();
  const [markers, setMarkers] = useState([
    {
      lat: 41.3111,
      lng: 69.2797,
      size: 0.1,
      color: "red",
      city: "Toshkent",
    },
    {
      lat: 39.6542,
      lng: 66.9597,
      size: 0.2,
      color: "orange",
      city: "Samarqand",
    },
    {
      lat: 37.2296,
      lng: 67.278,
      size: 0.2,
      color: "blue",
      city: "Termiz",
    },
  ]);

  useEffect(() => {
    // O‘zbekiston markaziga zoom
    globeEl.current.pointOfView({ lat: 41.3, lng: 69.2, altitude: 1.5 }, 2000);
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={markers}
        pointLat="lat"
        pointLng="lng"
        pointAltitude="size"
        pointColor="color"
        pointLabel={({ city }) => `<b>${city}</b>`}
      />
    </div>
  );
}

export default App;
