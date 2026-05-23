import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Edit2, Trash2, Eye, EyeOff, CheckCircle2, AlertTriangle, 
  Settings, User, Landmark, Weight, FileText, Sparkles, Database, 
  RotateCcw, History, Search, ArrowRight, Tag, Activity, Calendar
} from 'lucide-react';
import { Shipment, ShipmentStatus, CarrierType, ShippingMethod } from '../types';

interface OnlinePanelViewProps {
  shipments: Shipment[];
  onUpdateShipments: (updatedList: Shipment[]) => void;
  onResetShipments: () => void;
}

const CARRIERS: CarrierType[] = [
  'Apex Logistics',
  'FedEx',
  'DHL Global',
  'UPS Transport',
  'USPS Priority',
  'Oceanic Cargo',
  'Swift Express Cargo'
];

const METHODS: ShippingMethod[] = [
  'Ground Transport',
  'Express Delivery',
  'Air Freight',
  'Sea Cargo'
];

const STATUSES: { value: ShipmentStatus; label: string }[] = [
  { value: 'received', label: 'Received & Manifested' },
  { value: 'transit', label: 'In Transit' },
  { value: 'customs', label: 'Customs Hold / Review' },
  { value: 'out_for_delivery', label: 'Out for Local Delivery' },
  { value: 'delivered', label: 'Completed Delivery' }
];

export default function OnlinePanelView({ shipments, onUpdateShipments, onResetShipments }: OnlinePanelViewProps) {
  // Navigation / Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Shipment Form Fields
  const [newId, setNewId] = useState('');
  const [newSender, setNewSender] = useState('');
  const [newSenderAddr, setNewSenderAddr] = useState('');
  const [newSenderEmail, setNewSenderEmail] = useState('');
  const [newReceiver, setNewReceiver] = useState('');
  const [newReceiverAddr, setNewReceiverAddr] = useState('');
  const [newReceiverEmail, setNewReceiverEmail] = useState('');
  const [newOriginCity, setNewOriginCity] = useState('');
  const [newOriginCountry, setNewOriginCountry] = useState('USA');
  const [newDestCity, setNewDestCity] = useState('');
  const [newDestCountry, setNewDestCountry] = useState('USA');
  const [newStatus, setNewStatus] = useState<ShipmentStatus>('received');
  const [newCarrier, setNewCarrier] = useState<CarrierType>('Apex Logistics');
  const [newMethod, setNewMethod] = useState<ShippingMethod>('Ground Transport');
  const [newWeight, setNewWeight] = useState(25);
  const [newDims, setNewDims] = useState('12x12x12 in');
  const [newEstDelivery, setNewEstDelivery] = useState('2026-05-30');
  const [newCargoValue, setNewCargoValue] = useState(1500);
  const [newNotes, setNewNotes] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // New Historical Scan Log Fields (For the shipment being edited)
  const [newLogLocation, setNewLogLocation] = useState('');
  const [newLogDesc, setNewLogDesc] = useState('');
  const [newLogStatus, setNewLogStatus] = useState<ShipmentStatus>('received');

  // Trigger random formatted tracking code creation
  const generateRandomTrackingId = () => {
    const r1 = Math.floor(1000 + Math.random() * 9000);
    const r2 = Math.floor(1000 + Math.random() * 9000);
    setNewId(`US-${r1}-${r2}`);
  };

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    const trackingKey = (newId.trim() || `US-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`).toUpperCase();
    
    // Check duplication
    if (shipments.some(s => s.id.toUpperCase() === trackingKey.toUpperCase())) {
      alert(`Cargo tracking code "${trackingKey}" is already registered in the system.`);
      return;
    }

    const created: Shipment = {
      id: trackingKey,
      senderName: newSender || 'Default Sender Co.',
      senderAddress: newSenderAddr || '100 Main St, Austin, TX',
      senderEmail: newSenderEmail || '',
      receiverName: newReceiver || 'Default Recipient Corp',
      receiverAddress: newReceiverAddr || '500 Center Blvd, Los Angeles, CA',
      receiverEmail: newReceiverEmail || '',
      originCity: newOriginCity || 'Austin',
      originCountry: newOriginCountry || 'USA',
      destinationCity: newDestCity || 'Los Angeles',
      destinationCountry: newDestCountry || 'USA',
      status: newStatus,
      carrier: newCarrier,
      shippingMethod: newMethod,
      weight: Number(newWeight) || 10,
      dimensions: newDims || '10x10x10 in',
      estimatedDelivery: newEstDelivery || '2026-06-01',
      isActive: true,
      visibility: 'visible',
      cargoValue: Number(newCargoValue) || 1000,
      notes: newNotes,
      email: newEmail,
      history: [
        {
          id: `h-init-${Date.now()}`,
          timestamp: new Date().toISOString(),
          location: `${newOriginCity || 'Austin'} Terminal, USA`,
          description: 'Shipment recorded and queued into the WooCommerce Cargo Network.',
          status: newStatus
        }
      ]
    };

    const updated = [created, ...shipments];
    onUpdateShipments(updated);
    
    // Reset Add fields
    setNewId('');
    setNewSender('');
    setNewSenderAddr('');
    setNewSenderEmail('');
    setNewReceiver('');
    setNewReceiverAddr('');
    setNewReceiverEmail('');
    setNewOriginCity('');
    setNewDestCity('');
    setNewNotes('');
    setNewEmail('');
    setShowAddForm(false);
  };

  const handleDeleteShipment = (id: string) => {
    if (confirm(`Are you sure you want to delete tracking number ${id}? This cannot be undone.`)) {
      const updated = shipments.filter(s => s.id !== id);
      onUpdateShipments(updated);
      if (editingShipment?.id === id) {
        setEditingShipment(null);
      }
    }
  };

  const handleToggleActive = (id: string) => {
    const updated = shipments.map(s => {
      if (s.id === id) {
        return { ...s, isActive: !s.isActive };
      }
      return s;
    });
    onUpdateShipments(updated);
  };

  const handleToggleVisibility = (id: string) => {
    const updated = shipments.map(s => {
      if (s.id === id) {
        return { ...s, visibility: s.visibility === 'visible' ? 'hidden' as const : 'visible' as const };
      }
      return s;
    });
    onUpdateShipments(updated);
  };

  // Submit edit panel changes
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShipment) return;

    const updated = shipments.map(s => {
      if (s.id === editingShipment.id) {
        return editingShipment;
      }
      return s;
    });

    onUpdateShipments(updated);
    setEditingShipment(null);
  };

  // Add custom manual history timestamp logs
  const handleAddNewHistoryLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShipment || !newLogLocation.trim() || !newLogDesc.trim()) {
      alert('Provide both location coordinates and standard scan comments.');
      return;
    }

    const newLogItem = {
      id: `h-manual-${Date.now()}`,
      timestamp: new Date().toISOString(),
      location: newLogLocation.trim(),
      description: newLogDesc.trim(),
      status: newLogStatus
    };

    // Prepend to current shipment editing history
    const updatedHistory = [newLogItem, ...editingShipment.history];
    const updatedShipment = { ...editingShipment, history: updatedHistory, status: newLogStatus };
    
    setEditingShipment(updatedShipment);

    // Also sync globally so it's live instantly
    const updatedGlobal = shipments.map(s => {
      if (s.id === editingShipment.id) {
        return updatedShipment;
      }
      return s;
    });
    onUpdateShipments(updatedGlobal);

    // Clear fields
    setNewLogLocation('');
    setNewLogDesc('');
  };

  const handleDeleteHistoryLog = (logId: string) => {
    if (!editingShipment) return;
    const filteredHistory = editingShipment.history.filter(h => h.id !== logId);
    
    const updatedShipment = { ...editingShipment, history: filteredHistory };
    setEditingShipment(updatedShipment);

    const updatedGlobal = shipments.map(s => {
      if (s.id === editingShipment.id) {
        return updatedShipment;
      }
      return s;
    });
    onUpdateShipments(updatedGlobal);
  };

  // Statistics summaries
  const totalWeight = shipments.reduce((sum, s) => sum + s.weight, 0);
  const activeCount = shipments.filter(s => s.isActive).length;
  const transitCount = shipments.filter(s => s.status === 'transit').length;
  const customsHoldCount = shipments.filter(s => s.status === 'customs').length;
  const totalValue = shipments.reduce((sum, s) => sum + (s.cargoValue || 0), 0);

  // Filtered lists
  const filteredShipments = shipments.filter(s => {
    const term = searchTerm.toLowerCase();
    return s.id.toLowerCase().includes(term) || 
           s.senderName.toLowerCase().includes(term) || 
           s.receiverName.toLowerCase().includes(term) ||
           s.originCity.toLowerCase().includes(term) ||
           s.destinationCity.toLowerCase().includes(term);
  });

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 space-y-12">
      {/* Admin Panel Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-slate-950 text-white rounded-3xl border border-slate-800 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-sky-500 text-slate-950 font-mono text-[10px] uppercase font-bold rounded">WooCommerce Cargo Core</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h1 className="text-3xl font-bold font-sans tracking-tight">Cargo Administration System</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Manage, edit, activate, and update customer shipment records and tracking metrics.</p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => {
              generateRandomTrackingId();
              setShowAddForm(true);
              setEditingShipment(null);
            }}
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-sans font-semibold text-xs py-3 px-5 rounded-xl cursor-pointer transition flex items-center gap-1.5 uppercase tracking-wide"
          >
            <Plus className="w-4 h-4" /> Add Tracking Number
          </button>
          
          <button
            onClick={onResetShipments}
            className="bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 font-mono text-xs py-3 px-4 rounded-xl cursor-pointer border border-slate-700/50 transition flex items-center gap-1.5"
            title="Reset to pre-seeded demo values"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Re-seed System Data
          </button>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: 'Registered Records', count: shipments.length, colorBg: 'bg-slate-100', textCol: 'text-slate-900', subtext: 'Total Database items' },
          { label: 'Active Shipments', count: activeCount, colorBg: 'bg-emerald-50', textCol: 'text-emerald-700', subtext: 'Pulsing search clients' },
          { label: 'Transiting Inland', count: transitCount, colorBg: 'bg-sky-50', textCol: 'text-sky-700', subtext: 'Moving over carrier channels' },
          { label: 'Customs Holds', count: customsHoldCount, colorBg: 'bg-indigo-50', textCol: 'text-indigo-700', subtext: 'At US/Foreign borders' },
          { label: 'Accumulated Value', count: `$${totalValue.toLocaleString()}`, colorBg: 'bg-amber-50', textCol: 'text-amber-800', subtext: 'Insured cargo sum' },
        ].map((met, idx) => (
          <div key={idx} className={`${met.colorBg} border border-slate-100/30 p-5 rounded-2xl flex flex-col justify-between shadow-xs transition hover:scale-[1.01]`}>
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">{met.label}</span>
            <div className="py-2">
              <span className={`text-2xl sm:text-3xl font-sans font-extrabold ${met.textCol}`}>{met.count}</span>
            </div>
            <span className="text-slate-400 text-[10px] block leading-normal mt-1">{met.subtext}</span>
          </div>
        ))}
      </div>

      {/* Main Grid content: Datatable & Edit/Create Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Dynamic Left: Tables and search */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-bold font-sans text-slate-900 text-lg flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-500" /> WooCommerce Shipment Registry
            </h3>

            {/* In-table Search box */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tracking, user, origin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:outline-hidden text-slate-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="py-3 px-2">Tracking Key</th>
                  <th className="py-3 px-2">Route Route</th>
                  <th className="py-3 px-2">Method / Carrier</th>
                  <th className="py-3 px-2">Milestone</th>
                  <th className="py-3 px-2 text-center">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-sans">
                {filteredShipments.length > 0 ? (
                  filteredShipments.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition duration-150 group">
                      {/* Tracking key with visual status */}
                      <td className="py-4 px-2 font-mono">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-950 tracking-wide text-xs">{s.id}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                            Val: ${s.cargoValue?.toLocaleString() || 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Cities & Users */}
                      <td className="py-4 px-2">
                        <div className="text-slate-800 font-medium">
                          {s.originCity} ➜ <span className="text-slate-950">{s.destinationCity}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[130px]" title={`Receiver: ${s.receiverName}`}>
                          Recv: {s.receiverName}
                        </div>
                      </td>

                      {/* Operator & Method */}
                      <td className="py-4 px-2 font-sans text-slate-500">
                        <div className="text-slate-800">{s.shippingMethod}</div>
                        <div className="text-[10px] font-mono text-slate-400">{s.carrier}</div>
                      </td>

                      {/* Status state */}
                      <td className="py-4 px-2 text-center whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase rounded-md ${
                          s.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                          s.status === 'out_for_delivery' ? 'bg-orange-50 text-orange-700' :
                          s.status === 'customs' ? 'bg-indigo-50 text-indigo-700' : 'bg-sky-55 text-sky-700'
                        }`}>
                          {s.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Controls (isActive, visibility) */}
                      <td className="py-4 px-2 text-center">
                        <div className="flex items-center justify-center gap-3">
                          {/* Active controller */}
                          <button
                            onClick={() => handleToggleActive(s.id)}
                            className={`p-1 rounded cursor-pointer transition ${
                              s.isActive ? 'text-emerald-600 hover:text-emerald-700' : 'text-slate-300 hover:text-slate-400'
                            }`}
                            title={s.isActive ? 'Shipment Active (Search Enabled)' : 'Shipment Deactivated'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          {/* Visibility controller */}
                          <button
                            onClick={() => handleToggleVisibility(s.id)}
                            className={`p-1 rounded cursor-pointer transition ${
                              s.visibility === 'visible' ? 'text-sky-600 hover:text-sky-700' : 'text-slate-350 hover:text-slate-500'
                            }`}
                            title={s.visibility === 'visible' ? 'Visible in Public tracking' : 'Hidden from searches'}
                          >
                            {s.visibility === 'visible' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>

                      {/* Tools edit/delete */}
                      <td className="py-4 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition">
                          <button
                            onClick={() => {
                              setEditingShipment({ ...s });
                              setShowAddForm(false);
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg transition cursor-pointer"
                            title="Edit details & Timeline logs"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteShipment(s.id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-1.5 rounded-lg transition cursor-pointer"
                            title="Remove tracking"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      No matching shipments found in the WooCommerce logistics database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Right: Panel contextual actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action 1: Registrar panel (Create) */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-2 border-sky-500/30 rounded-3xl p-6 shadow-xl space-y-6"
            >
              <div className="flex justify-between items-center pb-3 border-b border-rose-50">
                <h4 className="font-bold text-slate-900 font-sans tracking-tight text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-500" /> Register Core Cargo Item
                </h4>
                <button 
                  onClick={() => setShowAddForm(false)} 
                  className="text-xs text-slate-400 hover:text-slate-650 cursor-pointer font-bold font-sans"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleCreateShipment} className="space-y-4 text-xs">
                {/* ID Generator */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-slate-500 font-semibold font-sans uppercase text-[10px]">Cargo Tracking Key</label>
                    <button
                      type="button"
                      onClick={generateRandomTrackingId}
                      className="text-sky-600 hover:text-sky-700 font-medium text-[11px]"
                    >
                      (Auto Generate)
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. US-9012-4421"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    className="w-full bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-slate-900 font-mono text-[11px] uppercase tracking-wider"
                  />
                </div>

                {/* Sender Specifics */}
                <div className="space-y-2 p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider flex items-center gap-1"><User className="w-3.5 h-3.5" /> SENDER (CONSIGNOR)</span>
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="Sender/Company Name"
                      value={newSender}
                      onChange={(e) => setNewSender(e.target.value)}
                      className="w-full bg-white rounded-lg p-2 border border-slate-200 text-[11px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="Direct Address (City, State, Zip)"
                      value={newSenderAddr}
                      onChange={(e) => setNewSenderAddr(e.target.value)}
                      className="w-full bg-white rounded-lg p-2 border border-slate-200 text-[10px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <input
                      type="email"
                      placeholder="Sender Email Address"
                      value={newSenderEmail}
                      onChange={(e) => setNewSenderEmail(e.target.value)}
                      className="w-full bg-white rounded-lg p-2 border border-slate-200 text-[10px]"
                    />
                  </div>
                </div>

                {/* Receiver Specifics */}
                <div className="space-y-2 p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider flex items-center gap-1"><User className="w-3.5 h-3.5" /> RECEIVER (CONSIGNEE)</span>
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="Receiver/Customer Name"
                      value={newReceiver}
                      onChange={(e) => setNewReceiver(e.target.value)}
                      className="w-full bg-white rounded-lg p-2 border border-slate-200 text-[11px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="Delivery Address (City, State, Country)"
                      value={newReceiverAddr}
                      onChange={(e) => setNewReceiverAddr(e.target.value)}
                      className="w-full bg-white rounded-lg p-2 border border-slate-200 text-[10px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <input
                      type="email"
                      placeholder="Receiver Email Address"
                      value={newReceiverEmail}
                      onChange={(e) => setNewReceiverEmail(e.target.value)}
                      className="w-full bg-white rounded-lg p-2 border border-slate-200 text-[10px]"
                    />
                  </div>
                </div>

                {/* Origin / Destination routing */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 font-semibold uppercase text-[9px]">Origin City</label>
                    <input
                      type="text"
                      placeholder="e.g. Austin"
                      value={newOriginCity}
                      onChange={(e) => setNewOriginCity(e.target.value)}
                      className="w-full bg-slate-50 rounded-lg p-2 border border-slate-200 text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-semibold uppercase text-[9px]">Dest City</label>
                    <input
                      type="text"
                      placeholder="e.g. Seattle"
                      value={newDestCity}
                      onChange={(e) => setNewDestCity(e.target.value)}
                      className="w-full bg-slate-50 rounded-lg p-2 border border-slate-200 text-[11px]"
                    />
                  </div>
                </div>

                {/* Select carrier / methods */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 font-semibold uppercase text-[9px]">Carrier Assign</label>
                    <select
                      value={newCarrier}
                      onChange={(e) => setNewCarrier(e.target.value as CarrierType)}
                      className="w-full bg-slate-50 rounded-lg p-2 border border-slate-200 text-[11px]"
                    >
                      {CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-500 font-semibold uppercase text-[9px]">Shipping Route</label>
                    <select
                      value={newMethod}
                      onChange={(e) => setNewMethod(e.target.value as ShippingMethod)}
                      className="w-full bg-slate-50 rounded-lg p-2 border border-slate-200 text-[11px]"
                    >
                      {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                {/* More Parameters */}
                <div className="grid grid-cols-2 gap-3 p-2 border border-slate-100 rounded-xl">
                  <div>
                    <label className="text-slate-400 uppercase text-[9px]">Insured Val ($)</label>
                    <input
                      type="number"
                      value={newCargoValue}
                      onChange={(e) => setNewCargoValue(Number(e.target.value))}
                      className="w-full bg-slate-50 rounded-lg p-2 border-slate-200 text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 uppercase text-[9px]">Weight (lbs)</label>
                    <input
                      type="number"
                      value={newWeight}
                      onChange={(e) => setNewWeight(Number(e.target.value))}
                      className="w-full bg-slate-50 rounded-lg p-2 border-slate-200 text-[11px]"
                    />
                  </div>
                </div>

                {/* Contact/Notification Email */}
                <div>
                  <label className="text-slate-500 font-semibold uppercase text-[9px]">Client / Notification Email</label>
                  <input
                    type="email"
                    placeholder="name@business.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-[11.5px]"
                  />
                </div>

                {/* Description notes */}
                <div>
                  <label className="text-slate-500 font-semibold uppercase text-[9px]">Dispatch Instructions / Notes</label>
                  <textarea
                    placeholder="Fragile items, specific delivery points, etc."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-50 rounded-lg p-2 border border-slate-200 text-[11px]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-950 hover:bg-slate-900 text-white font-sans font-semibold py-3 px-4 rounded-xl transition uppercase tracking-wider text-xs cursor-pointer"
                >
                  Create & Catalog Item
                </button>
              </form>
            </motion.div>
          )}

          {/* Action 2: Update and Edit Panel of Selected Shipment */}
          {editingShipment && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-slate-950 rounded-3xl p-6 shadow-xl space-y-6"
            >
              <div className="flex justify-between items-center pb-3 border-b border-rose-50">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Cargo Key Editor</span>
                  <h4 className="font-bold font-mono text-slate-950 text-base tracking-wide mt-0.5">{editingShipment.id}</h4>
                </div>
                <button 
                  onClick={() => setEditingShipment(null)} 
                  className="text-xs text-slate-400 hover:text-slate-650 cursor-pointer font-bold font-sans"
                >
                  ✕ Close
                </button>
              </div>

              {/* Status Selector Slider/List */}
              <div className="space-y-2 p-4 bg-slate-50 rounded-2xl relative">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block"><Activity className="w-4.5 h-4.5 inline text-sky-500 mr-1" /> Active Milestone Stage</span>
                
                <div className="grid grid-cols-1 gap-1 pt-1 text-xs">
                  {STATUSES.map(st => (
                    <button
                      key={st.value}
                      onClick={() => setEditingShipment({ ...editingShipment, status: st.value })}
                      className={`w-full py-2.5 px-3 rounded-lg flex justify-between items-center transition cursor-pointer text-left ${
                        editingShipment.status === st.value 
                        ? 'bg-slate-900 text-white font-bold' 
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-100'
                      }`}
                    >
                      <span>{st.label}</span>
                      {editingShipment.status === st.value && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form details updates (Sender/Receiver adjustments, weight, visibility) */}
              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                {/* Adjust Operator Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 uppercase text-[9px]">Carrier Operator</label>
                    <select
                      value={editingShipment.carrier}
                      onChange={(e) => setEditingShipment({ ...editingShipment, carrier: e.target.value as CarrierType })}
                      className="w-full bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-[11px]"
                    >
                      {CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 uppercase text-[9px]">Transit Route Type</label>
                    <select
                      value={editingShipment.shippingMethod}
                      onChange={(e) => setEditingShipment({ ...editingShipment, shippingMethod: e.target.value as ShippingMethod })}
                      className="w-full bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-[11px]"
                    >
                      {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl">
                  {/* Sender block */}
                  <div className="space-y-2">
                    <span className="text-slate-450 font-bold block text-[9px] uppercase tracking-wider">SENDER</span>
                    <input
                      type="text"
                      placeholder="Name"
                      value={editingShipment.senderName}
                      onChange={(e) => setEditingShipment({ ...editingShipment, senderName: e.target.value })}
                      className="w-full bg-white p-2 border rounded-lg text-[10px]"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={editingShipment.senderAddress || ''}
                      onChange={(e) => setEditingShipment({ ...editingShipment, senderAddress: e.target.value })}
                      className="w-full bg-white p-2 border rounded-lg text-[10px]"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={editingShipment.senderEmail || ''}
                      onChange={(e) => setEditingShipment({ ...editingShipment, senderEmail: e.target.value })}
                      className="w-full bg-white p-2 border rounded-lg text-[10px]"
                    />
                  </div>

                  {/* Receiver block */}
                  <div className="space-y-2">
                    <span className="text-slate-450 font-bold block text-[9px] uppercase tracking-wider">RECEIVER</span>
                    <input
                      type="text"
                      placeholder="Name"
                      value={editingShipment.receiverName}
                      onChange={(e) => setEditingShipment({ ...editingShipment, receiverName: e.target.value })}
                      className="w-full bg-white p-2 border rounded-lg text-[10px]"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={editingShipment.receiverAddress || ''}
                      onChange={(e) => setEditingShipment({ ...editingShipment, receiverAddress: e.target.value })}
                      className="w-full bg-white p-2 border rounded-lg text-[10px]"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={editingShipment.receiverEmail || ''}
                      onChange={(e) => setEditingShipment({ ...editingShipment, receiverEmail: e.target.value })}
                      className="w-full bg-white p-2 border rounded-lg text-[10px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-400 uppercase text-[9px]">Weight</label>
                    <input
                      type="number"
                      value={editingShipment.weight}
                      onChange={(e) => setEditingShipment({ ...editingShipment, weight: Number(e.target.value) })}
                      className="w-full bg-slate-50 p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 uppercase text-[9px]">ETA DLV</label>
                    <input
                      type="text"
                      value={editingShipment.estimatedDelivery}
                      onChange={(e) => setEditingShipment({ ...editingShipment, estimatedDelivery: e.target.value })}
                      className="w-full bg-slate-50 p-2 border rounded-lg text-[10px]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 uppercase text-[9px]">Insured ($)</label>
                    <input
                      type="number"
                      value={editingShipment.cargoValue || 0}
                      onChange={(e) => setEditingShipment({ ...editingShipment, cargoValue: Number(e.target.value) })}
                      className="w-full bg-slate-50 p-2 border rounded-lg text-[10px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-bold uppercase text-[9px]">Client / Notification Email</label>
                  <input
                    type="email"
                    placeholder="name@business.com"
                    value={editingShipment.email || ''}
                    onChange={(e) => setEditingShipment({ ...editingShipment, email: e.target.value })}
                    className="w-full bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-slate-900 text-[11px]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-950 hover:bg-slate-900 text-white font-sans font-semibold py-3 px-4 rounded-xl transition uppercase tracking-wider cursor-pointer"
                >
                  Save Standard Details
                </button>
              </form>

              {/* Sub-panel 2: Interactive Historical Scan Log Builder */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block"><History className="w-4 h-4 inline text-sky-500 mr-1" /> Dynamic Hub Scans ({editingShipment.history.length})</span>
                
                {/* Form to append scan logs directly */}
                <form onSubmit={handleAddNewHistoryLog} className="bg-slate-50 p-4 rounded-2xl space-y-3 border border-slate-100 text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[9px] block">Append Scan Event Live</span>
                  
                  <div className="space-y-1">
                    <input
                      type="text"
                      required
                      placeholder="Location: city/facility (e.g. Dallas Central Depot, TX)"
                      value={newLogLocation}
                      onChange={(e) => setNewLogLocation(e.target.value)}
                      className="w-full bg-white p-2 border rounded-lg placeholder-slate-400 text-[10px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <textarea
                      required
                      placeholder="Log details (e.g. Scanned, container sealed, customs authorized release)"
                      value={newLogDesc}
                      onChange={(e) => setNewLogDesc(e.target.value)}
                      rows={2}
                      className="w-full bg-white p-2 border rounded-lg placeholder-slate-400 text-[10px]"
                    />
                  </div>

                  {/* Set log's matching status */}
                  <div className="flex items-center gap-2 justify-between">
                    <select
                      value={newLogStatus}
                      onChange={(e) => setNewLogStatus(e.target.value as ShipmentStatus)}
                      className="bg-white p-2 border rounded-lg flex-1 text-[10px]"
                    >
                      {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    
                    <button
                      type="submit"
                      className="bg-sky-500 hover:bg-sky-450 text-slate-950 font-bold py-2 px-3.5 rounded-lg text-[10px] font-sans transition shrink-0 uppercase tracking-wider cursor-pointer flex items-center gap-1"
                    >
                      Append Log
                    </button>
                  </div>
                </form>

                {/* Vertical scrollable mini list of editable historical scan logs */}
                <div className="max-h-48 overflow-y-auto space-y-3 pt-2 divide-y divide-slate-50 pr-1">
                  {editingShipment.history.map((h, hIdx) => (
                    <div key={h.id} className="pt-3 flex justify-between items-start gap-2 text-[11px]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            h.status === 'delivered' ? 'bg-emerald-500' :
                            h.status === 'customs' ? 'bg-indigo-500' : 'bg-sky-500'
                          }`}></span>
                          <span className="font-bold text-slate-800 font-sans">{h.location}</span>
                        </div>
                        <p className="text-slate-500 leading-normal text-[10px]">{h.description}</p>
                        <span className="text-[9px] text-slate-400 font-mono italic block">{new Date(h.timestamp).toLocaleString()}</span>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteHistoryLog(h.id)}
                        className="text-slate-350 hover:text-rose-600 p-1 rounded hover:bg-rose-50 cursor-pointer transition"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Action 3: General System Instructions and WooCommerce Integration Guidelines */}
          {!editingShipment && !showAddForm && (
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm space-y-4 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Settings className="w-5 h-5 animate-spin-slow" />
              </div>
              <h4 className="font-bold font-sans text-sm tracking-tight">Cargo Admin Instructions</h4>
              
              <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                <p>
                  This terminal simulates a **WooCommerce Order Tracking** database where you can register active tracking tags, assign logistics companies, and update transit states.
                </p>
                <p className="border-l-2 border-sky-400 pl-3 italic text-[11px]">
                  When you modify or append a dynamic history scan to any cargo index here, it is cached straight into `localStorage`. You can immediately enter that tracking key into the <strong>Track Shipment</strong> main sub-view or Home search input to trace its coordinates.
                </p>
                <p>
                  Use the green and blue checks to toggle public search availability or deactivate tracking items dynamically.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
