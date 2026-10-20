export const CATEGORIES = ["phone", "laptop", "tablet", "smartwatch", "other"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABEL: Record<Category, string> = {
  phone: "Phones",
  laptop: "Laptops",
  tablet: "Tablets",
  smartwatch: "Smartwatches",
  other: "Other gadgets",
};

export const AREAS = ["Gwagwalada", "Wuse/Banex", "Kubwa", "Gwarinpa", "Kuje", "Guzape", "Garki", "Lugbe"] as const;
export type Area = (typeof AREAS)[number];

export const PICKUP = ["seller_location", "meet_public", "buyer_pickup", "flexible"] as const;
export type Pickup = (typeof PICKUP)[number];
export const PICKUP_LABEL: Record<Pickup, string> = {
  seller_location: "Pickup at seller's area",
  meet_public: "Meet in a public place",
  buyer_pickup: "Buyer arranges pickup",
  flexible: "Flexible",
};

export const ROLES = ["buyer", "seller", "technician"] as const;
export type Role = (typeof ROLES)[number];
export const ROLE_LABEL: Record<Role, string> = {
  buyer: "Parts buyer",
  seller: "Device seller",
  technician: "Repair technician",
};

export type DeviceStatus = "draft" | "published" | "reserved" | "sold";

export type SessionSource = "demo" | "supabase";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  source: SessionSource;
}

export interface Device {
  id: string;
  title: string;
  category: Category;
  brand: string;
  model: string;
  description: string;
  faults: string[];
  workingParts: string[];
  price: number;
  area: Area;
  pickup: Pickup;
  status: DeviceStatus;
  image: string;
  sellerId: string;
  sellerName: string;
  verifiedTechnician: boolean;
  createdAt: string;
}

export interface PartsRequest {
  id: string;
  category: Category;
  brand: string;
  model: string;
  component: string;
  details: string;
  budgetMin: number;
  budgetMax: number;
  area: Area;
  requesterId: string;
  requesterName: string;
  status: "open" | "fulfilled" | "closed";
  createdAt: string;
}

export interface ChatThread {
  id: string;
  ownerId: string;
  otherName: string;
  title: string;
  deviceId?: string;
  requestId?: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  authorName: string;
  body: string;
  createdAt: string;
}
