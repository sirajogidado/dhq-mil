import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Database, Key, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InterpolConfig {
  id: string;
  api_endpoint: string;
  api_key_name: string;
  status: 'active' | 'inactive' | 'testing';
  last_sync: string;
  created_at: string;
}

interface SyncLog {
  id: string;
  sync_type: string;
  status: 'success' | 'failed';
  records_processed: number;
  message: string;
  created_at: string;
}

const InterpolManagement = () => {
  const [config, setConfig] = useState<InterpolConfig | null>(null);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [newConfig, setNewConfig] = useState({
    api_endpoint: '',
    api_key_name: 'INTERPOL_API_KEY'
  });
  const { toast } = useToast();

  useEffect(() => {
    // For demo purposes, we'll use mock data since actual Interpol API integration would require real credentials
    setConfig({
      id: '1',
      api_endpoint: 'https://api.interpol.int/v1/',
      api_key_name: 'INTERPOL_API_KEY',
      status: 'inactive',
      last_sync: '2024-01-15T10:30:00Z',
      created_at: '2024-01-01T00:00:00Z'
    });

    setSyncLogs([
      {
        id: '1',
        sync_type: 'wanted_persons',
        status: 'success',
        records_processed: 1250,
        message: 'Successfully synced wanted persons database',
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: '2', 
        sync_type: 'stolen_documents',
        status: 'failed',
        records_processed: 0,
        message: 'API rate limit exceeded',
        created_at: '2024-01-15T09:15:00Z'
      }
    ]);

    setLoading(false);
  }, []);

  const handleSaveConfig = async () => {
    try {
      // In a real implementation, this would save to database
      const updatedConfig: InterpolConfig = {
        id: config?.id || '1',
        api_endpoint: newConfig.api_endpoint,
        api_key_name: newConfig.api_key_name,
        status: 'inactive',
        last_sync: config?.last_sync || new Date().toISOString(),
        created_at: config?.created_at || new Date().toISOString()
      };

      setConfig(updatedConfig);
      toast({
        title: "Success",
        description: "Interpol API configuration saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    }
  };

  const handleTestConnection = async () => {
    try {
      setConfig(prev => prev ? { ...prev, status: 'testing' } : null);
      
      // Simulate API test
      setTimeout(() => {
        setConfig(prev => prev ? { ...prev, status: 'active', last_sync: new Date().toISOString() } : null);
        toast({
          title: "Connection Test Successful",
          description: "Successfully connected to Interpol API",
        });
      }, 2000);
    } catch (error) {
      setConfig(prev => prev ? { ...prev, status: 'inactive' } : null);
      toast({
        title: "Connection Failed",
        description: "Unable to connect to Interpol API",
        variant: "destructive",
      });
    }
  };

  const handleManualSync = async () => {
    try {
      toast({
        title: "Sync Started",
        description: "Manual synchronization with Interpol database initiated",
      });

      // Simulate sync process
      setTimeout(() => {
        const newLog: SyncLog = {
          id: Date.now().toString(),
          sync_type: 'manual_sync',
          status: 'success',
          records_processed: Math.floor(Math.random() * 1000) + 500,
          message: 'Manual sync completed successfully',
          created_at: new Date().toISOString()
        };

        setSyncLogs(prev => [newLog, ...prev]);
        setConfig(prev => prev ? { ...prev, last_sync: new Date().toISOString() } : null);
        
        toast({
          title: "Sync Completed",
          description: `Successfully processed ${newLog.records_processed} records`,
        });
      }, 3000);
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to synchronize with Interpol database",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
      case 'testing':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Testing</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Inactive</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">Loading Interpol configuration...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Interpol Database Integration
          </h1>
          <p className="text-muted-foreground">Configure and manage integration with Interpol international database</p>
        </div>
        {config && getStatusBadge(config.status)}
      </div>

      <Tabs defaultValue="config" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="sync">Synchronization</TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endpoint">API Endpoint</Label>
                  <Input
                    id="endpoint"
                    placeholder="https://api.interpol.int/v1/"
                    value={newConfig.api_endpoint}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, api_endpoint: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api_key">API Key Name</Label>
                  <Input
                    id="api_key"
                    value={newConfig.api_key_name}
                    onChange={(e) => setNewConfig(prev => ({ ...prev, api_key_name: e.target.value }))}
                    placeholder="INTERPOL_API_KEY"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Security Notice</Label>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> The actual API key will be stored securely in Supabase secrets. 
                    Only authorized military personnel with admin access can configure this integration.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSaveConfig} className="flex-1">
                  Save Configuration
                </Button>
                <Button 
                  onClick={handleTestConnection} 
                  variant="outline" 
                  className="flex-1"
                  disabled={!newConfig.api_endpoint}
                >
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>

          {config && (
            <Card>
              <CardHeader>
                <CardTitle>Current Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>API Endpoint</Label>
                    <p className="text-sm font-mono bg-muted p-2 rounded">{config.api_endpoint}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="pt-2">{getStatusBadge(config.status)}</div>
                  </div>
                  <div>
                    <Label>Last Sync</Label>
                    <p className="text-sm">{new Date(config.last_sync).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Configured</Label>
                    <p className="text-sm">{new Date(config.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Synchronization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <h3 className="font-semibold">Wanted Persons</h3>
                      <p className="text-sm text-muted-foreground">Last sync: 2 hours ago</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <h3 className="font-semibold">Stolen Documents</h3>
                      <p className="text-sm text-muted-foreground">Sync failed</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <h3 className="font-semibold">Art & Antiquities</h3>
                      <p className="text-sm text-muted-foreground">Never synced</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleManualSync} 
                  className="w-full" 
                  disabled={config?.status !== 'active'}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start Manual Synchronization
                </Button>
                
                {config?.status !== 'active' && (
                  <p className="text-sm text-muted-foreground text-center">
                    Configure and activate API connection to enable synchronization
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Synchronization History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sync Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Records Processed</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.sync_type}</TableCell>
                      <TableCell>
                        <Badge className={log.status === 'success' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.records_processed.toLocaleString()}</TableCell>
                      <TableCell>{log.message}</TableCell>
                      <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {syncLogs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No synchronization logs available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterpolManagement;