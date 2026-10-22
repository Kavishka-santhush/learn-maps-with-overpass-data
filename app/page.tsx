'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapTutorialStep5() {
  const [loading, setLoading] = useState(true);
  const [placeCount, setPlaceCount] = useState(0);

  useEffect(() => {
    // 1. මැප් එක කොළඹ ප්‍රදේශය මධ්‍යස්ථානය කරගෙන open කිරීම
    const map = L.map('map-container').setView([6.9271, 79.8612], 13);

    // 2. OpenStreetMap Tile Layer එක දානවා
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://opensource.com">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Marker Layer Group එකක් තබා ගැනීම (Clean up කිරීමට පහසු වීමට)
    const markersLayer = L.layerGroup().addTo(map);

    // 3. Overpass API Query එක ලිවීම
    // (කොළඹ අවට ප්‍රදේශය තුළ තියෙන amenity = hospital / clinic සොයා ගැනීමට)
    const overpassQuery = `
      [out:json];
      (
        node["amenity"~"hospital|clinic|doctors"](6.87,79.82,6.98,79.92);
      );
      out body;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    // 4. API එකට Fetch ඉල්ලීමක් යැවීම
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // මෙතැනයි අර දෝෂය තිබුණේ (|| පසු [] එකතු කරන ලදී)
        const elements = data.elements || [];
        setPlaceCount(elements.length);
        setLoading(false);

        // Hospital සඳහා Custom Icon එකක් හැදීම
        const hospitalIcon = L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/4320/4320337.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        });

        // 5. ලැබුණු ඩේටා (Elements) Loop කරලා මැප් එකට Markers දැමීම
        elements.forEach((element) => {
          if (element.lat && element.lon) {
            const name = element.tags?.name || 'Medical Facility (Unnamed)';
            const amenityType = element.tags?.amenity || 'hospital';
            const address = element.tags?.['addr:street'] || 'Colombo Region';

            const marker = L.marker([element.lat, element.lon], { icon: hospitalIcon });

            marker.bindPopup(`
              <div style="padding: 6px; font-family: sans-serif;">
                <h3 style="font-weight: bold; font-size: 15px; color: #b91c1c; margin-bottom: 4px;">${name}</h3>
                <span style="background-color: #fee2e2; color: #991b1b; font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
                  ${amenityType.toUpperCase()}
                </span>
                <p style="font-size: 13px; color: #334155; margin-top: 6px;"><b>Address / Street:</b> ${address}</p>
                <p style="font-size: 11px; color: #64748b; margin-top: 4px;">Lat: ${element.lat.toFixed(4)}, Lon: ${element.lon.toFixed(4)}</p>
              </div>
            `);

            markersLayer.addLayer(marker);
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching Overpass data:', error);
        setLoading(false);
      });

    // Clean up function
    return () => {
      map.remove();
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-4 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800">
            Step 5: Overpass API Integration (Real OSM Data) ⚡
          </h1>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            {loading ? 'Loading live data...' : `Found ${placeCount} Hospitals/Clinics`}
          </span>
        </div>
        <p className="text-gray-600 mb-4">
          මෙම සිතියම OpenStreetMap සර්වර් එකෙන් Overpass API හරහා කොළඹ ප්‍රදේශයේ සැබෑ රෝහල් සහ සායන (Hospitals & Clinics) ඩේටා ඩයිනමික් ලෙස ලබාගෙන පෙන්වයි.
        </p>

        {/* Map Container */}
        <div 
          id="map-container" 
          className="w-full h-[550px] rounded-lg border border-gray-300 z-0 relative"
        >
          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
              <p className="text-lg font-semibold text-blue-600 animate-pulse">
                Fetching live map data from OpenStreetMap... 🌍
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}