import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare, PackageSearch, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageBits";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — PartLoop" },
      { name: "description", content: "List a damaged device, get matched with technicians, meet and agree in Abuja." },
    ],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PageHeader title="How PartLoop works" subtitle="A simple loop between owners, technicians and parts buyers in Abuja." />
      <ol className="space-y-4">
        {[
          { icon: PackageSearch, t: "List it honestly", b: "Sellers add brand, exact model, faults, working parts, area and a price. Photos in demo mode use a sample image until live storage is connected." },
          { icon: MessageSquare, t: "Get matched", b: "Technicians search devices or post a parts request. Buyers message from a listing. Demo messages stay on this device." },
          { icon: Wallet, t: "Meet and agree", b: "PartLoop does not take payment in this pilot. Meet in public, inspect the device, then agree the deal in person." },
        ].map(({ icon: Icon, t, b }, i) => (
          <li key={t} className="card-surface flex gap-4 p-6">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-accent-foreground"><Icon className="h-5 w-5" /></span>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Step 0{i + 1}</p>
              <h2 className="font-semibold">{t}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{b}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild className="rounded-full"><Link to="/sell/new">Sell a device</Link></Button>
        <Button asChild variant="outline" className="rounded-full"><Link to="/explore">Find a part</Link></Button>
      </div>
    </div>
  );
}
