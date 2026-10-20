
import { Link } from "@tanstack/react-router";

import {
  Apple,
  Compass,
  Facebook,
  Home,
  Mail,
  Play,
  Search,
  User,
} from "lucide-react";

import { Logo } from "./Logo";

import { Button } from "@/components/ui/button";

import {
  demo,
  selectUser,
  useDemo,
} from "@/services/demo-store";

// ======================================
// PARTLOOP NAVIGATION
// ======================================

const NAV = [
  {
    to: "/explore",
    label: "Explore",
  },
  {
    to: "/requests",
    label: "Parts wanted",
  },
  {
    to: "/safety",
    label: "Safety",
  },
] as const;

// ======================================
// OLD BANNER DISABLED
// ======================================

export function DemoBanner() {
  return null;
}

// ======================================
// MAIN HEADER
// ======================================

export function SiteHeader() {
  const user = useDemo(selectUser);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-xl">

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">

        {/* Brand */}

        <Logo />

        {/* Desktop navigation */}

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-2 md:flex"
        >

          {NAV.map((item) => (

            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{
                className:
                  "bg-secondary text-foreground",
              }}
            >
              {item.label}
            </Link>

          ))}

        </nav>

        {/* Account */}

        <div className="flex items-center gap-2">

          {user ? (

            <>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="rounded-full"
              >
                <Link to="/account">
                  {user.name.split(" ")[0]}
                </Link>
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => demo.signOut()}
              >
                Sign out
              </Button>
            </>

          ) : (

            <Button
              asChild
              size="sm"
              className="rounded-full px-5"
            >
              <Link to="/auth">
                Sign in
              </Link>
            </Button>

          )}

        </div>

      </div>

    </header>
  );
}

// ======================================
// MOBILE BOTTOM NAVIGATION
// ======================================

export function BottomNav() {
  const user = useDemo(selectUser);

  const accountTo = user ? "/account" : "/auth";

  const items = [
    {
      to: "/",
      label: "Home",
      icon: Home,
    },
    {
      to: "/explore",
      label: "Explore",
      icon: Compass,
    },
    {
      to: "/requests",
      label: "Wanted",
      icon: Search,
    },
    {
      to: accountTo,
      label: "Account",
      icon: User,
    },
  ] as const;

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur-xl md:hidden"
    >

      <ul className="grid grid-cols-4">

        {items.map(({ to, label, icon: Icon }) => (

          <li key={label}>

            <Link
              to={to}
              {...(
                to === "/"
                  ? {
                      activeOptions: {
                        exact: true,
                      } as const,
                    }
                  : {}
              )}
              className="flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{
                className: "text-green-700",
              }}
            >

              <Icon
                className="h-5 w-5"
                aria-hidden="true"
              />

              <span>{label}</span>

            </Link>

          </li>

        ))}

      </ul>

    </nav>
  );
}

// ======================================
// FOOTER
// ======================================

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border/60 bg-slate-50 pb-24 md:pb-0">

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">

        {/* BRAND */}

        <div>

          <Logo className="h-12" />

          <p className="mt-4 text-sm leading-7 text-slate-600">

            Connecting device owners, repair technicians
            and spare-parts buyers.

            Giving damaged electronics another chance.

          </p>

          <p className="mt-4 text-xs font-semibold text-green-700">
            Starting in Abuja, Nigeria
          </p>

        </div>

        {/* MARKETPLACE */}

        <div className="space-y-3 text-sm">

          <h3 className="mb-4 font-bold text-slate-900">
            Marketplace
          </h3>

          <Link
            to="/"
            className="block text-slate-600 hover:text-green-700"
          >
            Home
          </Link>

          <Link
            to="/explore"
            className="block text-slate-600 hover:text-green-700"
          >
            Explore devices
          </Link>

          <Link
            to="/requests"
            className="block text-slate-600 hover:text-green-700"
          >
            Parts wanted
          </Link>

          <Link
            to="/how-it-works"
            className="block text-slate-600 hover:text-green-700"
          >
            How PartLoop works
          </Link>

        </div>

        {/* TRUST AND POLICIES */}

        <div className="space-y-3 text-sm">

          <h3 className="mb-4 font-bold text-slate-900">
            Trust & Information
          </h3>

          <Link
            to="/safety"
            className="block text-slate-600 hover:text-green-700"
          >
            Safety guidelines
          </Link>

          <Link
            to="/privacy"
            className="block text-slate-600 hover:text-green-700"
          >
            Privacy Policy
          </Link>

          <Link
            to="/terms"
            className="block text-slate-600 hover:text-green-700"
          >
            Terms & Conditions
          </Link>

        </div>

        {/* CONTACT */}

        <div className="space-y-4 text-sm">

          <h3 className="font-bold text-slate-900">
            Connect with PartLoop
          </h3>

          <a
            href="mailto:partloop.ng@gmail.com"
            className="flex items-start gap-2 text-slate-600 hover:text-green-700"
          >
            <Mail className="mt-0.5 h-4 w-4 shrink-0" />

            <span className="break-all">
              partloop.ng@gmail.com
            </span>
          </a>

          <a
            href="https://www.facebook.com/share/1W9nRCUzcX/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-600 hover:text-green-700"
          >
            <Facebook className="h-4 w-4" />

            Facebook
          </a>

          <div className="pt-3">

            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-700">
              Mobile apps
            </p>

            <div className="flex flex-wrap gap-2">

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-500">

                <Apple className="h-5 w-5" />

                <div className="leading-tight">
                  <p className="text-xs font-semibold">
                    App Store
                  </p>
                  <p className="text-[10px]">
                    Coming soon
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-500">

                <Play className="h-5 w-5" />

                <div className="leading-tight">
                  <p className="text-xs font-semibold">
                    Google Play
                  </p>
                  <p className="text-[10px]">
                    Coming soon
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* COPYRIGHT */}

      <div className="border-t border-slate-200 px-5 py-5 text-center">

        <p className="text-xs text-slate-500">

          © {new Date().getFullYear()} PartLoop.
          All rights reserved.

        </p>

        <p className="mt-2 text-xs text-slate-500">

          Some marketplace listings are illustrative
          and are not available for purchase.

        </p>

      </div>

    </footer>
  );
}
