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
  const [apiKey, setApiKey] = useState('pk.eyJ1IjoibWFydmVsaiIsImEiOiJjbWV2NmgzOTQwZW5nMmdzNXBvZmFneW84In0.OaNDPl6OvdfOVHzolTWEcA');
  const [showApiInput, setShowApiInput] = useState(false);

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

    // All 36 Nigerian states with coordinates and security status
    const nigerianStates = [
      { name: "Abia", coordinates: [7.5629, 5.4527], threatLevel: "low" },
      { name: "Adamawa", coordinates: [12.4478, 9.3265], threatLevel: "medium" },
      { name: "Akwa Ibom", coordinates: [7.8753, 5.0066], threatLevel: "low" },
      { name: "Anambra", coordinates: [6.9206, 6.2104], threatLevel: "low" },
      { name: "Bauchi", coordinates: [9.8442, 10.3158], threatLevel: "medium" },
      { name: "Bayelsa", coordinates: [6.2664, 4.7719], threatLevel: "medium" },
      { name: "Benue", coordinates: [8.1335, 7.3336], threatLevel: "high" },
      { name: "Borno", coordinates: [13.0827, 11.8846], threatLevel: "high" },
      { name: "Cross River", coordinates: [8.3270, 5.9631], threatLevel: "low" },
      { name: "Delta", coordinates: [6.1924, 5.6804], threatLevel: "medium" },
      { name: "Ebonyi", coordinates: [8.1137, 6.2649], threatLevel: "low" },
      { name: "Edo", coordinates: [6.3350, 6.3176], threatLevel: "medium" },
      { name: "Ekiti", coordinates: [5.2206, 7.7193], threatLevel: "low" },
      { name: "Enugu", coordinates: [7.5105, 6.5244], threatLevel: "low" },
      { name: "Gombe", coordinates: [11.1667, 10.2833], threatLevel: "medium" },
      { name: "Imo", coordinates: [7.0256, 5.4947], threatLevel: "low" },
      { name: "Jigawa", coordinates: [9.5540, 12.2230], threatLevel: "medium" },
      { name: "Kaduna", coordinates: [7.4401, 10.5264], threatLevel: "high" },
      { name: "Kano", coordinates: [8.5164, 12.0022], threatLevel: "medium" },
      { name: "Katsina", coordinates: [7.6006, 12.9908], threatLevel: "high" },
      { name: "Kebbi", coordinates: [4.1975, 12.4533], threatLevel: "medium" },
      { name: "Kogi", coordinates: [6.7401, 7.7999], threatLevel: "medium" },
      { name: "Kwara", coordinates: [4.5756, 8.9669], threatLevel: "low" },
      { name: "Lagos", coordinates: [3.3792, 6.5244], threatLevel: "medium" },
      { name: "Nasarawa", coordinates: [8.5378, 8.5378], threatLevel: "medium" },
      { name: "Niger", coordinates: [6.5569, 10.2031], threatLevel: "high" },
      { name: "Ogun", coordinates: [3.4516, 7.1608], threatLevel: "low" },
      { name: "Ondo", coordinates: [5.1931, 7.2526], threatLevel: "low" },
      { name: "Osun", coordinates: [4.5560, 7.5629], threatLevel: "low" },
      { name: "Oyo", coordinates: [3.9470, 8.0037], threatLevel: "low" },
      { name: "Plateau", coordinates: [8.8965, 9.2182], threatLevel: "high" },
      { name: "Rivers", coordinates: [6.8432, 4.8156], threatLevel: "medium" },
      { name: "Sokoto", coordinates: [5.2340, 13.0609], threatLevel: "medium" },
      { name: "Taraba", coordinates: [9.7801, 8.8901], threatLevel: "medium" },
      { name: "Yobe", coordinates: [11.7466, 12.2939], threatLevel: "high" },
      { name: "Zamfara", coordinates: [6.2407, 12.1664], threatLevel: "high" },
      { name: "Abuja FCT", coordinates: [7.5399, 9.0579], threatLevel: "medium" }
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

      // Add state markers with color coding based on threat level
      nigerianStates.forEach((state) => {
        let color = '#10b981'; // green for low threat
        if (state.threatLevel === 'medium') color = '#f59e0b'; // yellow for medium threat
        if (state.threatLevel === 'high') color = '#ef4444'; // red for high threat

        const marker = new mapboxgl.Marker({
          color: color,
          scale: 0.8
        })
        .setLngLat(state.coordinates as [number, number])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div>
            <h3 class="font-bold">${state.name} State</h3>
            <p class="text-sm">Threat Level: <span class="font-semibold">${state.threatLevel.toUpperCase()}</span></p>
          </div>
        `))
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
    if (apiKey) {
      initializeMap();
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [apiKey]);

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

export default MapboxMap;