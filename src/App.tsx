import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardOverview from "./pages/DashboardOverview";
import CriminalDatabase from "./pages/CriminalDatabase";
import AlertsNotifications from "./pages/AlertsNotifications";
import MapsGeolocation from "./pages/MapsGeolocation";
import ReportsAnalytics from "./pages/ReportsAnalytics";
import UserManagement from "./pages/UserManagement";
import IncidentReporting from "./pages/IncidentReporting";
import SettingsHelp from "./pages/SettingsHelp";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverview />} />
              <Route path="criminal-database" element={<CriminalDatabase />} />
              <Route path="alerts" element={<AlertsNotifications />} />
              <Route path="maps" element={<MapsGeolocation />} />
              <Route path="reports" element={<ReportsAnalytics />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="incidents" element={<IncidentReporting />} />
              <Route path="settings" element={<SettingsHelp />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
