import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AlertTriangle, BadgeCheck, CheckCircle2, Flag, Heart, MapPin, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DEMO_DEVICES } from "@/data/demo/fixtures";
import { formatNGN } from "@/lib/format";
import { demo, selectDevices, selectFavorites, selectUser, useDemo } from "@/services/demo-store";
import { PICKUP_LABEL } from "@/types";

export const Route = createFileRoute("/devices/$id")({
  head: ({ params }) => {
    const d = DEMO_DEVICES.find((x) => x.id === params.id);
    const title = d ? `${d.title} — PartLoop` : "Device listing — PartLoop";
    const desc = d ? `${d.brand} ${d.model} in ${d.area}. ${formatNGN(d.price)}.` : "Damaged device listing on PartLoop.";
    return { meta: [{ title }, { name: "description", content: desc }, { property: "og:title", content: title }, { property: "og:description", content: desc }] };
  },
  component: DevicePage,
});

function DevicePage() {
  const { id } = Route.useParams();
  const devices = useDemo(selectDevices);
  const favs = useDemo(selectFavorites);
  const user = useDemo(selectUser);
  const d = devices.find((x) => x.id === id);
  if (!d) throw notFound();
  const needAuth = (msg: string) => () => (user ? toast.success(`${msg} (demo — not sent)`) : toast("Sign in to continue", { action: { label: "Sign in", onClick: () => (window.location.href = "/auth") } }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-32 md:pb-8">
      <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground">← Back to explore</Link>
      <div className="mt-4 grid gap-8 md:grid-cols-[1.2fr_1fr]">
        <div className="card-surface overflow-hidden">
          <img src={d.image} alt={d.title} width={944} height={704} className="aspect-[4/3] w-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{d.brand} · {d.model}</p>
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">{d.title}</h1>
          <p className="mt-3 text-3xl font-extrabold">{formatNGN(d.price)}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{d.area} (area only)</span>
            <span className="flex items-center gap-1"><Truck className="h-4 w-4" />{PICKUP_LABEL[d.pickup]}</span>
          </div>
          {d.status === "reserved" && <p className="mt-3 rounded-lg bg-warning-soft px-3 py-2 text-sm font-medium text-warning">Reserved — the seller is talking to a buyer.</p>}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-destructive"><AlertTriangle className="h-4 w-4" />Known faults</p>
              <ul className="mt-2 space-y-1 text-sm">{d.faults.map((f) => <li key={f}>{f}</li>)}</ul>
            </div>
            <div className="rounded-xl border bg-brand-soft p-4">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-accent-foreground"><CheckCircle2 className="h-4 w-4" />Working parts (unverified)</p>
              <ul className="mt-2 space-y-1 text-sm">{d.workingParts.length ? d.workingParts.map((f) => <li key={f}>{f}</li>) : <li>None listed</li>}</ul>
            </div>
          </div>
          {d.description && <p className="mt-5 text-sm leading-relaxed">{d.description}</p>}
          <p className="mt-4 text-xs text-muted-foreground">Condition reported by seller — verify parts before paying.</p>

          <div className="mt-5 flex items-center gap-2 rounded-xl border bg-card p-3 text-sm">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary font-semibold">{d.sellerName.at(-1)}</span>
            <span className="font-medium">{d.sellerName}</span>
            {d.verifiedTechnician && <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-accent-foreground"><BadgeCheck className="h-4 w-4 text-brand" />Verified technician</span>}
          </div>

          <div className="fixed inset-x-0 bottom-14 z-30 flex gap-2 border-t bg-card p-3 md:static md:mt-6 md:border-0 md:bg-transparent md:p-0">
            <Button className="flex-1 rounded-full" size="lg" onClick={needAuth("Offer drafted")}>Make an offer</Button>
            <Button variant="outline" className="flex-1 rounded-full" size="lg" onClick={needAuth("Message drafted")}>Message seller</Button>
            <Button variant="outline" size="icon-lg" className="rounded-full" aria-label="Save" onClick={() => (user ? demo.toggleFavorite(d.id) : toast("Sign in to save listings"))}>
              <Heart className={favs.includes(d.id) ? "fill-destructive text-destructive" : ""} />
            </Button>
          </div>
          <button type="button" onClick={needAuth("Report noted")} className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><Flag className="h-3.5 w-3.5" />Report this listing</button>
        </div>
      </div>
    </div>
  );
}
