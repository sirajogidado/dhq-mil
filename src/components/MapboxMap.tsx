import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface MapboxMapProps {
  onLocationSelect?: (location: { lat: number; lng: number; name: string }) => void;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ onLocationSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(true);

  const initializeMap = () => {
    if (!mapContainer.current || !apiKey) return;

    // Initialize map
    mapboxgl.accessToken = apiKey;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [8.6753, 9.0820], // Nigeria center coordinates
      zoom: 5.5,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Nigerian states data with coordinates
    const nigerianStates = [
      { name: "Lagos", coordinates: [3.3792, 6.5244] },
      { name: "Abuja", coordinates: [7.5399, 9.0579] },
      { name: "Kano", coordinates: [8.5164, 12.0022] },
      { name: "Rivers", coordinates: [6.8432, 4.8156] },
      { name: "Ogun", coordinates: [3.4516, 7.1608] },
      { name: "Kaduna", coordinates: [7.4401, 10.5264] },
      { name: "Oyo", coordinates: [3.9470, 8.0037] },
      { name: "Delta", coordinates: [6.1924, 5.6804] },
      { name: "Enugu", coordinates: [7.5105, 6.5244] },
      { name: "Cross River", coordinates: [8.3270, 5.9631] }
    ];

    // Sample case data
    const cases = [
      { name: "Armed Robbery - Lagos", coordinates: [3.3792, 6.5244], status: "active", type: "threat" },
      { name: "Kidnapping - Kaduna", coordinates: [7.4401, 10.5264], status: "investigation", type: "investigation" },
      { name: "Fraud Case - Abuja", coordinates: [7.5399, 9.0579], status: "resolved", type: "resolved" },
      { name: "Terrorism Alert - Borno", coordinates: [13.0827, 11.8846], status: "active", type: "threat" },
      { name: "Drug Trafficking - Rivers", coordinates: [6.8432, 4.8156], status: "investigation", type: "investigation" }
    ];

    map.current.on('load', () => {
      if (!map.current) return;

      // Add state markers
      nigerianStates.forEach((state) => {
        const marker = new mapboxgl.Marker({
          color: '#1e40af'
        })
        .setLngLat(state.coordinates as [number, number])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${state.name}</h3>`))
        .addTo(map.current!);
      });

      // Add case markers with different colors based on status
      cases.forEach((caseItem) => {
        let color = '#10b981'; // green for resolved
        if (caseItem.status === 'active') color = '#ef4444'; // red for active threats
        if (caseItem.status === 'investigation') color = '#f59e0b'; // yellow for investigation

        const marker = new mapboxgl.Marker({
          color: color
        })
        .setLngLat(caseItem.coordinates as [number, number])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div>
            <h3>${caseItem.name}</h3>
            <p>Status: ${caseItem.status}</p>
          </div>
        `))
        .addTo(map.current!);
      });
    });

    // Handle map clicks for location selection
    if (onLocationSelect) {
      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        onLocationSelect({
          lat: lat,
          lng: lng,
          name: `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
        });
      });
    }

    setShowApiInput(false);
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      initializeMap();
    }
  };

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  if (showApiInput) {
    return (
      <div className="p-6 bg-card rounded-lg border border-border">
        <div className="space-y-4 max-w-md mx-auto">
          <div>
            <h3 className="text-lg font-semibold mb-2">Mapbox Configuration</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your Mapbox public token to enable the interactive map. 
              Get your token from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
            <Input
              id="mapbox-token"
              type="password"
              placeholder="pk.eyJ1..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <Button onClick={handleApiKeySubmit} className="w-full">
            Load Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden border border-border">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-2 left-2 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
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
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>State Locations</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapboxMap;