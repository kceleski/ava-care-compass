
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AvaWidget from "./components/AvaWidget";
import HomePage from "./components/HomePage";
import FindCarePage from "./components/FindCarePage";
import TermsPage from "./components/TermsPage";
import ResourcesPage from "./components/ResourcesPage";
import AdvertisePage from "./components/AdvertisePage";
import LoginPage from "./components/LoginPage";
import InteractionStyles from "./components/InteractionStyles";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [avaFullScreen, setAvaFullScreen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <InteractionStyles />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/find-care" element={<FindCarePage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/advertise" element={<AdvertisePage />} />
                <Route path="/login" element={<LoginPage />} />
                {/* Placeholder routes for future implementation */}
                <Route path="/contact" element={<div className="pt-24 p-8 text-center"><h1 className="text-2xl">Contact Page Coming Soon</h1></div>} />
                <Route path="/register" element={<div className="pt-24 p-8 text-center"><h1 className="text-2xl">Register Page Coming Soon</h1></div>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <AvaWidget 
              isFullScreen={avaFullScreen}
              onFullScreenToggle={() => setAvaFullScreen(!avaFullScreen)}
            />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
