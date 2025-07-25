import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Sistem from "./pages/Sistem";
import ManeviPanel from "./pages/ManeviPanel";
import EarningsDashboard from "./pages/EarningsDashboard";
import MemberPanel from "./pages/MemberPanel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EnhancedAdminPanel from "./pages/EnhancedAdminPanel";
import ComprehensiveAdminPanel from "./pages/ComprehensiveAdminPanel";
import RealTimeTransactions from "./pages/RealTimeTransactions";
import EWalletFinancial from "./pages/EWalletFinancial";
import ClonePage from "./pages/ClonePage";
import ProductCheckout from "./pages/ProductCheckout";
import ProductsPage from "./pages/ProductsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sistem" element={<Sistem />} />
          <Route path="/manevi-panel" element={<ManeviPanel />} />
          <Route path="/kazanc" element={<EarningsDashboard />} />
          <Route path="/member-panel" element={<MemberPanel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/kayıt" element={<Register />} />
          <Route path="/admin-panel" element={<EnhancedAdminPanel />} />
          <Route
            path="/comprehensive-admin"
            element={<ComprehensiveAdminPanel />}
          />
          <Route
            path="/real-time-transactions"
            element={<RealTimeTransactions />}
          />
          <Route path="/e-wallet" element={<EWalletFinancial />} />
          <Route path="/clone/:slug" element={<ClonePage />} />
          <Route path="/checkout" element={<ProductCheckout />} />
          <Route path="/products" element={<ProductsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
