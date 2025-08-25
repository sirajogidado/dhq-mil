import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1">
          {/* Header */}
          <header className="h-16 border-b border-primary/20 bg-card flex items-center px-4 sticky top-0 z-40">
            <SidebarTrigger className="mr-4" />
            
            <div className="flex-1">
              <div className="w-full h-2 bg-gradient-military rounded-full mb-2"></div>
              <h1 className="text-lg font-bold text-primary">
                Military Citizen Database System
              </h1>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-foreground font-medium">
                Officer: {user?.email}
              </p>
              <p className="text-xs text-muted-foreground">
                Security Level: Classified
              </p>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;