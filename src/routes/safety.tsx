import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageBits";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety — PartLoop" },
      { name: "description", content: "How to trade damaged devices more safely during the PartLoop Abuja pilot." },
    ],
  }),
  component: SafetyPage,
});

function SafetyPage() {
  const tips = [
    ["Verify before you pay", "Condition is reported by the seller. Power on the device and check the parts you care about before handing over cash."],
    ["Meet in public", "Busy spots in Wuse, Garki or a well-known plaza during the day are safer than isolated compounds."],
    ["Keep numbers private", "Use in-app demo messages first. Share a phone number only when you are ready to meet."],
    ["No payment processing", "This pilot does not hold money, escrow or logistics. If someone asks you to pay online as “PartLoop”, it is not us."],
    ["Report problems", "Use Report on a listing. In demo mode that note stays local; live reporting needs the backend."],
  ];
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PageHeader title="Trade safely" subtitle="PartLoop is a matching tool. You are still responsible for the meetup." />
      <ul className="space-y-4">
        {tips.map(([t, b]) => (
          <li key={t} className="card-surface p-6">
            <h2 className="font-semibold">{t}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{b}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
