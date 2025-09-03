import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Download } from "lucide-react";

// Dummy data
const criminalRecords = [
  { id: "CR001", name: "Jane Smith", crime: "Robbery", status: "Arrested", location: "Lagos", biometrics: "BIO456" },
  { id: "CR002", name: "John Doe", crime: "Kidnapping", status: "Wanted", location: "Abuja", biometrics: "BIO123" },
  { id: "CR003", name: "Ali Musa", crime: "Terrorism", status: "Wanted", location: "Kano", biometrics: "BIO789" },
];

const CriminalDatabase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [crimeTypeFilter, setCrimeTypeFilter] = useState("all");
  const [records, setRecords] = useState(criminalRecords);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newRecord, setNewRecord] = useState({
    name: "",
    crime: "",
    location: "",
    biometrics: "",
    status: "Wanted",
    photo: null as File | null
  });

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status.toLowerCase() === statusFilter;
    const matchesType = crimeTypeFilter === "all" || record.crime.toLowerCase().includes(crimeTypeFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddRecord = () => {
    if (!newRecord.name || !newRecord.crime || !newRecord.location) {
      alert("Please fill in all required fields");
      return;
    }

    const record = {
      id: `CR${String(records.length + 1).padStart(3, '0')}`,
      name: newRecord.name,
      crime: newRecord.crime,
      status: newRecord.status,
      location: newRecord.location,
      biometrics: newRecord.biometrics || `BIO${Math.floor(Math.random() * 1000)}`
    };

    setRecords(prev => [...prev, record]);
    setNewRecord({ name: "", crime: "", location: "", biometrics: "", status: "Wanted", photo: null });
    alert("Criminal record added successfully");
  };

  const handleUpdateRecord = () => {
    if (!selectedRecord) return;
    
    setRecords(prev => prev.map(r => 
      r.id === selectedRecord.id ? selectedRecord : r
    ));
    setIsEditing(false);
    setSelectedRecord(null);
    alert("Record updated successfully");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Criminal Database Management</h1>
        <Button className="bg-gradient-military text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add New Entry
        </Button>
      </div>

      <Tabs defaultValue="search" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="add">Add New Entry</TabsTrigger>
          <TabsTrigger value="search">Search & View</TabsTrigger>
          <TabsTrigger value="edit">Edit/Update Records</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Criminal Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter full name" 
                    value={newRecord.name}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crime-type">Crime Type</Label>
                  <Select value={newRecord.crime} onValueChange={(value) => setNewRecord(prev => ({ ...prev, crime: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crime type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Terrorism">Terrorism</SelectItem>
                      <SelectItem value="Kidnapping">Kidnapping</SelectItem>
                      <SelectItem value="Robbery">Robbery</SelectItem>
                      <SelectItem value="Fraud">Fraud</SelectItem>
                      <SelectItem value="Murder">Murder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Last Known Location</Label>
                  <Input 
                    id="location" 
                    placeholder="Enter location" 
                    value={newRecord.location}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biometrics">Biometrics ID</Label>
                  <Input 
                    id="biometrics" 
                    placeholder="Enter biometrics ID" 
                    value={newRecord.biometrics}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, biometrics: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newRecord.status} onValueChange={(value) => setNewRecord(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wanted">Active/Wanted</SelectItem>
                      <SelectItem value="Arrested">Arrested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photo">Photo Upload</Label>
                  <Input 
                    id="photo" 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setNewRecord(prev => ({ ...prev, photo: e.target.files?.[0] || null }))}
                  />
                </div>
              </div>
              <Button onClick={handleAddRecord} className="w-full bg-gradient-military text-white">Add Criminal Entry</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search & View Records
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="wanted">Wanted</SelectItem>
                    <SelectItem value="arrested">Arrested</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={crimeTypeFilter} onValueChange={setCrimeTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Crimes</SelectItem>
                    <SelectItem value="terrorism">Terrorism</SelectItem>
                    <SelectItem value="kidnapping">Kidnapping</SelectItem>
                    <SelectItem value="robbery">Robbery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Crime Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.id}</TableCell>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.crime}</TableCell>
                      <TableCell>{record.location}</TableCell>
                      <TableCell>
                        <Badge variant={record.status === "Wanted" ? "destructive" : "default"} 
                               className={record.status === "Arrested" ? "bg-green-100 text-green-800 border-green-300" : ""}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedRecord(record);
                            setIsEditing(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit Criminal Record</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing && selectedRecord ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input 
                      id="edit-name" 
                      value={selectedRecord.name}
                      onChange={(e) => setSelectedRecord(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-crime-type">Crime Type</Label>
                    <Select 
                      value={selectedRecord.crime} 
                      onValueChange={(value) => setSelectedRecord(prev => ({ ...prev, crime: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Terrorism">Terrorism</SelectItem>
                        <SelectItem value="Kidnapping">Kidnapping</SelectItem>
                        <SelectItem value="Robbery">Robbery</SelectItem>
                        <SelectItem value="Fraud">Fraud</SelectItem>
                        <SelectItem value="Murder">Murder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-location">Last Known Location</Label>
                    <Input 
                      id="edit-location" 
                      value={selectedRecord.location}
                      onChange={(e) => setSelectedRecord(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select 
                      value={selectedRecord.status} 
                      onValueChange={(value) => setSelectedRecord(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Wanted">Active/Wanted</SelectItem>
                        <SelectItem value="Arrested">Arrested</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Select a record from the Search & View tab to edit it.
                </p>
              )}
              
              {isEditing && selectedRecord && (
                <div className="flex gap-3">
                  <Button onClick={handleUpdateRecord} className="flex-1 bg-gradient-military text-white">
                    Update Record
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => { setIsEditing(false); setSelectedRecord(null); }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Criminal Database
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select defaultValue="csv">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Filter by Status</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Records</SelectItem>
                      <SelectItem value="wanted">Wanted Only</SelectItem>
                      <SelectItem value="arrested">Arrested Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full bg-gradient-military text-white">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CriminalDatabase;