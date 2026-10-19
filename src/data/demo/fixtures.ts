import phone from "@/assets/device-phone.jpg";
import laptop from "@/assets/device-laptop.jpg";
import tablet from "@/assets/device-tablet.jpg";
import type { Device, PartsRequest } from "@/types";

// Fictional demo data only. No real people, numbers or survey respondents.
const day = 86400000;
const base = Date.UTC(2026, 9, 18, 12);
const at = (daysAgo: number) => new Date(base - daysAgo * day).toISOString();

export const DEMO_DEVICES: Device[] = [
  {
    id: "d1", title: "iPhone 12 — cracked screen, boots fine", category: "phone", brand: "Apple", model: "iPhone 12 (A2403)",
    description: "Dropped it last month. Screen is cracked but touch still works in most areas. Face ID works.",
    faults: ["Cracked front glass", "Battery health 78%"], workingParts: ["Logic board", "Rear camera", "Face ID", "Speakers"],
    price: 115000, area: "Wuse/Banex", pickup: "meet_public", status: "published", image: phone, sellerName: "Demo seller A", verifiedTechnician: false, createdAt: at(0.2),
  },
  {
    id: "d2", title: "MacBook Pro 13\" 2020 — dead display", category: "laptop", brand: "Apple", model: "MacBook Pro 13 M1 (A2338)",
    description: "Display shows lines then went black. Keyboard and trackpad are fine. Dent near the hinge.",
    faults: ["Display assembly damaged", "Dent on bottom case"], workingParts: ["Keyboard", "Trackpad", "Battery", "Charging port"],
    price: 320000, area: "Gwarinpa", pickup: "seller_location", status: "published", image: laptop, sellerName: "Demo seller B", verifiedTechnician: false, createdAt: at(1),
  },
  {
    id: "d3", title: "Samsung Galaxy Tab A8 — won't charge", category: "tablet", brand: "Samsung", model: "Galaxy Tab A8 (SM-X200)",
    description: "Back cover already opened. Stopped charging after a power surge. Screen has no cracks.",
    faults: ["Not charging", "Possible charging IC fault"], workingParts: ["Screen", "Battery (untested)", "Camera"],
    price: 45000, area: "Kubwa", pickup: "flexible", status: "published", image: tablet, sellerName: "Demo technician C", verifiedTechnician: true, createdAt: at(2),
  },
  {
    id: "d4", title: "Tecno Camon 20 — water damage", category: "phone", brand: "Tecno", model: "Camon 20 (CK6n)",
    description: "Fell into water. Phone vibrates but screen stays black.",
    faults: ["No display", "Water damage"], workingParts: ["Back glass", "Rear camera (unverified)"],
    price: 28000, area: "Gwagwalada", pickup: "buyer_pickup", status: "published", image: phone, sellerName: "Demo seller D", verifiedTechnician: false, createdAt: at(3),
  },
  {
    id: "d5", title: "HP EliteBook 840 G5 — no power", category: "laptop", brand: "HP", model: "EliteBook 840 G5",
    description: "Laptop doesn't power on. Screen and keyboard were perfect before.",
    faults: ["No power"], workingParts: ["Screen", "Keyboard", "8GB RAM", "256GB SSD"],
    price: 95000, area: "Guzape", pickup: "meet_public", status: "reserved", image: laptop, sellerName: "Demo seller E", verifiedTechnician: false, createdAt: at(4),
  },
  {
    id: "d6", title: "iPad 9th gen — shattered digitizer", category: "tablet", brand: "Apple", model: "iPad 9th gen (A2602)",
    description: "Digitizer shattered, LCD underneath looks fine.",
    faults: ["Broken digitizer"], workingParts: ["LCD", "Battery", "Logic board", "Home button"],
    price: 70000, area: "Kuje", pickup: "seller_location", status: "published", image: tablet, sellerName: "Demo seller F", verifiedTechnician: false, createdAt: at(5),
  },
];

export const DEMO_REQUESTS: PartsRequest[] = [
  { id: "r1", category: "phone", brand: "Apple", model: "iPhone 12 (A2403)", component: "Rear camera module", details: "Original only. Customer's camera is blurry.", budgetMin: 20000, budgetMax: 35000, area: "Wuse/Banex", requesterName: "Demo technician G", status: "open", createdAt: at(0.5) },
  { id: "r2", category: "laptop", brand: "HP", model: "EliteBook 840 G5", component: "Motherboard", details: "Need a working board, i5 8th gen preferred.", budgetMin: 40000, budgetMax: 70000, area: "Garki", requesterName: "Demo buyer H", status: "open", createdAt: at(1.5) },
  { id: "r3", category: "tablet", brand: "Samsung", model: "Galaxy Tab A8 (SM-X200)", component: "LCD screen", details: "Screen with frame if possible.", budgetMin: 25000, budgetMax: 40000, area: "Lugbe", requesterName: "Demo technician I", status: "open", createdAt: at(2.5) },
  { id: "r4", category: "phone", brand: "Infinix", model: "Hot 30 (X6831)", component: "Charging board", details: "Flex with USB-C port.", budgetMin: 3000, budgetMax: 7000, area: "Kubwa", requesterName: "Demo buyer J", status: "open", createdAt: at(3.5) },
];
