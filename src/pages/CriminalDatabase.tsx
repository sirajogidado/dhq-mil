import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/context/DataContext";

interface CriminalRecord {
  id: string;
  registration_id: string;
  first_name: string;
  last_name: string;
  crime_type?: string;
  status: string;
  last_seen_location?: string;
  wanted_status?: string;
  severity?: string;
}

const CriminalDatabase = () => {
  const { toast } = useToast();
  const { refreshStats } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [crimeTypeFilter, setCrimeTypeFilter] = useState("all");
  const [records, setRecords] = useState<CriminalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<CriminalRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newRecord, setNewRecord] = useState({
    first_name: "",
    last_name: "",
    crime_type: "",
    last_seen_location: "",
    severity: "medium",
    wanted_status: "active",
    photo: null as File | null
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .in('status', ['flagged', 'wanted'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast({
        title: "Error",
        description: "Failed to load criminal records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    const fullName = `${record.first_name} ${record.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                         record.registration_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status.toLowerCase() === statusFilter;
    const matchesType = crimeTypeFilter === "all" || record.crime_type?.toLowerCase().includes(crimeTypeFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesType;
  });

  const isFormValid = newRecord.first_name && newRecord.last_name && newRecord.crime_type && newRecord.last_seen_location;

  const handleAddRecord = async () => {
    if (!isFormValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('registrations')
        .insert([{
          first_name: newRecord.first_name,
          last_name: newRecord.last_name,
          crime_type: newRecord.crime_type,
          last_seen_location: newRecord.last_seen_location,
          severity: newRecord.severity,
          wanted_status: newRecord.wanted_status,
          status: 'flagged',
          gender: 'male',
          phone_number: 'Not provided',
          address: 'Not provided',
          state: 'Unknown',
          lga: 'Unknown',
          date_of_birth: '1990-01-01',
          registration_id: `CR-${Date.now()}`
        }]);

      if (error) throw error;

      await fetchRecords();
      await refreshStats();
      setNewRecord({ 
        first_name: "", 
        last_name: "", 
        crime_type: "", 
        last_seen_location: "", 
        severity: "medium",
        wanted_status: "active",
        photo: null 
      });
      
      toast({
        title: "Success",
        description: "Criminal record added successfully",
      });
    } catch (error) {
      console.error('Error adding record:', error);
      toast({
        title: "Error",
        description: "Failed to add criminal record",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRecord = async () => {
    if (!selectedRecord) return;
    
    try {
      const { error } = await supabase
        .from('registrations')
        .update({
          first_name: selectedRecord.first_name,
          last_name: selectedRecord.last_name,
          crime_type: selectedRecord.crime_type,
          last_seen_location: selectedRecord.last_seen_location,
          severity: selectedRecord.severity,
          wanted_status: selectedRecord.wanted_status
        })
        .eq('id', selectedRecord.id);

      if (error) throw error;

      await fetchRecords();
      await refreshStats();
      setIsEditing(false);
      setSelectedRecord(null);
      
      toast({
        title: "Success",
        description: "Record updated successfully",
      });
    } catch (error) {
      console.error('Error updating record:', error);
      toast({
        title: "Error",
        description: "Failed to update record",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Criminal Database Management</h1>
        <Button 
          className="bg-gradient-military text-white" 
          onClick={() => document.getElementById('add-tab')?.click()}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Entry
        </Button>
      </div>

      <Tabs defaultValue="search" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger id="add-tab" value="add">Add New Entry</TabsTrigger>
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
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input 
                    id="first_name" 
                    placeholder="Enter first name" 
                    value={newRecord.first_name}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, first_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input 
                    id="last_name" 
                    placeholder="Enter last name" 
                    value={newRecord.last_name}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, last_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crime-type">Crime Type *</Label>
                  <Select value={newRecord.crime_type} onValueChange={(value) => setNewRecord(prev => ({ ...prev, crime_type: value }))}>
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
                  <Label htmlFor="location">Last Known Location *</Label>
                  <Input 
                    id="location" 
                    placeholder="Enter location" 
                    value={newRecord.last_seen_location}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, last_seen_location: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity Level</Label>
                  <Select value={newRecord.severity} onValueChange={(value) => setNewRecord(prev => ({ ...prev, severity: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wanted_status">Wanted Status</Label>
                  <Select value={newRecord.wanted_status} onValueChange={(value) => setNewRecord(prev => ({ ...prev, wanted_status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active/Wanted</SelectItem>
                      <SelectItem value="arrested">Arrested</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                onClick={handleAddRecord} 
                className="w-full bg-gradient-military text-white"
                disabled={!isFormValid}
              >
                Add Criminal Entry
              </Button>
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
                      <TableCell className="font-medium">{record.registration_id}</TableCell>
                      <TableCell>{record.first_name} {record.last_name}</TableCell>
                      <TableCell>{record.crime_type || 'Not specified'}</TableCell>
                      <TableCell>{record.last_seen_location || 'Unknown'}</TableCell>
                      <TableCell>
                        <Badge variant={record.wanted_status === "active" ? "destructive" : "default"} 
                               className={record.wanted_status === "arrested" ? "bg-green-100 text-green-800 border-green-300" : ""}>
                          {record.wanted_status || record.status}
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
                    <Label htmlFor="edit-first-name">First Name</Label>
                    <Input 
                      id="edit-first-name" 
                      value={selectedRecord.first_name}
                      onChange={(e) => setSelectedRecord(prev => prev ? { ...prev, first_name: e.target.value } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-last-name">Last Name</Label>
                    <Input 
                      id="edit-last-name" 
                      value={selectedRecord.last_name}
                      onChange={(e) => setSelectedRecord(prev => prev ? { ...prev, last_name: e.target.value } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-crime-type">Crime Type</Label>
                    <Select 
                      value={selectedRecord.crime_type || ''} 
                      onValueChange={(value) => setSelectedRecord(prev => prev ? { ...prev, crime_type: value } : null)}
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
                      value={selectedRecord.last_seen_location || ''}
                      onChange={(e) => setSelectedRecord(prev => prev ? { ...prev, last_seen_location: e.target.value } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select 
                      value={selectedRecord.wanted_status || selectedRecord.status} 
                      onValueChange={(value) => setSelectedRecord(prev => prev ? { ...prev, wanted_status: value } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active/Wanted</SelectItem>
                        <SelectItem value="arrested">Arrested</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
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