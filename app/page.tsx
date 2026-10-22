'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapTutorialStep9() {
  const [routeInfo, setRouteInfo] = useState({ distance: null, duration: null, loading: true });

  useEffect(() => {
    // 1. මැප් එක කොළඹ සහ මහනුවර මැද ප්‍රදේශය කේන්ද්‍ර කරගෙන open කිරීම
    const map = L.map('map-container').setView([7.1000, 80.2500], 10);

    // 2. OpenStreetMap Tile Layer එක දානවා
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 3. Start (Colombo) සහ End (Kandy) කෝඩිනේට්ස්
    // OSRM API එකට [Longitude, Latitude] පිළිවෙළට දිය යුතුය!
    const startCoord = [79.8612, 6.9271]; // Colombo [lng, lat]
    const endCoord = [80.6337, 7.2906];   // Kandy [lng, lat]

    // Custom Icons සාදා ගැනීම
    const startIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/1483/1483190.png', // Start pin
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    const endIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/565/565547.png', // End pin
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    // Markers මැප් එකට දැමීම
    const startMarker = L.marker([6.9271, 79.8612], { icon: startIcon }).addTo(map);
    startMarker.bindPopup("<b>Start Point:</b> Colombo");

    const endMarker = L.marker([7.2906, 80.6337], { icon: endIcon }).addTo(map);
    endMarker.bindPopup("<b>Destination:</b> Kandy");

    // 4. OSRM Routing API එකට Request එක යැවීම
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoord[0]},${startCoord[1]};${endCoord[0]},${endCoord[1]}?overview=full&geometries=geojson`;

    fetch(osrmUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          const route = data.routes;
          const distanceInKm = (route.distance / 1000).toFixed(2); // මීටර් කිලෝමීටර් වලට හැරවීම
          const durationInMins = Math.round(route.duration / 60);  // තත්පර මිනිත්තු වලට හැරවීම

          setRouteInfo({
            distance: distanceInKm,
            duration: durationInMins,
            loading: false
          });

          // 5. OSRM එකෙන් ලැබෙන GeoJSON coordinates හරහා Polyline එකක් ඇඳීම
          // (OSRM geojson coordinates වල [lng, lat] තියෙන නිසා Leaflet [lat, lng] වලට මාරු කරගත යුතුය)
          const routeCoordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

          const routePolyline = L.polyline(routeCoordinates, {
            color: '#2563eb', // තද නිල් පාට රේඛාව
            weight: 6,
            opacity: 0.85
          }).addTo(map);

          // මැප් එක රූට් එක පෙනෙන සේ Zoom කිරීම
          map.fitBounds(routePolyline.getBounds(), { padding: [50, 50] });
        }
      })
      .catch((err) => {
        console.error('Error fetching OSRM route:', err);
        setRouteInfo(prev => ({ ...prev, loading: false }));
      });

    // Clean up function
    return () => {
      map.remove();
    };
  }, []);

  return (
    <main className="flex flex-col h-screen bg-gray-100 p-6">
      {/* Header & Route Details Panel */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-md gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Step 9: Routing & Navigation (OSRM API) 🚗
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            කොළඹ සිට මහනුවර දක්වා OSRM රවුටින් සේවාව හරහා සැබෑ මංපෙත (Driving Route) ඩයිනමික් ලෙස ගණනය කර පෙන්වා ඇත.
          </p>
        </div>

        {/* Distance & Duration Display Card */}
        <div className="flex gap-3">
          <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg text-center">
            <span className="block text-[10px] uppercase font-bold text-blue-600">Total Distance</span>
            <span className="text-sm font-extrabold text-blue-900">
              {routeInfo.loading ? 'Calculing...' : `${routeInfo.distance} km`}
            </span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg text-center">
            <span className="block text-[10px] uppercase font-bold text-emerald-600">Est. Time</span>
            <span className="text-sm font-extrabold text-emerald-900">
              {routeInfo.loading ? 'Calculating...' : `${routeInfo.duration} mins`}
            </span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative rounded-xl border border-gray-300 overflow-hidden shadow-md z-0">
        <div id="map-container" className="w-full h-full" />

        {routeInfo.loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
            <p className="text-sm font-semibold text-blue-600 animate-pulse">
              Calculating optimal driving route... 🛣️
            </p>
          </div>
        )}
      </div>
    </main>
  );
}