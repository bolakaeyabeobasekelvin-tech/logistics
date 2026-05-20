import { useEffect, useRef, useState } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from "@vis.gl/react-google-maps";
import { TrackingDetails } from "../types";
import { Plane, Ship, MapPin, Search, Grid, Info, AlertTriangle, ArrowRight, Shield, Globe } from "lucide-react";

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";

const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY";

// Helper component that binds a geodesic line from origin to destination and moves the map viewport
function CargoGeodesicPolyline({
  origin,
  destination
}: {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}) {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    // Remove existing polyline if any
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    // Creating geodesic polyline tracing transatlantic aviation and sea lines
    polylineRef.current = new google.maps.Polyline({
      path: [origin, destination],
      geodesic: true,
      strokeColor: "#10B981", // Emerald accent
      strokeOpacity: 0.8,
      strokeWeight: 4,
    });

    polylineRef.current.setMap(map);

    // Fit map bounds to encompass original routing nicely
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(origin);
    bounds.extend(destination);
    
    // Smooth transition
    map.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, origin, destination]);

  return null;
}

export default function TrackingMap({ shipment }: { shipment: TrackingDetails | null }) {
  const [showConfigHelp, setShowConfigHelp] = useState(true);

  if (!shipment) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-8 border border-neutral-200 border-dashed rounded-2xl bg-neutral-50/50">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4 animate-pulse">
          <Search className="w-6 h-6" />
        </div>
        <p className="text-neutral-900 font-medium text-lg leading-snug">No Active Shipment Selected</p>
        <p className="text-neutral-500 text-sm mt-1 max-w-sm text-center">
          Enter a tracking number or choose a demo transatlantic cargo shipment above to begin live geolocation.
        </p>
      </div>
    );
  }

  const originCoords = { lat: shipment.origin.lat, lng: shipment.origin.lng };
  const destCoords = { lat: shipment.destination.lat, lng: shipment.destination.lng };
  const liveCoords = { lat: shipment.liveStatus.currentLocation.lat, lng: shipment.liveStatus.currentLocation.lng };
  const isAir = shipment.shipmentType.toLowerCase().includes("air");

  // Instruction block as requested by Google Maps Platform constitution
  const setupInstructions = (
    <div className="p-4 bg-amber-50/90 text-amber-900 border-b border-amber-200 text-xs">
      <div className="flex items-start gap-2 max-w-7xl mx-auto">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-950">Google Maps API Key Missing or Unconfigured</p>
          <p>
            You are viewing the simulated telemetry grid. To activate real Google Maps and polylines:
          </p>
          <ol className="list-decimal pl-4 space-y-1 mt-1 font-medium">
            <li>
              Get an API key:{" "}
              <a 
                href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline hover:text-amber-950 font-bold"
              >
                Get API Key on Google Cloud Console
              </a>
            </li>
            <li>
              Add your key as a secret in AI Studio: Open <strong className="font-bold">Settings</strong> (⚙️ gear icon, top-right corner) → <strong className="font-bold">Secrets</strong> → type <code>GOOGLE_MAPS_PLATFORM_KEY</code> → press <strong className="font-bold">Enter</strong> → paste key → press <strong className="font-bold">Enter</strong>.
            </li>
            <li>The container will rebuild instantly — no browser reload requested.</li>
          </ol>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative border border-neutral-200 rounded-2xl overflow-hidden shadow-sm bg-neutral-900 h-[480px]">
      
      {/* Setup instructions top bar */}
      {!hasValidKey && setupInstructions}

      {hasValidKey ? (
        <APIProvider apiKey={API_KEY} version="weekly">
          <Map
            defaultCenter={liveCoords}
            defaultZoom={4}
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
            className="w-full h-full"
            style={{ width: "100%", height: "100%" }}
          >
            {/* Draw geodesic route from Heathrow/Boston to O'Hare/Southampton */}
            <CargoGeodesicPolyline origin={originCoords} destination={destCoords} />

            {/* Origin Dock / Airport */}
            <AdvancedMarker position={originCoords} title={`Origin: ${shipment.origin.code}`}>
              <Pin background="#3B82F6" glyphColor="#fff" scale={0.9} />
            </AdvancedMarker>

            {/* Current Cargo Location */}
            <AdvancedMarker position={liveCoords} title={`Active Position: ${shipment.status}`}>
              <div 
                className="flex items-center justify-center bg-emerald-500 text-white rounded-full p-2 border-2 border-white shadow-lg animate-bounce" 
                style={{ width: "40px", height: "40px" }}
              >
                {isAir ? <Plane className="w-5 h-5 rotate-[15deg]" /> : <Ship className="w-5 h-5" />}
              </div>
            </AdvancedMarker>

            {/* Destination Port / Airport */}
            <AdvancedMarker position={destCoords} title={`Destination: ${shipment.destination.code}`}>
              <Pin background="#E11D48" glyphColor="#fff" scale={1.1} />
            </AdvancedMarker>
          </Map>
        </APIProvider>
      ) : (
        /* Visual Geodesic Radar fallback if Google Maps Key not connected - visually stunning */
        <div className="relative w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-300 font-mono overflow-hidden">
          
          {/* Animated radar sonar wave */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-neutral-800/40 pointer-events-none flex items-center justify-center">
            <div className="w-[450px] h-[450px] rounded-full border border-neutral-800/60 flex items-center justify-center animate-ping duration-10000">
              <div className="w-[300px] h-[300px] rounded-full border border-neutral-700/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/5 border border-emerald-500/20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Compass grid decorations (Anti-Tech-Larping: keep simple, human-friendly for tracking display) */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Coordinates Header */}
          <div className="flex justify-between items-start z-10 text-xs text-neutral-400 bg-neutral-950/80 p-3 rounded-xl border border-neutral-800 backdrop-blur-md">
            <div>
              <p className="font-semibold text-neutral-200">TRANSATLANTIC TRANSIT INTERPOLATION</p>
              <p className="text-xs text-emerald-400 font-bold mt-1">Live Progress Telemetry: {shipment.liveStatus.progressPct}%</p>
            </div>
            <div className="text-right">
              <p className="text-neutral-200">ID: {shipment.id}</p>
              <p className="text-[10px] text-neutral-500 mt-1">GMT UTC-00</p>
            </div>
          </div>

          {/* Dynamic Geodesic Route Visualizer */}
          <div className="relative w-full max-w-xl mx-auto flex items-center justify-between py-12 z-10">
            {/* Origin Landmark */}
            <div className="text-center w-28 bg-neutral-950/90 p-3 border border-neutral-800 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-blue-400 font-bold text-xs ring-4 ring-blue-500/10 mb-2">
                {shipment.origin.code}
              </div>
              <p className="text-[11px] font-bold text-neutral-100 truncate">{shipment.origin.code}</p>
              <p className="text-[9px] text-neutral-400 truncate mt-0.5">{shipment.origin.lat.toFixed(2)}N, {shipment.origin.lng.toFixed(2)}E</p>
            </div>

            {/* Connection Flight Path Overlay */}
            <div className="flex-1 relative mx-4 flex items-center">
              <div className="w-full h-1 bg-gradient-to-r from-blue-500/20 via-emerald-500/50 to-red-500/20 rounded-full"></div>
              
              {/* Airplane or ship sliding visually across progress point */}
              <div 
                className="absolute flex flex-col items-center justify-center transition-all duration-1000"
                style={{ left: `${shipment.liveStatus.progressPct}%`, transform: "translateX(-50%)" }}
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-neutral-900 shadow-xl flex items-center justify-center text-white ring-4 ring-emerald-500/20">
                  {isAir ? <Plane className="w-5 h-5 rotate-[20deg]" /> : <Ship className="w-5 h-5" />}
                </div>
                <div className="absolute top-[44px] bg-emerald-950/90 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 text-[8px] rounded-md font-bold whitespace-nowrap hidden sm:block">
                  {shipment.liveStatus.speedKnots} {isAir ? "mph" : "kts"}
                </div>
              </div>
            </div>

            {/* Destination Landmark */}
            <div className="text-center w-28 bg-neutral-950/90 p-3 border border-neutral-800 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-red-400 font-bold text-xs ring-4 ring-red-500/10 mb-2">
                {shipment.destination.code}
              </div>
              <p className="text-[11px] font-bold text-neutral-100 truncate">{shipment.destination.code}</p>
              <p className="text-[9px] text-neutral-400 truncate mt-0.5">{shipment.destination.lat.toFixed(2)}N, {shipment.destination.lng.toFixed(2)}E</p>
            </div>
          </div>

          {/* Location Telemetry Sidebar (Overlay) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 z-10 bg-neutral-950/90 p-3 rounded-xl border border-neutral-800 backdrop-blur-md text-[11px]">
            <div className="border-r border-neutral-800 pr-2">
              <p className="text-neutral-500">CURRENT POSITION</p>
              <p className="font-bold text-emerald-400 font-sans mt-0.5 truncate">
                {shipment.liveStatus.currentLocation.lat.toFixed(4)}°N, {shipment.liveStatus.currentLocation.lng.toFixed(4)}°W
              </p>
            </div>
            <div className="lg:border-r border-neutral-800 lg:px-2">
              <p className="text-neutral-500">OPERATIONAL LINER</p>
              <p className="font-bold text-neutral-200 mt-0.5 truncate">{shipment.vesselName}</p>
            </div>
            <div className="border-r border-neutral-800 pr-2">
              <p className="text-neutral-500">CARRIER SERVICE</p>
              <p className="font-bold text-neutral-200 mt-0.5 truncate">{shipment.carrierPartner}</p>
            </div>
            <div className="lg:pl-2">
              <p className="text-neutral-500">EST. REMAINING TRANSIT</p>
              <p className="font-bold text-amber-400 mt-0.5">
                {shipment.liveStatus.estimatedArrivalMin > 60 
                  ? `${Math.floor(shipment.liveStatus.estimatedArrivalMin / 60)}h ${shipment.liveStatus.estimatedArrivalMin % 60}m` 
                  : `${shipment.liveStatus.estimatedArrivalMin}m`}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Floating Carrier Seal */}
      <div className="absolute bottom-16 right-4 z-10 flex items-center gap-1.5 bg-neutral-950/80 px-2.5 py-1 text-[10px] uppercase font-sans text-neutral-300 font-bold tracking-widest border border-neutral-800 rounded-full backdrop-blur-md shadow-lg">
        <Shield className="w-3.5 h-3.5 text-emerald-500" />
        <span>GMB Hub Verified Partners</span>
      </div>
    </div>
  );
}
