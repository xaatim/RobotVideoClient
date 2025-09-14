"use client";
import { APIProvider, Map, Marker, useMap, } from "@vis.gl/react-google-maps";
import robotIcon from "../../public/robot.svg";
import { useEffect, useState } from "react";
export default function GoogleMap() {
  
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_kEY!}>
      <Map
        style={{ width: "100vw", height: "100vh" }}
        defaultZoom={17.12}

        defaultCenter={{ lat: 1.85797, lng: 103.09355 }}
        gestureHandling={"greedy"}
        
        
      >
      
        <MovingMarker />
      </Map>
    </APIProvider>
  );
}

export const MovingMarker = () => {
  const path = [
    { lat: 1.858626, lng: 103.0855782 }, // Starting point (UTHM main entrance)
    { lat: 1.859000, lng: 103.0860000 },
    { lat: 1.859500, lng: 103.0865000 },
    { lat: 1.860000, lng: 103.0870000 },
    { lat: 1.860500, lng: 103.0875000 },
    { lat: 1.861000, lng: 103.0880000 },
    { lat: 1.861500, lng: 103.0885000 },
    { lat: 1.862000, lng: 103.0890000 },
    { lat: 1.862500, lng: 103.0895000 },
    { lat: 1.863000, lng: 103.0900000 },
  ];

  const [positionIndex, setPositionIndex] = useState(0);
  const [position, setPosition] = useState<google.maps.LatLngLiteral>(path[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositionIndex((prevIndex) => (prevIndex + 1) % path.length);
    }, 1000); // Move every 1 second

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setPosition(path[positionIndex]);
  }, [positionIndex]);

  return (
    <Marker
      position={position}
      icon={{
        url: robotIcon.src,
        scaledSize: new google.maps.Size(40, 40),
      }}
    ></Marker>
  );
};
