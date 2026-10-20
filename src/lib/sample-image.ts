import phone from "@/assets/device-phone.jpg";
import laptop from "@/assets/device-laptop.jpg";
import tablet from "@/assets/device-tablet.jpg";
import type { Category } from "@/types";

/** Demo listings cannot upload photos until live storage is connected. */
export function sampleImageFor(category: Category): string {
  if (category === "laptop") return laptop;
  if (category === "tablet") return tablet;
  return phone;
}
