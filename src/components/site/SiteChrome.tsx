import { Link } from "@tanstack/react-router";
import { Compass, Home, PackagePlus, Search, User } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { demo, selectUser, useDemo } from "@/services/demo-store";

const NAV = [
  { to: "/explore", label: "Explore" },
  { to: "/requests", label: "Parts wanted" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/safety", label: "Safety" },
] as const;

export function DemoBanner() {
  return (
    <div className="bg-primary px-4 py-1.5 text-center text-xs font-medium text-primary-foreground">
      <span className="mr-1.5 rounded bg-brand px-1.5 py-0.5 font-bold text-brand-foreground">DEMO</span>
      Sample listings only — nothing here is a real person, device or payment.
    </div>
  );
}

export function SiteHeader() {
  const user = useDemo(selectUser);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" activeProps={{ className: "bg-secondary text-foreground" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Button variant="ghost" size="sm" onClick={() => demo.signOut()}>Sign out</Button>
          ) : (
            <Button asChild variant="ghost" size="sm"><Link to="/auth">Sign in</Link></Button>
          )}
          <Button asChild size="sm" className="hidden rounded-full sm:inline-flex"><Link to="/sell/new">Sell a device</Link></Button>
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/explore", label: "Explore", icon: Compass },
    { to: "/sell/new", label: "Sell", icon: PackagePlus },
    { to: "/requests", label: "Wanted", icon: Search },
    { to: "/auth", label: "Account", icon: User },
  ] as const;
  return (
    <nav aria-label="Mobile" className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur md:hidden">
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link to={to} activeOptions={{ exact: to === "/" }} className="flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-muted-foreground" activeProps={{ className: "text-foreground" }}>
              <Icon className="h-5 w-5" aria-hidden />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-card pb-24 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo className="h-14" />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">Your broken device. Someone else's missing part. Piloting in Abuja.</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Marketplace</p>
          <Link to="/explore" className="block text-muted-foreground hover:text-foreground">Explore devices</Link>
          <Link to="/requests" className="block text-muted-foreground hover:text-foreground">Parts wanted</Link>
          <Link to="/sell/new" className="block text-muted-foreground hover:text-foreground">Sell a device</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Trust</p>
          <Link to="/safety" className="block text-muted-foreground hover:text-foreground">Safety</Link>
          <Link to="/privacy" className="block text-muted-foreground hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="block text-muted-foreground hover:text-foreground">Terms</Link>
        </div>
      </div>
      <p className="border-t px-4 py-4 text-center text-xs text-muted-foreground">© 2026 PartLoop · Demo pilot — not an operational payment or logistics service.</p>
    </footer>
  );
}
