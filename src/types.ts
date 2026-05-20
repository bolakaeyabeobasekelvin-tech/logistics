export interface SenderInfo {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: "United Kingdom" | "United States";
}

export interface ReceiverInfo {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: "United Kingdom" | "United States";
}

export interface ParcelDetails {
  weight: string;
  length: string;
  width: string;
  height: string;
  value: string;
  description: string;
}

export interface QuoteRequest {
  origin: string;
  destination: string;
  weight: number;
  weightUnit: "kg" | "lbs";
  length: number;
  width: number;
  height: number;
  dimUnit: "cm" | "in";
  value: number;
  declaredCurrency: "USD" | "GBP";
}

export interface QuoteOption {
  id: string;
  name: string;
  carrier: string;
  speed: "Economy" | "Standard" | "Express";
  transitDays: number;
  cost: number;
  costBreakdown: {
    baseRate: number;
    fuelSurcharge: number;
    customsProcessing: number;
    transatlanticSecurity: number;
    taxVAT: number;
  };
}

export interface TrackingPoint {
  lat: number;
  lng: number;
}

export interface TrackingDetails {
  id: string;
  senderName: string;
  receiverName: string;
  origin: { name: string; lat: number; lng: number; code: string };
  destination: { name: string; lat: number; lng: number; code: string };
  status: string;
  milestoneIndex: number;
  weightKg: number;
  weightLbs: number;
  carrierPartner: string;
  vesselName: string;
  declaredValue: number;
  shipmentType: string;
  liveStatus: {
    currentLocation: TrackingPoint;
    progressPct: number;
    speedKnots: number;
    headingDegree: number;
    estimatedArrivalMin: number;
    lastUpdated: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: "user" | "advisor";
  text: string;
  timestamp: string;
}

export interface LocalizationConfig {
  region: "US" | "UK";
  currency: "USD" | "GBP";
  weightUnit: "kg" | "lbs";
  dimensionUnit: "cm" | "in";
  language: "en-US" | "en-GB";
}
