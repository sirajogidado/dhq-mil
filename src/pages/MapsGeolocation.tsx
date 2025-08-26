import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Filter } from "lucide-react";

// Dummy data for map pins
const mapPins = [
  {
    id: "P001",
    coordinates: "6.5244, 3.3792",
    description: "Suspect spotted at Lagos Island",
    crimeType: "Kidnapping",
    status: "Active",
    timestamp: "2025-08-25 14:30"
  },
  {
    id: "P002",
    coordinates: "9.0579, 7.4951",
    description: "Biometric match at checkpoint",
    crimeType: "Terrorism",
    status: "Verified",
    timestamp: "2025-08-25 12:15"
  },
  {
    id: "P003",
    coordinates: "11.9504, 8.5373",
    description: "Wanted person sighting",
    crimeType: "Robbery",
    status: "Investigating",
    timestamp: "2025-08-25 09:45"
  },
];

const MapsGeolocation = () => {
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [newPin, setNewPin] = useState({
    coordinates: "",
    description: "",
    crimeType: ""
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Maps & Geolocation</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-gradient-military text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Pin
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Nigeria Security Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Interactive Map</p>
                <p className="text-sm">
                  Map will display Nigeria with security pins<br />
                  showing crime locations and hotspots
                </p>
                <div className="mt-4 text-xs">
                  <p>📍 Red pins: Active threats</p>
                  <p>🟡 Yellow pins: Under investigation</p>
                  <p>🟢 Green pins: Resolved cases</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pin Management */}
        <div className="space-y-6">
          {/* Add New Pin Form */}
          <Card>
            <CardHeader>
              <CardTitle>Pin Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coordinates">Coordinates</Label>
                <Input
                  id="coordinates"
                  placeholder="e.g., 6.5244, 3.3792"
                  value={newPin.coordinates}
                  onChange={(e) => setNewPin({ ...newPin, coordinates: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Describe the incident"
                  value={newPin.description}
                  onChange={(e) => setNewPin({ ...newPin, description: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="crime-type">Crime Type</Label>
                <Select value={newPin.crimeType} onValueChange={(value) => setNewPin({ ...newPin, crimeType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crime type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="terrorism">Terrorism</SelectItem>
                    <SelectItem value="kidnapping">Kidnapping</SelectItem>
                    <SelectItem value="robbery">Robbery</SelectItem>
                    <SelectItem value="fraud">Fraud</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full bg-gradient-military text-white">
                Add Location Pin
              </Button>
            </CardContent>
          </Card>

          {/* Recent Pins */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Pins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mapPins.map((pin) => (
                <div
                  key={pin.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedPin === pin.id ? "border-primary bg-primary/10" : ""
                  }`}
                  onClick={() => setSelectedPin(pin.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm">{pin.id}</span>
                    <Badge variant={
                      pin.status === "Active" ? "destructive" :
                      pin.status === "Verified" ? "secondary" : "outline"
                    }>
                      {pin.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {pin.description}
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{pin.crimeType}</span>
                    <span>{pin.coordinates}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hotspot Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-primary">Lagos</div>
            <p className="text-xs text-muted-foreground">45 incidents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-primary">Abuja</div>
            <p className="text-xs text-muted-foreground">32 incidents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-primary">Kano</div>
            <p className="text-xs text-muted-foreground">28 incidents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-primary">Rivers</div>
            <p className="text-xs text-muted-foreground">21 incidents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-primary">Kaduna</div>
            <p className="text-xs text-muted-foreground">19 incidents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-primary">Others</div>
            <p className="text-xs text-muted-foreground">67 incidents</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapsGeolocation;