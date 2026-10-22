'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapTutorialStep4() {
  useEffect(() => {
    // 1. මැප් එක කොළඹ ප්‍රදේශය මධ්‍යස්ථානය කරගෙන open කිරීම
    const map = L.map('map-container').setView([6.9271, 79.8612], 12);

    // 2. OpenStreetMap Tile Layer එක දානවා
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}⁠/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // -------------------------------------------------------------------------
    // 3. MOCK GEOJSON DATA (සාමාන්‍යයෙන් මෙය ගවර්මන්ට් සයිට් එකකින් හෝ API එකකින් ලැබේ)
    // -------------------------------------------------------------------------
    const governmentGeoJSONData = {
      "type": "FeatureCollection",
      "features": [
        // --- 1. Polygon Feature (විශේෂිත සංවර්ධන කලාපයක මායිම - රජයේ දත්ත ලෙස සිතමු) ---
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [79.8500, 6.9300],
                [79.8800, 6.9400],
                [79.8900, 6.9100],
                [79.8600, 6.8900],
                [79.8500, 6.9300]
              ]
            ]
          },
          "properties": {
            "name": "Colombo Commercial Zone",
            "type": "Zone",
            "description": "රජයේ නගර සංවර්ධන අධිකාරිය මගින් නම් කරන ලද වාණිජ කලාපය.",
            "status": "Active"
          }
        },
        // --- 2. Point Feature (රෝහලක් / මහජන සේවා ස්ථානයක්) ---
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [79.8612, 6.9271] // [Longitude, Latitude] - GeoJSON වල මූලිකවම Longitude එක මුලින් එන්නේ!
          },
          "properties": {
            "name": "Central Public Hub",
            "type": "Facility",
            "description": "මහජන සේවා මධ්‍යස්ථානය සහ තොරතුරු කුටිය."
          }
        },
        // --- 3. Point Feature (තවත් ස්ථානයක්) ---
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [79.8750, 6.9150]
          },
          "properties": {
            "name": "Smart Transit Station",
            "type": "Transit",
            "description": "ප්‍රධාන බස් සහ දුම්රිය සංක්‍රාන්ති මධ්‍යස්ථානය."
          }
        }
      ]
    };

    // -------------------------------------------------------------------------
    // 4. L.geoJSON() භාවිතා කරමින් ඩේටා මැප් එකට Render කිරීම සහ Style කිරීම
    // -------------------------------------------------------------------------
    L.geoJSON(governmentGeoJSONData, {
      
      // අ) Polygons සහ Lines සඳහා Style ලබාදීම
      style: function (feature) {
        if (feature.properties.type === 'Zone') {
          return {
            color: '#7c3aed',      // පර්පල් පාට මායිම (Purple border)
            fillColor: '#c084fc',  // ඇතුළේ පුරවන පාට (Light Purple fill)
            fillOpacity: 0.4,
            weight: 3
          };
        }
        return { color: '#333', weight: 2 };
      },

      // බ) Point (Markers) සඳහා Custom Icons හෝ Markers සැකසීම
      pointToLayer: function (feature, latlng) {
        // කැමති icon එකක් තෝරාගැනීම
        const iconUrl = feature.properties.type === 'Facility' 
          ? 'https://cdn-icons-png.flaticon.com/512/3177/3177361.png' // Building/Hub icon
          : 'https://cdn-icons-png.flaticon.com/512/684/684908.png';  // Pin icon

        const customIcon = L.icon({
          iconUrl: iconUrl,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        });

        return L.marker(latlng, { icon: customIcon });
      },

      // ඇ) හැම Feature එකක්ම (Polygon හෝ Marker) උඩ Click කරාම Popup එකක් පෙන්වීම
      onEachFeature: function (feature, layer) {
        if (feature.properties) {
          const props = feature.properties;
          layer.bindPopup(`
            <div style="padding: 6px; font-family: sans-serif;">
              <h3 style="font-weight: bold; font-size: 15px; color: #4c1d95; margin-bottom: 4px;">${props.name}</h3>
              <span style="background-color: #ede9fe; color: #6d28d9; font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
                ${props.type}
              </span>
              <p style="font-size: 13px; color: #334155; margin-top: 6px;">${props.description}</p>
            </div>
          `);
        }
      }

    }).addTo(map);

    // Clean up function
    return () => {
      map.remove();
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-4 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Step 4: Working with GeoJSON Data (Government / APIs) 🌐
        </h1>
        <p className="text-gray-600 mb-4">
          රජයේ සයිට් එකකින් හෝ API එකකින් ලැබෙන GeoJSON ඩේටා (Polygons සහ Points එකම ඩේටා සෙට් එකක) ස්වයංක්‍රීයව මැප් එකට ලෝඩ් කර ඇත.
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