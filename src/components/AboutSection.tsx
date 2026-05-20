import React from "react";
import { 
  Building2, 
  MapPin, 
  Scale, 
  ShieldCheck, 
  UserCheck, 
  Award, 
  History, 
  PhoneCall, 
  FileCheck2,
  Anchor
} from "lucide-react";

export default function AboutSection() {
  return (
    <div className="space-y-8">
      
      {/* Narrative grid row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* About corporate text */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 lg:p-8 space-y-6">
          
          <div className="space-y-2 border-b border-neutral-100 pb-4">
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Corporate Heritage</span>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight leading-none">Who We Are & What We Safeguard</h2>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed">
            Transatlantic Express Logistics represents the gold standard in consolidated cargo orchestration, dedicated entirely to freight bridges balancing North America and the United Kingdom. Focused on high-end specialized air cargo, commercial pharmaceutical runs, and heavy industrial machinery sea vessels, we manage continuous customs reporting and telemetry lines from point of booking to delivery destination.
          </p>

          <p className="text-xs text-neutral-600 leading-relaxed">
            Understanding that global maritime carriage is complex, we leverage deep regional logistics alliances, particularly our strategic partner network with <strong className="font-semibold text-neutral-900">Transglobal Express Ltd</strong> (providing reliable GMB-registered depot support for over 30 years). Together, we consolidate packages to leverage bulk shipping rates across prime courier networks like DHL, FedEx, and sea vessels, delivering the savings directly to our corporate and retail cargo shippers.
          </p>

          {/* Operational Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
            <div className="flex gap-3">
              <span className="mt-1 flex items-center justify-center p-1.5 bg-neutral-100 rounded-lg text-emerald-600 shrink-0 h-8 w-8">
                <ShieldCheck className="w-4.5 h-4.5" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">Secure Masked Routing</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-normal">
                  In compliance with GDPR and CCPA tracking directives, all public tracking telemetry is anonymized to protect consignee warehouse locations.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="mt-1 flex items-center justify-center p-1.5 bg-neutral-100 rounded-lg text-blue-600 shrink-0 h-8 w-8">
                <Scale className="w-4.5 h-4.5" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wide font-sans">Active Compliance Duty Exemption</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-normal">
                  Our calculations are aligned with US Section 321 ($800) and UK HMRC Import VAT (£135) exemption thresholds to block unexpected customs fees.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Corporate specifications sheet */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-4 flex flex-col justify-between bg-gradient-to-br from-neutral-50 to-white">
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-neutral-950 uppercase tracking-widest border-b border-neutral-200 pb-2">
              Registered Specifications
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                <span className="text-neutral-500">Legal Carrier Seal</span>
                <span className="font-bold text-neutral-900">Transatlantic Express Ltd</span>
              </div>

              <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                <span className="text-neutral-500">Established Jurisdiction</span>
                <span className="font-bold text-neutral-100 bg-neutral-900 px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider">
                  UK HMRC / US CBP
                </span>
              </div>

              <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                <span className="text-neutral-500">Global Operational Partner</span>
                <span className="font-bold text-neutral-900">Transglobal Express</span>
              </div>

              <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                <span className="text-neutral-500">Corporate Security Model</span>
                <span className="font-bold text-neutral-900">GDPR & CCPA Compliant</span>
              </div>

              <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                <span className="text-neutral-500">Quality Standard Certification</span>
                <span className="font-bold text-neutral-900 font-mono">ISO 9001:2015 Verified</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center text-xs">
            <p className="font-bold text-emerald-950">Active Shipping Operations</p>
            <p className="text-emerald-700 font-semibold font-mono mt-0.5">Customs filings active 24/7</p>
          </div>
        </div>

      </div>

      {/* Trust credentials / Milestones history */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-white p-5 border border-neutral-200 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-neutral-100 rounded-xl text-neutral-700 shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">Company Track Record</p>
            <p className="text-base font-black text-neutral-950 mt-1">30+ Years Global Operations</p>
            <p className="text-xs text-neutral-500 leading-normal mt-1">Founded with direct ties in Slough & Heathrow to link trans-Atlantic container services.</p>
          </div>
        </div>

        <div className="bg-white p-5 border border-neutral-200 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-neutral-100 rounded-xl text-neutral-700 shrink-0">
            <Award className="w-5 h-5 animate-pulse text-emerald-600" />
          </div>
          <div>
            <p className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">Total Manifest Volume</p>
            <p className="text-base font-black text-neutral-950 mt-1">3.4M+ Parcels Cleared</p>
            <p className="text-xs text-neutral-500 leading-normal mt-1">Ensuring daily clearance operations across US FDA and UK border customs systems.</p>
          </div>
        </div>

        <div className="bg-white p-5 border border-neutral-200 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-neutral-100 rounded-xl text-neutral-700 shrink-0">
            <FileCheck2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">Consignor Safeguard</p>
            <p className="text-base font-black text-neutral-950 mt-1">100% Insured Sea & Air Lines</p>
            <p className="text-xs text-neutral-500 leading-normal mt-1">All consolidation loads are fully bonded under the Carriage of Goods by Sea Act (COGSA).</p>
          </div>
        </div>

      </div>

    </div>
  );
}
