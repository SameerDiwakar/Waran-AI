import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { UserContextProvider } from "./UserContext";
import axios from "axios";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import { useEffect } from "react";
import ForgotPassword from "./pages/ForgotPassword";


axios.defaults.withCredentials = true;
// Set the baseURL to localhost for development, fallback to production if not available
axios.defaults.baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://waran-ai.onrender.com";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    fetch('https://waran-ai.onrender.com/health').catch(() => {});
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserContextProvider>
    </QueryClientProvider>
  );
};

export default App;
