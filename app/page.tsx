'use client';

import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapTutorialStep6() {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Map සහ Markers refs සකස් කිරීම (React වලදී මැප් එක සහ markers පාලනය කිරීමට)
  const mapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    // 1. මැප් එක කොළඹ ප්‍රදේශය මධ්‍යස්ථානය කරගෙන open කිරීම (මෙහිදී mapRef එක save කරගනිමු)
    const map = L.map('map-container').setView([6.9271, 79.8612], 13);
    mapRef.current = map;

    // 2. OpenStreetMap Tile Layer එක දානවා
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);

    // 3. Overpass API මගින් කොළඹ රෝහල් ඩේටා ලබා ගැනීම
    const overpassQuery = `
      [out:json];
      (
        node["amenity"~"hospital|clinic|doctors"](6.87,79.82,6.98,79.92);
      );
      out body;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const elements = (data.elements || []).filter(el => el.tags && el.tags.name);
        
        // ඩේටා Format කර state එකට ඇතුළත් කිරීම
        const formattedData = elements.map((el, index) => ({
          id: el.id || index,
          name: el.tags.name,
          amenity: el.tags.amenity || 'hospital',
          street: el.tags['addr:street'] || 'Colombo Region',
          lat: el.lat,
          lon: el.lon
        }));

        setHospitals(formattedData);
        setFilteredHospitals(formattedData);
        setLoading(false);

        const hospitalIcon = L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/4320/4320337.png',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30]
        });

        // 4. Markers මැප් එකට එකතු කර ref එකේ save කරගැනීම
        formattedData.forEach((item) => {
          const marker = L.marker([item.lat, item.lon], { icon: hospitalIcon });

          marker.bindPopup(`
            <div style="padding: 4px; font-family: sans-serif;">
              <h3 style="font-weight: bold; font-size: 14px; color: #b91c1c; margin-bottom: 2px;">${item.name}</h3>
              <span style="background-color: #fee2e2; color: #991b1b; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
                ${item.amenity.toUpperCase()}
              </span>
              <p style="font-size: 12px; color: #334155; margin-top: 4px;"><b>Street:</b> ${item.street}</p>
            </div>
          `);

          markersLayer.addLayer(marker);
          markersRef.current[item.id] = marker; // පසුකාලීනව click කිරීමට marker එක save කරමු
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });

    return () => {
      map.remove();
    };
  }, []);

  // 5. Search Bar එකේ නම టైප් කරන විට ලැයිස්තුව ෆිල්ටර් කිරීම
  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);

    const filtered = hospitals.filter(item => 
      item.name.toLowerCase().includes(keyword) || 
      item.street.toLowerCase().includes(keyword)
    );
    setFilteredHospitals(filtered);
  };

  // 6. Sidebar එකේ අයිතමයක් උඩ click කළ විට මැප් එක අදාළ තැනට Zoom වීම සහ Popup එක පෙන්වීම
  const handleSelectLocation = (item) => {
    if (mapRef.current) {
      mapRef.current.flyTo([item.lat, item.lon], 16, {
        animate: true,
        duration: 1.5
      });

      const marker = markersRef.current[item.id];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  return (
    <main className="flex flex-col h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Step 6: Advanced Map Dashboard & Sidebar 🚀
        </h1>
        <p className="text-sm text-gray-600">
          ግራපස ලැයිස්තුවෙන් (Sidebar) රෝහලක් ක්ලික් කර මැප් එක එය වෙත යොමු වන ආකාරය බලන්න. නැතහොත් Search බාර් එකෙන් පහසුවෙන් සොයන්න.
        </p>
      </div>

      {/* Main Layout (Sidebar + Map Container) */}
      <div className="flex flex-col md:flex-row flex-1 gap-4 bg-white p-4 rounded-xl shadow-md overflow-hidden">
        
        {/* Left Side: Sidebar & Search List */}
        <div className="w-full md:w-1/3 flex flex-col h-[300px] md:h-auto border-r border-gray-200 pr-0 md:pr-4">
          <div className="mb-3">
            <input 
              type="text"
              placeholder="Search hospitals by name..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Showing {filteredHospitals.length} facilities
            </p>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {loading ? (
              <p className="text-sm text-blue-600 animate-pulse text-center py-4">Loading sidebar list...</p>
            ) : filteredHospitals.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No hospitals found.</p>
            ) : (
              filteredHospitals.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleSelectLocation(item)}
                  className="p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg cursor-pointer transition-all shadow-xs"
                >
                  <h4 className="font-semibold text-sm text-gray-800">{item.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{item.street}</p>
                  <span className="inline-block mt-1 bg-red-100 text-red-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                    {item.amenity.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Map Container */}
        <div className="w-full md:w-2/3 h-[400px] md:h-full relative rounded-lg border border-gray-300 overflow-hidden z-0">
          <div id="map-container" className="w-full h-full" />
          
          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
              <p className="text-base font-semibold text-blue-600 animate-pulse">
                Building Interactive Dashboard... 🌍
              </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}