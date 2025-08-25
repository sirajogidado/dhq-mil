import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, FileCheck, AlertTriangle, Eye, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DatabaseStats {
  totalRegistrations: number;
  verifiedIdentities: number;
  pendingReviews: number;
  flaggedProfiles: number;
}

const DashboardOverview = () => {
  const [stats, setStats] = useState<DatabaseStats>({
    totalRegistrations: 0,
    verifiedIdentities: 0,
    pendingReviews: 0,
    flaggedProfiles: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch registration stats
        const { count: totalRegistrations } = await supabase
          .from('registrations')
          .select('*', { count: 'exact', head: true });

        const { count: verifiedIdentities } = await supabase
          .from('registrations')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'verified');

        const { count: pendingReviews } = await supabase
          .from('registrations')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        const { count: flaggedProfiles } = await supabase
          .from('registrations')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'flagged');

        setStats({
          totalRegistrations: totalRegistrations || 0,
          verifiedIdentities: verifiedIdentities || 0,
          pendingReviews: pendingReviews || 0,
          flaggedProfiles: flaggedProfiles || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">
          Operational Dashboard
        </h1>
        <p className="text-muted-foreground">
          Real-time overview of national citizen database and security monitoring
        </p>
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
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card key={index} className="cursor-pointer hover:shadow-elegant transition-smooth border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${action.color}/10`}>
                    <Icon className={`w-5 h-5 text-${action.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
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
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">New registration verified</p>
                <p className="text-sm text-muted-foreground">Citizen ID: NG-2024-123456</p>
              </div>
              <Badge variant="outline" className="text-success border-success">
                VERIFIED
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">Security flag raised</p>
                <p className="text-sm text-muted-foreground">Profile requires manual review</p>
              </div>
              <Badge variant="outline" className="text-destructive border-destructive">
                FLAGGED
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">Interpol database sync</p>
                <p className="text-sm text-muted-foreground">Cross-reference completed</p>
              </div>
              <Badge variant="outline" className="text-tertiary border-tertiary">
                SYNCED
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;