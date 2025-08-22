import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, FileCheck, TrendingUp } from "lucide-react";

const StatsCards = () => {
  const stats = [
    {
      title: "Total Registered Citizens",
      value: "2,847,392",
      change: "+12.3%",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Verified Identities", 
      value: "2,645,281",
      change: "+8.7%",
      icon: Shield,
      color: "text-success"
    },
    {
      title: "Completed Registrations",
      value: "1,892,447",
      change: "+15.2%", 
      icon: FileCheck,
      color: "text-secondary"
    },
    {
      title: "Daily Growth Rate",
      value: "4,256",
      change: "+5.1%",
      icon: TrendingUp,
      color: "text-primary-light"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-success mt-1">{stat.change} this month</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-subtle ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;