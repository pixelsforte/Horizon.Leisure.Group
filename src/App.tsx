import { useState, useEffect } from "react";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Philosophy from "./components/Philosophy";
import Challenge from "./components/Challenge";
import About from "./components/About";
import Services from "./components/Services";
import Partnership from "./components/Partnership";
import OurImpact from "./components/Our-impact";
import Difference from "./components/Difference";
import Directors from "./components/Directors";
import Team from "./components/Team";
import Events from "./components/Events";
import Clients from "./components/Clients";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsApp";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState("");
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    // Determine if we're on the administrative route
    const checkRoute = () => {
      setIsAdminRoute(window.location.pathname.startsWith("/hlg-management-portal"));
    };
    checkRoute();
    
    // Add path change listeners (for robust SPA client-side custom route routing)
    window.addEventListener("popstate", checkRoute);
    return () => window.removeEventListener("popstate", checkRoute);
  }, []);

  const handleSelectModel = (modelTitle: string) => {
    setSelectedModel(modelTitle);
  };

  return (
    <>
      {loading ? (
        <Loader onComplete={() => setLoading(false)} />
      ) : isAdminRoute ? (
        <AdminPanel />
      ) : (
        <div className="relative min-h-screen selection:bg-[#c09f53] selection:text-[#0D3B0D]">
          
          {/* Main Global Header */}
          <Header />

          {/* Sequential Core Sections of Horizon Leisure Group */}
          <main>
            <Hero />
            <Philosophy />
            <Challenge />
            <About />
            <Services />
            <Partnership onSelectModel={handleSelectModel} />
            <Difference />
            {/* <Directors /> */}
            {/* <Team /> */}
            <Events />
            <Clients />
            <OurImpact />
            <FAQ />
            <Contact selectedModel={selectedModel} />
          </main>

          {/* Main Footer */}
          <Footer />

          {/* Sticky/Floating WhatsApp Button */}
          <WhatsAppButton />

        </div>
      )}
    </>
  );
}
