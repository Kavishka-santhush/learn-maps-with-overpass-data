'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapTutorialStep2() {
  useEffect(() => {
    // 1. මැප් එක මුලින්ම කොළඹ මධ්‍යස්ථානය කරගෙන Open කරනවා
    const map = L.map('map-container').setView([6.9271, 79.8612], 10);

    // 2. OpenStreetMap Tile Layer එක දානවා
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // ----------------------------------------------------
    // 3. Custom Icon එකක් නිර්මාණය කිරීම (Custom Marker Icon)
    // ----------------------------------------------------
    const customLocationIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Red Pin Icon URL
      iconSize: [38, 38],       // Icon එකේ Width, Height (Pixels)
      iconAnchor: [19, 38],     // Icon එක මැප් එකේ ලක්ෂ්‍යයට අදාල වන තැන (Center-bottom)
      popupAnchor: [0, -38]     // Popup එක පෙන්විය යුතු ස්ථානය (Icon එකට උඩින්)
    });

    const hospitalIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/4320/4320337.png', // Hospital Icon
      iconSize: [35, 35],
      iconAnchor: [17, 35],
      popupAnchor: [0, -35]
    });

    // ----------------------------------------------------
    // 4. Sample Data Array (නගර සහ ස්ථාන කිහිපයක Latitude / Longitude)
    // ----------------------------------------------------
    const locations = [
      {
        id: 1,
        name: "Colombo Lotus Tower",
        category: "Landmark",
        lat: 6.9271,
        lng: 79.8612,
        description: "ශ්‍රී ලංකාවේ උසම නෙළුම් කුලුන (Lotus Tower).",
        icon: customLocationIcon
      },
      {
        id: 2,
        name: "National Hospital of Sri Lanka",
        category: "Hospital",
        lat: 6.9187,
        lng: 79.8686,
        description: "කොළඹ ජාතික රෝහල.",
        icon: hospitalIcon
      },
      {
        id: 3,
        name: "Negombo Beach",
        category: "Attraction",
        lat: 7.2083,
        lng: 79.8358,
        description: "මීගමුව වෙරළ තීරය.",
        icon: customLocationIcon
      }
    ];

    // ----------------------------------------------------
    // 5. Loop එකක් මගින් Markers මැප් එකට එකතු කිරීම
    // ----------------------------------------------------
    locations.forEach((loc) => {
      // Marker එක හදලා, custom icon එක set කරලා, map එකට add කරනවා
      const marker = L.marker([loc.lat, loc.lng], { icon: loc.icon }).addTo(map);

      // Marker එක Click කරාම පේන HTML Popup එකක් සෙට් කරනවා
      marker.bindPopup(`
        <div style="padding: 4px;">
          <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 4px; color: #1e293b;">${loc.name}</h3>
          <span style="background-color: #e2e8f0; font-size: 11px; padding: 2px 6px; rounded: 4px; color: #475569;">
            ${loc.category}
          </span>
          <p style="font-size: 13px; margin-top: 8px; color: #334155;">${loc.description}</p>
        </div>
      `);
    });

    // Clean up function
    return () => {
      map.remove();
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-4 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Step 2: Custom Icons & Interactive Popups 📍
        </h1>
        <p className="text-gray-600 mb-4">
          මැප් එකේ තියෙන Markers (Red Pin / Hospital) උඩ Click කරලා බලන්න. ඩේටා Array එකකින් Markers dynamically render වෙලා තියෙනවා.
        </p>

        {/* Map Container */}
        <div 
          id="map-container" 
          className="w-full h-[500px] rounded-lg border border-gray-300 z-0"
        />
      </div>
    </main>
  );
}