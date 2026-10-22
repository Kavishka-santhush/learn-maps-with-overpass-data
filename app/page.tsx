'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapTutorialStep3Advanced() {
  useEffect(() => {
    // 1. මැප් එක කොළඹ සහ මහනුවර මැද ප්‍රදේශය කේන්ද්‍ර කරගෙන open කිරීම (Zoom level 10)
    const map = L.map('map-container').setView([7.1000, 80.1500], 10);

    // 2. OpenStreetMap Tile Layer එක දානවා
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // ----------------------------------------------------
    // 3. POLYLINE: කොළඹ සිට මහනුවර දක්වා සැබෑ මාර්ගයක් (Winding Route)
    // ----------------------------------------------------
    const colomboToKandyRoute = [
      [6.9271, 79.8612], // කොළඹ (Colombo)
      [6.9580, 79.8880], // පැලියගොඩ
      [7.0000, 79.9500], // කඩවත
      [7.0850, 80.0150], // නිට්ටඹුව පැත්තට
      [7.2415, 80.1970], // වරකාපොළ
      [7.2513, 80.3464], // කෑගල්ල
      [7.2533, 80.5233], // කඩුගන්නාව
      [7.2694, 80.5925], // පේරාදෙනිය
      [7.2906, 80.6337]  // මහනුවර (Kandy)
    ];

    const routePolyline = L.polyline(colomboToKandyRoute, {
      color: '#2563eb',    // තද නිල් පාට (Blue route)
      weight: 6,           // ඝනකම
      opacity: 0.8         // විනිවිදභාවය
    }).addTo(map);

    routePolyline.bindPopup("<b>Main Route:</b> Colombo to Kandy Highway/Main Road");

    // ----------------------------------------------------
    // 4. POLYGON: සංකීර්ණ බහුඅස්‍රයක් (Complex Zone / District Area Boundary)
    // ----------------------------------------------------
    // ලකුණු 7-8 ක් එකතු කර සාදන ලද සංකීර්ණ මායිම් හැඩයක් (උදාහරණයක් ලෙස ප්‍රදේශයක සීමාවක්)
    const complexZoneCoordinates = [
      [7.0500, 79.9200], // උතුරු මුල්ල
      [7.1200, 80.0000], // ඊසාන දිශාව
      [7.1400, 80.1000], // නැගෙනහිර දිශාව
      [7.0600, 80.1800], // ගිනිකොන දිශාව
      [6.9500, 80.1500], // දකුණු මුල්ල (උඩ)
      [6.9000, 80.0500], // නිරිත දිශාව
      [6.9800, 79.9400]  // බටහිර දිශාව
    ];

    const complexPolygon = L.polygon(complexZoneCoordinates, {
      color: '#dc2626',        // මායිමේ පාට (Red border)
      fillColor: '#fca5a5',    // ඇතුළේ පුරවන පාට (Soft Red fill)
      fillOpacity: 0.5,        // විනිවිදභාවය
      weight: 3,               // මායිමේ ඝනකම
      dashArray: '5, 5'        // මායිම තිත් රේඛාවක් ලෙස පෙන්වීමට (Optional - dashed border)
    }).addTo(map);

    complexPolygon.bindPopup(`
      <div style="padding: 4px;">
        <h3 style="font-weight: bold; color: #b91c1c;">Special Economic/Development Zone</h3>
        <p style="font-size: 12px; margin-top: 4px;">මෙය බහු-ලක්ෂ්‍ය (Multi-vertex) සංකීර්ණ මායිම් ප්‍රදේශයකි.</p>
      </div>
    `);

    // Clean up function
    return () => {
      map.remove();
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-4 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Step 3 (Advanced): Complex Polygons & Routes 🗺️
        </h1>
        <p className="text-gray-600 mb-4">
          මෙහි කොළඹ සිට මහනුවර දක්වා දිවෙන වක්‍ර මාර්ගයක් (Polyline) සහ බහු ලක්ෂ්‍යයන්ගෙන් යුත් සංකීර්ණ ප්‍රදේශයක් (Complex Polygon) සිතියම්ගත කර ඇත.
        </p>

        {/* Map Container */}
        <div 
          id="map-container" 
          className="w-full h-[550px] rounded-lg border border-gray-300 z-0"
        />
      </div>
    </main>
  );
}