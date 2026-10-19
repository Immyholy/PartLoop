import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeviceCard, EmptyState } from "@/components/site/Cards";
import { selectDevices, useDemo } from "@/services/demo-store";
import { AREAS, CATEGORIES, CATEGORY_LABEL } from "@/types";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.enum(CATEGORIES).optional(),
  area: z.string().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc"]).optional(),
});

export const Route = createFileRoute("/explore")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Explore damaged devices — PartLoop" },
      { name: "description", content: "Browse damaged phones, laptops and tablets for parts or repair in Abuja." },
      { property: "og:title", content: "Explore devices — PartLoop" },
      { property: "og:description", content: "Find a donor device for the part you need." },
    ],
  }),
  component: Explore,
});

function Explore() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: "/explore" });
  const devices = useDemo(selectDevices);
  const set = (patch: Partial<z.infer<typeof searchSchema>>) => navigate({ search: (p) => ({ ...p, ...patch }), replace: true });

  const results = useMemo(() => {
    const q = (s.q ?? "").toLowerCase().trim();
    const list = devices.filter((d) =>
      d.status !== "draft" && d.status !== "sold" &&
      (!s.category || d.category === s.category) &&
      (!s.area || d.area === s.area) &&
      (!q || [d.title, d.brand, d.model, d.description, ...d.workingParts].join(" ").toLowerCase().includes(q)),
    );
    if (s.sort === "price_asc") return [...list].sort((a, b) => a.price - b.price);
    if (s.sort === "price_desc") return [...list].sort((a, b) => b.price - a.price);
    return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [devices, s]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Explore devices</h1>
      <p className="mt-1 text-sm text-muted-foreground">Condition reported by seller — verify parts before paying.</p>

      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <label htmlFor="q" className="sr-only">Search</label>
          <Input id="q" defaultValue={s.q} onChange={(e) => set({ q: e.target.value || undefined })} placeholder="Brand, model or part" className="h-11 bg-card pl-9" />
        </div>
        <Select value={s.area ?? "all"} onValueChange={(v) => set({ area: v === "all" ? undefined : v })}>
          <SelectTrigger className="h-11 bg-card" aria-label="Area"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Abuja areas</SelectItem>
            {AREAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={s.sort ?? "newest"} onValueChange={(v) => set({ sort: v as "newest" })}>
          <SelectTrigger className="h-11 bg-card" aria-label="Sort"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: low to high</SelectItem>
            <SelectItem value="price_desc">Price: high to low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Category">
        {[undefined, ...CATEGORIES].map((c) => {
          const active = s.category === c;
          return (
            <button key={c ?? "all"} type="button" aria-pressed={active} onClick={() => set({ category: c })}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"}`}>
              {c ? CATEGORY_LABEL[c] : "All"}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">{results.length} result{results.length === 1 ? "" : "s"}</p>
      {results.length ? (
        <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{results.map((d) => <DeviceCard key={d.id} d={d} />)}</div>
      ) : (
        <div className="mt-3"><EmptyState title="No devices match yet" body="Try a different model or area — or post a parts request so sellers can find you." /></div>
      )}
    </div>
  );
}
