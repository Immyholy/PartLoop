import { Link } from "@tanstack/react-router";
import logo from "@/assets/partloop-logo.jpg.asset.json";

export function Logo({ className = "h-11" }: { className?: string }) {
  return (
    <Link to="/" aria-label="PartLoop home" className="inline-flex items-center">
      <img src={logo.url} alt="PartLoop" className={`${className} w-auto object-contain mix-blend-multiply`} width={748} height={496} />
    </Link>
  );
}
