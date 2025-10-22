import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Prophesy from "./pages/Prophesy";
import Seamsi from "./pages/Seamsi";
import TempleDetail from "./pages/TempleDetail";
import PredictionResult from "./pages/PredictionResult";
import NotFound from "./pages/NotFound";
import Header from "@/components/Header";
import Admin from "@/pages/Admin";
import AdminTempleList from "@/pages/AdminTempleList";
import AdminTempleAdd from "@/pages/AdminTempleAdd";
import AdminFortuneAdd from "@/pages/AdminFortuneAdd";
import AdminFortuneList from "@/pages/AdminFortuneList";
import AdminFortuneEdit from "@/pages/AdminFortuneEdit";
import AdminTempleEdit from "@/pages/AdminTempleEdit";
import LagnaChecker from "@/pages/LagnaChecker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/fortune" element={<Prophesy />} />
          <Route path="/fortune/seamsi" element={<Seamsi />} />
          <Route path="/fortune/lagna" element={<LagnaChecker />} />
          <Route path="/fortune/seamsi/temple/:templeId" element={<TempleDetail />} />
          <Route path="/fortune/seamsi/prediction/:number" element={<PredictionResult />} />
          <Route path="/fortune/admin" element={<Admin />} />
          <Route path="/fortune/admin/temples" element={<AdminTempleList />} />
          <Route path="/fortune/admin/temples/new" element={<AdminTempleAdd />} />
          <Route path="/fortune/admin/temples/:templeId/edit" element={<AdminTempleEdit />} />
          <Route path="/fortune/admin/temples/:templeId/fortunes" element={<AdminFortuneList />} />
          <Route path="/fortune/admin/temples/:templeId/fortunes/new" element={<AdminFortuneAdd />} />
          <Route path="/fortune/admin/temples/:templeId/fortunes/:fortuneNumber/edit" element={<AdminFortuneEdit />} />
          <Route path="/fortune/admin/fortunes/new" element={<AdminFortuneAdd />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
