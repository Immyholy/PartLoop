
import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

import {
  ArrowUpRight,
  Heart,
  MapPin,
  PackageSearch,
  Wrench,
} from "lucide-react";

import { toast } from "sonner";

import { formatNGN } from "@/lib/format";
import { getSupabase } from "@/lib/supabase";

import {
  CATEGORY_LABEL,
  type Device,
  type PartsRequest,
} from "@/types";

import {
  demo,
  selectFavorites,
  useDemo,
} from "@/services/demo-store";

// ======================================
// CHECK REAL AUTHENTICATION
// ======================================

async function hasAuthenticatedAccount(): Promise<boolean> {
  const supabase = getSupabase();

  if (!supabase) {
    return false;
  }

  try {
    const { data, error } = await supabase.auth.getUser();

    return !error && Boolean(data.user);
  } catch {
    return false;
  }
}

// ======================================
// DEVICE CARD
// ======================================

export function DeviceCard({ d }: { d: Device }) {
  const navigate = useNavigate();

  const favorites = useDemo(selectFavorites);

  const [loading, setLoading] = useState(false);

  const saved = favorites.includes(d.id);

  // Keep the exact selected product for after login.
  const productPath = `/devices/${encodeURIComponent(d.id)}`;

  async function openDevice() {
    if (loading) return;

    setLoading(true);

    try {
      const authenticated = await hasAuthenticatedAccount();

      if (authenticated) {
        await navigate({
          to: "/devices/$id",
          params: {
            id: d.id,
          },
        });
      } else {
        await navigate({
          to: "/auth",
          search: {
            next: productPath,
          },
        });
      }
    } finally {
      setLoading(false);
    }
  }

  async function toggleSaved() {
    if (loading) return;

    setLoading(true);

    try {
      const authenticated = await hasAuthenticatedAccount();

      if (!authenticated) {
        await navigate({
          to: "/auth",
          search: {
            next: productPath,
          },
        });

        return;
      }

      // Temporary local favorites until the Supabase
      // favorites table is connected.
      demo.toggleFavorite(d.id);

      toast.success(
        saved
          ? "Removed from saved listings"
          : "Added to saved listings"
      );
    } catch {
      toast.error("Unable to save listing. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const categoryName =
    CATEGORY_LABEL[d.category] ?? "Electronics";

  return (
    <article className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/5">

      {/* PRODUCT LINK */}

      <Link
        to="/auth"
        search={{
          next: productPath,
        }}
        onClick={(event) => {
          // Preserve normal browser shortcuts for opening links
          // in another tab. The link still targets sign-in.
          if (
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          ) {
            return;
          }

          event.preventDefault();

          void openDevice();
        }}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-inset"
        aria-label={`View ${d.title}`}
      >

        {/* PRODUCT IMAGE */}

        <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">

          <img
            src={d.image}
            alt={d.title}
            loading="lazy"
            width={944}
            height={704}
            className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">

            <span className="rounded-full border border-white/70 bg-white/95 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur">

              {categoryName}

            </span>

          </div>

          <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/75 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
            Example listing
          </span>

          <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm transition-colors group-hover:bg-green-600 group-hover:text-white">

            <ArrowUpRight className="h-4 w-4" />

          </div>

        </div>

        {/* PRODUCT INFORMATION */}

        <div className="space-y-3 p-4 sm:p-5">

          <p className="truncate text-xs font-medium text-muted-foreground">
            {d.brand} · {d.model}
          </p>

          <h3 className="line-clamp-2 min-h-11 text-sm font-semibold leading-snug text-foreground sm:text-base">
            {d.title}
          </h3>

          <p className="text-xl font-extrabold tracking-tight text-foreground">
            {formatNGN(d.price)}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">

            <MapPin
              className="h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />

            <span className="truncate">
              {d.area}
            </span>

          </div>

          <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-3">

            <span className="text-xs text-muted-foreground">
              Device preview
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
              View details
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>

          </div>

        </div>

      </Link>

      {/* SAVE BUTTON */}

      <button
        type="button"
        disabled={loading}
        aria-pressed={saved}
        aria-label={
          saved
            ? "Remove from saved listings"
            : "Save this listing"
        }
        onClick={() => void toggleSaved()}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/95 text-slate-600 shadow-sm backdrop-blur transition-all hover:scale-105 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-60"
      >

        <Heart
          className={`h-4 w-4 ${
            saved
              ? "fill-red-500 text-red-500"
              : ""
          }`}
        />

      </button>

    </article>
  );
}

// ======================================
// PARTS REQUEST CARD
// ======================================

export function RequestCard({
  r,
}: {
  r: PartsRequest;
}) {
  return (
    <article className="flex min-w-0 flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:border-green-200 hover:shadow-md">

      {/* HEADING */}

      <div className="flex flex-wrap items-center justify-between gap-2">

        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">

          <Wrench
            className="h-3.5 w-3.5"
            aria-hidden="true"
          />

          Part wanted

        </span>

        <span className="text-[11px] text-muted-foreground">
          Example request
        </span>

      </div>

      {/* REQUEST INFORMATION */}

      <div>

        <h3 className="line-clamp-2 text-base font-bold leading-snug">
          {r.component}
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          {r.brand} · {r.model}
        </p>

      </div>

      {r.details && (
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {r.details}
        </p>
      )}

      {/* PRICE AND LOCATION */}

      <div className="mt-auto space-y-3 border-t border-border/70 pt-4">

        <div className="flex items-center gap-2">

          <PackageSearch
            className="h-4 w-4 shrink-0 text-green-700"
            aria-hidden="true"
          />

          <span className="text-sm font-bold">
            {formatNGN(r.budgetMin)}
            {" – "}
            {formatNGN(r.budgetMax)}
          </span>

        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">

          <MapPin
            className="h-3.5 w-3.5"
            aria-hidden="true"
          />

          <span>{r.area}</span>

        </div>

      </div>

    </article>
  );
}

// ======================================
// EMPTY STATE
// ======================================

type EmptyStateProps = {
  title: string;
  body: string;
  action?: ReactNode;
};

export function EmptyState({
  title,
  body,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card px-6 py-12 text-center">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">

        <PackageSearch className="h-7 w-7" />

      </div>

      <h3 className="text-lg font-bold">
        {title}
      </h3>

      <p className="max-w-sm text-sm leading-6 text-muted-foreground">
        {body}
      </p>

      {action && (
        <div className="mt-3">
          {action}
        </div>
      )}

    </div>
  );
}
