import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Apartments from "./pages/Apartments";
import Cafes from "./pages/Cafes";
import Taxi from "./pages/Taxi";
import Cameras from "./pages/Cameras";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main pages with header/footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/apartments" element={<Apartments />} />
            <Route path="/cafes" element={<Cafes />} />
            <Route path="/taxi" element={<Taxi />} />
            <Route path="/cameras" element={<Cameras />} />
          </Route>
          
          {/* Auth pages without header/footer */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
