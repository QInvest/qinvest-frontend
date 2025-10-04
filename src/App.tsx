import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/company/:id" element={<CompanyDetail />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/credit-request" element={<CreditRequest />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/meus-investimentos" element={<MeusInvestimentos />} />
          <Route path="/investment/:id" element={<MeusInvestimentos />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
