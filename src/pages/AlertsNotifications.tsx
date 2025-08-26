import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bell, AlertTriangle, CheckCircle, Clock } from "lucide-react";

// Dummy data
const alerts = [
  {
    id: "AL001",
    message: "Sighting in Abuja - Suspect John Doe spotted at Central Market",
    type: "sighting",
    priority: "high",
    timestamp: "2025-08-25 14:30",
    status: "pending"
  },
  {
    id: "AL002",
    message: "New criminal database entry requires verification",
    type: "verification",
    priority: "medium",
    timestamp: "2025-08-25 12:15",
    status: "acknowledged"
  },
  {
    id: "AL003",
    message: "Biometric match found in Lagos checkpoint",
    type: "match",
    priority: "high",
    timestamp: "2025-08-25 09:45",
    status: "escalated"
  },
];

const AlertsNotifications = () => {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [action, setAction] = useState("");
  const [notes, setNotes] = useState("");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "acknowledged": return <CheckCircle className="w-4 h-4" />;
      case "escalated": return <AlertTriangle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Alerts & Notifications</h1>
        <div className="flex gap-2">
          <Badge variant="destructive">3 High Priority</Badge>
          <Badge variant="secondary">1 Medium Priority</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedAlert === alert.id ? "border-primary bg-primary/10" : ""
                }`}
                onClick={() => setSelectedAlert(alert.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{alert.id}</span>
                    <Badge variant={getPriorityColor(alert.priority)}>
                      {alert.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(alert.status)}
                    <Badge variant="outline">{alert.status}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {alert.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  {alert.timestamp}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alert Action Form */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Action</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedAlert ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="alert-id">Alert ID</Label>
                  <div className="p-2 bg-muted rounded border">
                    {selectedAlert}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="action">Action</Label>
                  <Select value={action} onValueChange={setAction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acknowledge">Acknowledge</SelectItem>
                      <SelectItem value="escalate">Escalate</SelectItem>
                      <SelectItem value="investigate">Investigate</SelectItem>
                      <SelectItem value="close">Close</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter action notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button className="w-full bg-gradient-military text-white">
                  Submit Action
                </Button>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select an alert to take action</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">8</div>
            <p className="text-sm text-muted-foreground">Unresolved Alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">15</div>
            <p className="text-sm text-muted-foreground">Resolved Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">2.5h</div>
            <p className="text-sm text-muted-foreground">Avg Response Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">92%</div>
            <p className="text-sm text-muted-foreground">Resolution Rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlertsNotifications;