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
import { MapPin, Plus, Filter, Map, Navigation, AlertTriangle, Eye, CheckCircle, Pencil, Trash2 } from "lucide-react";
import LeafletMap from "@/components/LeafletMap";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "maps_geolocation_pins_v1";

type PinStatus = "active" | "under investigation" | "resolved";
type MapPin = {
  id: string;
  coordinates: [number, number];
  description: string;
  crimeType: string;
  status: PinStatus;
  timestamp: string;
};

const defaultPins: MapPin[] = [
  { id: "P001", coordinates: [3.3792, 6.5244], description: "Suspect spotted at Lagos Island", crimeType: "kidnapping", status: "active", timestamp: "2025-08-25 14:30" },
  { id: "P002", coordinates: [7.4951, 9.0579], description: "Biometric match at checkpoint", crimeType: "terrorism", status: "under investigation", timestamp: "2025-08-25 12:15" },
  { id: "P003", coordinates: [8.5373, 11.9504], description: "Wanted person sighting resolved", crimeType: "armed-robbery", status: "resolved", timestamp: "2025-08-25 09:45" },
];

export default function MapsGeolocation() {
  const [mapPins, setMapPins] = useState<MapPin[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as MapPin[];
    } catch {}
    return defaultPins;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mapPins));
    } catch {}
  }, [mapPins]);

  const [editingPin, setEditingPin] = useState<MapPin | null>(null);
  const [newPin, setNewPin] = useState({
    coordinates: "",
    description: "",
    crimeType: "",
    status: "active" as PinStatus,
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
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      toast({ title: "Invalid coordinates", description: "Use format: lat, lng", variant: "destructive" });
      return;
    }
    const timestamp = new Date().toLocaleString('en-GB', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });

    if (editingPin) {
      setMapPins(prev => prev.map(p => p.id === editingPin.id ? {
        ...p,
        coordinates: [lng, lat],
        description: newPin.description,
        crimeType: newPin.crimeType,
        status: newPin.status,
        timestamp,
      } : p));
      toast({ title: "Updated", description: "Security pin updated" });
    } else {
      const nextNum = mapPins.reduce((max, p) => {
        const n = parseInt(p.id.replace(/\D/g, ""), 10);
        return Number.isFinite(n) && n > max ? n : max;
      }, 0) + 1;
      const newPinData: MapPin = {
        id: `P${String(nextNum).padStart(3, '0')}`,
        coordinates: [lng, lat],
        description: newPin.description,
        crimeType: newPin.crimeType,
        status: newPin.status,
        timestamp,
      };
      setMapPins(prev => [...prev, newPinData]);
      toast({ title: "Success", description: "New security pin added" });
    }

    setNewPin({ coordinates: "", description: "", crimeType: "", status: "active" });
    setEditingPin(null);
    setIsAddingPin(false);
  };

  const openEdit = (pin: MapPin) => {
    setEditingPin(pin);
    const [lng, lat] = pin.coordinates;
    setNewPin({
      coordinates: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      description: pin.description,
      crimeType: pin.crimeType,
      status: pin.status,
    });
    setIsAddingPin(true);
  };

  const handleDelete = (id: string) => {
    setMapPins(prev => prev.filter(p => p.id !== id));
    toast({ title: "Deleted", description: "Security pin removed" });
  };

  const closeDialog = (open: boolean) => {
    setIsAddingPin(open);
    if (!open) {
      setEditingPin(null);
      setNewPin({ coordinates: "", description: "", crimeType: "", status: "active" });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Maps & Geolocation</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Interactive security mapping and location intelligence
          </p>
        </div>
        
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Filter className="w-4 h-4 mr-2" />
            Filter Cases
          </Button>
          <Dialog open={isAddingPin} onOpenChange={closeDialog}>
            <DialogTrigger asChild>
              <Button className="flex-1 sm:flex-none">
                <Plus className="w-4 h-4 mr-2" />
                Add Security Pin
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPin ? "Edit Security Pin" : "Add New Security Pin"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="coordinates">Coordinates (lat, lng)</Label>
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
                  <Label htmlFor="pin-status">Status</Label>
                  <Select value={newPin.status} onValueChange={(value: PinStatus) => setNewPin(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger id="pin-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="under investigation">Under Investigation</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Button variant="outline" onClick={() => closeDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddPin}>
                    {editingPin ? "Save Changes" : "Add Pin"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="map" className="space-y-6">
        <TabsList className="w-full sm:w-auto flex-wrap h-auto">
          <TabsTrigger value="map">Map</TabsTrigger>
          <TabsTrigger value="pins">Pins</TabsTrigger>
          <TabsTrigger value="hotspots">Hotspots</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-6">
          {/* Interactive Map Display */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5 text-primary" />
                Nigerian Security Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
              <LeafletMap onLocationSelect={handleLocationSelect} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pins" className="space-y-6">
          {/* Recent Pins List */}
          {mapPins.length === 0 && (
            <p className="text-sm text-muted-foreground">No pins yet. Add one from the top-right.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mapPins.map((pin) => (
              <Card key={pin.id} className="hover:shadow-md transition-shadow">
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
                  <h4 className="font-semibold mb-2 break-words">{pin.description}</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{pin.crimeType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </div>
                    <div className="flex items-center gap-2 break-all">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{pin.coordinates[1].toFixed(4)}, {pin.coordinates[0].toFixed(4)}</span>
                    </div>
                    <div className="text-xs">
                      {pin.timestamp}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(pin)}>
                      <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDelete(pin.id)}>
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hotspots" className="space-y-6">
          {/* Hotspot Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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