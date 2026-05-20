import React, { useState, useEffect } from "react";
import { LocalizationConfig, TrackingDetails, QuoteOption } from "./types";
import TrackingMap from "./components/TrackingMap";
import QuoteSection from "./components/QuoteSection";
import BookingForm from "./components/BookingForm";
import LogisticsAdvisor from "./components/LogisticsAdvisor";
import HomeSection from "./components/HomeSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import AdminCargoManager from "./components/AdminCargoManager";
import { 
  Building2, 
  MapPin, 
  Navigation, 
  Phone, 
  Mail, 
  Layers, 
  Scale, 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  Info, 
  DollarSign, 
  Globe, 
  Star, 
  ChevronRight, 
  Download, 
  FileCheck, 
  Truck, 
  Anchor, 
  ListTodo,
  Database,
  Calculator,
  UserCheck
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "about" | "track" | "quote" | "book" | "advisor" | "partner" | "contact" | "admin">("home");
  const [trackingNumberInput, setTrackingNumberInput] = useState("TE-UKUS-88402");
  const [activeShipment, setActiveShipment] = useState<TrackingDetails | null>(null);
  const [trackingError, setTrackingError] = useState("");
  const [isSearchingTracking, setIsSearchingTracking] = useState(false);

  // Localization configuration state
  const [localization, setLocalization] = useState<LocalizationConfig>({
    region: "UK",
    currency: "GBP",
    weightUnit: "kg",
    dimensionUnit: "cm",
    language: "en-GB"
  });

  // Flow handoff: holding prefilled booking info from quote metrics
  const [prefilledBooking, setPrefilledBooking] = useState<{
    quote: QuoteOption;
    originCity: string;
    destCity: string;
    weight: number;
    value: number;
  } | null>(null);

  // Auto-fetch initial shipment info on load to make the dashboard look active and amazing
  useEffect(() => {
    fetchShipmentDetails("TE-UKUS-88402");
  }, []);

  // Poll tracking details every 8 seconds to show real-time coordinates moving on the map!
  useEffect(() => {
    if (activeShipment && (activeShipment.id === "TE-UKUS-88402" || activeShipment.id === "TE-USUK-40192")) {
      const interval = setInterval(() => {
        fetchShipmentDetails(activeShipment.id, true);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [activeShipment?.id]);

  const fetchShipmentDetails = async (id: string, silent = false) => {
    if (!silent) {
      setIsSearchingTracking(true);
      setTrackingError("");
    }
    try {
      const response = await fetch(`/api/tracking/${id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Shipment ID not found.");
      }
      setActiveShipment(data);
    } catch (err: any) {
      console.error(err);
      if (!silent) {
        setTrackingError(err.message || "Unable to acquire shipment coordinate registries.");
        setActiveShipment(null);
      }
    } finally {
      if (!silent) {
        setIsSearchingTracking(false);
      }
    }
  };

  const handleTrackingSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumberInput.trim()) {
      fetchShipmentDetails(trackingNumberInput.trim());
    }
  };

  const handleQuickDemoClick = (id: string) => {
    setTrackingNumberInput(id);
    fetchShipmentDetails(id);
    setActiveTab("track");
  };

  const handleQuoteRedirectToBooking = (
    quote: QuoteOption, 
    originCity: string, 
    destCity: string, 
    weight: number, 
    value: number
  ) => {
    setPrefilledBooking({ quote, originCity, destCity, weight, value });
    setActiveTab("book");
  };

  const handleBookingHandoffToTrackingMap = (trackingNumber: string) => {
    setTrackingNumberInput(trackingNumber);
    fetchShipmentDetails(trackingNumber);
    setActiveTab("track");
  };

  // Adjust localization settings depending on selection
  const switchRegion = (region: "US" | "UK") => {
    if (region === "UK") {
      setLocalization({
        region: "UK",
        currency: "GBP",
        weightUnit: "kg",
        dimensionUnit: "cm",
        language: "en-GB"
      });
    } else {
      setLocalization({
        region: "US",
        currency: "USD",
        weightUnit: "lbs",
        dimensionUnit: "in",
        language: "en-US"
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans select-none antialiased text-neutral-800">
      
      {/* Dynamic Global Notification Ticker */}
      <div className="bg-neutral-950 text-white py-2 px-4 text-xs font-mono font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>UK-US Air freight lines active. Normal sea container transit intervals apply.</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>HELPLINE: <strong className="text-white font-bold">260-270-7501</strong></span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">EMAIL: <strong className="text-white font-bold">ship@transatlanticexpress.com</strong></span>
          </div>
        </div>
      </div>

      {/* Main Corporate Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-neutral-950 text-white rounded-xl flex items-center justify-center font-black tracking-tighter text-lg shadow">
              TE
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-neutral-900 leading-none">TRANSATLANTIC EXPRESS</span>
                <span className="text-[9px] uppercase tracking-widest font-extrabold text-neutral-400 border border-neutral-200 px-1.5 py-0.5 rounded">Logistics</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                US-UK Consolidated Cargo Operations • GMB Verified Carrier Partner
              </p>
            </div>
          </div>

          {/* Localization Adjusters & Contacts */}
          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
            
            {/* Localized Contacts summary */}
            <div className="hidden lg:block text-right mr-4 border-r border-neutral-200 pr-5">
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider leading-none">Support Desk</p>
              <p className="text-sm font-black text-neutral-900 mt-1">260-270-7501</p>
              <p className="text-xs text-neutral-500">ship@transatlanticexpress.com</p>
            </div>

            {/* Region Switch buttons */}
            <div className="bg-neutral-100 p-1.5 rounded-xl border border-neutral-200 flex gap-1">
              <button
                onClick={() => switchRegion("UK")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                  localization.region === "UK" 
                    ? "bg-white text-neutral-950 shadow-sm" 
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                🇬🇧 UK Focus
              </button>
              <button
                onClick={() => switchRegion("US")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                  localization.region === "US" 
                    ? "bg-white text-neutral-950 shadow-sm" 
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                🇺🇸 US Focus
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Hero Informational Banner */}
      {(activeTab === "home" || activeTab === "track") && (
        <section className="bg-gradient-to-b from-white to-neutral-50 border-b border-neutral-200 py-10 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 shadow-sm">
                <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Transatlantic Shipping Alliance • GMB Search Partnered Integration</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight leading-tight">
                Bespoke Sea & Air Cargo Dispatch for the <span className="text-emerald-600">US & UK Markets</span>
              </h1>
              
              <p className="text-neutral-600 text-sm max-w-2xl leading-relaxed">
                We coordinate robust freight consolidated forwarding specializing in transatlantic commercial channels. Partnering operationally with GMB-registered <strong className="font-semibold text-neutral-900">Transglobal Express Ltd</strong>, our platforms connect parcel bookings directly, with fully localized metrics, dual-currency processing, and automatic compliance screening.
              </p>

              {/* Micro value badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border border-neutral-200 shadow-sm flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 leading-tight">Dual Market Security</h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">GDPR & CCPA Compliant</p>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-neutral-200 shadow-sm flex items-start gap-2.5">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 leading-tight">GMB Listed Partner</h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Transglobal Express UK/US</p>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-neutral-200 shadow-sm flex items-start gap-2.5">
                  <Scale className="w-5 h-5 text-amber-600" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 leading-tight">Tax De Minimis</h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">US $800 / UK £135 clearance</p>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-neutral-200 shadow-sm flex items-start gap-2.5">
                  <Clock className="w-5 h-5 text-red-600" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 leading-tight">Live Telemetry</h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Continuous GPS update</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-5 border border-neutral-200 rounded-2xl shadow-sm text-neutral-700">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-2.5 border-b border-neutral-100 pb-1.5 flex items-center justify-between">
                <span>Quick Demo Telemetry</span>
                <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded uppercase">Active Cargo</span>
              </h3>
              <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                Trace real-time geodesic movements computed directly from timestamp increments:
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => handleQuickDemoClick("TE-UKUS-88402")}
                  className="w-full text-left p-3 rounded-xl border border-neutral-150 hover:border-emerald-500 hover:bg-neutral-50/50 flex justify-between items-center text-xs transition cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-neutral-950">TE-UKUS-88402</span>
                    <span className="text-neutral-500 block text-[10px] mt-0.5">LHR to ORD • Air Freight Liner</span>
                  </div>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded inline-flex items-center gap-1 text-[10px]">
                    In Flight
                  </span>
                </button>

                <button
                  onClick={() => handleQuickDemoClick("TE-USUK-40192")}
                  className="w-full text-left p-3 rounded-xl border border-neutral-150 hover:border-emerald-500 hover:bg-neutral-50/50 flex justify-between items-center text-xs transition cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-neutral-950">TE-USUK-40192</span>
                    <span className="text-neutral-500 block text-[10px] mt-0.5">Boston to Southampton • Sea Tanker</span>
                  </div>
                  <span className="text-blue-700 font-bold bg-blue-50 px-2 py-1 rounded inline-flex items-center gap-1 text-[10px]">
                    Ocean Transit
                  </span>
                </button>

                <button
                  onClick={() => handleQuickDemoClick("TE-UKUS-10294")}
                  className="w-full text-left p-3 rounded-xl border border-neutral-150 hover:border-emerald-500 hover:bg-neutral-50/50 flex justify-between items-center text-xs transition cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-neutral-950">TE-UKUS-10294</span>
                    <span className="text-neutral-500 block text-[10px] mt-0.5">Glasgow to Los Angeles • Spirits batch</span>
                  </div>
                  <span className="text-amber-700 font-bold bg-amber-50 px-2 py-1 rounded inline-flex items-center gap-1 text-[10px]">
                    Last Mile
                  </span>
                </button>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Primary Dashboard Navigation Tabs */}
      <section className="bg-white border-b border-neutral-200 py-2 sticky top-[77px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-1 border-b border-neutral-100 pb-0.5 scrollbar-thin">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-4 py-3 text-xs uppercase tracking-wider font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === "home" 
                  ? "border-emerald-600 text-emerald-950 bg-emerald-50/10 font-black" 
                  : "border-transparent text-neutral-500 hover:text-neutral-950 hover:border-neutral-300"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`px-4 py-3 text-xs uppercase tracking-wider font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === "about" 
                  ? "border-emerald-600 text-emerald-950 bg-emerald-50/10 font-black" 
                  : "border-transparent text-neutral-500 hover:text-neutral-950 hover:border-neutral-300"
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => setActiveTab("track")}
              className={`px-4 py-3 text-xs uppercase tracking-wider font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === "track" 
                  ? "border-emerald-600 text-emerald-950 bg-emerald-50/10 font-black" 
                  : "border-transparent text-neutral-500 hover:text-neutral-950 hover:border-neutral-300"
              }`}
            >
              Track and Trace
            </button>
            <button
              onClick={() => setActiveTab("quote")}
              className={`px-4 py-3 text-xs uppercase tracking-wider font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === "quote" 
                  ? "border-emerald-600 text-emerald-950 bg-emerald-50/10 font-black" 
                  : "border-transparent text-neutral-500 hover:text-neutral-950 hover:border-neutral-300"
              }`}
            >
              Rates Calculator
            </button>
            <button
              onClick={() => setActiveTab("book")}
              className={`px-4 py-3 text-xs uppercase tracking-wider font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === "book" 
                  ? "border-emerald-600 text-emerald-950 bg-emerald-50/10 font-black" 
                  : "border-transparent text-neutral-500 hover:text-neutral-950 hover:border-neutral-300"
              }`}
            >
              Cargo Booking
            </button>
            <button
              onClick={() => setActiveTab("advisor")}
              className={`px-4 py-3 text-xs uppercase tracking-wider font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === "advisor" 
                  ? "border-emerald-600 text-emerald-950 bg-emerald-50/10 font-black" 
                  : "border-transparent text-neutral-500 hover:text-neutral-950 hover:border-neutral-300"
              }`}
            >
              Customs AI Advisor
            </button>
            <button
              onClick={() => setActiveTab("partner")}
              className={`px-4 py-3 text-xs uppercase tracking-wider font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === "partner" 
                  ? "border-emerald-600 text-emerald-950 bg-emerald-50/10 font-black" 
                  : "border-transparent text-neutral-500 hover:text-neutral-950 hover:border-neutral-300"
              }`}
            >
              GMB Profile
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-4 py-3 text-xs uppercase tracking-wider font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === "contact" 
                  ? "border-emerald-600 text-emerald-950 bg-emerald-50/10 font-black" 
                  : "border-transparent text-neutral-500 hover:text-neutral-950 hover:border-neutral-300"
              }`}
            >
              Contact & Facilities
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`ml-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border border-dashed border-emerald-300 text-emerald-850 hover:bg-neutral-50 ${
                activeTab === "admin" 
                  ? "bg-emerald-600 text-white border-solid border-emerald-600 font-extrabold shadow-sm hover:bg-emerald-600" 
                  : "text-emerald-700 bg-emerald-50/40"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Sections switcher */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {activeTab === "track" && (
          <div className="space-y-6">
            
            {/* Direct Tracker Input form bar */}
            <div className="bg-white p-5 border border-neutral-200 rounded-2xl shadow-sm">
              <form onSubmit={handleTrackingSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-400">
                    <Navigation className="w-5 h-5 rotate-[45deg]" />
                  </span>
                  <input
                    type="text"
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-11 pr-4 py-3 text-sm text-neutral-950 tracking-wider font-semibold uppercase leading-none outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    placeholder="Enter Shipment ID (e.g. TE-UKUS-88402, TE-USUK-40192)"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearchingTracking}
                  className="bg-neutral-950 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl shadow transition cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {isSearchingTracking ? "Connecting telemetry..." : "Track Geolocation"}
                </button>
              </form>

              {trackingError && (
                <div className="mt-3 text-xs text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-lg flex items-center gap-2">
                  <Info className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{trackingError}</span>
                </div>
              )}
            </div>

            {/* Tracking MAP panel and data stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <div className="lg:col-span-8 space-y-4">
                <TrackingMap shipment={activeShipment} />
              </div>

              {/* Status details sidebar */}
              <div className="lg:col-span-4 space-y-4">
                {activeShipment ? (
                  <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm p-5 space-y-5">
                    
                    <div>
                      <div className="flex justify-between items-start">
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Cargo Manifest Identifier</p>
                        <span className="text-[11px] font-mono text-neutral-900 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
                          {activeShipment.id}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-neutral-950 mt-1">{activeShipment.shipmentType}</h4>
                    </div>

                    {/* Progress slider bar status */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-neutral-500">
                        <span>Transit Tracker Route</span>
                        <span className="font-bold text-neutral-800">{activeShipment.liveStatus.progressPct}% completed</span>
                      </div>
                      <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${activeShipment.liveStatus.progressPct}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Checkpoints Stepper */}
                    <div className="space-y-4 border-t border-neutral-100 pt-4 text-xs">
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-2">Transit Milestone Checkpoints</p>
                      
                      <div className="relative pl-5 space-y-3">
                        {/* Connecting bar */}
                        <div className="absolute top-2 left-1.5 bottom-2 w-0.5 bg-neutral-200"></div>

                        {/* Booking milestone */}
                        <div className="relative flex items-start gap-2.5">
                          <span className={`w-3.5 h-3.5 rounded-full absolute -left-[19px] border-2 bg-white flex items-center justify-center ${
                            activeShipment.milestoneIndex >= 0 ? "border-emerald-500 bg-emerald-500 text-white" : "border-neutral-200"
                          }`}>
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </span>
                          <div>
                            <p className={`font-semibold ${activeShipment.milestoneIndex >= 0 ? "text-neutral-900" : "text-neutral-400"}`}>
                              Cargo Booked & Recorded
                            </p>
                            <p className="text-[10px] text-neutral-400 leading-tight">Carrier accepted and scheduled</p>
                          </div>
                        </div>

                        {/* Agency sorting scan */}
                        <div className="relative flex items-start gap-2.5">
                          <span className={`w-3.5 h-3.5 rounded-full absolute -left-[19px] border-2 bg-white flex items-center justify-center ${
                            activeShipment.milestoneIndex >= 1 ? "border-emerald-500 bg-emerald-500 text-white" : "border-neutral-200"
                          }`}>
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </span>
                          <div>
                            <p className={`font-semibold ${activeShipment.milestoneIndex >= 1 ? "text-neutral-900" : "text-neutral-400"}`}>
                              Transglobal Express Facility Handshake
                            </p>
                            <p className="text-[10px] text-neutral-400 leading-tight">Origin sorting scan, package measures verified</p>
                          </div>
                        </div>

                        {/* Outward customs clearance */}
                        <div className="relative flex items-start gap-2.5">
                          <span className={`w-3.5 h-3.5 rounded-full absolute -left-[19px] border-2 bg-white flex items-center justify-center ${
                            activeShipment.milestoneIndex >= 2 ? "border-emerald-500 bg-emerald-500 text-white" : "border-neutral-200"
                          }`}>
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </span>
                          <div>
                            <p className={`font-semibold ${activeShipment.milestoneIndex >= 2 ? "text-neutral-900" : "text-neutral-400"}`}>
                              Outward Border Clearance Signed
                            </p>
                            <p className="text-[10px] text-neutral-400 leading-tight">HMRC (or US CBP) declaration filings finalized</p>
                          </div>
                        </div>

                        {/* Transatlantic transit flight */}
                        <div className="relative flex items-start gap-2.5">
                          <span className={`w-3.5 h-3.5 rounded-full absolute -left-[19px] border-2 bg-white flex items-center justify-center ${
                            activeShipment.milestoneIndex >= 3 ? "border-emerald-500 bg-emerald-500 text-white" : "border-neutral-200"
                          }`}>
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </span>
                          <div>
                            <p className={`font-semibold ${activeShipment.milestoneIndex >= 3 ? "text-neutral-900 font-bold" : "text-neutral-400"}`}>
                              Transatlantic Route Crossing
                            </p>
                            <p className="text-[10px] text-neutral-400 leading-tight">In active flight / ocean voyage</p>
                          </div>
                        </div>

                        {/* Destination Hub Import clearance */}
                        <div className="relative flex items-start gap-2.5">
                          <span className={`w-3.5 h-3.5 rounded-full absolute -left-[19px] border-2 bg-white flex items-center justify-center ${
                            activeShipment.milestoneIndex >= 4 ? "border-emerald-500 bg-emerald-500 text-white" : "border-neutral-200"
                          }`}>
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </span>
                          <div>
                            <p className={`font-semibold ${activeShipment.milestoneIndex >= 4 ? "text-neutral-900" : "text-neutral-400"}`}>
                              Import Border customs pre-clearance
                            </p>
                            <p className="text-[10px] text-neutral-400 leading-tight">Tariff review under CCPA / GDPR safety guidelines</p>
                          </div>
                        </div>

                        {/* Last mile Delivery */}
                        <div className="relative flex items-start gap-2.5">
                          <span className={`w-3.5 h-3.5 rounded-full absolute -left-[19px] border-2 bg-white flex items-center justify-center ${
                            activeShipment.milestoneIndex >= 5 ? "border-emerald-500 bg-emerald-500 text-white" : "border-neutral-200"
                          }`}>
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </span>
                          <div>
                            <p className={`font-semibold ${activeShipment.milestoneIndex >= 5 ? "text-neutral-900 font-bold" : "text-neutral-400"}`}>
                              Out for Last Mile Hub Delivery
                            </p>
                            <p className="text-[10px] text-neutral-400 leading-tight">Transatlantic Express local cargo vehicle</p>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="bg-neutral-50 px-3.5 py-4 border border-neutral-154 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-400 font-bold">Shipper Origin</span>
                        <span className="font-semibold text-neutral-900 truncate max-w-[170px]">{activeShipment.senderName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400 font-bold">Recipient Cargo Target</span>
                        <span className="font-semibold text-neutral-900 truncate max-w-[170px]">{activeShipment.receiverName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400 font-bold">Carrier Fleet Partner</span>
                        <span className="font-semibold text-neutral-950 truncate max-w-[170px]">{activeShipment.carrierPartner}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400 font-bold">Invoiced customs valuation</span>
                        <span className="font-semibold font-mono text-neutral-950">
                          {localization.currency === "GBP" ? "£" : "$"}{Math.round(activeShipment.declaredValue * (localization.currency === "GBP" ? 0.8 : 1))}
                        </span>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="bg-white border border-neutral-200 rounded-2xl p-5 text-center shadow-sm">
                    <p className="text-neutral-405 text-xs text-center py-6 leading-relaxed">
                      Select or Search for any of our high-seas demo shipments using the sidebar panel items to review dynamic cargo stepper status details instantly.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {activeTab === "quote" && (
          <QuoteSection 
            localization={localization} 
            onBookingRedirect={handleQuoteRedirectToBooking} 
          />
        )}

        {activeTab === "book" && (
          <BookingForm 
            localization={localization}
            prefilledQuote={prefilledBooking} 
            onBookingSuccess={handleBookingHandoffToTrackingMap}
          />
        )}

        {activeTab === "advisor" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Advisor Chat Panel */}
            <div className="lg:col-span-8">
              <LogisticsAdvisor />
            </div>

            {/* Side instructions & regulatory facts */}
            <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-2xl shadow-sm p-5 space-y-5">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-2.5">
                <Scale className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Customs Declarations Handbook</h3>
              </div>
              
              <div className="space-y-4 text-xs leading-relaxed text-neutral-600">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-150">
                  <h4 className="font-bold text-neutral-800 uppercase text-[10px] tracking-wider mb-1">US De Minimis (Section 321)</h4>
                  <p className="text-[11px] text-neutral-600 leading-normal">
                    Imports into the US valued under $800 USD are generally exempt from customs tariffs and detailed entry declarations if shipped to a single end-consumer recipient.
                  </p>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-150">
                  <h4 className="font-bold text-neutral-800 uppercase text-[10px] tracking-wider mb-1">UK Import Customs exemption limits</h4>
                  <p className="text-[11px] text-neutral-600 leading-normal">
                    UK custom levies do not apply for commercial deliveries below the £135 threshold, though standard 20% import VAT calculations are applicable at border hubs.
                  </p>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-150">
                  <h4 className="font-bold text-neutral-800 uppercase text-[10px] tracking-wider mb-1">GDPR & CCPA Safety protocols</h4>
                  <p className="text-[11px] text-neutral-600 leading-normal">
                    To comply with UK Data Protection Act 2018 and the California Consumer Privacy Act (CCPA), we automatically encrypt and mask corporate addresses on tracking interfaces. Personal telemetry remains private.
                  </p>
                </div>

                <div className="pt-2 text-center border-t border-neutral-100">
                  <p className="font-sans text-[11px] font-bold text-neutral-800 mb-1">Need Urgent Human Consultation?</p>
                  <p className="text-emerald-700 font-mono font-bold">Helpline: 260-270-7501</p>
                  <p className="text-neutral-500 text-[10px] mt-0.5">Corporate: ship@transatlanticexpress.com</p>
                </div>
              </div>

            </div>

          </div>
        )}

        {activeTab === "partner" && (
          <div className="space-y-8">
            
            {/* Large banner about GMB profiles */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 lg:p-8 space-y-6">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-200 pb-5">
                <div>
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-6 h-6 text-emerald-600" />
                    <h2 className="text-xl font-bold text-neutral-900 leading-none">GMB Operational Integration Partner Profile</h2>
                  </div>
                  <p className="text-neutral-500 text-sm mt-1.5">
                    Verified Google My Business directory information for international cargo dispatch.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-800 border border-yellow-200 px-3.5 py-1.5 rounded-xl">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 shrink-0" />
                  <span className="font-bold text-sm">4.7 / 5.0 (3,450 Reviews)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-100 pb-1">operational brand identity</h3>
                  
                  <div className="space-y-3 font-sans text-sm text-neutral-600">
                    <div className="flex justify-between py-1.5 border-b border-neutral-50">
                      <strong className="text-neutral-800 font-bold">Registered Legal Name:</strong>
                      <span>Transglobal Express Ltd</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-neutral-50">
                      <strong className="text-neutral-800 font-bold">Active GMB Focus Markets:</strong>
                      <span>United Kingdom (HQ) & United States</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-neutral-50">
                      <strong className="text-neutral-800 font-bold">Establishment Date:</strong>
                      <span>January 1993 (30+ Years Global Track Record)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-neutral-50">
                      <strong className="text-neutral-800 font-bold">Premium Courier Network:</strong>
                      <span>DHL, UPS, FedEx, DPD, TNT & Evri integration</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-neutral-50">
                      <strong className="text-neutral-800 font-bold">Accreditation:</strong>
                      <span>ISO 9001:2015 Quality Management Certified</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-500 italic mt-3 leading-normal">
                    *Our software integrates with Transglobal Express Ltd APIs and logistics warehouses to automate customs reporting clearances and generate seamless cargo tracking logs between European and North American ports.
                  </p>
                </div>

                <div className="bg-neutral-50/50 rounded-2xl border border-neutral-150 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1 flex justify-between">
                    <span>Active Warehouse Depots</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-white px-2 py-0.5 rounded border border-neutral-200">Open 24/7</span>
                  </h3>
                  
                  <div className="space-y-4 text-xs text-neutral-700 leading-normal">
                    <div className="flex gap-2.5">
                      <MapPin className="w-5 h-5 text-neutral-400 shrink-0" />
                      <div>
                        <p className="font-bold text-neutral-900 leading-tight">London Heathrow HQ Consolidated Base</p>
                        <p className="text-neutral-500 mt-0.5">Unit 5, Lakeside Industrial Estate, Colnbrook, Slough, Berkshire, SL3 0ED, United Kingdom</p>
                        <p className="text-[10px] text-emerald-700 font-bold mt-1 leading-none">UK CUSTOMS AGENCY HUB (FILINGS HMRC-1049)</p>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <MapPin className="w-5 h-5 text-neutral-400 shrink-0" />
                      <div>
                        <p className="font-bold text-neutral-900 leading-tight">North American Import Terminal Base</p>
                        <p className="text-neutral-500 mt-0.5">Consolidation Terminal Hub, Near Chicago O'Hare Cargo Gate 5, Illinois, IL 60666, United States of America</p>
                        <p className="text-[10px] text-blue-700 font-bold mt-1 leading-none">US CBP SCREENING BASE (ENTRY SECTION 321)</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-4 text-center">
                    <p className="text-xs font-bold text-neutral-900 mb-1">Corporate Dispatch Communications</p>
                    <p className="text-sm font-black font-mono text-neutral-950 flex items-center justify-center gap-1.5">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>260-270-7501</span>
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">Electronic inquiry desk: ship@transatlanticexpress.com</p>
                  </div>
                </div>

              </div>

            </div>

            {/* Grid display of other reputation metrics and data protection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                  <FileCheck className="w-5 h-5 text-emerald-700" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">Customs Broker Authorization Treaty</h4>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Exporting from the United Kingdom to the United States requires filing commercial invoices utilizing the Harmonized Commodity Description and Coding System (HS Codes). Under our strategic treaty with <strong className="font-semibold text-neutral-900">Transglobal Express</strong>, bookings placed through our secure Outward booking portal receive streamlined pre-clearance codes to bypass standard secondary port waitlines.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900">GDPR & CCPA Masking Directives</h4>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  In agreement with the UK Information Commissioner's Office (ICO) and California Attorney General guidance, all public tracking lookups are anonymous. Detailed delivery sign-offs, consignee streets, and contact phone telemetry are masked dynamically until accessed through securely logged user dashboards, ensuring robust data protection.
                </p>
              </div>

            </div>

          </div>
        )}

        {activeTab === "home" && (
          <HomeSection 
            onNavigate={(tab) => {
              setActiveTab(tab);
            }} 
            localization={localization}
          />
        )}

        {activeTab === "about" && (
          <AboutSection />
        )}

        {activeTab === "contact" && (
          <ContactSection />
        )}

        {activeTab === "admin" && (
          <AdminCargoManager 
            onSelectShipmentForTracking={(id) => {
              setTrackingNumberInput(id);
              fetchShipmentDetails(id);
              setActiveTab("track");
            }} 
          />
        )}

      </main>

      {/* Trust Signpost & Regulatory Outlines Footer */}
      <footer className="bg-white border-t border-neutral-200 py-12 mt-12 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-neutral-950 text-white rounded-lg flex items-center justify-center font-black tracking-tighter text-sm">
                TE
              </div>
              <span className="font-black tracking-tight text-neutral-900">TRANSATLANTIC EXPRESS</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Consolidated cargo registry orchestrating secure shipping lanes, custom clearances, and live tracking between Heathrow (LHR/LGW) and North American ports.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-neutral-950 uppercase tracking-widest text-[10px]">Operations & Helpline</h4>
            <ul className="space-y-1.5 font-sans">
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="font-bold text-neutral-800">260-270-7501</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="font-bold text-neutral-800">ship@transatlanticexpress.com</span>
              </li>
              <li className="flex items-center gap-1.5 text-[11px]">
                <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>Heathrow & Chicago Cargo Parks</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-neutral-950 uppercase tracking-widest text-[10px]">Operational Partner</h4>
            <p className="text-[11px] leading-relaxed">
              Partnered operationally under GMB listings with <strong className="font-semibold text-neutral-850">Transglobal Express Ltd</strong>, managing consolidated air cargo and ocean containers since 1993. ISO 9001:2015 Certified cargo safety.
            </p>
          </div>

          <div className="space-y-3 text-[10px] leading-normal">
            <h4 className="font-extrabold text-neutral-950 uppercase tracking-wide text-[10px]">Compliance & Jurisdiction</h4>
            <p className="text-[10px]">
              Transatlantic Express Logistics is governed by the Carriage of Goods by Sea Act (COGSA) of 1936, the Hague-Visby rules, UK HMRC import tariffs, and US CBP Section 321 exemptions. Automated client data masked under UK GDPR / California Consumer Privacy Act (CCPA).
            </p>
            <p className="pt-2 border-t border-neutral-100 font-mono text-[9px] text-neutral-400">
              © {new Date().getFullYear()} Transatlantic Express Logistics. All rights reserved.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
