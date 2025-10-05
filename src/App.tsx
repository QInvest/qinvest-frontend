import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Opportunities from "./pages/Opportunities";
import CompanyDetail from "./pages/CompanyDetail";
import Wallet from "./pages/Wallet";
import CreditRequest from "./pages/CreditRequest";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import MeusInvestimentos from "./pages/MeusInvestimentos";
import MinhaEmpresa from "./pages/MinhaEmpresa";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route 
              path="/login" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Register />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/opportunities" 
              element={
                <ProtectedRoute>
                  <Opportunities />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/company/:id" 
              element={
                <ProtectedRoute>
                  <CompanyDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wallet" 
              element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/credit-request" 
              element={
                <ProtectedRoute>
                  <CreditRequest />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/minha-empresa" 
              element={
                <ProtectedRoute>
                  <MinhaEmpresa />
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
            <Route 
              path="/meus-investimentos" 
              element={
                <ProtectedRoute>
                  <MeusInvestimentos />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/investment/:id" 
              element={
                <ProtectedRoute>
                  <MeusInvestimentos />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;