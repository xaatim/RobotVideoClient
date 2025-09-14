"use client";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import robotIcon from "../../public/robot.svg";
import { useEffect, useState } from "react";

const customIcon = new L.Icon({
  iconUrl: robotIcon.src,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export default function OpenStreetMap() {
  return (
    <MapContainer
      center={[1.85797, 103.09355]}
      zoom={17}
      style={{ width: "100vw", height: "100vh" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />
      <MovingMarker />
    </MapContainer>
  );
}

const MovingMarker = () => {
  const path = [
    { lat: 1.858626, lng: 103.0855782 },
    { lat: 1.859, lng: 103.086 },
    { lat: 1.8595, lng: 103.0865 },
    { lat: 1.86, lng: 103.087 },
    { lat: 1.8605, lng: 103.0875 },
    { lat: 1.861, lng: 103.088 },
    { lat: 1.8615, lng: 103.0885 },
    { lat: 1.862, lng: 103.089 },
    { lat: 1.8625, lng: 103.0895 },
    { lat: 1.863, lng: 103.09 },
  ];

  const [positionIndex, setPositionIndex] = useState(0);
  const [position, setPosition] = useState(path[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositionIndex((prevIndex) => (prevIndex + 1) % path.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setPosition(path[positionIndex]);
  }, [positionIndex]);

  return <Marker position={position} icon={customIcon} />;
};
