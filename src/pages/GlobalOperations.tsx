import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Settings, 
  Database, 
  MapPin, 
  Shield,
  AlertTriangle,
  Users,
  Building
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReferenceDataItem {
  id?: string;
  name: string;
  code?: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
}

export default function GlobalOperations() {
  const [crimeTypes, setCrimeTypes] = useState<ReferenceDataItem[]>([]);
  const [states, setStates] = useState<ReferenceDataItem[]>([]);
  const [ranks, setRanks] = useState<ReferenceDataItem[]>([]);
  const [departments, setDepartments] = useState<ReferenceDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ReferenceDataItem | null>(null);
  const [newItem, setNewItem] = useState<ReferenceDataItem>({ name: "", description: "" });
  const { toast } = useToast();

  // Nigerian states data
  const nigerianStates = [
    { name: "Abia", code: "AB" },
    { name: "Adamawa", code: "AD" },
    { name: "Akwa Ibom", code: "AK" },
    { name: "Anambra", code: "AN" },
    { name: "Bauchi", code: "BA" },
    { name: "Bayelsa", code: "BY" },
    { name: "Benue", code: "BE" },
    { name: "Borno", code: "BO" },
    { name: "Cross River", code: "CR" },
    { name: "Delta", code: "DE" },
    { name: "Ebonyi", code: "EB" },
    { name: "Edo", code: "ED" },
    { name: "Ekiti", code: "EK" },
    { name: "Enugu", code: "EN" },
    { name: "Gombe", code: "GO" },
    { name: "Imo", code: "IM" },
    { name: "Jigawa", code: "JI" },
    { name: "Kaduna", code: "KD" },
    { name: "Kano", code: "KN" },
    { name: "Katsina", code: "KT" },
    { name: "Kebbi", code: "KE" },
    { name: "Kogi", code: "KO" },
    { name: "Kwara", code: "KW" },
    { name: "Lagos", code: "LA" },
    { name: "Nasarawa", code: "NA" },
    { name: "Niger", code: "NI" },
    { name: "Ogun", code: "OG" },
    { name: "Ondo", code: "ON" },
    { name: "Osun", code: "OS" },
    { name: "Oyo", code: "OY" },
    { name: "Plateau", code: "PL" },
    { name: "Rivers", code: "RI" },
    { name: "Sokoto", code: "SO" },
    { name: "Taraba", code: "TA" },
    { name: "Yobe", code: "YO" },
    { name: "Zamfara", code: "ZA" },
    { name: "FCT Abuja", code: "FC" }
  ];

  const defaultCrimeTypes = [
    { name: "Armed Robbery", description: "Armed theft with threat of violence" },
    { name: "Kidnapping", description: "Unlawful detention or abduction" },
    { name: "Fraud", description: "Financial crimes and deception" },
    { name: "Terrorism", description: "Acts of terrorism and insurgency" },
    { name: "Drug Trafficking", description: "Illegal drug distribution and sales" },
    { name: "Cybercrime", description: "Internet and computer-related crimes" },
    { name: "Murder", description: "Unlawful killing of another person" },
    { name: "Assault", description: "Physical attack or threat of violence" }
  ];

  const defaultRanks = [
    { name: "General", description: "Highest military rank" },
    { name: "Lieutenant General", description: "Three-star general" },
    { name: "Major General", description: "Two-star general" },
    { name: "Brigadier", description: "One-star general" },
    { name: "Colonel", description: "Senior field officer" },
    { name: "Lieutenant Colonel", description: "Field officer" },
    { name: "Major", description: "Company commander" },
    { name: "Captain", description: "Junior officer" },
    { name: "Lieutenant", description: "Entry-level officer" },
    { name: "Second Lieutenant", description: "Trainee officer" }
  ];

  const defaultDepartments = [
    { name: "Intelligence", description: "Military intelligence operations" },
    { name: "Operations", description: "Tactical and strategic operations" },
    { name: "Logistics", description: "Supply chain and equipment management" },
    { name: "Personnel", description: "Human resources and administration" },
    { name: "Communications", description: "Signal and communications systems" },
    { name: "Engineering", description: "Military engineering and construction" },
    { name: "Medical", description: "Military medical services" },
    { name: "Security", description: "Base and facility security" }
  ];

  useEffect(() => {
    fetchReferenceData();
  }, []);

  const fetchReferenceData = async () => {
    try {
      setLoading(true);
      
      // Initialize with default data if tables are empty
      setCrimeTypes(defaultCrimeTypes);
      setStates(nigerianStates);
      setRanks(defaultRanks);
      setDepartments(defaultDepartments);

    } catch (error) {
      console.error("Error fetching reference data:", error);
      toast({
        title: "Error",
        description: "Failed to load reference data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (type: string) => {
    if (!newItem.name.trim()) {
      toast({
        title: "Error", 
        description: "Name is required",
        variant: "destructive"
      });
      return;
    }

    const item = { ...newItem, id: Date.now().toString() };
    
    switch(type) {
      case 'crime-types':
        setCrimeTypes(prev => [...prev, item]);
        break;
      case 'states':
        setStates(prev => [...prev, item]);
        break;
      case 'ranks':
        setRanks(prev => [...prev, item]);
        break;
      case 'departments':
        setDepartments(prev => [...prev, item]);
        break;
    }

    setNewItem({ name: "", description: "" });
    toast({
      title: "Success",
      description: "Item added successfully"
    });
  };

  const handleEditItem = (item: ReferenceDataItem) => {
    setEditingItem(item);
  };

  const handleSaveEdit = (type: string) => {
    if (!editingItem) return;

    const updateList = (list: ReferenceDataItem[]) => 
      list.map(item => item.id === editingItem.id ? editingItem : item);

    switch(type) {
      case 'crime-types':
        setCrimeTypes(updateList);
        break;
      case 'states':
        setStates(updateList);
        break;
      case 'ranks':
        setRanks(updateList);
        break;
      case 'departments':
        setDepartments(updateList);
        break;
    }

    setEditingItem(null);
    toast({
      title: "Success",
      description: "Item updated successfully"
    });
  };

  const handleDeleteItem = (id: string, type: string) => {
    const filterList = (list: ReferenceDataItem[]) => 
      list.filter(item => item.id !== id);

    switch(type) {
      case 'crime-types':
        setCrimeTypes(filterList);
        break;
      case 'states':
        setStates(filterList);
        break;
      case 'ranks':
        setRanks(filterList);
        break;
      case 'departments':
        setDepartments(filterList);
        break;
    }

    toast({
      title: "Success",
      description: "Item deleted successfully"
    });
  };

  const ReferenceDataTable = ({ 
    data, 
    type, 
    title, 
    icon: Icon 
  }: { 
    data: ReferenceDataItem[], 
    type: string, 
    title: string, 
    icon: any 
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new item form */}
        <div className="border-b border-border pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label htmlFor={`new-${type}-name`}>Name</Label>
              <Input
                id={`new-${type}-name`}
                placeholder="Enter name"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor={`new-${type}-description`}>Description</Label>
              <Input
                id={`new-${type}-description`}
                placeholder="Enter description"
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => handleAddItem(type)} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>

        {/* Data list */}
        <div className="space-y-2">
          {data.map((item) => (
            <div key={item.id || item.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
              {editingItem?.id === item.id ? (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 mr-3">
                  <Input
                    value={editingItem.name}
                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                  <Input
                    value={editingItem.description || ""}
                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                    placeholder="Description"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{item.name}</span>
                    {item.code && <Badge variant="outline">{item.code}</Badge>}
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                {editingItem?.id === item.id ? (
                  <>
                    <Button size="sm" variant="outline" onClick={() => handleSaveEdit(type)}>
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={() => handleEditItem(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDeleteItem(item.id || item.name, type)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Settings className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading reference data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Global Operations</h1>
          <p className="text-muted-foreground mt-1">
            Manage system-wide reference data and configurations
          </p>
        </div>
      </div>

      <Tabs defaultValue="crime-types" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="crime-types">Crime Types</TabsTrigger>
          <TabsTrigger value="locations">States & Locations</TabsTrigger>
          <TabsTrigger value="ranks">Military Ranks</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="crime-types">
          <ReferenceDataTable 
            data={crimeTypes}
            type="crime-types"
            title="Crime Type Management"
            icon={AlertTriangle}
          />
        </TabsContent>

        <TabsContent value="locations">
          <ReferenceDataTable 
            data={states}
            type="states"
            title="States and Locations"
            icon={MapPin}
          />
        </TabsContent>

        <TabsContent value="ranks">
          <ReferenceDataTable 
            data={ranks}
            type="ranks"
            title="Military Ranks"
            icon={Shield}
          />
        </TabsContent>

        <TabsContent value="departments">
          <ReferenceDataTable 
            data={departments}
            type="departments"
            title="Department Management"
            icon={Building}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}