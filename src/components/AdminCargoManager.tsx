import React, { useState, useEffect } from "react";
import { TrackingDetails } from "../types";
import { 
  Database, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  AlertCircle, 
  RefreshCw, 
  Layers, 
  FileSpreadsheet, 
  MapPin, 
  Ship, 
  Plane,
  Coins
} from "lucide-react";

interface AdminCargoManagerProps {
  onSelectShipmentForTracking: (id: string) => void;
}

const PORT_PRESETS = [
  { code: "LHR", name: "London Heathrow Int'l Airport, UK", lat: 51.47, lng: -0.45 },
  { code: "ORD", name: "Chicago O'Hare International Airport, US", lat: 41.97, lng: -87.91 },
  { code: "BOS", name: "Port of Boston, Massachusetts, USA", lat: 42.36, lng: -71.06 },
  { code: "SOU", name: "Port of Southampton, Hampshire, UK", lat: 50.91, lng: -1.40 },
  { code: "GLA", name: "Glasgow Logistics Outpost, Scotland, UK", lat: 55.86, lng: -4.25 },
  { code: "LAX", name: "Los Angeles Gateway Docks, California, USA", lat: 33.94, lng: -118.41 }
];

const MILESTONES = [
  { value: 0, label: "0 - Cargo Booked & Recorded" },
  { value: 1, label: "1 - Sort & Measure Scanned" },
  { value: 2, label: "2 - Outward Customs Filings Signed" },
  { value: 3, label: "3 - Active Air/Ocean Transit Route" },
  { value: 4, label: "4 - Import Border Clearance Processing" },
  { value: 5, label: "5 - Out for Last Mile Hub Delivery" }
];

export default function AdminCargoManager({ onSelectShipmentForTracking }: AdminCargoManagerProps) {
  const [shipments, setShipments] = useState<TrackingDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Create Mode state
  const [isCreating, setIsCreating] = useState(false);
  const [newId, setNewId] = useState("");
  const [newSenderName, setNewSenderName] = useState("");
  const [newReceiverName, setNewReceiverName] = useState("");
  const [newStatus, setNewStatus] = useState("Transit clearance approved");
  const [newMilestone, setNewMilestone] = useState(0);
  const [newWeightKg, setNewWeightKg] = useState("500");
  const [newDeclaredValue, setNewDeclaredValue] = useState("1200");
  const [newShipmentType, setNewShipmentType] = useState("Transatlantic Consolidated Container Package");
  const [newCarrierPartner, setNewCarrierPartner] = useState("Transglobal Express Partner Fleet");
  const [newVesselName, setNewVesselName] = useState("Pacific Transporter (TGE-91)");

  // Lat / Lng inputs
  const [newOriginCode, setNewOriginCode] = useState("LHR");
  const [newOriginName, setNewOriginName] = useState("London Heathrow Int'l Airport, UK");
  const [newOriginLat, setNewOriginLat] = useState("51.4700");
  const [newOriginLng, setNewOriginLng] = useState("-0.4543");

  const [newDestCode, setNewDestCode] = useState("ORD");
  const [newDestName, setNewDestName] = useState("Chicago O'Hare International Airport, US");
  const [newDestLat, setNewDestLat] = useState("41.9742");
  const [newDestLng, setNewDestLng] = useState("-87.9073");

  // Editing Mode state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editMilestone, setEditMilestone] = useState(0);
  const [editVesselName, setEditVesselName] = useState("");
  const [editDeclaredValue, setEditDeclaredValue] = useState("");

  const fetchShipments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/shipments");
      if (!response.ok) throw new Error("Failed to retrieve current shipments.");
      const data = await response.json();
      setShipments(data);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred retrieving data cache.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // Set Preset coordinates for shipper/recipient to make Admin entries frictionless!
  const applyOriginPreset = (code: string) => {
    const preset = PORT_PRESETS.find(p => p.code === code);
    if (preset) {
      setNewOriginCode(preset.code);
      setNewOriginName(preset.name);
      setNewOriginLat(preset.lat.toFixed(4));
      setNewOriginLng(preset.lng.toFixed(4));
    }
  };

  const applyDestPreset = (code: string) => {
    const preset = PORT_PRESETS.find(p => p.code === code);
    if (preset) {
      setNewDestCode(preset.code);
      setNewDestName(preset.name);
      setNewDestLat(preset.lat.toFixed(4));
      setNewDestLng(preset.lng.toFixed(4));
    }
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!newSenderName.trim() || !newReceiverName.trim()) {
      setErrorMessage("Corporate Shipper Name & Receiver Name are strictly requested.");
      return;
    }

    try {
      const payload = {
        id: newId.trim() || undefined,
        senderName: newSenderName,
        receiverName: newReceiverName,
        origin: {
          code: newOriginCode,
          name: newOriginName,
          lat: parseFloat(newOriginLat) || 40.0,
          lng: parseFloat(newOriginLng) || -40.0
        },
        destination: {
          code: newDestCode,
          name: newDestName,
          lat: parseFloat(newDestLat) || 40.0,
          lng: parseFloat(newDestLng) || -40.0
        },
        status: newStatus,
        milestoneIndex: newMilestone,
        weightKg: parseFloat(newWeightKg) || 100,
        carrierPartner: newCarrierPartner,
        vesselName: newVesselName,
        declaredValue: parseFloat(newDeclaredValue) || 100,
        shipmentType: newShipmentType
      };

      const res = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create shipment entry row.");
      }

      setSuccessMessage(`Shipment ${data.id} has been registered successfully on our radar!`);
      setIsCreating(false);
      resetCreateForm();
      fetchShipments();
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to log container entry.");
    }
  };

  const resetCreateForm = () => {
    setNewId("");
    setNewSenderName("");
    setNewReceiverName("");
    setNewStatus("Transit clearance approved");
    setNewMilestone(0);
    setNewWeightKg("500");
    setNewDeclaredValue("1200");
  };

  const handleStartEditing = (shipment: TrackingDetails) => {
    setEditingId(shipment.id);
    setEditStatus(shipment.status);
    setEditMilestone(shipment.milestoneIndex);
    setEditVesselName(shipment.vesselName);
    setEditDeclaredValue(shipment.declaredValue.toString());
  };

  const handleSaveEdit = async (id: string) => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const res = await fetch(`/api/shipments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          milestoneIndex: editMilestone,
          vesselName: editVesselName,
          declaredValue: parseFloat(editDeclaredValue) || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save updated telemetry values.");
      }

      setSuccessMessage(`Shipment telemetry for ${id} has been updated successfully!`);
      setEditingId(null);
      fetchShipments();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to edit record row.");
    }
  };

  const handleDeleteShipment = async (id: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete shipment record ${id}?`)) {
      return;
    }
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const res = await fetch(`/api/shipments/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to purge record from list.");
      }

      setSuccessMessage(`Shipment record ${id} was purged successfully.`);
      fetchShipments();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to purge record row.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden space-y-6">
      
      {/* Upper Panel Branding */}
      <div className="p-6 bg-gradient-to-r from-neutral-800 to-neutral-950 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 text-emerald-400 bg-neutral-800/80 rounded-lg">
              <Database className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold tracking-tight">Cargo Telemetry Admin Center</h2>
          </div>
          <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed font-sans max-w-xl">
            Corporate dispatch panel for editing real-time geolocating vectors, update milestone checkpoints, and manage custom manifest lines for LHR-ORD lanes.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={fetchShipments}
            className="p-2.5 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700/60 text-neutral-300 hover:text-white rounded-xl transition flex items-center justify-center cursor-pointer"
            title="Refresh database entries"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow cursor-pointer"
          >
            {isCreating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4 text-white" />}
            <span>{isCreating ? "Cancel Creation" : "Create Shipment"}</span>
          </button>
        </div>
      </div>

      {/* Notifications Row */}
      <div className="px-6">
        {errorMessage && (
          <div className="p-3.5 bg-red-55/90 text-red-900 border border-red-200/80 rounded-xl text-xs flex items-center gap-2 bg-red-50">
            <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="p-3.5 bg-emerald-55/90 text-emerald-900 border border-emerald-200/80 rounded-xl text-xs flex items-center gap-2 bg-emerald-50">
            <Check className="w-4 h-4 text-emerald-650 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}
      </div>

      {/* CREATE SHIPMENT FORM ACCORDION */}
      {isCreating && (
        <form onSubmit={handleCreateShipment} className="p-6 bg-neutral-50/50 border-t border-b border-neutral-150 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1.5 flex items-center gap-1.5">
            <Layers className="w-4.5 h-4.5 text-emerald-600" />
            <span>Generate New Live Cargo Record</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Custom Tracking Number</label>
              <input
                type="text"
                placeholder="e.g. TE-LHRORD-9903"
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-950 font-mono tracking-wider font-semibold outline-none"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
              />
              <span className="text-[9px] text-neutral-400 mt-0.5 block">Leave empty for auto-generation.</span>
            </div>

            <div>
              <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Shipper Name</label>
              <input
                type="text"
                required
                placeholder="e.g. British Automotive Steel"
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-950 outline-none"
                value={newSenderName}
                onChange={(e) => setNewSenderName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Consignee Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ohio Assembly Works LLC"
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-950 outline-none"
                value={newReceiverName}
                onChange={(e) => setNewReceiverName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Carrier Courier Partner</label>
              <input
                type="text"
                placeholder="e.g. Transglobal Express (DHL Air)"
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-950 outline-none"
                value={newCarrierPartner}
                onChange={(e) => setNewCarrierPartner(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
            <div>
              <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Transit Vessel / Flight Model</label>
              <input
                type="text"
                placeholder="e.g. B777 Cargo Jet (TGE-99)"
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-950 outline-none"
                value={newVesselName}
                onChange={(e) => setNewVesselName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Gross Weight (kg)</label>
              <input
                type="number"
                min="1"
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-950 outline-none"
                value={newWeightKg}
                onChange={(e) => setNewWeightKg(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Declared Value (USD)</label>
              <input
                type="number"
                min="1"
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-950 outline-none font-mono"
                value={newDeclaredValue}
                onChange={(e) => setNewDeclaredValue(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Shipment Category Type</label>
              <input
                type="text"
                placeholder="e.g. Heavy Steel Castings"
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-950 outline-none"
                value={newShipmentType}
                onChange={(e) => setNewShipmentType(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Origin coordinates picker details */}
            <div className="bg-white p-4 border border-neutral-200 rounded-xl space-y-3">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-1.5">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Origin coordinate configs</span>
                </span>
                
                <div className="flex gap-1">
                  <select
                    className="text-[10px] font-bold bg-neutral-100 hover:bg-neutral-250 rounded px-1.5 py-0.5 outline-none cursor-pointer"
                    onChange={(e) => applyOriginPreset(e.target.value)}
                    defaultValue="LHR"
                  >
                    <option value="" disabled>Common Presets</option>
                    {PORT_PRESETS.map((p) => (
                      <option key={p.code} value={p.code}>🇬🇧 {p.code} ({p.name.split(",")[0]})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-neutral-400 font-bold uppercase mb-0.5">Origin Port Code</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-neutral-50 border border-neutral-250 rounded px-2 py-1 text-xs outline-none"
                    value={newOriginCode}
                    onChange={(e) => setNewOriginCode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-neutral-400 font-bold uppercase mb-0.5 font-sans">Origin Depot Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-neutral-50 border border-neutral-250 rounded px-2 py-1 text-xs outline-none"
                    value={newOriginName}
                    onChange={(e) => setNewOriginName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-neutral-400 font-bold uppercase mb-0.5">Latitude (Float)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    className="w-full bg-neutral-50 border border-neutral-250 rounded px-2 py-1 text-xs outline-none font-mono"
                    value={newOriginLat}
                    onChange={(e) => setNewOriginLat(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-neutral-400 font-bold uppercase mb-0.5">Longitude (Float)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    className="w-full bg-neutral-50 border border-neutral-250 rounded px-2 py-1 text-xs outline-none font-mono"
                    value={newOriginLng}
                    onChange={(e) => setNewOriginLng(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Destination coordinates picker details */}
            <div className="bg-white p-4 border border-neutral-200 rounded-xl space-y-3">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-1.5">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-650" />
                  <span>Destination coordinate configs</span>
                </span>
                
                <div className="flex gap-1">
                  <select
                    className="text-[10px] font-bold bg-neutral-100 hover:bg-neutral-250 rounded px-1.5 py-0.5 outline-none cursor-pointer"
                    onChange={(e) => applyDestPreset(e.target.value)}
                    defaultValue="ORD"
                  >
                    <option value="" disabled>Common Presets</option>
                    {PORT_PRESETS.map((p) => (
                      <option key={p.code} value={p.code}>🇺🇸 {p.code} ({p.name.split(",")[0]})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-neutral-400 font-bold uppercase mb-0.5">Dest Port Code</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-neutral-50 border border-neutral-250 rounded px-2 py-1 text-xs outline-none"
                    value={newDestCode}
                    onChange={(e) => setNewDestCode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-neutral-400 font-bold uppercase mb-0.5">Dest Depot Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-neutral-50 border border-neutral-250 rounded px-2 py-1 text-xs outline-none"
                    value={newDestName}
                    onChange={(e) => setNewDestName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-neutral-400 font-bold uppercase mb-0.5">Latitude (Float)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    className="w-full bg-neutral-50 border border-neutral-250 rounded px-2 py-1 text-xs outline-none font-mono"
                    value={newDestLat}
                    onChange={(e) => setNewDestLat(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-neutral-400 font-bold uppercase mb-0.5">Longitude (Float)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    className="w-full bg-neutral-50 border border-neutral-250 rounded px-2 py-1 text-xs outline-none font-mono"
                    value={newDestLng}
                    onChange={(e) => setNewDestLng(e.target.value)}
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Status Remarks</label>
              <input
                type="text"
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-950 outline-none"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Active Transit Milestone</label>
              <select
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-950 outline-none"
                value={newMilestone}
                onChange={(e) => setNewMilestone(parseInt(e.target.value))}
              >
                {MILESTONES.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-neutral-100">
            <button
              type="submit"
              className="bg-neutral-950 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition cursor-pointer"
            >
              Commit Manifest to Database
            </button>
          </div>
        </form>
      )}

      {/* Table listing shipments */}
      <div className="p-6">
        <h3 className="text-xs font-bold text-neutral-450 uppercase tracking-widest mb-4 flex items-center gap-1.5 text-neutral-500">
          <FileSpreadsheet className="w-4 h-4 text-neutral-400" />
          <span>Active Registry Rows ({shipments.length})</span>
        </h3>

        {isLoading ? (
          <div className="py-20 text-center text-sm text-neutral-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-8 h-8 animate-spin text-neutral-300" />
            <p className="font-mono">Syncing server registry indexes...</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-neutral-200 rounded-xl shadow-inner bg-neutral-50/20">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Shipment ID</th>
                  <th className="py-3 px-4">Shipper / Recipient</th>
                  <th className="py-3 px-4">Transit Route</th>
                  <th className="py-3 px-4">Vessel / Carrier</th>
                  <th className="py-3 px-4 font-mono text-right">Value ($)</th>
                  <th className="py-3 px-4">Milestone Station</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-sans">
                {shipments.map((shipment) => {
                  const isEditing = editingId === shipment.id;
                  const isAir = shipment.shipmentType.toLowerCase().includes("air");

                  return (
                    <tr 
                      key={shipment.id} 
                      className={`hover:bg-white transition-all ${
                        isEditing ? "bg-amber-50/20" : ""
                      }`}
                    >
                      {/* 1. ID column */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <button
                            onClick={() => onSelectShipmentForTracking(shipment.id)}
                            className="font-mono font-bold text-neutral-950 bg-neutral-100 border border-neutral-250 rounded-lg px-2 py-1 hover:bg-emerald-600 hover:text-white transition cursor-pointer text-left block"
                            title="Click to load in track status map!"
                          >
                            {shipment.id}
                          </button>
                          <span className="text-[10px] text-neutral-400 block truncate max-w-[120px]">{shipment.shipmentType}</span>
                        </div>
                      </td>

                      {/* 2. Sender / Receiver column */}
                      <td className="py-3 px-4 max-w-[180px]">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-neutral-900 truncate" title={shipment.senderName}>
                            From: <span className="font-bold">{shipment.senderName}</span>
                          </p>
                          <p className="text-neutral-500 truncate" title={shipment.receiverName}>
                            To: <span className="font-bold">{shipment.receiverName}</span>
                          </p>
                        </div>
                      </td>

                      {/* 3. Transit route coordinates codes */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-blue-600">{shipment.origin.code}</span>
                          <span className="text-neutral-400">→</span>
                          <span className="font-bold text-red-600">{shipment.destination.code}</span>
                          <span className="text-[10px] text-neutral-400">
                            ({shipment.origin.lat.toFixed(1)}N, {shipment.destination.lat.toFixed(1)}N)
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-500 truncate max-w-[150px] mt-0.5">{shipment.destination.name.split(",")[0]}</p>
                      </td>

                      {/* 4. Vessel and Carrier */}
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              className="bg-white border border-neutral-300 rounded px-2 py-1 text-xs w-full"
                              value={editVesselName}
                              onChange={(e) => setEditVesselName(e.target.value)}
                            />
                            <p className="text-[10px] text-neutral-400 truncate">{shipment.carrierPartner}</p>
                          </div>
                        ) : (
                          <div className="space-y-0.5 max-w-[150px]">
                            <p className="font-medium text-neutral-900 truncate flex items-center gap-1">
                              {isAir ? <Plane className="w-3.5 h-3.5 text-blue-500 shrink-0" /> : <Ship className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
                              <span className="truncate">{shipment.vesselName}</span>
                            </p>
                            <p className="text-[10px] text-neutral-500 truncate">{shipment.carrierPartner}</p>
                          </div>
                        )}
                      </td>

                      {/* 5. Invoiced Declared Value */}
                      <td className="py-3 px-4 font-mono font-bold text-right text-neutral-900">
                        {isEditing ? (
                          <input
                            type="number"
                            className="bg-white border border-neutral-300 rounded px-2 py-1 text-xs w-20 text-right font-mono"
                            value={editDeclaredValue}
                            onChange={(e) => setEditDeclaredValue(e.target.value)}
                          />
                        ) : (
                          <span>${shipment.declaredValue.toLocaleString()}</span>
                        )}
                      </td>

                      {/* 6. Active checklist status and index milestones */}
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <div className="space-y-2">
                            <select
                              className="bg-white border border-neutral-300 rounded px-2 py-1 text-xs w-full outline-none"
                              value={editMilestone}
                              onChange={(e) => setEditMilestone(parseInt(e.target.value))}
                            >
                              {MILESTONES.map((m) => (
                                <option key={m.value} value={m.value}>{m.label}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              className="bg-white border border-neutral-300 rounded px-2 py-1 text-[11px] w-full"
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                            />
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-950 text-white border">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              <span>Milestone {shipment.milestoneIndex}</span>
                            </span>
                            <p className="text-[10px] text-neutral-500 leading-tight block truncate max-w-[140px]" title={shipment.status}>
                              {shipment.status}
                            </p>
                          </div>
                        )}
                      </td>

                      {/* 7. Action controllers */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(shipment.id)}
                                className="p-1 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[10px] uppercase tracking-wide transition flex items-center gap-0.5 cursor-pointer"
                                title="Save changes"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Save</span>
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1 px-2 bg-neutral-300 hover:bg-neutral-200 text-neutral-700 rounded font-bold text-[10px] uppercase tracking-wide transition flex items-center gap-0.5 cursor-pointer"
                                title="Cancel editing"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Cancel</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEditing(shipment)}
                                className="p-1.5 bg-neutral-100 hover:bg-emerald-100 text-neutral-700 hover:text-emerald-700 border border-neutral-250 hover:border-emerald-250 rounded transition cursor-pointer"
                                title="Edit shipment information"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteShipment(shipment.id)}
                                className="p-1.5 bg-neutral-100 hover:bg-red-100 text-neutral-700 hover:text-red-700 border border-neutral-250 hover:border-red-250 rounded transition cursor-pointer"
                                title="Delete shipment permanently"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
