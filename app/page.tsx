'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapTutorialStep1() {
  useEffect(() => {
    // 1. මැප් එක Init කරන්නේ මෙතනින් (කොළඹ ප්‍රදේශය මධ්‍යස්ථානය කරගනිමු)
    // [Latitude, Longitude], Zoom level (උදා: 13)
    const map = L.map('map-container').setView([6.9271, 79.8612], 13);

    // 2. OpenStreetMap Tiles (පසුබිම් සිතියම) එකතු කිරීම
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 3. Component එක unmount වෙද්දී map එක clean up කිරීම
    return () => {
      map.remove();
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-4 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Step 1: My First Next.js Leaflet Map 🗺️
        </h1>
        <p className="text-gray-600 mb-4">
          මෙන්න කොළඹ (Colombo) කේන්ද්‍ර කරගත් මූලික OpenStreetMap සිතියම.
        </p>
        
        {/* මැප් එක පෙන්වන container එක (මෙයට අනිවාර්යයෙන් Height එකක් තිබිය යුතුය) */}
        <div 
          id="map-container" 
          className="w-full h-[500px] rounded-lg border border-gray-300 z-0"
        />
      </div>
    </main>
  );
}