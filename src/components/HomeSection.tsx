import React from "react";
import { 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Navigation, 
  PlaneTakeoff, 
  Ship, 
  Compass, 
  Phone,
  Globe
} from "lucide-react";
import { LocalizationConfig } from "../types";

interface HomeSectionProps {
  onNavigate: (tab: "track" | "quote" | "book" | "advisor" | "admin" | "about" | "contact") => void;
  localization: LocalizationConfig;
}

export default function HomeSection({ onNavigate, localization }: HomeSectionProps) {
  return (
    <div className="space-y-12">
      
      {/* 1. Hero Block Visual Intro */}
      <div className="relative overflow-hidden bg-neutral-900 rounded-3xl border border-neutral-800 shadow-xl py-12 px-6 sm:px-12 lg:px-16 text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
        
        {/* Subtle grid accent background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-p" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-p)" />
          </svg>
        </div>

        <div className="lg:col-span-8 space-y-6 z-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-bold border border-emerald-500/20 shadow-sm animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>Premium Consolidated Sea & Air Freight</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Seamless Hub-to-Hub Delivery <br />
            <span className="text-emerald-500">Across the Mid-Atlantic.</span>
          </h2>

          <p className="text-neutral-350 text-sm sm:text-base leading-relaxed text-neutral-300 max-w-2xl">
            We operate ultra-secure daily logistics cargo lines linking primary UK hubs directly with prime US ports of entry. Bridged with Google-My-Business certified dispatch warehouses, we screen, customs-clear, and route parcels of all scales.
          </p>

          <div className="flex flex-wrap gap-3.5 pt-2">
            <button
              onClick={() => onNavigate("track")}
              className="px-6 py-3 bg-white text-neutral-950 hover:bg-emerald-500 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest' transition shadow flex items-center justify-center gap-2 cursor-pointer transition-all font-sans"
            >
              <span>Track Active Cargo</span>
              <Navigation className="w-4 h-4 rotate-[45deg]" />
            </button>
            <button
              onClick={() => onNavigate("quote")}
              className="px-6 py-3 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-neutral-200 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer font-sans"
            >
              <span>Calculate Cust Rates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Right Visual Column */}
        <div className="lg:col-span-4 bg-neutral-950/80 p-5 rounded-2xl border border-neutral-800 backdrop-blur-sm z-10 self-stretch flex flex-col justify-between">
          <div className="space-y-3">
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Operational Pipeline Seals</p>
            <hr className="border-neutral-800" />
            
            <div className="flex items-center gap-2.5 py-1">
              <PlaneTakeoff className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-neutral-200">Express Air Cargo Consolidation</p>
                <p className="text-[10px] text-neutral-400">Regular slates out of Heathrow LHR</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 py-1">
              <Ship className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-neutral-200">LCL Consolidated Oceans Cargo</p>
                <p className="text-[10px] text-neutral-400">Southampton SOU to Boston Marine Terminal</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 py-1">
              <Compass className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-neutral-200">Seamless GMB Broker Registry</p>
                <p className="text-[10px] text-neutral-400">Strategic alliance: Transglobal Express Ltd</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 mt-4">
            <div className="flex justify-between items-center text-xs text-neutral-400 font-mono">
              <span>HELPLINE:</span>
              <span className="font-extrabold text-neutral-100">260-270-7501</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Three Pillars / Key Advantages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">Unrivaled Transatlantic Velocity</h3>
          <p className="text-xs text-neutral-600 leading-normal">
            Whether you choose our 2-day Express Air Courier jet line or cost-efficient 14-day consolidations via ocean cargo vessels, we optimize each customs interface to maximize speed and suppress terminal line queues.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">HMRC UK & US CBP Compliance</h3>
          <p className="text-xs text-neutral-600 leading-normal">
            We are built on absolute compliance. All bookings incorporate automatically simulated tax threshold reviews (including US Section 321 exemptions & UK £135 threshold calculations) to protect consignees from hidden costs.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">Live Interpolated GPS Telemetry</h3>
          <p className="text-xs text-neutral-600 leading-normal">
            Track your high-seas cargo or high-altitude freight liner. Our state-of-the-art interactive live map visualizes real-world geodesics from origin coordinates seamlessly.
          </p>
        </div>

      </div>

      {/* 3. GMB Google My Business Partner Spotlight Block */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-100 pb-5">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600">Operational Broker Network</span>
            <h3 className="text-lg font-extrabold text-neutral-950">GMB Operational Alliance with Transglobal Express Ltd</h3>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 text-yellow-800 border border-yellow-200 px-3 py-1 rounded-xl text-xs font-bold">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>4.7 / 5.0 GMB Rating</span>
          </div>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed max-w-4xl">
          By integrating operationally with the warehouses, sorting bases, and customs agencies of <strong className="font-semibold text-neutral-900">Transglobal Express Ltd</strong> (a premier shipping brand founded in the UK with over 30 years of global carriage experience), we pass commercial components, retail consumer packages, and industrial parts through priority terminals across DHL, FedEx, and sea liners.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-neutral-50/50 border border-neutral-150">
            <p className="text-xs text-neutral-400 font-semibold mb-1">HQ UK Depot Address</p>
            <p className="text-xs font-bold text-neutral-900 font-mono">Slough SL3 0ED, London Heathrow</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-50/50 border border-neutral-150">
            <p className="text-xs text-neutral-400 font-semibold mb-1">US Consolidated depot</p>
            <p className="text-xs font-bold text-neutral-900 font-mono">Chicago O'Hare Area, IL 60666</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-50/50 border border-neutral-150">
            <p className="text-xs text-neutral-400 font-semibold mb-1">Accreditations</p>
            <p className="text-xs font-bold text-neutral-950 font-mono">ISO 9001:2015 Cert</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-50/50 border border-neutral-150">
            <p className="text-xs text-neutral-400 font-semibold mb-1">Tracking Integrations</p>
            <p className="text-xs font-bold text-neutral-950 font-mono">DHL, FedEx, UPS & Sea Lines</p>
          </div>
        </div>
      </div>

      {/* 4. Mini interactive CTA Grid banner */}
      <div className="bg-neutral-50/80 rounded-2xl border border-neutral-200 p-6 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
        <div className="space-y-1">
          <h4 className="font-bold text-neutral-900 text-sm">Have cargo ready to cross transatlantic borders?</h4>
          <p className="text-xs text-neutral-500">Calculate fuel surcharge, VAT, and custom security fees in seconds.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onNavigate("quote")}
            className="px-4.5 py-2.5 bg-neutral-950 hover:bg-emerald-600 text-white rounded-xl text-xs font-extrabold uppercase tracking-widest cursor-pointer transition"
          >
            Go to Quote Engine
          </button>
          <button
            onClick={() => onNavigate("book")}
            className="px-4.5 py-2.5 bg-white border hover:bg-neutral-100 text-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wide cursor-pointer transition"
          >
            Secure Booking Portal
          </button>
        </div>
      </div>

    </div>
  );
}
