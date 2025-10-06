import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Plus, Filter, Map, Navigation, AlertTriangle, Eye, CheckCircle } from "lucide-react";
import LeafletMap from "@/components/LeafletMap";
import { useToast } from "@/hooks/use-toast";

export default function MapsGeolocation() {
  // Enhanced map pins data
  const [mapPins, setMapPins] = useState([
    {
      id: "P001",
      coordinates: [3.3792, 6.5244] as [number, number],
      description: "Suspect spotted at Lagos Island",
      crimeType: "kidnapping",
      status: "active" as const,
      timestamp: "2025-08-25 14:30"
    },
    {
      id: "P002", 
      coordinates: [7.4951, 9.0579] as [number, number],
      description: "Biometric match at checkpoint",
      crimeType: "terrorism",
      status: "under investigation" as const,
      timestamp: "2025-08-25 12:15"
    },
    {
      id: "P003",
      coordinates: [8.5373, 11.9504] as [number, number], 
      description: "Wanted person sighting resolved",
      crimeType: "armed-robbery",
      status: "resolved" as const,
      timestamp: "2025-08-25 09:45"
    }
  ]);
  
  const [selectedPin, setSelectedPin] = useState<typeof mapPins[0] | null>(null);
  const [newPin, setNewPin] = useState({
    coordinates: "",
    description: "",
    crimeType: "",
  });
  const [isAddingPin, setIsAddingPin] = useState(false);
  const { toast } = useToast();

  const handleLocationSelect = (location: { lat: number; lng: number; name: string }) => {
    setNewPin(prev => ({
      ...prev,
      coordinates: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
    }));
    toast({
      title: "Location Selected",
      description: `Coordinates: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
    });
  };

  const handleAddPin = () => {
    if (!newPin.coordinates || !newPin.description || !newPin.crimeType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const [lat, lng] = newPin.coordinates.split(',').map(coord => parseFloat(coord.trim()));
    const newPinData = {
      id: `P${String(mapPins.length + 1).padStart(3, '0')}`,
      coordinates: [lng, lat] as [number, number],
      description: newPin.description,
      crimeType: newPin.crimeType,
      status: "active" as const,
      timestamp: new Date().toLocaleString('en-GB', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    setMapPins(prev => [...prev, newPinData]);
    
    toast({
      title: "Success",
      description: "New security pin added successfully to the map"
    });
    
    setNewPin({ coordinates: "", description: "", crimeType: "" });
    setIsAddingPin(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Maps & Geolocation</h1>
          <p className="text-muted-foreground mt-1">
            Interactive security mapping and location intelligence
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter Cases
          </Button>
          <Dialog open={isAddingPin} onOpenChange={setIsAddingPin}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Security Pin
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Security Pin</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="coordinates">Coordinates</Label>
                    <Input
                      id="coordinates"
                      placeholder="Click on map to select location"
                      value={newPin.coordinates}
                      onChange={(e) => setNewPin(prev => ({ ...prev, coordinates: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="crime-type">Crime Type</Label>
                    <Select value={newPin.crimeType} onValueChange={(value) => setNewPin(prev => ({ ...prev, crimeType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crime type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="armed-robbery">Armed Robbery</SelectItem>
                        <SelectItem value="kidnapping">Kidnapping</SelectItem>
                        <SelectItem value="terrorism">Terrorism</SelectItem>
                        <SelectItem value="drug-trafficking">Drug Trafficking</SelectItem>
                        <SelectItem value="fraud">Fraud</SelectItem>
                        <SelectItem value="cybercrime">Cybercrime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the incident or security concern..."
                    value={newPin.description}
                    onChange={(e) => setNewPin(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Click on the main map below to select a location, then fill out this form.
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsAddingPin(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPin}>
                    Add Pin
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="map" className="space-y-6">
        <TabsList>
          <TabsTrigger value="map">Interactive Map</TabsTrigger>
          <TabsTrigger value="pins">Security Pins</TabsTrigger>
          <TabsTrigger value="hotspots">Threat Hotspots</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-6">
          {/* Interactive Map Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5 text-primary" />
                Nigerian Security Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LeafletMap onLocationSelect={handleLocationSelect} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pins" className="space-y-6">
          {/* Recent Pins List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mapPins.map((pin) => (
              <Card key={pin.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline">{pin.id}</Badge>
                    <Badge variant={
                      pin.status === "active" ? "destructive" :
                      pin.status === "resolved" ? "default" : "secondary"
                    }>
                      {pin.status}
                    </Badge>
                  </div>
                  <h4 className="font-semibold mb-2">{pin.description}</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{pin.crimeType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{pin.coordinates.join(', ')}</span>
                    </div>
                    <div className="text-xs">
                      {pin.timestamp}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hotspots" className="space-y-6">
          {/* Hotspot Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { state: "Lagos", incidents: 45, threat: "high" },
              { state: "Abuja", incidents: 32, threat: "medium" },
              { state: "Kano", incidents: 28, threat: "medium" },
              { state: "Rivers", incidents: 21, threat: "low" },
              { state: "Kaduna", incidents: 19, threat: "high" },
              { state: "Others", incidents: 67, threat: "medium" }
            ].map((hotspot) => (
              <Card key={hotspot.state}>
                <CardContent className="p-4 text-center">
                  <div className="text-lg font-bold text-primary mb-1">{hotspot.state}</div>
                  <p className="text-sm text-muted-foreground mb-2">{hotspot.incidents} incidents</p>
                  <Badge variant={
                    hotspot.threat === "high" ? "destructive" :
                    hotspot.threat === "medium" ? "secondary" : "default"
                  }>
                    {hotspot.threat} risk
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}