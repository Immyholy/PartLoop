import { Link } from "@tanstack/react-router";
import logo from "@/assets/partloop-logo.jpg.asset.json";

export function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <Link to="/" aria-label="PartLoop home" className="inline-flex items-center">
      <img src={logo.url} alt="PartLoop" className={`${className} w-auto mix-blend-multiply object-contain`} width={1280} height={640} />
    </Link>
  );
}
