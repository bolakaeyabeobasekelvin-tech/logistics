import React, { useState } from "react";
import { LocalizationConfig, QuoteOption } from "../types";
import { Calculator, Shield, HelpCircle, ArrowRight, CheckCircle2, ChevronRight, DollarSign, Euro, Globe2 } from "lucide-react";

interface QuoteSectionProps {
  localization: LocalizationConfig;
  onBookingRedirect: (quote: QuoteOption, originStr: string, destStr: string, wt: number, val: number) => void;
}

export default function QuoteSection({ localization, onBookingRedirect }: QuoteSectionProps) {
  const [originCity, setOriginCity] = useState("London");
  const [destCity, setDestCity] = useState("New York");
  const [weightInput, setWeightInput] = useState("15");
  const [valueInput, setValueInput] = useState("450");
  const [isCalculating, setIsCalculating] = useState(false);
  const [quotes, setQuotes] = useState<QuoteOption[] | null>(null);

  // Conversions for pricing calculations
  const displayCurrencySymbol = localization.currency === "GBP" ? "£" : "$";

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setQuotes(null);

    // Simulate reliable freight API response times
    setTimeout(() => {
      const parsedWeight = parseFloat(weightInput) || 10;
      const parsedValue = parseFloat(valueInput) || 100;
      
      // Dynamic base fee depending on custom input weight
      const weightMultiplier = localization.weightUnit === "kg" ? 12 : 5.5; 
      const baseFeeUnit = Math.round(50 + parsedWeight * weightMultiplier);

      const computedQuotes: QuoteOption[] = [
        {
          id: "qo-express",
          name: "Priority Transatlantic Express Express Air Courier",
          carrier: "Transglobal Express Partners (utilizing DHL Courier Line)",
          speed: "Express",
          transitDays: 2,
          cost: baseFeeUnit * 1.6,
          costBreakdown: {
            baseRate: Math.round(baseFeeUnit * 1.1),
            fuelSurcharge: Math.round(baseFeeUnit * 0.15),
            customsProcessing: Math.round(25),
            transatlanticSecurity: Math.round(15),
            taxVAT: Math.round(baseFeeUnit * 0.1)
          }
        },
        {
          id: "qo-standard",
          name: "Standard Consolidated Transatlantic Air Freight",
          carrier: "Transglobal Express Cargo (consolidated air charter)",
          speed: "Standard",
          transitDays: 5,
          cost: baseFeeUnit * 1.1,
          costBreakdown: {
            baseRate: Math.round(baseFeeUnit * 0.8),
            fuelSurcharge: Math.round(baseFeeUnit * 0.1),
            customsProcessing: Math.round(15),
            transatlanticSecurity: Math.round(10),
            taxVAT: Math.round(baseFeeUnit * 0.05)
          }
        },
        {
          id: "qo-economy",
          name: "LCL Sea-Freight Direct Marine Container Cargo",
          carrier: "Transglobal Ocean Freight Lines (vessel cargo partners)",
          speed: "Economy",
          transitDays: 14,
          cost: baseFeeUnit * 0.55 + 40,
          costBreakdown: {
            baseRate: Math.round(baseFeeUnit * 0.35),
            fuelSurcharge: Math.round(20),
            customsProcessing: Math.round(10),
            transatlanticSecurity: Math.round(5),
            taxVAT: Math.round(baseFeeUnit * 0.02)
          }
        }
      ];

      // Convert calculated dollar base to localized currency if GBP selected
      if (localization.currency === "GBP") {
        computedQuotes.forEach(q => {
          q.cost = Math.round(q.cost * 0.8);
          q.costBreakdown.baseRate = Math.round(q.costBreakdown.baseRate * 0.8);
          q.costBreakdown.fuelSurcharge = Math.round(q.costBreakdown.fuelSurcharge * 0.8);
          q.costBreakdown.customsProcessing = Math.round(q.costBreakdown.customsProcessing * 0.8);
          q.costBreakdown.transatlanticSecurity = Math.round(q.costBreakdown.transatlanticSecurity * 0.8);
          q.costBreakdown.taxVAT = Math.round(q.costBreakdown.taxVAT * 0.8);
        });
      }

      setQuotes(computedQuotes);
      setIsCalculating(false);
    }, 850);
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-neutral-50 to-neutral-100/50 border-b border-neutral-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 leading-snug">
              Instant Transatlantic Shipping Quote Calculator
            </h2>
            <p className="text-neutral-500 text-xs mt-0.5">
              Input weight parameters in {localization.weightUnit === "kg" ? "Kilograms" : "Pounds"} to trace operational shipping carrier rates.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
              Origin Port / City
            </label>
            <input
              type="text"
              required
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm text-neutral-950 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              placeholder="e.g. London, Heathrow"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
              Destination Port / City
            </label>
            <input
              type="text"
              required
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm text-neutral-950 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
              value={destCity}
              onChange={(e) => setDestCity(e.target.value)}
              placeholder="e.g. Chicago, ORD"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">
              Gross Weight ({localization.weightUnit})
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              required
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm text-neutral-950 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              placeholder="15"
            />
          </div>

          <div className="flex flex-col justify-end">
            <button
              type="submit"
              disabled={isCalculating}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl px-4 py-2.5 shadow-sm transition-all focus:ring-2 focus:ring-emerald-500/10 cursor-pointer disabled:opacity-50"
            >
              {isCalculating ? "Calculating logistics..." : "Get Live Quote Options"}
            </button>
          </div>
        </form>

        {quotes && (
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">
                  Carrier Match: {originCity} to {destCity} ({weightInput} {localization.weightUnit})
                </span>
              </div>
              <span className="font-bold underline">Partnered via Transglobal Express GMB Network</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="relative p-5 border border-neutral-200 hover:border-emerald-500/50 rounded-2xl bg-neutral-50/20 hover:bg-white transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    {/* Header line */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className={`inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded ${
                          quote.speed === "Express" ? "bg-red-50 text-red-600 border border-red-100" :
                          quote.speed === "Standard" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                          "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}>
                          {quote.speed} SPEED
                        </span>
                        <h3 className="text-sm font-bold text-neutral-900 mt-2 leading-snug">{quote.name}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-500 font-medium">Est. Duration</p>
                        <p className="text-sm font-bold text-neutral-900 font-mono">{quote.transitDays} Days</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-neutral-500 mt-2 italic leading-tight">
                      {quote.carrier}
                    </p>

                    {/* Breakdown Accordion */}
                    <div className="mt-4 border-t border-b border-dashed border-neutral-200 py-3 space-y-1 text-xs">
                      <div className="flex justify-between text-neutral-500">
                        <span>Base Freight Cost</span>
                        <span className="font-mono">{displayCurrencySymbol}{quote.costBreakdown.baseRate}</span>
                      </div>
                      <div className="flex justify-between text-neutral-500">
                        <span>Marine Surcharge & Fuel</span>
                        <span className="font-mono">{displayCurrencySymbol}{quote.costBreakdown.fuelSurcharge}</span>
                      </div>
                      <div className="flex justify-between text-neutral-500">
                        <span>Customs Clearing Agency Fee</span>
                        <span className="font-mono">{displayCurrencySymbol}{quote.costBreakdown.customsProcessing}</span>
                      </div>
                      <div className="flex justify-between text-neutral-500">
                        <span>Security & Customs Transit Screening</span>
                        <span className="font-mono">{displayCurrencySymbol}{quote.costBreakdown.transatlanticSecurity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <p className="text-[11px] text-neutral-400 font-bold tracking-wide uppercase">All-Inclusive Total</p>
                        <p className="text-2xl font-black text-neutral-950 font-mono tracking-tight">
                          {displayCurrencySymbol}{quote.cost}
                        </p>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        Lock Price 48h
                      </span>
                    </div>

                    <button
                      onClick={() => onBookingRedirect(
                        quote, 
                        originCity, 
                        destCity, 
                        parseFloat(weightInput), 
                        parseFloat(valueInput)
                      )}
                      className="w-full bg-neutral-950 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Proceed to Booking</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-500 max-w-2xl mt-4">
              <Shield className="w-4 h-4 text-neutral-400 shrink-0" />
              <p>
                Calculations are aligned with Carriage of Goods by Sea Act (COGSA) guidelines and current fuel index tariffs. Final custom duties dependent on target HTS Codes at import port of entry.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
