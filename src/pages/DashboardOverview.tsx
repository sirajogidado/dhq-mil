import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Shield, FileCheck, AlertTriangle, Eye, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import CitizenSearch from "@/components/CitizenSearch";
import { useAuth } from "@/components/AuthProvider";
import { useData } from "@/context/DataContext";

const DashboardOverview = () => {
  const { user } = useAuth();
  const { stats, refreshStats } = useData();
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    setLoading(false);
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent registrations
      const { data: recentRegs } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      // Fetch recent user activities
      const { data: recentUsers } = await supabase
        .from('pending_registrations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2);

      const activities = [
        ...(recentRegs || []).map(reg => ({
          type: 'registration',
          title: reg.status === 'flagged' ? 'Security flag raised' : 'New registration verified',
          description: `Citizen ID: ${reg.registration_id}`,
          status: reg.status,
          time: reg.created_at
        })),
        ...(recentUsers || []).map(user => ({
          type: 'user_request',
          title: 'New registration request',
          description: `Request from ${user.email}`,
          status: user.status,
          time: user.created_at
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 3);

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const statCards = [
    {
      title: "Total Citizens",
      value: loading ? "Loading..." : stats.totalRegistrations.toLocaleString(),
      description: "Registered in database",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Verified Identities",
      value: loading ? "Loading..." : stats.verifiedIdentities.toLocaleString(),
      description: "Security cleared",
      icon: Shield,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Pending Reviews",
      value: loading ? "Loading..." : stats.pendingReviews.toLocaleString(),
      description: "Awaiting verification",
      icon: FileCheck,
      color: "text-tertiary",
      bgColor: "bg-tertiary/10"
    },
    {
      title: "Security Alerts",
      value: loading ? "Loading..." : stats.flaggedProfiles.toLocaleString(),
      description: "Flagged for review",
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    }
  ];

  const quickActions = [
    {
      title: "Search Citizen",
      description: "Find citizen by ID or biometric",
      icon: Search,
      color: "primary"
    },
    {
      title: "Security Review",
      description: "Review flagged profiles",
      icon: Eye,
      color: "destructive"
    },
    {
      title: "Interpol Check",
      description: "Cross-reference with international database",
      icon: Shield,
      color: "tertiary"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-military p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome to DHQ Military Database</h1>
            <p className="text-white/90 mt-1">
              Officer: {user?.email} | Access Level: Classified
            </p>
            <p className="text-white/80 text-sm mt-2">
              System Status: Operational | Last Login: {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">#{Math.floor(Math.random() * 9999).toString().padStart(4, '0')}</div>
            <p className="text-white/80 text-sm">Session ID</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Military Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">
            Real-time system monitoring and key performance indicators
          </p>
        </div>
        
        {/* Quick Search */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search citizen by name, ID, or phone..."
              className="pl-10 w-80"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <Search className="w-4 h-4 mr-2" />
                Advanced Search
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Citizen Database Search</DialogTitle>
              </DialogHeader>
              <CitizenSearch onSelectCitizen={(citizen) => console.log("Selected citizen:", citizen)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Security Status Bar */}
      <div className="bg-gradient-military p-4 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">System Status: OPERATIONAL</h3>
            <p className="text-sm opacity-90">All security protocols active • Database synchronized</p>
          </div>
          <Badge variant="outline" className="bg-white/20 text-white border-white/30">
            CLASSIFIED
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-elegant transition-smooth border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Search Citizen</CardTitle>
                    <CardDescription>Find citizen by ID or biometric</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Citizen Database Search</DialogTitle>
            </DialogHeader>
            <CitizenSearch onSelectCitizen={(citizen) => console.log("Selected citizen:", citizen)} />
          </DialogContent>
        </Dialog>
        
        <Card 
          className="cursor-pointer hover:shadow-elegant transition-smooth border-l-4 border-l-destructive"
          onClick={() => window.location.href = '/dashboard/security-review'}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Eye className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-lg">Security Review</CardTitle>
                <CardDescription>Review flagged profiles</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-elegant transition-smooth border-l-4 border-l-tertiary"
          onClick={() => window.location.href = '/dashboard/interpol'}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-tertiary/10">
                <Shield className="w-5 h-5 text-tertiary" />
              </div>
              <div>
                <CardTitle className="text-lg">Interpol Check</CardTitle>
                <CardDescription>Cross-reference with international database</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Recent Security Activity
          </CardTitle>
          <CardDescription>
            Latest system events and security monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{new Date(activity.time).toLocaleString()}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    activity.status === 'verified' ? 'text-success border-success' :
                    activity.status === 'flagged' ? 'text-destructive border-destructive' :
                    activity.status === 'pending' ? 'text-tertiary border-tertiary' :
                    'text-muted-foreground border-muted-foreground'
                  }
                >
                  {activity.status?.toUpperCase() || 'NEW'}
                </Badge>
              </div>
            )) : (
              <div className="text-center py-4 text-muted-foreground">
                No recent activity
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;