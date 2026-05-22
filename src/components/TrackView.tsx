import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Calendar, Scale, Box, Check, FileText, Truck, ArrowRight, ShieldCheck, Map, Clock, AlertCircle } from 'lucide-react';
import { Shipment, ShipmentStatus } from '../types';

interface TrackViewProps {
  currentTrackingId: string;
  onSearch: (trackingId: string | '') => void;
  availableShipments: Shipment[];
}

// Order of shipment stages
const STAGES: { key: ShipmentStatus; label: string; desc: string }[] = [
  { key: 'received', label: 'Cargo Received', desc: 'Manifested & scanned' },
  { key: 'transit', label: 'In Transit', desc: 'En route via carrier' },
  { key: 'customs', label: 'Customs Clearance', desc: 'Import/Export customs gateway' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Dispatch onto last-mile carrier' },
  { key: 'delivered', label: 'Signed Delivery', desc: 'Completed and verified signature' }
];

export default function TrackView({ currentTrackingId, onSearch, availableShipments }: TrackViewProps) {
  const [searchVal, setSearchVal] = useState(currentTrackingId);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle outside search prop updates
  useEffect(() => {
    setSearchVal(currentTrackingId);
    if (currentTrackingId) {
      const match = availableShipments.find(
        s => s.id.toUpperCase() === currentTrackingId.trim().toUpperCase()
      );
      if (match) {
        if (match.visibility === 'hidden') {
          setSelectedShipment(null);
          setErrorMessage('Target shipment is currently deactivated by the administrator cargo control panel.');
        } else {
          setSelectedShipment(match);
          setErrorMessage('');
        }
      } else {
        setSelectedShipment(null);
        setErrorMessage('Tracking number not found. Verify code format or contact dispatch.');
      }
    } else {
      setSelectedShipment(null);
      setErrorMessage('');
    }
  }, [currentTrackingId, availableShipments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) {
      setErrorMessage('Please enter a custom tracking number code.');
      return;
    }
    onSearch(searchVal.trim());
  };

  // Get index of current status in the stages list
  const getCurrentStageIndex = (status: ShipmentStatus): number => {
    return STAGES.findIndex(s => s.key === status);
  };

  // Helper to draw a mock route simulator dynamically
  const drawRoutePath = (shipment: Shipment) => {
    const stageIdx = getCurrentStageIndex(shipment.status);
    const totalStages = STAGES.length - 1;
    const percentage = totalStages > 0 ? (stageIdx / totalStages) * 100 : 0;
    
    return (
      <div className="relative h-2 bg-slate-200 rounded-full mt-6">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-500 to-sky-600 rounded-full transition-all duration-700 ease-out-back"
          style={{ width: `${percentage}%` }}
        />
        {/* Glowing node at active coordinates */}
        <div 
          className="absolute -top-1.5 w-5 h-5 bg-sky-500 rounded-full shadow-lg shadow-sky-400/40 border-4 border-white transition-all duration-700"
          style={{ left: `calc(${percentage}% - 10px)` }}
        >
          <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pb-24 space-y-12">
      {/* Upper header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest text-sky-600 font-semibold font-sans">CARGO AUDITING PORTAL</span>
        <h1 className="text-3xl font-bold text-slate-900 font-sans tracking-tight">Active Freight Tracking</h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Enter your global tracking ID below to check live carrier records, estimated port release, and container historical scans.
        </p>
      </div>

      {/* Tracker Search Form */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-3xl border border-slate-100 shadow-xl">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter active tracking key (e.g. US-9482-9018, US-3810-7749)..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500/25 font-mono text-sm tracking-widest uppercase transition"
            />
          </div>
          <button
            type="submit"
            className="bg-slate-950 hover:bg-slate-900 text-white font-sans font-semibold px-8 py-4 rounded-2xl transition duration-150 text-sm uppercase tracking-wide shrink-0"
          >
            Locate Container
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-rose-800 text-xs sm:text-sm font-semibold">Logistics Clearance Alert</p>
              <p className="text-rose-600 text-[11px] sm:text-xs mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Quick Selections */}
        {!selectedShipment && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Operational Demo Systems</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {availableShipments.filter(s => s.visibility !== 'hidden').map((shipment) => (
                <button
                  key={shipment.id}
                  onClick={() => {
                    setSearchVal(shipment.id);
                    onSearch(shipment.id);
                  }}
                  className="p-3 bg-slate-50 hover:bg-sky-50 rounded-xl border border-slate-100 hover:border-sky-200 transition text-left cursor-pointer flex flex-col justify-between"
                >
                  <span className="font-mono text-xs font-dm font-bold text-slate-800 tracking-wider block">{shipment.id}</span>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                    <span className="font-sans">{shipment.originCity} ➜ {shipment.destinationCity}</span>
                    <span className="font-semibold uppercase text-sky-600 font-mono">{shipment.status.replace('_', ' ')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {selectedShipment && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left: General Tracker Details Card & Stages Timeline */}
            <div className="lg:col-span-8 space-y-8">
              {/* Main Timeline Card */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-8">
                {/* Upper tracking bar identifier */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-50 gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">Active Shipment Tracking Key</span>
                    <h3 className="text-2xl font-bold font-mono text-slate-900 tracking-wide">{selectedShipment.id}</h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 text-xs font-mono font-bold uppercase rounded-full ${
                      selectedShipment.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                      selectedShipment.status === 'out_for_delivery' ? 'bg-orange-50 text-orange-700' :
                      selectedShipment.status === 'customs' ? 'bg-indigo-50 text-indigo-700' : 'bg-sky-50 text-sky-700'
                    }`}>
                      • {selectedShipment.status.replace(/_/g, ' ')}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-mono rounded-full">
                      {selectedShipment.carrier}
                    </span>
                  </div>
                </div>

                {/* Progress bar and timeline stations */}
                <div className="space-y-6">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Shipment Milestone Timeline</h4>
                  
                  {/* Graphical Line */}
                  {drawRoutePath(selectedShipment)}

                  {/* Milestones list (Interactive visual) */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 pt-4">
                    {STAGES.map((stage, sIdx) => {
                      const currentActiveIdx = getCurrentStageIndex(selectedShipment.status);
                      const isCompleted = sIdx <= currentActiveIdx;
                      const isCurrent = sIdx === currentActiveIdx;

                      return (
                        <div 
                          key={stage.key} 
                          className={`flex sm:flex-col gap-3 p-3 rounded-2xl border transition duration-200 ${
                            isCurrent ? 'bg-sky-50/70 border-sky-200/80 shadow-xs' : 
                            isCompleted ? 'bg-slate-50/80 border-slate-100' : 'bg-transparent border-dashed border-slate-200 opacity-60'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isCompleted ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {isCompleted ? <Check className="w-4 h-4 text-slate-950 stroke-[3px]" /> : <span className="text-[10px] font-mono font-bold">{sIdx + 1}</span>}
                          </div>

                          <div className="space-y-0.5">
                            <p className={`text-xs font-bold font-sans ${isCurrent ? 'text-sky-950 font-extrabold' : 'text-slate-800'}`}>
                              {stage.label}
                            </p>
                            <p className="text-[10px] text-slate-500 leading-normal">{stage.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Cargo Route Mapping Simulation */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Map className="w-4 h-4 text-sky-500" /> Interactive Route Indicator
                  </h4>

                  <div className="bg-slate-950 rounded-2xl p-6 relative overflow-hidden text-white border border-slate-800">
                    {/* SVG Map Path Drawing */}
                    <div className="absolute inset-0 z-0 opacity-10">
                      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">DEPOT ORIGIN</span>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-emerald-400" />
                          <div>
                            <p className="text-sm font-bold">{selectedShipment.originCity}</p>
                            <p className="text-[10px] text-slate-400 font-mono uppercase">{selectedShipment.originCountry}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center flex-1 justify-center space-y-1">
                        <span className="text-[9px] font-mono text-sky-400 uppercase tracking-widest">Active Dispatch Corridor</span>
                        <div className="flex items-center gap-3 w-full max-w-[180px] justify-center">
                          <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                          <span className="h-0.5 border-t border-dashed border-sky-500 flex-1"></span>
                          <span className="w-3 h-3 rounded-full bg-sky-500 animate-pulse"></span>
                          <span className="h-0.5 border-t border-dashed border-slate-600 flex-1"></span>
                          <span className="w-3 h-3 rounded-full bg-slate-600"></span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-300 mt-1">{selectedShipment.shippingMethod}</span>
                      </div>

                      <div className="space-y-2 text-right">
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">TERMINAL DESTINATION</span>
                        <div className="flex items-center gap-2 justify-end">
                          <div>
                            <p className="text-sm font-bold">{selectedShipment.destinationCity}</p>
                            <p className="text-[10px] text-slate-400 font-mono uppercase">{selectedShipment.destinationCountry}</p>
                          </div>
                          <MapPin className="w-5 h-5 text-sky-400" />
                        </div>
                      </div>
                    </div>

                    {/* Simulation logs overlay */}
                    <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px]">CURRENT BEACON</span>
                        <span className="text-sky-300 font-semibold">{selectedShipment.carrier}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">ETA DELIVERY</span>
                        <span className="text-white font-semibold">{selectedShipment.estimatedDelivery}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">WEIGHT METRIC</span>
                        <span className="text-slate-300 font-semibold">{selectedShipment.weight} lbs</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">CARGO VALUE</span>
                        <span className="text-emerald-400 font-semibold">${selectedShipment.cargoValue?.toLocaleString() || 'N/A'} USD</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scan History Log Details */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="text-sm font-bold text-slate-900 font-sans tracking-tight uppercase tracking-widest text-slate-400">Hub Audit Scans ({selectedShipment.history.length})</h3>
                
                <div className="space-y-6 relative border-l border-slate-100 pl-4 py-2">
                  {selectedShipment.history.map((log, lIdx) => (
                    <div key={log.id} className="relative group">
                      {/* Hub node status */}
                      <span className="absolute -left-6.5 top-1 w-4 h-4 rounded-full bg-white border-2 border-slate-300 group-hover:border-sky-500 transition" />
                      
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-1">
                          <span className="font-bold text-slate-800 font-sans">{log.location}</span>
                          <span className="text-slate-450 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{log.description}</p>
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 font-mono text-[9px] rounded uppercase font-semibold">
                          {log.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Core Manifest Panel & Warehouse Rules */}
            <div className="lg:col-span-4 space-y-8">
              {/* Manifest checklist card */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
                  <FileText className="w-5 h-5 text-sky-500" />
                  <h4 className="font-bold text-slate-950 text-sm font-sans tracking-tight">Cargo Manifest Invoice</h4>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-sans">Sender</span>
                    <span className="text-slate-800 font-semibold font-sans text-right max-w-[150px] truncate">{selectedShipment.senderName}</span>
                  </div>
                  <div className="py-2 border-b border-slate-50 space-y-1">
                    <span className="text-slate-400 block font-sans">Sender Dispatch Point</span>
                    <span className="text-slate-600 font-sans text-[11px] block leading-normal">{selectedShipment.senderAddress}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-sans">Consignee</span>
                    <span className="text-slate-800 font-semibold font-sans text-right max-w-[150px] truncate">{selectedShipment.receiverName}</span>
                  </div>
                  <div className="py-2 border-b border-slate-50 space-y-1">
                    <span className="text-slate-400 block font-sans">Delivery Destination</span>
                    <span className="text-slate-600 font-sans text-[11px] block leading-normal">{selectedShipment.receiverAddress}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-sans">Package Weight</span>
                    <span className="text-slate-800 font-mono font-bold">{selectedShipment.weight} lbs</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-sans">Box Dimensions</span>
                    <span className="text-slate-800 font-mono">{selectedShipment.dimensions}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-[11px] border border-slate-105">
                    <span className="text-slate-400 block font-mono font-bold">CARRIER NOTES / INSTRUCTIONS</span>
                    <p className="text-slate-600 leading-normal italic font-sans">
                      {selectedShipment.notes || 'Routine commerce handling. Check seal integrity upon delivery handoff.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Secure Delivery Info */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm space-y-4 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm tracking-tight text-white font-sans">Protected Cargo Bond</h4>
                <p className="text-slate-350 text-xs leading-relaxed font-sans">
                  This parcel transit status is securely registered with specialized USA import brokerages. To file an insurance variance or dispute carrier logs, reference registration code:
                </p>
                <code className="block bg-slate-950 p-2.5 rounded-lg text-emerald-400 font-mono text-[10px] text-center border border-slate-800 tracking-wider">
                  REG_FMC_{selectedShipment.id.replace(/-/g, '_')}
                </code>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
