import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LeafletMapProps {
  onLocationSelect?: (location: { lat: number; lng: number; name: string }) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ onLocationSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([9.0820, 8.6753], 6);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    // All 36 Nigerian states with coordinates and security status
    const nigerianStates = [
      { name: "Abia", coordinates: [5.4527, 7.5629], threatLevel: "low" },
      { name: "Adamawa", coordinates: [9.3265, 12.4478], threatLevel: "medium" },
      { name: "Akwa Ibom", coordinates: [5.0066, 7.8753], threatLevel: "low" },
      { name: "Anambra", coordinates: [6.2104, 6.9206], threatLevel: "low" },
      { name: "Bauchi", coordinates: [10.3158, 9.8442], threatLevel: "medium" },
      { name: "Bayelsa", coordinates: [4.7719, 6.2664], threatLevel: "medium" },
      { name: "Benue", coordinates: [7.3336, 8.1335], threatLevel: "high" },
      { name: "Borno", coordinates: [11.8846, 13.0827], threatLevel: "high" },
      { name: "Cross River", coordinates: [5.9631, 8.3270], threatLevel: "low" },
      { name: "Delta", coordinates: [5.6804, 6.1924], threatLevel: "medium" },
      { name: "Ebonyi", coordinates: [6.2649, 8.1137], threatLevel: "low" },
      { name: "Edo", coordinates: [6.3176, 6.3350], threatLevel: "medium" },
      { name: "Ekiti", coordinates: [7.7193, 5.2206], threatLevel: "low" },
      { name: "Enugu", coordinates: [6.5244, 7.5105], threatLevel: "low" },
      { name: "Gombe", coordinates: [10.2833, 11.1667], threatLevel: "medium" },
      { name: "Imo", coordinates: [5.4947, 7.0256], threatLevel: "low" },
      { name: "Jigawa", coordinates: [12.2230, 9.5540], threatLevel: "medium" },
      { name: "Kaduna", coordinates: [10.5264, 7.4401], threatLevel: "high" },
      { name: "Kano", coordinates: [12.0022, 8.5164], threatLevel: "medium" },
      { name: "Katsina", coordinates: [12.9908, 7.6006], threatLevel: "high" },
      { name: "Kebbi", coordinates: [12.4533, 4.1975], threatLevel: "medium" },
      { name: "Kogi", coordinates: [7.7999, 6.7401], threatLevel: "medium" },
      { name: "Kwara", coordinates: [8.9669, 4.5756], threatLevel: "low" },
      { name: "Lagos", coordinates: [6.5244, 3.3792], threatLevel: "medium" },
      { name: "Nasarawa", coordinates: [8.5378, 8.5378], threatLevel: "medium" },
      { name: "Niger", coordinates: [10.2031, 6.5569], threatLevel: "high" },
      { name: "Ogun", coordinates: [7.1608, 3.4516], threatLevel: "low" },
      { name: "Ondo", coordinates: [7.2526, 5.1931], threatLevel: "low" },
      { name: "Osun", coordinates: [7.5629, 4.5560], threatLevel: "low" },
      { name: "Oyo", coordinates: [8.0037, 3.9470], threatLevel: "low" },
      { name: "Plateau", coordinates: [9.2182, 8.8965], threatLevel: "high" },
      { name: "Rivers", coordinates: [4.8156, 6.8432], threatLevel: "medium" },
      { name: "Sokoto", coordinates: [13.0609, 5.2340], threatLevel: "medium" },
      { name: "Taraba", coordinates: [8.8901, 9.7801], threatLevel: "medium" },
      { name: "Yobe", coordinates: [12.2939, 11.7466], threatLevel: "high" },
      { name: "Zamfara", coordinates: [12.1664, 6.2407], threatLevel: "high" },
      { name: "Abuja FCT", coordinates: [9.0579, 7.5399], threatLevel: "medium" }
    ];

    // Sample case data
    const cases = [
      { name: "Armed Robbery - Lagos", coordinates: [6.5244, 3.3792], status: "active", type: "threat" },
      { name: "Kidnapping - Kaduna", coordinates: [10.5264, 7.4401], status: "investigation", type: "investigation" },
      { name: "Fraud Case - Abuja", coordinates: [9.0579, 7.5399], status: "resolved", type: "resolved" },
      { name: "Terrorism Alert - Borno", coordinates: [11.8846, 13.0827], status: "active", type: "threat" },
      { name: "Drug Trafficking - Rivers", coordinates: [4.8156, 6.8432], status: "investigation", type: "investigation" }
    ];

    // Add state markers with color coding based on threat level
    nigerianStates.forEach((state) => {
      let color = '#10b981'; // green for low threat
      if (state.threatLevel === 'medium') color = '#f59e0b'; // yellow for medium threat
      if (state.threatLevel === 'high') color = '#ef4444'; // red for high threat

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      L.marker(state.coordinates as [number, number], { icon: customIcon })
        .addTo(map.current!)
        .bindPopup(`
          <div>
            <h3 style="font-weight: bold; margin-bottom: 4px;">${state.name} State</h3>
            <p style="margin: 0; font-size: 14px;">Threat Level: <span style="font-weight: 600;">${state.threatLevel.toUpperCase()}</span></p>
          </div>
        `);
    });

    // Add case markers with different colors based on status
    cases.forEach((caseItem) => {
      let color = '#10b981'; // green for resolved
      if (caseItem.status === 'active') color = '#ef4444'; // red for active threats
      if (caseItem.status === 'investigation') color = '#f59e0b'; // yellow for investigation

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      L.marker(caseItem.coordinates as [number, number], { icon: customIcon })
        .addTo(map.current!)
        .bindPopup(`
          <div>
            <h3 style="font-weight: bold; margin-bottom: 4px;">${caseItem.name}</h3>
            <p style="margin: 0; font-size: 14px;">Status: ${caseItem.status}</p>
          </div>
        `);
    });

    // Handle map clicks for location selection
    if (onLocationSelect) {
      map.current.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onLocationSelect({
          lat: lat,
          lng: lng,
          name: `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
        });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [onLocationSelect]);

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden border border-border">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-2 left-2 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-md z-[1000]">
        <div className="text-sm space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Active Threats</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Under Investigation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Resolved Cases</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Low Threat States</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium Threat States</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>High Threat States</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeafletMap;