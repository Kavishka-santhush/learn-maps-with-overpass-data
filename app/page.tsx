'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

export default function MapTutorialStep8() {
  const [loading, setLoading] = useState(true);
  const [totalPlaces, setTotalPlaces] = useState(0);

  useEffect(() => {
    // 1. මැප් එක ශ්‍රී ලංකාව මැද ප්‍රදේශයට (Zoom 8) සෙට් කිරීම
    const map = L.map('map-container').setView([7.8731, 80.7718], 8);

    // 2. OpenStreetMap Tile Layer එක දානවා
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    // ----------------------------------------------------
    // 3. MARKER CLUSTER GROUP එකක් සාදා ගැනීම
    // ----------------------------------------------------
    // L.markerClusterGroup() මගින් Markers එකතු කර Cluster කිරීමට පහසුකම සලසයි
    const markerClusterGroup = L.markerClusterGroup({
      chunkedLoading: true, // ඩේටා ගොඩක් තියෙද්දී smooth ලෙස load කිරීමට
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true
    });

    // 4. Overpass API මගින් මුළු ලංකාවේම තියෙන ඉන්ධන හල් (Fuel Stations) සහ රෝහල් විශාල ප්‍රමාණයක් ලබා ගැනීම
    const overpassQuery = `
      [out:json];
      (
        node["amenity"="fuel"](5.9,79.5,9.9,81.9);
        node["amenity"="hospital"](5.9,79.5,9.9,81.9);
      );
      out body;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const elements = data.elements || [];
        setTotalPlaces(elements.length);
        setLoading(false);

        // Icons සාදා ගැනීම
        const fuelIcon = L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448628.png',
          iconSize: [26, 26],
          iconAnchor: [13, 26],
          popupAnchor: [0, -26]
        });

        const hospitalIcon = L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/4320/4320337.png',
          iconSize: [26, 26],
          iconAnchor: [13, 26],
          popupAnchor: [0, -26]
        });

        // 5. Markers විශාල ප්‍රමාණය Loop කර Cluster Group එකට එකතු කිරීම
        elements.forEach((element) => {
          if (element.lat && element.lon) {
            const isFuel = element.tags?.amenity === 'fuel';
            const name = element.tags?.name || (isFuel ? 'Fuel Station' : 'Hospital / Clinic');
            const icon = isFuel ? fuelIcon : hospitalIcon;

            const marker = L.marker([element.lat, element.lon], { icon });

            marker.bindPopup(`
              <div style="padding: 4px; font-family: sans-serif;">
                <h3 style="font-weight: bold; font-size: 14px; color: #1e293b; margin-bottom: 2px;">${name}</h3>
                <span style="background-color: ${isFuel ? '#fef3c7' : '#fee2e2'}; color: ${isFuel ? '#b45309' : '#991b1b'}; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
                  ${element.tags?.amenity?.toUpperCase()}
                </span>
                <p style="font-size: 11px; color: #64748b; margin-top: 4px;">Lat: ${element.lat.toFixed(4)}, Lon: ${element.lon.toFixed(4)}</p>
              </div>
            `);

            // කෙලින්ම මැප් එකට නොදා Cluster Group එකට එකතු කරමු
            markerClusterGroup.addLayer(marker);
          }
        });

        // 6. සම්පූර්ණ Cluster Group එක මැප් එකට එකතු කිරීම
        map.addLayer(markerClusterGroup);
      })
      .catch((error) => {
        console.error('Error fetching cluster data:', error);
        setLoading(false);
      });

    // Clean up function
    return () => {
      map.remove();
    };
  }, []);

  return (
    <main className="flex flex-col h-screen bg-gray-100 p-6">
      {/* Header Info */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-md gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Step 8: Marker Clustering (High Density Data) 🧮
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            ශ්‍රී ලංකාවේ ස්ථාන සීයකට/දහසකට වැඩි ප්‍රමාණයක් එකවර ලෝඩ් කර ඇති අතර, ඒවා Cluster Circles ලෙස සංවිධානය වී ඇත. Cluster එකක් උඩ Click කර එය දිගහැරෙන ආකාරය බලන්න!
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg">
            {loading ? 'Fetching nationwide data...' : `Total Loaded Places: ${totalPlaces}`}
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative rounded-xl border border-gray-300 overflow-hidden shadow-md z-0">
        <div id="map-container" className="w-full h-full" />

        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-emerald-700">
                Fetching nationwide Sri Lanka places & clustering...
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}