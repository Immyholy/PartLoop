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

export type DeviceStatus = "draft" | "published" | "reserved" | "sold";

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
  requesterName: string;
  status: "open" | "fulfilled" | "closed";
  createdAt: string;
}
