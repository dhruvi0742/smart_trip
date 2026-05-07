import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


// ✅ CUSTOM LOCATION ICON
const customIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/684/684908.png",

  iconSize: [45, 45],

  iconAnchor: [22, 45],

  popupAnchor: [0, -40]
});


// ✅ MAP MOVE
function ChangeMapView({ coords }) {

  const map = useMap();

  useEffect(() => {

    if (coords) {
      map.setView(coords, 12);
    }

  }, [coords, map]);

  return null;
}


export default function MapPanel({ place }) {

  const [coords, setCoords] = useState([21.1702, 72.8311]); // Surat default

  useEffect(() => {

    if (!place) return;

    const fetchLocation = async () => {

      try {

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
        );

        const data = await res.json();

        if (data && data.length > 0) {

          const lat = parseFloat(data[0].lat);

          const lon = parseFloat(data[0].lon);

          setCoords([lat, lon]);

        }

      } catch (err) {

        console.error("Map error:", err);

      }
    };

    fetchLocation();

  }, [place]);


  return (

    <section className="w-[50%] h-screen">

      <MapContainer
        center={coords}
        zoom={12}
        className="h-screen w-full"
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeMapView coords={coords} />

        {/* ✅ CUSTOM ICON ADDED */}
        <Marker
          position={coords}
          icon={customIcon}
        >

          <Popup>
            📍 {place || "Surat City"}
          </Popup>

        </Marker>

      </MapContainer>

    </section>
  );
}