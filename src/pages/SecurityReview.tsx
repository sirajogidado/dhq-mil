import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Eye, X, Edit, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FlaggedProfile {
  id: string;
  registration_id: string;
  first_name: string;
  last_name: string;
  status: string;
  crime_type?: string;
  severity?: string;
  notes?: string;
  created_at: string;
  last_seen_location?: string;
}

const SecurityReview = () => {
  const [flaggedProfiles, setFlaggedProfiles] = useState<FlaggedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<FlaggedProfile | null>(null);
  const [editingProfile, setEditingProfile] = useState<FlaggedProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFlaggedProfiles();
  }, []);

  const fetchFlaggedProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('status', 'flagged')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFlaggedProfiles(data || []);
    } catch (error) {
      console.error('Error fetching flagged profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load flagged profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnflag = async (profileId: string) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: 'pending' })
        .eq('id', profileId);

      if (error) throw error;

      setFlaggedProfiles(prev => prev.filter(p => p.id !== profileId));
      toast({
        title: "Success",
        description: "Profile has been unflagged and moved to pending review",
      });
    } catch (error) {
      console.error('Error unflagging profile:', error);
      toast({
        title: "Error", 
        description: "Failed to unflag profile",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async () => {
    if (!editingProfile) return;

    try {
      const { error } = await supabase
        .from('registrations')
        .update({
          crime_type: editingProfile.crime_type,
          severity: editingProfile.severity,
          notes: editingProfile.notes,
          last_seen_location: editingProfile.last_seen_location,
        })
        .eq('id', editingProfile.id);

      if (error) throw error;

      setFlaggedProfiles(prev => 
        prev.map(p => p.id === editingProfile.id ? editingProfile : p)
      );
      setEditingProfile(null);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const filteredProfiles = flaggedProfiles.filter(profile =>
    profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.registration_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">Loading flagged profiles...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-destructive" />
            Security Review Dashboard
          </h1>
          <p className="text-muted-foreground">Review and manage flagged profiles requiring security attention</p>
        </div>
        <Badge variant="destructive" className="text-lg px-4 py-2">
          {flaggedProfiles.length} Flagged Profiles
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Flagged Profiles</CardTitle>
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Crime Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date Flagged</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.registration_id}</TableCell>
                  <TableCell>{profile.first_name} {profile.last_name}</TableCell>
                  <TableCell>{profile.crime_type || 'Not specified'}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(profile.severity)}>
                      {profile.severity || 'Medium'}
                    </Badge>
                  </TableCell>
                  <TableCell>{profile.last_seen_location || 'Unknown'}</TableCell>
                  <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedProfile(profile)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Profile Details - {selectedProfile?.registration_id}</DialogTitle>
                          </DialogHeader>
                          {selectedProfile && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Full Name</Label>
                                <p className="text-sm">{selectedProfile.first_name} {selectedProfile.last_name}</p>
                              </div>
                              <div>
                                <Label>Crime Type</Label>
                                <p className="text-sm">{selectedProfile.crime_type || 'Not specified'}</p>
                              </div>
                              <div>
                                <Label>Severity Level</Label>
                                <Badge className={getSeverityColor(selectedProfile.severity)}>
                                  {selectedProfile.severity || 'Medium'}
                                </Badge>
                              </div>
                              <div>
                                <Label>Last Seen Location</Label>
                                <p className="text-sm">{selectedProfile.last_seen_location || 'Unknown'}</p>
                              </div>
                              <div className="col-span-2">
                                <Label>Notes</Label>
                                <p className="text-sm">{selectedProfile.notes || 'No additional notes'}</p>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingProfile(profile)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Profile - {editingProfile?.registration_id}</DialogTitle>
                          </DialogHeader>
                          {editingProfile && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="crime_type">Crime Type</Label>
                                <Input
                                  id="crime_type"
                                  value={editingProfile.crime_type || ''}
                                  onChange={(e) => setEditingProfile(prev => prev ? {...prev, crime_type: e.target.value} : null)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="severity">Severity Level</Label>
                                <select
                                  id="severity"
                                  className="w-full p-2 border rounded-md"
                                  value={editingProfile.severity || 'medium'}
                                  onChange={(e) => setEditingProfile(prev => prev ? {...prev, severity: e.target.value} : null)}
                                >
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                </select>
                              </div>
                              <div>
                                <Label htmlFor="last_seen_location">Last Seen Location</Label>
                                <Input
                                  id="last_seen_location"
                                  value={editingProfile.last_seen_location || ''}
                                  onChange={(e) => setEditingProfile(prev => prev ? {...prev, last_seen_location: e.target.value} : null)}
                                />
                              </div>
                              <div className="col-span-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                  id="notes"
                                  value={editingProfile.notes || ''}
                                  onChange={(e) => setEditingProfile(prev => prev ? {...prev, notes: e.target.value} : null)}
                                  rows={3}
                                />
                              </div>
                              <div className="col-span-2 flex gap-2">
                                <Button onClick={handleUpdateProfile} className="flex-1">
                                  Update Profile
                                </Button>
                                <Button variant="outline" onClick={() => setEditingProfile(null)} className="flex-1">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleUnflag(profile.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredProfiles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No flagged profiles found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityReview;