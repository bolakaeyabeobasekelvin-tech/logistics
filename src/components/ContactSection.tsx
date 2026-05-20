import React, { useState } from "react";
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  Building, 
  ShieldCheck, 
  ExternalLink 
} from "lucide-react";

export default function ContactSection() {
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [topic, setTopic] = useState("customs");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim() || !message.trim()) return;

    // Simulate ticketing generation
    const randomTicket = `TX-SRV-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketNumber(randomTicket);
    setIsSent(true);

    // Clear form
    setNameInput("");
    setEmailInput("");
    setPhoneInput("");
    setMessage("");
  };

  return (
    <div className="space-y-8">
      
      {/* Visual Header Banner */}
      <div className="bg-gradient-to-r from-neutral-800 to-neutral-950 text-white rounded-2xl border border-neutral-800 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            Transatlantic Support Gateways
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-2 pb-1">Get in Touch with our Cargo Specialists</h2>
          <p className="text-neutral-400 text-xs">Assisting transatlantic dispatch inquiries, HAZMAT listings, and global tariff clearances 24/7.</p>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-2.5 bg-neutral-900 border border-neutral-800 p-3 rounded-xl shadow-inner col-span-1">
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <PhoneCall className="w-4 h-4" />
            </span>
            <div>
              <p className="text-[9px] text-neutral-500 font-bold uppercase">Customer Helpline (US)</p>
              <a href="tel:260-270-7501" className="text-xs font-mono font-black text-white hover:text-emerald-400 transition">
                260-270-7501
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-neutral-900 border border-neutral-800 p-3 rounded-xl shadow-inner col-span-1">
            <span className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Mail className="w-4 h-4" />
            </span>
            <div>
              <p className="text-[9px] text-neutral-500 font-bold uppercase font-sans">Official Communications</p>
              <a href="mailto:ship@transatlanticexpress.com" className="text-xs font-mono font-black text-white hover:text-blue-400 transition">
                ship@transatlanticexpress.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Contact Form column */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-4">
          
          <h3 className="text-xs font-extrabold text-neutral-950 uppercase tracking-widest border-b border-neutral-150 pb-2 flex items-center gap-1.5">
            <Send className="w-4 h-4 text-emerald-600" />
            <span>Send Secure Electronic Service Query</span>
          </h3>

          {isSent ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3.5 text-center">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-emerald-950 uppercase tracking-wider">Inquiry Standard logged successfully</h4>
                <p className="text-neutral-550 text-xs mt-0.5">
                  We have queued your dispatch file for reviewing. A cargo analyst will reach out within 45 minutes.
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-100 max-w-xs mx-auto">
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Generated Support Ticket</p>
                <p className="text-xs font-mono font-black text-neutral-900 mt-1">{ticketNumber}</p>
              </div>

              <button
                onClick={() => setIsSent(false)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline block mx-auto cursor-pointer"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Corporate Representative</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-950 focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500 outline-none transition"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Business Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@company.com"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-950 focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500 outline-none transition"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Contact Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="e.g. 260-270-7501"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-950 focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500 outline-none transition font-mono"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Topic Classification</label>
                  <select
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-950 focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500 outline-none transition cursor-pointer"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  >
                    <option value="customs">Customs Duties & Section 321</option>
                    <option value="cargo">Ocean-Freight booking container</option>
                    <option value="complaints">Tracking & Location discrepancy</option>
                    <option value="partner">GMB Partner Carrier integrations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Detailed Message Manifest</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail your dimensions, cargo type, HS Code or specific support issue here..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-950 focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500 outline-none transition resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-neutral-950 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition cursor-pointer shadow-sm"
              >
                Log Electronic inquiry
              </button>
            </form>
          )}

          <div className="flex items-center gap-1.5 p-3.5 bg-neutral-50 rounded-xl text-[10.5px] text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Communications are encrypted and compliant with CCPA standards.</span>
          </div>

        </div>

        {/* Locations List column */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-neutral-950 uppercase tracking-widest border-b border-neutral-150 pb-2 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-neutral-600" />
              <span>Physical Terminal Hubs Directory</span>
            </h3>

            <div className="space-y-4 font-sans text-xs">
              
              {/* United Kingdom LHR Location */}
              <div className="p-4 bg-neutral-50/50 border border-neutral-150 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-neutral-900 uppercase text-[11px] tracking-wider">UK Head Office Depot</span>
                  <span className="bg-blue-50 text-blue-600 font-mono text-[9px] px-1.5 py-0.5 rounded font-black">LHR GATEWAY</span>
                </div>
                <hr className="border-neutral-200 border-dashed" />
                <p className="text-neutral-600 font-medium">SLOUGH DEPOT ASSEMBLY FACILITY</p>
                <div className="flex items-start gap-1 text-neutral-500 text-[11px] mt-1.5 scale-95 origin-left">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-neutral-450 mt-0.5" />
                  <span>Colnbrook, Slough SL3 0ED, London Heathrow Area, UK</span>
                </div>
                <div className="flex items-center gap-1 text-neutral-500 text-[11px] mt-1 scale-95 origin-left">
                  <Clock className="w-3.5 h-3.5 shrink-0 text-neutral-450" />
                  <span>Mon - Fri: 08:00 - 18:30 (GMT)</span>
                </div>
              </div>

              {/* United States COR Location */}
              <div className="p-4 bg-neutral-50/50 border border-neutral-150 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-neutral-900 uppercase text-[11px] tracking-wider">US Consolidated Gateway</span>
                  <span className="bg-red-50 text-red-650 font-mono text-[9px] px-1.5 py-0.5 rounded font-black">ORD DEPOT</span>
                </div>
                <hr className="border-neutral-200 border-dashed" />
                <p className="text-neutral-600 font-medium">CHICAGO MIDWEST WAREHOUSE</p>
                <div className="flex items-start gap-1 text-neutral-500 text-[11px] mt-1.5 scale-95 origin-left">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-neutral-450 mt-0.5" />
                  <span>Bensenville Industrial Park, Chicago O'Hare Area, IL 60106, US</span>
                </div>
                <div className="flex items-center gap-1 text-neutral-500 text-[11px] mt-1 scale-95 origin-left">
                  <Clock className="w-3.5 h-3.5 shrink-0 text-neutral-450" />
                  <span>Mon - Fri: 07:30 - 18:00 (CST)</span>
                </div>
              </div>

            </div>
          </div>

          <div className="p-4 bg-neutral-900 text-white rounded-xl space-y-1 p-3 flex flex-col justify-between">
            <p className="text-[10px] text-neutral-500 font-bold uppercase">GMB Broker Network Verification</p>
            <p className="text-xs text-neutral-300">Operations run securely with Transglobal Express Ltd logistics terminals (Slough & Bensenville locations).</p>
            <a 
              href="https://www.transglobalexpress.co.uk" 
              target="_blank" 
              rel="noopener"
              className="text-[10px] text-emerald-400 font-bold hover:underline inline-flex items-center gap-1 mt-2 font-sans uppercase tracking-wider"
            >
              <span>Visit Partner Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
