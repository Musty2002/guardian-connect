import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ThemeProvider } from "next-themes";
import { useNativeApp } from "@/hooks/useNativeApp";
import { useNativePushNotifications } from "@/hooks/useNativePushNotifications";
import { SplashScreen } from "@/components/SplashScreen";
import Index from "./pages/Index";
import Map from "./pages/Map";
import Emergency from "./pages/Emergency";
import Family from "./pages/Family";
import ParentDashboard from "./pages/ParentDashboard";
import ChildControls from "./pages/ChildControls";
import SafeZones from "./pages/SafeZones";
import Settings from "./pages/Settings";
import DeviceSecurity from "./pages/DeviceSecurity";
import EmergencySettings from "./pages/EmergencySettings";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  // Initialize native app features
  useNativeApp();
  const { initializePushNotifications } = useNativePushNotifications();

  useEffect(() => {
    // Initialize push notifications on app start
    initializePushNotifications();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><Map /></ProtectedRoute>} />
        <Route path="/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
        <Route path="/family" element={<ProtectedRoute><Family /></ProtectedRoute>} />
        <Route path="/parent-dashboard" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
        <Route path="/child-controls" element={<ProtectedRoute><ChildControls /></ProtectedRoute>} />
        <Route path="/safe-zones" element={<ProtectedRoute><SafeZones /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/device-security" element={<ProtectedRoute><DeviceSecurity /></ProtectedRoute>} />
        <Route path="/emergency-settings" element={<ProtectedRoute><EmergencySettings /></ProtectedRoute>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash screen only once per session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    return !hasSeenSplash;
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
