import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Google GenAI SDK client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Preloaded mock transatlantic shipments for live coordinates tracking
const MOCK_SHIPMENTS: Record<string, {
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
}> = {
  "TE-UKUS-88402": {
    id: "TE-UKUS-88402",
    senderName: "Covent Garden Luxury Brands Ltd",
    receiverName: "Hudson Yards Distributors LLC",
    origin: { name: "London Heathrow Int'l Airport, UK", lat: 51.4700, lng: -0.4543, code: "LHR" },
    destination: { name: "Chicago O'Hare International Airport, US", lat: 41.9742, lng: -87.9073, code: "ORD" },
    status: "Transatlantic High-Altitude Air Transit",
    milestoneIndex: 3, // In flight
    weightKg: 1240,
    weightLbs: 2733.7,
    carrierPartner: "Transglobal Express Courier Services (via DHL Express Air)",
    vesselName: "A350-900 Freight Liner (TGE-309)",
    declaredValue: 24500,
    shipmentType: "Temperature-Controlled Pharmaceutical Air Cargo"
  },
  "TE-USUK-40192": {
    id: "TE-USUK-40192",
    senderName: "Boston Precision Machining Corp",
    receiverName: "Midlands Industrial Assembly Ltd",
    origin: { name: "Port of Boston, Massachusetts, USA", lat: 42.3601, lng: -71.0589, code: "BOS" },
    destination: { name: "Port of Southampton, Hampshire, UK", lat: 50.9097, lng: -1.4044, code: "SOU" },
    status: "Mid-Atlantic Freight Vessel Voyage",
    milestoneIndex: 3, // Ocean Transit
    weightKg: 18200,
    weightLbs: 40124.1,
    carrierPartner: "Transglobal Express Freight Lines (via Hapag-Lloyd)",
    vesselName: "Atlantic Horizon Marine Cargo Ship (IMO: 9812736)",
    declaredValue: 145000,
    shipmentType: "Specialized Heavy Industrial Equipment (Sea Freight Container)"
  },
  "TE-UKUS-10294": {
    id: "TE-UKUS-10294",
    senderName: "Scottish Spirits Exporting Co.",
    receiverName: "Pacific Coast Imports Inc.",
    origin: { name: "Glasgow Logistics Outpost, Scotland, UK", lat: 55.8642, lng: -4.2518, code: "GLA" },
    destination: { name: "Los Angeles Gateway Docks, California, USA", lat: 33.9416, lng: -118.4085, code: "LAX" },
    status: "Arrived at Regional Hub - Out for Last-Mile Delivery",
    milestoneIndex: 5, // Out for Delivery
    weightKg: 350,
    weightLbs: 771.6,
    carrierPartner: "Transglobal Express UK (via FedEx Premium Deliveries)",
    vesselName: "Courier Van (TGE-LAX-4)",
    declaredValue: 12500,
    shipmentType: "Priority Glass-Bottle Spirit Casks"
  }
};

// Admin Cargo Management APIs
app.get("/api/shipments", (req, res) => {
  res.json(Object.values(MOCK_SHIPMENTS));
});

app.post("/api/shipments", (req, res) => {
  const {
    id,
    senderName,
    receiverName,
    origin,
    destination,
    status,
    milestoneIndex,
    weightKg,
    carrierPartner,
    vesselName,
    declaredValue,
    shipmentType
  } = req.body;

  if (!senderName || !receiverName || !origin?.name || !destination?.name) {
    return res.status(400).json({ error: "Missing required shipment fields." });
  }

  // Create or enforce a unique tracking ID if not provided
  const parsedId = id && id.trim() 
    ? id.trim().toUpperCase() 
    : `TE-${(origin.code || "GEN").toUpperCase()}${(destination.code || "GEN").toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

  if (MOCK_SHIPMENTS[parsedId]) {
    return res.status(400).json({ error: `Shipment ID ${parsedId} already exists.` });
  }

  const pkg = {
    id: parsedId,
    senderName,
    receiverName,
    origin: {
      name: origin.name,
      lat: parseFloat(origin.lat) || 45.0,
      lng: parseFloat(origin.lng) || -40.0,
      code: (origin.code || "GEN").toUpperCase()
    },
    destination: {
      name: destination.name,
      lat: parseFloat(destination.lat) || 45.0,
      lng: parseFloat(destination.lng) || -40.0,
      code: (destination.code || "GEN").toUpperCase()
    },
    status: status || "Shipment Booked",
    milestoneIndex: parseInt(milestoneIndex) || 0,
    weightKg: parseFloat(weightKg) || 10,
    weightLbs: Math.round((parseFloat(weightKg) || 10) * 2.20462),
    carrierPartner: carrierPartner || "Transglobal Express Partner Fleet",
    vesselName: vesselName || "Cargo Liner",
    declaredValue: parseFloat(declaredValue) || 100,
    shipmentType: shipmentType || "General Cargo"
  };

  MOCK_SHIPMENTS[parsedId] = pkg;
  res.status(201).json(pkg);
});

app.put("/api/shipments/:id", (req, res) => {
  const id = req.params.id;
  if (!MOCK_SHIPMENTS[id]) {
    return res.status(404).json({ error: "Shipment not found." });
  }

  const {
    senderName,
    receiverName,
    origin,
    destination,
    status,
    milestoneIndex,
    weightKg,
    carrierPartner,
    vesselName,
    declaredValue,
    shipmentType
  } = req.body;

  const current = MOCK_SHIPMENTS[id];

  MOCK_SHIPMENTS[id] = {
    ...current,
    senderName: senderName || current.senderName,
    receiverName: receiverName || current.receiverName,
    origin: origin ? {
      name: origin.name || current.origin.name,
      lat: origin.lat !== undefined ? parseFloat(origin.lat) : current.origin.lat,
      lng: origin.lng !== undefined ? parseFloat(origin.lng) : current.origin.lng,
      code: (origin.code || current.origin.code).toUpperCase()
    } : current.origin,
    destination: destination ? {
      name: destination.name || current.destination.name,
      lat: destination.lat !== undefined ? parseFloat(destination.lat) : current.destination.lat,
      lng: destination.lng !== undefined ? parseFloat(destination.lng) : current.destination.lng,
      code: (destination.code || current.destination.code).toUpperCase()
    } : current.destination,
    status: status !== undefined ? status : current.status,
    milestoneIndex: milestoneIndex !== undefined ? parseInt(milestoneIndex) : current.milestoneIndex,
    weightKg: weightKg !== undefined ? parseFloat(weightKg) : current.weightKg,
    weightLbs: weightKg !== undefined ? Math.round(parseFloat(weightKg) * 2.20462) : current.weightLbs,
    carrierPartner: carrierPartner || current.carrierPartner,
    vesselName: vesselName !== undefined ? vesselName : current.vesselName,
    declaredValue: declaredValue !== undefined ? parseFloat(declaredValue) : current.declaredValue,
    shipmentType: shipmentType || current.shipmentType
  };

  res.json(MOCK_SHIPMENTS[id]);
});

app.delete("/api/shipments/:id", (req, res) => {
  const id = req.params.id;
  if (!MOCK_SHIPMENTS[id]) {
    return res.status(404).json({ error: "Shipment not found." });
  }
  delete MOCK_SHIPMENTS[id];
  res.json({ success: true });
});

// API Route: Get Live calculated geolocation for shipment
// Computes dynamic midpoints along the route depending on system time for super polished "live tracker movement"!
app.get("/api/tracking/:id", (req, res) => {
  const id = req.params.id;
  const shipment = MOCK_SHIPMENTS[id];

  if (!shipment) {
    return res.status(404).json({ error: "Shipment ID not found. Try TE-UKUS-88402, TE-USUK-40192 or TE-UKUS-10294." });
  }

  // Generate dynamic location coordinates based on current timestamp for active shipments
  const now = Date.now();
  let currentLat = shipment.origin.lat;
  let currentLng = shipment.origin.lng;
  let progressPct = 100;
  let estimatedArrivalMin = 0;

  if (shipment.milestoneIndex === 3) {
    // If "In Transatlantic Transit", let's interpolate between origin and destination based on time
    // Loop transit animation every 120 seconds for interactive visual proof
    const loopDurationMs = 120 * 1000;
    const progressFactor = (now % loopDurationMs) / loopDurationMs;
    progressPct = Math.round(progressFactor * 100);

    // Linear interpolation between origin and destination coords
    currentLat = shipment.origin.lat + (shipment.destination.lat - shipment.origin.lat) * progressFactor;
    currentLng = shipment.origin.lng + (shipment.destination.lng - shipment.origin.lng) * progressFactor;
    estimatedArrivalMin = Math.round((1 - progressFactor) * 360); // Max 6 hours air transit or scaled sea transit
  } else if (shipment.milestoneIndex === 5) {
    // Last-mile delivery (near destination)
    progressPct = 95;
    // Hovering nearby destination
    currentLat = shipment.destination.lat + 0.05 * Math.sin(now / 15000);
    currentLng = shipment.destination.lng + 0.05 * Math.cos(now / 15000);
    estimatedArrivalMin = 45;
  }

  res.json({
    ...shipment,
    liveStatus: {
      currentLocation: { lat: currentLat, lng: currentLng },
      progressPct,
      speedKnots: shipment.shipmentType.includes("Air") ? 480 : 18,
      headingDegree: 285,
      estimatedArrivalMin,
      lastUpdated: new Date().toISOString()
    }
  });
});

// Post bookings endpoint simulating Transglobal Express integration validation
app.post("/api/booking", (req, res) => {
  const { sender, receiver, parcel, speed, declarationAccepted } = req.body;

  if (!declarationAccepted) {
    return res.status(400).json({ error: "Booking requires accepting US/UK export control customs declaration directives." });
  }

  // Create a randomized tracking number in standard format template
  const isWestbound = sender.country === "United Kingdom";
  const directionStr = isWestbound ? "UKUS" : "USUK";
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const trackingNumber = `TE-${directionStr}-${randomNum}`;

  // Register in memory (temporary)
  const originCoord = isWestbound 
    ? { name: `${sender.city} Logistical Outpost, UK`, lat: 51.5074, lng: -0.1278, code: "LON" }
    : { name: `${sender.city} Depot, USA`, lat: 40.7128, lng: -74.0060, code: "NYC" };
    
  const destCoord = isWestbound
    ? { name: `${receiver.city} Int'l Port/Hub, USA`, lat: 40.7128, lng: -74.0060, code: "NYC" }
    : { name: `${receiver.city} Int'l Depot, UK`, lat: 51.5074, lng: -0.1278, code: "LON" };

  const parsedWeight = parseFloat(parcel.weight) || 12;
  const newBooking = {
    id: trackingNumber,
    senderName: sender.company || sender.fullName,
    receiverName: receiver.company || receiver.fullName,
    origin: originCoord,
    destination: destCoord,
    status: "Shipment Booked (Pre-Transit Screening)",
    milestoneIndex: 0,
    weightKg: isWestbound ? parsedWeight : Math.round(parsedWeight * 0.453592),
    weightLbs: isWestbound ? Math.round(parsedWeight * 2.20462) : parsedWeight,
    carrierPartner: "Transglobal Express Ltd Strategic Cargo Fleet",
    vesselName: speed === "Express" ? "Scheduled Cargo Jet Container" : "Transatlantic Ocean Voyager",
    declaredValue: parseFloat(parcel.value) || 500,
    shipmentType: `${speed} Transatlantic freight standard pack`
  };

  MOCK_SHIPMENTS[trackingNumber] = newBooking;

  res.json({
    success: true,
    trackingNumber,
    bookingDetails: newBooking,
    partnerVerification: "In partnership with GMB-registered Transglobal Express UK/US Carrier dispatch hubs (Verified ISO-9001)."
  });
});

// Expert fallback responses if GEMINI_API_KEY is not defined
const EXPERT_LOGISTICS_FALLBACKS: Array<{ keywords: string[]; answer: string }> = [
  {
    keywords: ["food", "meat", "chocolate", "cheese", "alcohol", "wine", "beer", "whisky"],
    answer: "For UK to US shipping, food items regulated by the FDA (Food and Drug Administration) require Prior Notice filing. Unprocessed meat products are strictly prohibited to prevent disease transmission. Shelf-stable chocolates and hard cheeses are generally admissible if commercial value is specified. Shipping alcohol requires state-specific import licensing and standard customs documentation managed by our partner Transglobal Express."
  },
  {
    keywords: ["gdpr", "ccpa", "privacy", "laws", "consent", "cookie", "data protection"],
    answer: "At Transatlantic Express Logistics, we handle tracking data strictly under UK GDPR / DPA 2018 for UK/EU citizens, and CCPA (California Consumer Privacy Act) for US clients. Personal contact info is masked on tracking links, secure SSL transit logs are encrypted, and we never sell user delivery coordinates to third-party marketing networks."
  },
  {
    keywords: ["customs", "duty", "taxes", "vat", "de minimis", "import tariff", "rate"],
    answer: "The US De Minimis threshold (Section 321) allows duty-free importation for commercial orders valued under $800 USD. For UK imports, the de minimis threshold is £135 GBP for duty exemption, though standard UK VAT (20%) is calculated and applied to all imports from outside the UK unless specific relief applies."
  },
  {
    keywords: ["gmb", "google my business", "transglobal express", "partner", "reviews"],
    answer: "Our logistics operational partner, Transglobal Express, is a highly rated shipping company searchable on Google My Business. With deep reviews detailing prompt customs handovers, their UK & US warehouse depots orchestrate sea-container and air-flight handoffs cleanly across prime carriers like UPS, DHL, and FedEx, maintaining a 4.7+ Trust Score."
  },
  {
    keywords: ["prohibited", "illegal", "restricted", "lithium", "battery", "perfume"],
    answer: "Transatlantic hazardous shipping guidelines restrict aerosol cans, nail polish, lithium-ion battery packs (unless integrated in certified consumer hardware under UN3481 conditions), and luxury items valued over £20,000 without specialized ocean-container registration. Feel free to contact our support team at 260-270-7501 for specific hazmat clearances."
  }
];

// Helper to find a fallback response if Gemini fails or is unconfigured
function getExpertFallback(query: string): string {
  const normQuery = query.toLowerCase();
  for (const fallback of EXPERT_LOGISTICS_FALLBACKS) {
    if (fallback.keywords.some(keyword => normQuery.includes(keyword))) {
      return fallback.answer;
    }
  }
  return "To ship across transatlantic channels safely, ensure your cargo includes a commercial invoice detailing harmonized system codes (HS Code), a clear delivery postcode, and weight/dimension telemetry. Call our US customer line 260-270-7501 or write to ship@transatlanticexpress.com for direct help on your cargo manifest.";
}

// API Route: AI Logistics & Customs Support Advisor
app.post("/api/support/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message string is required in the body." });
  }

  try {
    const ai = getGeminiClient();
    
    const prompt = `You are the Expert Transatlantic Logistics and Compliance Advisor representing both Transatlantic Express Logistics and our GMB operational partner "Transglobal Express Ltd" (founded in UK, shipping worldwide).
You must answer the user's inquiry regarding US-UK transatlantic shipping regulations, customs duties (e.g. US de minimis $800, UK £135), GDPR/CCPA privacy standards, prohibited items, or carrier networks.

Include:
- Professional, reassuring guidance
- Clear bulleted lists if explaining rules or rates
- Mention our customer helpline 260-270-7501 or corporate electronic response ship@transatlanticexpress.com where relevant to build immediate trust.
Do not hallucinate tracking information. If they ask about tracking, instruct them to enter their tracking ID (e.g., TE-UKUS-88402) in our live tracker.

Inquiry: "${message}"`;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite transatlantic maritime and air cargo customs compliance analyst, specializing in US FDA/CBP laws and UK HMRC guidelines."
      }
    });

    const responseText = result.text || "I was unable to formulate a response at this time.";
    return res.json({ response: responseText, source: "Gemini AI" });

  } catch (error: any) {
    // If the API key is unconfigured or a network error occurs, we gracefully guide the user using our expert lookup matrix
    console.warn("Gemini API not available or errored out. Using smart local expert system fallback:", error.message);
    const localAnswer = getExpertFallback(message);
    
    // Supplement with warning if it's purely a missing-key issue, but keep it ultra-legible
    return res.json({ 
      response: `${localAnswer}\n\n*(Expert Guidance provided by Transatlantic Logistics Registry. Connect your valid GOOGLE_MAPS_PLATFORM_KEY and GEMINI_API_KEY in the AI Studio Settings menu to run the fully active AI conversational agent).*`, 
      source: "Local Rules Analytics Engine" 
    });
  }
});

// Configure Vite middleware or production file server
async function configureServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Transatlantic Express Logistics backend running on http://0.0.0.0:${PORT}`);
  });
}

configureServer().catch((err) => {
  console.error("Failed to start trans-atlantic server:", err);
});
