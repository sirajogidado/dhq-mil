import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, User, Phone, MapPin, Calendar, Shield } from "lucide-react";

interface Citizen {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  lga: string;
  registrationId: string;
  status: string;
  dateOfBirth: string;
  profilePhotoUrl?: string;
}

interface CitizenSearchProps {
  onSelectCitizen?: (citizen: Citizen) => void;
}

export default function CitizenSearch({ onSelectCitizen }: CitizenSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Citizen[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock citizen data
  const mockCitizens: Citizen[] = [
    {
      id: "1",
      firstName: "Ahmed",
      lastName: "Ibrahim",
      email: "ahmed.ibrahim@email.com",
      phone: "+234-803-123-4567",
      state: "Lagos",
      lga: "Ikeja",
      registrationId: "NG-2024-001234",
      status: "verified",
      dateOfBirth: "1985-03-15",
      profilePhotoUrl: ""
    },
    {
      id: "2",
      firstName: "Fatima",
      lastName: "Abubakar",
      email: "fatima.abubakar@email.com",
      phone: "+234-806-987-6543",
      state: "Kano",
      lga: "Nassarawa",
      registrationId: "NG-2024-005678",
      status: "pending",
      dateOfBirth: "1990-07-22",
      profilePhotoUrl: ""
    },
    {
      id: "3",
      firstName: "Chioma",
      lastName: "Okafor",
      email: "chioma.okafor@email.com",
      phone: "+234-701-555-7890",
      state: "Enugu",
      lga: "Enugu East",
      registrationId: "NG-2024-009876",
      status: "verified",
      dateOfBirth: "1988-11-08",
      profilePhotoUrl: ""
    },
    {
      id: "4",
      firstName: "Olumide",
      lastName: "Adeyemi",
      email: "olumide.adeyemi@email.com",
      phone: "+234-814-222-3333",
      state: "Oyo",
      lga: "Ibadan North",
      registrationId: "NG-2024-011111",
      status: "flagged",
      dateOfBirth: "1982-05-30",
      profilePhotoUrl: ""
    },
    {
      id: "5",
      firstName: "Aisha",
      lastName: "Mohammed",
      email: "aisha.mohammed@email.com",
      phone: "+234-909-444-5555",
      state: "FCT Abuja",
      lga: "Wuse",
      registrationId: "NG-2024-013579",
      status: "verified",
      dateOfBirth: "1993-12-12",
      profilePhotoUrl: ""
    }
  ];

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API search with mock data
    setTimeout(() => {
      const results = mockCitizens.filter(citizen => 
        citizen.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        citizen.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        citizen.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        citizen.phone.includes(searchTerm) ||
        citizen.registrationId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'verified':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'flagged':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'flagged':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          Citizen Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, email, or registration ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Found {searchResults.length} result(s)
            </h3>
            
            {searchResults.map((citizen) => (
              <Card 
                key={citizen.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onSelectCitizen?.(citizen)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={citizen.profilePhotoUrl} />
                      <AvatarFallback>
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">
                            {citizen.firstName} {citizen.lastName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {citizen.registrationId}
                          </p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(citizen.status)}>
                          {citizen.status.charAt(0).toUpperCase() + citizen.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{citizen.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{citizen.lga}, {citizen.state}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{new Date(citizen.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className={`w-4 h-4 ${getStatusColor(citizen.status)}`} />
                          <span className={getStatusColor(citizen.status)}>
                            {citizen.status === 'verified' && 'Identity Verified'}
                            {citizen.status === 'pending' && 'Verification Pending'}
                            {citizen.status === 'flagged' && 'Flagged Profile'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {searchTerm && searchResults.length === 0 && !isSearching && (
          <div className="text-center py-8 text-muted-foreground">
            <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No citizens found matching your search criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}