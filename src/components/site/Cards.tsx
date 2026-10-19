import { Link } from "@tanstack/react-router";
import { BadgeCheck, Heart, MapPin, Wrench } from "lucide-react";
import { formatNGN, timeAgo } from "@/lib/format";
import { CATEGORY_LABEL, type Device, type PartsRequest } from "@/types";
import { demo, selectFavorites, selectUser, useDemo } from "@/services/demo-store";
import { toast } from "sonner";

export function DeviceCard({ d }: { d: Device }) {
  const favs = useDemo(selectFavorites);
  const user = useDemo(selectUser);
  const saved = favs.includes(d.id);
  return (
    <article className="card-surface lift group relative overflow-hidden">
      <Link to="/devices/$id" params={{ id: d.id }} className="block focus-visible:outline-none">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img src={d.image} alt={d.title} loading="lazy" width={944} height={704} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
          <div className="absolute left-3 top-3 flex gap-1.5">
            <span className="rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">{CATEGORY_LABEL[d.category].replace(/s$/, "")}</span>
            {d.status === "reserved" && <span className="rounded-full bg-warning-soft px-2.5 py-1 text-[11px] font-semibold text-warning">Reserved</span>}
          </div>
        </div>
        <div className="space-y-2 p-4">
          <p className="text-xs font-medium text-muted-foreground">{d.brand} · {d.model}</p>
          <h3 className="line-clamp-2 font-semibold leading-snug">{d.title}</h3>
          <div className="flex items-center justify-between pt-1">
            <span className="text-lg font-bold">{formatNGN(d.price)}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" aria-hidden />{d.area}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">{d.verifiedTechnician && <BadgeCheck className="h-3.5 w-3.5 text-brand" aria-label="Verified technician" />}{d.sellerName}</span>
            <span>{timeAgo(d.createdAt)}</span>
          </div>
        </div>
      </Link>
      <button
        type="button"
        aria-pressed={saved}
        aria-label={saved ? "Remove from saved" : "Save listing"}
        onClick={() => {
          if (!user) return toast("Sign in to save listings");
          demo.toggleFavorite(d.id);
        }}
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/90 backdrop-blur transition hover:scale-105"
      >
        <Heart className={`h-4 w-4 ${saved ? "fill-destructive text-destructive" : ""}`} />
      </button>
    </article>
  );
}

export function RequestCard({ r }: { r: PartsRequest }) {
  return (
    <article className="card-surface flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-accent-foreground"><Wrench className="h-3.5 w-3.5" aria-hidden />Wanted</span>
        <span className="text-xs text-muted-foreground">{timeAgo(r.createdAt)}</span>
      </div>
      <div>
        <h3 className="font-semibold">{r.component}</h3>
        <p className="text-sm text-muted-foreground">{r.brand} · {r.model}</p>
      </div>
      {r.details && <p className="text-sm">{r.details}</p>}
      <div className="mt-auto flex items-center justify-between border-t pt-3 text-sm">
        <span className="font-semibold">{formatNGN(r.budgetMin)} – {formatNGN(r.budgetMax)}</span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" aria-hidden />{r.area}</span>
      </div>
    </article>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="card-surface flex flex-col items-center gap-2 p-10 text-center">
      <p className="font-semibold">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
