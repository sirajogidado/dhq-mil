import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Plus, Eye, FileText, Clock } from "lucide-react";

// Dummy data
const incidents = [
  {
    id: "INC001",
    reporter: "Citizen X",
    incidentType: "Sighting",
    location: "Abuja Central Market",
    description: "Suspect seen at market around 2PM",
    status: "Pending Review",
    timestamp: "2025-08-25 14:30",
    priority: "Medium"
  },
  {
    id: "INC002",
    reporter: "Officer Johnson",
    incidentType: "Tip",
    location: "Lagos Island",
    description: "Informant reports suspicious activity",
    status: "Under Investigation",
    timestamp: "2025-08-25 11:45",
    priority: "High"
  },
  {
    id: "INC003",
    reporter: "Anonymous",
    incidentType: "Evidence",
    location: "Kano State",
    description: "Photo evidence of wanted person",
    status: "Verified",
    timestamp: "2025-08-24 16:20",
    priority: "High"
  },
];

const IncidentReporting = () => {
  const [incident, setIncident] = useState({
    reporter: "",
    incidentType: "",
    location: "",
    description: "",
    evidence: null as File | null
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Review": return "secondary";
      case "Under Investigation": return "default";
      case "Verified": return "secondary";
      case "Rejected": return "destructive";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Incident Reporting</h1>
        <div className="flex gap-2">
          <Badge variant="destructive">5 Pending</Badge>
          <Badge variant="default">3 Investigating</Badge>
        </div>
      </div>

      <Tabs defaultValue="submit" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="submit">Submit Report</TabsTrigger>
          <TabsTrigger value="review">Review Queue</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="submit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Submit New Incident Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reporter">Reporter Name</Label>
                  <Input
                    id="reporter"
                    placeholder="Enter reporter name (or Anonymous)"
                    value={incident.reporter}
                    onChange={(e) => setIncident({ ...incident, reporter: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incident-type">Incident Type</Label>
                  <Select value={incident.incidentType} onValueChange={(value) => setIncident({ ...incident, incidentType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sighting">Sighting</SelectItem>
                      <SelectItem value="tip">Anonymous Tip</SelectItem>
                      <SelectItem value="evidence">Evidence Submission</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter incident location"
                  value={incident.location}
                  onChange={(e) => setIncident({ ...incident, location: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Incident Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed description of the incident..."
                  value={incident.description}
                  onChange={(e) => setIncident({ ...incident, description: e.target.value })}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="evidence">Evidence Upload</Label>
                <Input
                  id="evidence"
                  type="file"
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={(e) => setIncident({ ...incident, evidence: e.target.files?.[0] || null })}
                />
                <p className="text-xs text-muted-foreground">
                  Supported formats: Images, Videos, PDF, Word documents
                </p>
              </div>
              
              <Button className="w-full bg-gradient-military text-white">
                Submit Incident Report
              </Button>
            </CardContent>
          </Card>

          {/* Quick Report Template */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Report Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setIncident({
                  ...incident,
                  reporter: "Citizen Report",
                  incidentType: "sighting",
                  location: "Lagos State",
                  description: "SUSPECT SIGHTING REPORT\n\nDate/Time: [Current Date/Time]\nLocation: [Specific Address/Landmark]\nSuspect Description: [Height, Build, Clothing, Distinguishing Features]\nActivity Observed: [What was the suspect doing?]\nDuration of Observation: [How long was suspect observed?]\nWitnesses Present: [Any other witnesses?]\nContact Information: [Reporter's contact details]\n\nAdditional Notes:\n- [Any other relevant information]\n- [Direction suspect was heading]\n- [Vehicle information if applicable]"
                })}
              >
                <Eye className="w-4 h-4 mr-2" />
                Suspect Sighting Template
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setIncident({
                  ...incident,
                  reporter: "Anonymous",
                  incidentType: "tip",
                  location: "Confidential",
                  description: "ANONYMOUS TIP REPORT\n\nType of Information: [Crime Type/Activity]\nLocation: [Where is this happening?]\nTime Frame: [When does this occur?]\nPersons Involved: [Number of people, descriptions if known]\nActivity Details: [Detailed description of suspicious activity]\nFrequency: [How often does this occur?]\nSafety Concerns: [Is this an immediate threat?]\nEvidence Available: [Photos, documents, recordings?]\n\nConfidentiality Notice:\n- This report is submitted anonymously\n- No personal information of reporter required\n- Contact only through secure channels if follow-up needed\n\nUrgency Level: [Low/Medium/High]"
                })}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Anonymous Tip Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Moderation Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium">{incident.id}</TableCell>
                      <TableCell>{incident.reporter}</TableCell>
                      <TableCell>{incident.incidentType}</TableCell>
                      <TableCell>{incident.location}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(incident.priority)}>
                          {incident.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {incident.timestamp}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Report History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div key={incident.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{incident.id} - {incident.incidentType}</h4>
                        <p className="text-sm text-muted-foreground">Reporter: {incident.reporter}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getPriorityColor(incident.priority)}>
                          {incident.priority}
                        </Badge>
                        <Badge variant={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm"><strong>Location:</strong> {incident.location}</p>
                      <p className="text-sm"><strong>Description:</strong> {incident.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Submitted: {incident.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">24</div>
            <p className="text-sm text-muted-foreground">Total Reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">8</div>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">15</div>
            <p className="text-sm text-muted-foreground">Verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">1</div>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IncidentReporting;