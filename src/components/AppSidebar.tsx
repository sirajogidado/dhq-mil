import { BarChart3, Users, Shield, FileText, LogOut, Settings, AlertTriangle, Map, MapPin, Bell, Bot } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "Criminal Database", url: "/dashboard/criminal-database", icon: Users },
  { title: "Security Review", url: "/dashboard/security-review", icon: AlertTriangle },
  { title: "Interpol Integration", url: "/dashboard/interpol", icon: Shield },
  { title: "Alerts & Notifications", url: "/dashboard/alerts", icon: Bell },
  { title: "Maps & Geolocation", url: "/dashboard/maps", icon: Map },
  { title: "Reports & Analytics", url: "/dashboard/reports", icon: FileText },
  { title: "User Management", url: "/dashboard/user-management", icon: Shield },
  { title: "Incident Reporting", url: "/dashboard/incidents", icon: AlertTriangle },
  { title: "AI Assistant", url: "/dashboard/ai-assistant", icon: Bot },
  { title: "Settings & Help", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Error",
          description: "Failed to logout. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Logged out",
        description: "You have been securely logged out.",
      });
      navigate("/login");
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={`${isCollapsed ? "w-16" : "w-64"} border-r border-sidebar-border bg-sidebar-background`}>
      <SidebarHeader className="border-b border-sidebar-border bg-gradient-military">
        <div className="flex items-center gap-3 p-4">
          <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <img 
              src="/lovable-uploads/7eba8c59-5aed-446e-89fc-7f834f8505c4.png" 
              alt="NIMADS Logo" 
              className="w-10 h-10 object-contain rounded-full"
            />
            <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-white truncate">NIMADS</h2>
              <p className="text-xs text-white/80 truncate">National Integrated Military & Demographic System</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar-background">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground px-4 py-2 text-xs font-semibold uppercase tracking-wider">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/dashboard"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 mx-2 rounded-lg transition-smooth ${
                          isActive 
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow" 
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4 bg-sidebar-background">
        <Button 
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}