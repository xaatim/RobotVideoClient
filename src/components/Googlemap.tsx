"use client";
import { APIProvider, Map, Marker, useMap, } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
export default function GoogleMap() {
  
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_kEY!}>
      <Map
        style={{ width: "100vw", height: "100vh" }}
        defaultZoom={3}

        defaultCenter={{ lat: 12, lng: 0 }}
        gestureHandling={"greedy"}
        disableDefaultUI
        
      >
      
        <MovingMarker />
      </Map>
    </APIProvider>
  );
}

export const MovingMarker = () => {
  const [position, setPosition] = useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const t = performance.now();
      const lat = Math.sin(t / 2000) * 5;
      const lng = Math.cos(t / 3000) * 5;

      setPosition({ lat, lng });
    }, 200);

    return () => clearInterval(interval);
  });

  return <Marker position={position}></Marker>;
};
