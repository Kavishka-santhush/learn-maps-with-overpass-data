'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapTutorialStep3() {
  useEffect(() => {
    // 1. මැප් එක කොළඹ මධ්‍යස්ථානය කරගෙන open කිරීම
    const map = L.map('map-container').setView([6.9271, 79.8612], 11);

    // 2. OpenStreetMap Tile Layer එක දානවා
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 3. Custom Icon එකක් (කොළඹ කොටුව සඳහා)
    const colomboIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      iconSize: [35, 35],
      iconAnchor: [17, 35],
      popupAnchor: [0, -35]
    });

    // 4. Marker එකක් දැමීම
    const marker = L.marker([6.9271, 79.8612], { icon: colomboIcon }).addTo(map);
    marker.bindPopup("<b>Colombo Fort / Center</b>");

    // ----------------------------------------------------
    // 5. POLYLINE (රේඛාවක් / මාර්ගයක් ඇඳීම)
    // ----------------------------------------------------
    // උදාහරණයක් ලෙස කොළඹ සිට මීගමුව දක්වා යන මාවතක් (Coordinates කිහිපයක් සම්බන්ධ කරමින්)
    const routeCoordinates = [
      [6.9271, 79.8612], // කොළඹ
      [6.9890, 79.9155], // කැලණිය / පෑලියගොඩ ප්‍රදේශය හරහා
      [7.0840, 79.9925], // ගම්පහ පැත්තට හැරෙන තැනක් වගේ
      [7.2083, 79.8358]  // මීගමුව වෙරළ
    ];

    const routePolyline = L.polyline(routeCoordinates, {
      color: '#3b82f6',    // රේඛාවේ පාට (Blue)
      weight: 5,           // රේඛාවේ ඝනකම (Thickness)
      opacity: 0.7         // පාරාභූත බව (Opacity)
    }).addTo(map);

    // Polyline එක උඩ Click කරාම පෙන්වන Popup එකක්
    routePolyline.bindPopup("<b>Sample Route:</b> Colombo to Negombo Path");

    // ----------------------------------------------------
    // 6. POLYGON (ප්‍රදේශයක මායිමක් / බහුඅස්‍රයක් ඇඳීම)
    // ----------------------------------------------------
    // උදාහරණයක් ලෙස කොළඹ අවට ප්‍රදේශයක් ආවරණය වන පරිදි Polygon එකක කෝඩිනේට්ස්
    const zonePolygonCoordinates = [
      [6.9500, 79.8500],
      [6.9500, 79.9000],
      [6.8900, 79.9000],
      [6.8900, 79.8500]
    ];

    const zonePolygon = L.polygon(zonePolygonCoordinates, {
      color: '#ef4444',        // මායිමේ පාට (Red border)
      fillColor: '#f87171',    // ඇතුළේ පුරවන පාට (Light Red fill)
      fillOpacity: 0.4,        // ඇතුළේ පාටේ විනිවිදභාවය
      weight: 3                // මායිමේ ඝනකම
    }).addTo(map);

    // Polygon එක උඩ Click කරාම පෙන්වන Popup එකක්
    zonePolygon.bindPopup("<b>Restricted Zone / District Area</b><br>මෙය විශේෂිත ප්‍රදේශයක මායිමකි.");

    // Clean up function
    return () => {
      map.remove();
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-4 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Step 3: Polylines & Polygons 📐
        </h1>
        <p className="text-gray-600 mb-4">
          මෙම සිතියමෙහි නිල් පාටින් පාරක්/මාර්ගයක් (Polyline) සහ රතු පාටින් ප්‍රදේශයක මායිමක් (Polygon) ඇඳ ඇත. ඒවා මත ක්ලික් කර විස්තර බලන්න.
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