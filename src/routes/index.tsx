import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Leaf, MessageSquare, PackageSearch, Recycle, Search, ShieldCheck, Wallet, Wrench } from "lucide-react";
import { useState } from "react";
import hero from "@/assets/hero-loop.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DeviceCard, RequestCard } from "@/components/site/Cards";
import { selectDevices, selectRequests, useDemo } from "@/services/demo-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PartLoop — Sell broken gadgets, find parts in Abuja" },
      { name: "description", content: "List your damaged phone or laptop, or find a donor device for the part you need. PartLoop pilot in Abuja." },
      { property: "og:title", content: "PartLoop — Broken to you. Valuable to someone else." },
      { property: "og:description", content: "A marketplace for damaged devices and reusable parts, piloting in Abuja." },
    ],
  }),
  component: Index,
});

const FAQ = [
  ["Does PartLoop buy my device?", "No. PartLoop connects you with technicians and buyers. You agree a price directly with them."],
  ["How do payments work?", "This pilot doesn't process payments. Agree with the buyer and pay or collect in person, after checking the device."],
  ["Is my exact location shown?", "Never. Listings only show the area you type in, like Kubwa or Wuse/Banex."],
  ["Are working parts guaranteed?", "No. Condition is reported by the seller — always verify parts before paying."],
];

function Index() {
  const devices = useDemo(selectDevices);
  const requests = useDemo(selectRequests);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <section className="hero-glow relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 md:grid-cols-2 md:pt-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold"><span className="h-2 w-2 rounded-full bg-brand" />Now piloting in Abuja</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-6xl">Broken to you.<br /><span className="text-brand">Valuable</span> to someone else.</h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">List your damaged phone or laptop. Technicians find the parts they need. Everyone keeps value out of the bin.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full"><Link to="/sell/new">Sell a damaged device <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-card"><Link to="/explore">Find a part</Link></Button>
            </div>
            <form
              role="search"
              className="card-surface mt-8 flex max-w-md items-center gap-2 p-2"
              onSubmit={(e) => { e.preventDefault(); navigate({ to: "/explore", search: { q } }); }}
            >
              <Search className="ml-2 h-4 w-4 text-muted-foreground" aria-hidden />
              <label htmlFor="hero-q" className="sr-only">Search brand, model or part</label>
              <Input id="hero-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="iPhone 12, HP EliteBook, charging port…" className="border-0 shadow-none focus-visible:ring-0" />
              <Button type="submit" size="sm" className="rounded-full">Search</Button>
            </form>
          </div>
          <div className="relative">
            <img src={hero} alt="Device parts arranged in a loop" width={1200} height={1008} className="mx-auto w-full max-w-lg mix-blend-multiply" />
            <div className="absolute bottom-6 left-0 hidden rounded-2xl card-surface p-3 text-xs sm:block">
              <p className="font-semibold">{devices.filter((d) => d.status === "published").length} sample listings</p>
              <p className="text-muted-foreground">Demo illustration</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">How it works</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { icon: PackageSearch, t: "List it honestly", b: "Brand, exact model, what's broken and what still works. Add photos, your area and a price." },
            { icon: MessageSquare, t: "Get matched", b: "Technicians and parts buyers search by model and part, then message you or make an offer." },
            { icon: Wallet, t: "Meet & agree", b: "Meet in a safe place, let them check the device, then agree the deal in person." },
          ].map(({ icon: Icon, t, b }, i) => (
            <div key={t} className="card-surface p-6">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-accent-foreground"><Icon className="h-5 w-5" /></span>
                <span className="text-4xl font-extrabold text-border">0{i + 1}</span>
              </div>
              <h3 className="mt-4 font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold">Fresh on PartLoop</h2>
          <Link to="/explore" className="text-sm font-semibold hover:underline">See all →</Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {devices.slice(0, 6).map((d) => <DeviceCard key={d.id} d={d} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">Parts wanted</h2>
            <p className="mt-1 text-sm text-muted-foreground">Technicians looking for specific parts right now.</p>
          </div>
          <Link to="/requests" className="text-sm font-semibold hover:underline">All requests →</Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {requests.slice(0, 4).map((r) => <RequestCard key={r.id} r={r} />)}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-3">
          {[
            { icon: Wallet, t: "Recover value", b: "That drawer phone still has a working camera, board or battery someone needs." },
            { icon: Recycle, t: "Reduce e-waste", b: "Every reused part is one less new part shipped in and one less device dumped." },
            { icon: Wrench, t: "Repair locally", b: "Help Abuja technicians find donor parts faster for their customers." },
          ].map(({ icon: Icon, t, b }) => (
            <div key={t}>
              <Icon className="h-6 w-6 text-brand" />
              <h3 className="mt-3 text-lg font-semibold">{t}</h3>
              <p className="mt-1 text-sm opacity-75">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
        <div className="card-surface p-8">
          <ShieldCheck className="h-8 w-8 text-brand" />
          <h2 className="mt-4 text-2xl font-bold">Trade safely</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• Condition reported by seller — verify parts before paying.</li>
            <li>• Meet in busy public places during the day.</li>
            <li>• Keep your phone number private until you're ready.</li>
            <li>• Report anything that looks wrong.</li>
          </ul>
          <Link to="/safety" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold hover:underline">Read safety tips <Leaf className="h-4 w-4" /></Link>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Questions</h2>
          <Accordion type="single" collapsible className="mt-4">
            {FAQ.map(([q, a]) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger className="text-left">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}
