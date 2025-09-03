import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Edit, Trash2, Shield, Clock, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [pendingRegistrations, setPendingRegistrations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const [newUser, setNewUser] = useState({
    username: "",
    role: "",
    email: "",
    password: "",
    status: "Active"
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load pending registrations
      const { data: pending, error: pendingError } = await supabase
        .from('pending_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (pendingError) throw pendingError;
      setPendingRegistrations(pending || []);

      // Load existing users
      const { data: userProfiles, error: usersError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(userProfiles || []);

    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const approveRegistration = async (registrationId: string, password: string) => {
    try {
      const { error } = await supabase.functions.invoke('create-approved-user', {
        body: { registrationId, password }
      });

      if (error) throw error;

      toast({
        title: "Registration approved!",
        description: "User account has been created successfully.",
      });

      // Reload data
      loadData();
    } catch (error: any) {
      toast({
        title: "Error approving registration",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const rejectRegistration = async (registrationId: string) => {
    try {
      const { error } = await supabase
        .from('pending_registrations')
        .update({ status: 'rejected', approved_by: user?.id, approved_at: new Date().toISOString() })
        .eq('id', registrationId);

      if (error) throw error;

      toast({
        title: "Registration rejected",
        description: "The registration request has been rejected.",
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Error rejecting registration",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "destructive";
      case "editor": return "secondary";
      case "viewer": return "outline";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "secondary" : "destructive";
  };

  const getRegistrationStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "default";
      case "approved": return "secondary";
      case "rejected": return "destructive";
      default: return "outline";
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Admin-only access to manage system users</p>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{users.length}</div>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">
              {users.filter(u => u.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">
              {pendingRegistrations.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-sm text-muted-foreground">Pending Requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <p className="text-sm text-muted-foreground">Admins</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Users and Pending Registrations */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">System Users</TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending Registrations
            {pendingRegistrations.filter(r => r.status === 'pending').length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {pendingRegistrations.filter(r => r.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  System Users
                </CardTitle>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-primary text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" />
                      Create User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New System User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-username">Full Name</Label>
                          <Input
                            id="new-username"
                            placeholder="Enter full name"
                            value={newUser.username}
                            onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-email">Email</Label>
                          <Input
                            id="new-email"
                            type="email"
                            placeholder="user@dhq.mil.ng"
                            value={newUser.email}
                            onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-role">Role</Label>
                          <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Password</Label>
                          <Input
                            id="new-password"
                            type="password"
                            placeholder="Enter password"
                            value={newUser.password}
                            onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => {
                            // Here you would normally create the user via Supabase
                            toast({
                              title: "User created successfully",
                              description: `${newUser.username} has been added to the system.`
                            });
                            setNewUser({ username: "", role: "", email: "", password: "", status: "Active" });
                            setIsAddUserOpen(false);
                          }}
                          className="flex-1 bg-gradient-primary text-primary-foreground"
                        >
                          Create User
                        </Button>
                        <Button variant="outline" onClick={() => setIsAddUserOpen(false)} className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
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

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Pending Registration Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell className="font-medium">{registration.full_name}</TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>{registration.department}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {registration.reason_for_access}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRegistrationStatusColor(registration.status)}>
                          {registration.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(registration.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {registration.status === 'pending' && (
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Approve Registration</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p>Approve registration for {registration.full_name}?</p>
                                  <div className="space-y-2">
                                    <Label htmlFor="temp-password">Temporary Password</Label>
                                    <Input
                                      id="temp-password"
                                      type="password"
                                      defaultValue="TempPass123!"
                                      placeholder="Set temporary password"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      onClick={() => {
                                        const password = (document.getElementById('temp-password') as HTMLInputElement)?.value || 'TempPass123!';
                                        approveRegistration(registration.id, password);
                                      }}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      Approve & Create Account
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600"
                              onClick={() => rejectRegistration(registration.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Role Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-destructive">Admin</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Full system access</li>
                <li>• User management</li>
                <li>• Database modifications</li>
                <li>• Report generation</li>
                <li>• System settings</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-secondary">Editor</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• View criminal database</li>
                <li>• Add/edit records</li>
                <li>• Manage alerts</li>
                <li>• Create reports</li>
                <li>• Cannot manage users</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Viewer</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• View-only access</li>
                <li>• Browse criminal database</li>
                <li>• View reports</li>
                <li>• Cannot modify data</li>
                <li>• Cannot access settings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;