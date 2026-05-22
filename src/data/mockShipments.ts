import { Shipment } from '../types';

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'US-9482-9018',
    senderName: 'Texas Manufacturing Inc.',
    senderAddress: '102 Industrial Blvd, Austin, TX 78701',
    receiverName: 'Pacific Retail Group',
    receiverAddress: '4802 Broadway Ave, Seattle, WA 98122',
    originCity: 'Austin',
    originCountry: 'USA',
    destinationCity: 'Seattle',
    destinationCountry: 'USA',
    status: 'transit',
    carrier: 'Apex Logistics',
    shippingMethod: 'Ground Transport',
    weight: 125,
    dimensions: '24x24x18 in',
    estimatedDelivery: '2026-05-25',
    isActive: true,
    visibility: 'visible',
    cargoValue: 4500,
    notes: 'Fragile electrical components. Keep upright.',
    history: [
      {
        id: 'h1',
        timestamp: '2026-05-22T08:30:00Z',
        location: 'Denver Distribution Hub, CO',
        description: 'Departed Denver transit center, continuing northbound route.',
        status: 'transit'
      },
      {
        id: 'h2',
        timestamp: '2026-05-21T14:15:00Z',
        location: 'Amarillo Consolidation Hub, TX',
        description: 'Scanned at regional consolidation and sorting center.',
        status: 'transit'
      },
      {
        id: 'h3',
        timestamp: '2026-05-20T10:00:00Z',
        location: 'Austin Industrial Depot, TX',
        description: 'Shipment received and processed at departure hub.',
        status: 'received'
      }
    ]
  },
  {
    id: 'US-3810-7749',
    senderName: 'EuroTech Components GmbH',
    senderAddress: 'Industriepark 12, Stuttgart, 70173, Germany',
    receiverName: 'Advanced Aerodynamics LLC',
    receiverAddress: '782 Skyline Dr, Wichita, KS 67201',
    originCity: 'Stuttgart',
    originCountry: 'Germany',
    destinationCity: 'Wichita',
    destinationCountry: 'USA',
    status: 'customs',
    carrier: 'DHL Global',
    shippingMethod: 'Air Freight',
    weight: 42,
    dimensions: '18x12x12 in',
    estimatedDelivery: '2026-05-24',
    isActive: true,
    visibility: 'visible',
    cargoValue: 12800,
    notes: 'Premium high-torque aerospace bearings.',
    history: [
      {
        id: 'h4',
        timestamp: '2026-05-22T11:45:00Z',
        location: 'JFK Customs Facility, NY',
        description: 'In customs clearance process. Documentation review underway.',
        status: 'customs'
      },
      {
        id: 'h5',
        timestamp: '2026-05-21T18:30:00Z',
        location: 'Leipzig Airport Hub, Germany',
        description: 'Transited European outbound center, loaded onto international aircraft.',
        status: 'transit'
      },
      {
        id: 'h6',
        timestamp: '2026-05-21T02:00:00Z',
        location: 'Stuttgart Cargo Express, Germany',
        description: 'Consolidated, manifested, and loaded for airport transfer.',
        status: 'received'
      }
    ]
  },
  {
    id: 'US-1102-6281',
    senderName: 'Silicon Valley Logistics',
    senderAddress: '500 Innovation Way, San Jose, CA 95110',
    receiverName: 'Digital Edge Labs',
    receiverAddress: '900 Westwood Blvd, Los Angeles, CA 90024',
    originCity: 'San Jose',
    originCountry: 'USA',
    destinationCity: 'Los Angeles',
    destinationCountry: 'USA',
    status: 'out_for_delivery',
    carrier: 'Swift Express Cargo',
    shippingMethod: 'Express Delivery',
    weight: 8.5,
    dimensions: '12x10x6 in',
    estimatedDelivery: '2026-05-22',
    isActive: true,
    visibility: 'visible',
    cargoValue: 850,
    history: [
      {
        id: 'h7',
        timestamp: '2026-05-22T07:15:00Z',
        location: 'Los Angeles Delivery Center, CA',
        description: 'Out for delivery. Loaded onto local parcel carrier truck.',
        status: 'out_for_delivery'
      },
      {
        id: 'h8',
        timestamp: '2026-05-21T21:40:00Z',
        location: 'Los Angeles Freight Sorting Hub, CA',
        description: 'Received at local delivery station, sorted for local route.',
        status: 'transit'
      },
      {
        id: 'h9',
        timestamp: '2026-05-21T13:05:00Z',
        location: 'San Jose Departure Hub, CA',
        description: 'Dispatched from origin hub. En route to Los Angeles.',
        status: 'transit'
      },
      {
        id: 'h10',
        timestamp: '2026-05-21T09:00:00Z',
        location: 'Silicon Valley Logistics Center, CA',
        description: 'Picked up by courier, packed, and manifested.',
        status: 'received'
      }
    ]
  },
  {
    id: 'US-5021-8842',
    senderName: 'Seattle Seafood Exporters',
    senderAddress: 'Pier 56, Alaskan Way, Seattle, WA 98101',
    receiverName: 'Tokyo Import Corp',
    receiverAddress: '3-1-1 Tsukiji, Chuo-ku, Tokyo 104-0045, Japan',
    originCity: 'Seattle',
    originCountry: 'USA',
    destinationCity: 'Tokyo',
    destinationCountry: 'Japan',
    status: 'transit',
    carrier: 'Oceanic Cargo',
    shippingMethod: 'Sea Cargo',
    weight: 4500,
    dimensions: '20ft Refrigerated Container',
    estimatedDelivery: '2026-06-05',
    isActive: true,
    visibility: 'visible',
    cargoValue: 35000,
    notes: 'Cold chain integrity monitoring enabled. Maintain constant -18C temp.',
    history: [
      {
        id: 'h11',
        timestamp: '2026-05-21T06:00:00Z',
        location: 'Pacific Ocean Transit (Vessel #711)',
        description: 'Mid-transit crossing. Vessel status: on schedule. Temp logged at -18.2C.',
        status: 'transit'
      },
      {
        id: 'h12',
        timestamp: '2026-05-18T16:00:00Z',
        location: 'Port of Seattle Container Terminal 18',
        description: 'Loaded onto oceanic vessel Oceanic-Runner V104. Set sail.',
        status: 'transit'
      },
      {
        id: 'h13',
        timestamp: '2026-05-17T11:00:00Z',
        location: 'Seattle Port Storage',
        description: 'Refrigerated cargo cleared export logistics check.',
        status: 'received'
      }
    ]
  },
  {
    id: 'US-8820-4137',
    senderName: 'Auto Parts Distribution',
    senderAddress: '2400 Pulaski Hwy, Chicago, IL 60623',
    receiverName: 'Apex Repair Garages',
    receiverAddress: '1500 SW 8th St, Miami, FL 33135',
    originCity: 'Chicago',
    originCountry: 'USA',
    destinationCity: 'Miami',
    destinationCountry: 'USA',
    status: 'delivered',
    carrier: 'UPS Transport',
    shippingMethod: 'Ground Transport',
    weight: 95,
    dimensions: '30x20x15 in',
    estimatedDelivery: '2026-05-20',
    isActive: true,
    visibility: 'visible',
    cargoValue: 1200,
    history: [
      {
        id: 'h14',
        timestamp: '2026-05-20T14:45:00Z',
        location: 'Miami Auto Center, FL',
        description: 'Delivered. Received at loading dock. Signed for by: M. Rodriguez.',
        status: 'delivered'
      },
      {
        id: 'h15',
        timestamp: '2026-05-20T08:00:00Z',
        location: 'Miami Sorting Facility, FL',
        description: 'Out for local delivery en route to repair shop.',
        status: 'out_for_delivery'
      },
      {
        id: 'h16',
        timestamp: '2026-05-19T03:00:00Z',
        location: 'Atlanta Regional Transit, GA',
        description: 'Transited southern interchange. Sorted for Florida destination.',
        status: 'transit'
      },
      {
        id: 'h17',
        timestamp: '2026-05-18T10:30:00Z',
        location: 'Chicago Hub, IL',
        description: 'Processed and loaded into intercity trailer.',
        status: 'received'
      }
    ]
  }
];

const LOCAL_STORAGE_KEY = 'us_logistics_shipments';

export function getShipments(): Shipment[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SHIPMENTS));
    return INITIAL_SHIPMENTS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse shipments from localStorage', e);
    return INITIAL_SHIPMENTS;
  }
}

export function saveShipments(shipments: Shipment[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(shipments));
}

export function getShipmentByTrackingNumber(trackingNumber: string): Shipment | undefined {
  const shipments = getShipments();
  const normalizedSearch = trackingNumber.trim().toUpperCase();
  return shipments.find(s => s.id.toUpperCase() === normalizedSearch);
}
