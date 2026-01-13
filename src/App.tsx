import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Actions from "./pages/Actions";
import Debug from "./pages/Debug";
import SimulateFailure from "./pages/SimulateFailure";
import NotFound from "./pages/NotFound";
import { LazorkitProvider } from '@lazorkit/wallet';
import { Footer } from "./components/Footer";

const queryClient = new QueryClient();

const CONFIG = {
  rpcUrl: 'https://api.devnet.solana.com',
  portalUrl: 'https://portal.lazor.sh',
  paymasterConfig: {
    paymasterUrl: 'https://kora.devnet.lazorkit.com'
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LazorkitProvider rpcUrl={CONFIG.rpcUrl}
        portalUrl={CONFIG.portalUrl}
        paymasterConfig={CONFIG.paymasterConfig}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/actions" element={<Actions />} />
                <Route path="/debug" element={<Debug />} />
                <Route path="/simulate-failure" element={<SimulateFailure />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </LazorkitProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
