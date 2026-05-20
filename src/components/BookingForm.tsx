import React, { useState } from "react";
import { SenderInfo, ReceiverInfo, ParcelDetails, LocalizationConfig, QuoteOption } from "../types";
import { FileText, Clipboard, ChevronRight, CheckCircle2, AlertCircle, Info, ShieldAlert, Check } from "lucide-react";

interface BookingFormProps {
  onBookingSuccess: (trackingNumber: string) => void;
  prefilledQuote: { 
    quote: QuoteOption; 
    originCity: string; 
    destCity: string; 
    weight: number; 
    value: number; 
  } | null;
  localization: LocalizationConfig;
}

export default function BookingForm({ onBookingSuccess, prefilledQuote, localization }: BookingFormProps) {
  const [senderInfo, setSenderInfo] = useState<SenderInfo>({
    fullName: "James Jerry",
    company: "Transatlantic Export Hub",
    email: "jamesjerry2060@gmail.com",
    phone: "260-270-7501",
    street: "24 Covent Garden High St",
    city: prefilledQuote?.originCity || (localization.region === "UK" ? "London" : "Chicago"),
    postalCode: localization.region === "UK" ? "WC2E 8HD" : "60666",
    country: localization.region === "UK" ? "United Kingdom" : "United States"
  });

  const [receiverInfo, setReceiverInfo] = useState<ReceiverInfo>({
    fullName: "Elizabeth Carter",
    company: "East Coast Distributing Logistics",
    email: "carter.dist@gmail.com",
    phone: "312-555-0144",
    street: "32 Fifth Avenue Suite 404",
    city: prefilledQuote?.destCity || (localization.region === "UK" ? "New York" : "London"),
    postalCode: localization.region === "UK" ? "10001" : "EC1A 1BB",
    country: localization.region === "UK" ? "United States" : "United Kingdom"
  });

  const [parcelDetails, setParcelDetails] = useState<ParcelDetails>({
    weight: prefilledQuote?.weight.toString() || "12.5",
    length: "35",
    width: "25",
    height: "20",
    value: prefilledQuote?.value.toString() || "450",
    description: "Premium commercial components in standard export grade cardboards"
  });

  const [speed, setSpeed] = useState<string>(prefilledQuote?.quote.speed || "Standard");
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successInfo, setSuccessInfo] = useState<{ id: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!declarationAccepted) {
      setErrorMsg("Consent Required: You must verify standard US CBP & UK HMRC customs export control terms before submitting.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: senderInfo,
          receiver: receiverInfo,
          parcel: parcelDetails,
          speed,
          declarationAccepted: true
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to register cargo parcel booking.");
      }

      setSuccessInfo({ id: data.trackingNumber });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Unknown error processing flight cargo registers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handoffToMap = () => {
    if (successInfo) {
      onBookingSuccess(successInfo.id);
      // reset success state
      setSuccessInfo(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-neutral-50 to-neutral-100/50 border-b border-neutral-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 leading-snug">
              Secure Transatlantic Sea & Air Booking Portal
            </h2>
            <p className="text-neutral-505 text-xs mt-0.5">
              Integrated with GMB-Registered **Transglobal Express** Agency customs dispatch routing.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {successInfo ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center shadow-inner max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <p className="text-emerald-950 font-black text-xl tracking-tight leading-none">Shipment Booking Confirmed!</p>
              <p className="text-emerald-700 text-xs mt-1.5 font-medium">
                Customs pre-clearance registered via Transglobal Express dispatch network.
              </p>
            </div>

            <div className="bg-white p-4 border border-emerald-100 rounded-xl max-w-sm mx-auto space-y-1">
              <p className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase leading-none">Global Tracking Number</p>
              <p className="text-2xl font-mono font-black text-neutral-900 tracking-wider">
                {successInfo.id}
              </p>
              <p className="text-[9px] text-neutral-500 pt-1 leading-normal italic">
                Manifest recorded with reference code for US FDA clearance and UK HMRC relief claims.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handoffToMap}
                className="w-full sm:w-auto bg-neutral-950 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition shadow flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <span>Track Cargo Live on Map</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {prefilledQuote && (
              <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-800 flex items-center justify-between">
                <div>
                  <span className="font-bold">Prefilled from Calculator:</span> {prefilledQuote.originCity} to {prefilledQuote.destCity} ({prefilledQuote.weight} {localization.weightUnit}, {localization.currency === "GBP" ? "£" : "$"}{prefilledQuote.quote.cost} total).
                </div>
                <button 
                  type="button" 
                  onClick={() => setSpeed(prefilledQuote.quote.speed)}
                  className="text-[11px] font-bold underline text-blue-900 hover:text-neutral-900"
                >
                  Match Speed Configuration
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Shipper Column */}
              <div className="space-y-3 p-4 bg-neutral-50/50 rounded-xl border border-neutral-150">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1.5 flex justify-between">
                  <span>1. Shipper Information (Origin)</span>
                  <span className="text-blue-600 font-normal normal-case">{senderInfo.country}</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Contact Name</label>
                    <input
                      type="text" required
                      className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none"
                      value={senderInfo.fullName}
                      onChange={(e) => setSenderInfo({...senderInfo, fullName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Company Office</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none"
                      value={senderInfo.company}
                      onChange={(e) => setSenderInfo({...senderInfo, company: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Corporate Email</label>
                    <input
                      type="email" required
                      className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none"
                      value={senderInfo.email}
                      onChange={(e) => setSenderInfo({...senderInfo, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Phone (excl. Int'l)</label>
                    <input
                      type="text" required
                      className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none"
                      value={senderInfo.phone}
                      onChange={(e) => setSenderInfo({...senderInfo, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Warehouse Street Address</label>
                  <input
                    type="text" required
                    className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none"
                    value={senderInfo.street}
                    onChange={(e) => setSenderInfo({...senderInfo, street: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">City / Depot</label>
                    <input
                      type="text" required
                      className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none"
                      value={senderInfo.city}
                      onChange={(e) => setSenderInfo({...senderInfo, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Post / ZIP Code</label>
                    <input
                      type="text" required
                      className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none"
                      value={senderInfo.postalCode}
                      onChange={(e) => setSenderInfo({...senderInfo, postalCode: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Country Region</label>
                  <select
                    className="w-full bg-white border border-neutral-200 rounded-lg px-2 py-1.5 text-xs text-neutral-900 outline-none"
                    value={senderInfo.country}
                    onChange={(e) => {
                      const sel = e.target.value as "United Kingdom" | "United States";
                      setSenderInfo({...senderInfo, country: sel});
                      // Set recipient to alternative by default
                      setReceiverInfo({...receiverInfo, country: sel === "United Kingdom" ? "United States" : "United Kingdom"});
                    }}
                  >
                    <option value="United Kingdom">United Kingdom (UK HMRC Out)</option>
                    <option value="United States">United States (US CBP Out)</option>
                  </select>
                </div>

              </div>

              {/* Consignee Column */}
              <div className="space-y-3 p-4 bg-neutral-50/50 rounded-xl border border-neutral-150">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1.5 flex justify-between">
                  <span>2. Consignee Information (Recipient)</span>
                  <span className="text-red-600 font-normal normal-case">{receiverInfo.country}</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Receiver Full Name</label>
                    <input
                      type="text" required
                      className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none"
                      value={receiverInfo.fullName}
                      onChange={(e) => setReceiverInfo({...receiverInfo, fullName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Receiving Brand / Corp</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none"
                      value={receiverInfo.company}
                      onChange={(e) => setReceiverInfo({...receiverInfo, company: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Consignee Email</label>
                    <input
                      type="email" required
                      className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none"
                      value={receiverInfo.email}
                      onChange={(e) => setReceiverInfo({...receiverInfo, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Receiving Phone</label>
                    <input
                      type="text" required
                      className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none"
                      value={receiverInfo.phone}
                      onChange={(e) => setReceiverInfo({...receiverInfo, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Delivery Destination Address</label>
                  <input
                    type="text" required
                    className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none"
                    value={receiverInfo.street}
                    onChange={(e) => setReceiverInfo({...receiverInfo, street: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Target Destination City</label>
                    <input
                      type="text" required
                      className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none"
                      value={receiverInfo.city}
                      onChange={(e) => setReceiverInfo({...receiverInfo, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Receiver Post/Zip Code</label>
                    <input
                      type="text" required
                      className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none"
                      value={receiverInfo.postalCode}
                      onChange={(e) => setReceiverInfo({...receiverInfo, postalCode: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">Target Country Region</label>
                  <select
                    disabled
                    className="w-full bg-neutral-200/50 border border-neutral-200 rounded-lg px-2 py-1.5 text-xs text-neutral-600 outline-none cursor-not-allowed"
                    value={receiverInfo.country}
                  >
                    <option value="United States">United States (US CBP In)</option>
                    <option value="United Kingdom">United Kingdom (UK HMRC In)</option>
                  </select>
                </div>

              </div>

            </div>

            {/* Parcel Details Section */}
            <div className="p-4 bg-neutral-50/50 border border-neutral-150 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1.5">
                3. Parcel Cargo Metrics & Value Declarations
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-0.5">
                    Gross Weight ({localization.weightUnit})
                  </label>
                  <input
                    type="number" required min="0.1" step="0.1"
                    className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none shadow-sm"
                    value={parcelDetails.weight}
                    onChange={(e) => setParcelDetails({...parcelDetails, weight: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-0.5">
                    Customs Value ({localization.currency === "GBP" ? "GBP £" : "USD $"})
                  </label>
                  <input
                    type="number" required min="1"
                    className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none shadow-sm"
                    value={parcelDetails.value}
                    onChange={(e) => setParcelDetails({...parcelDetails, value: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-0.5">
                    Transit Method Speed
                  </label>
                  <select
                    className="w-full bg-white border border-neutral-200 rounded-lg px-2 py-1.5 text-xs text-neutral-900 outline-none"
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                  >
                    <option value="Express">Express Air Jet (2 Days)</option>
                    <option value="Standard">Standard Consolidated Air (5 Days)</option>
                    <option value="Economy">Economy LCL Ocean Liner (14 Days)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-0.5">
                    Linear Dimensions ({localization.dimensionUnit})
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    <input
                      type="text" required placeholder="L"
                      className="w-full bg-white border border-neutral-200 rounded-md px-1.5 py-1.5 text-center text-xs text-neutral-900 outline-none"
                      value={parcelDetails.length}
                      onChange={(e) => setParcelDetails({...parcelDetails, length: e.target.value})}
                    />
                    <input
                      type="text" required placeholder="W"
                      className="w-full bg-white border border-neutral-200 rounded-md px-1.5 py-1.5 text-center text-xs text-neutral-900 outline-none"
                      value={parcelDetails.width}
                      onChange={(e) => setParcelDetails({...parcelDetails, width: e.target.value})}
                    />
                    <input
                      type="text" required placeholder="H"
                      className="w-full bg-white border border-neutral-200 rounded-md px-1.5 py-1.5 text-center text-xs text-neutral-900 outline-none"
                      value={parcelDetails.height}
                      onChange={(e) => setParcelDetails({...parcelDetails, height: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-0.5">Goods description & contents</label>
                <input
                  type="text" required
                  className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none"
                  value={parcelDetails.description}
                  onChange={(e) => setParcelDetails({...parcelDetails, description: e.target.value})}
                />
              </div>

            </div>

            {/* Customs Declaration Accordion */}
            <div className="p-4 bg-amber-50/40 border border-amber-200/60 rounded-xl space-y-3 text-xs text-amber-950">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-bold text-amber-950 uppercase tracking-wider">HMRC UK Outward & CBP US Civil Import Controls Guidelines</h4>
                  <p className="text-amber-900 leading-normal">
                    You are certifying that this container record contains no dangerous goods or restricted substances (including commercial lithium-ion batteries, liquid alcohol over proof limits without licensing, or animal derivatives that violate sanitary checks).
                  </p>
                  
                  <label className="flex items-start gap-2.5 mt-2 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 accent-emerald-600 w-4 h-4 rounded"
                      checked={declarationAccepted}
                      onChange={(e) => setDeclarationAccepted(e.target.checked)}
                    />
                    <span className="text-amber-900 leading-snug font-medium">
                      I hereby verify this booking declaration is valid, conforming to US Section 321 exemptions & UK Data Protection Act tracking consents. I authorize GMB partner **Transglobal Express Ltd** as my outward clearing agency broker.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-neutral-950 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition shadow cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Submitting Transatlantic Cargo entry..." : "Confirm Transatlantic booking"}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
