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
import SecurityReview from "./pages/SecurityReview";
import InterpolManagement from "./pages/InterpolManagement";
import AIAssistant from "./pages/AIAssistant";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import { DataProvider } from "./context/DataContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
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
              <Route path="security-review" element={<SecurityReview />} />
              <Route path="interpol" element={<InterpolManagement />} />
              <Route path="alerts" element={<AlertsNotifications />} />
              <Route path="maps" element={<MapsGeolocation />} />
              <Route path="reports" element={<ReportsAnalytics />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="incidents" element={<IncidentReporting />} />
              <Route path="ai-assistant" element={<AIAssistant />} />
              <Route path="settings" element={<SettingsHelp />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
