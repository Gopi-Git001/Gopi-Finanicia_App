// src/App.tsx
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";

import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Insurance from "@/pages/Insurance";
import Loans from "@/pages/Loans";
import Credit from "@/pages/Credit";
import Compare from "@/pages/Compare";
import AIAssistant from "@/pages/AIAssistant";
import Profile from "@/pages/Profile";
import Support from "@/pages/Support";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      {/* Wrap your entire app in AuthProvider */}
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/insurance" element={<Insurance />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/credit" element={<Credit />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/support" element={<Support />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;