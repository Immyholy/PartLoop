import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageBits";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — PartLoop" },
      { name: "description", content: "Demo terms for the PartLoop Abuja marketplace pilot." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PageHeader title="Terms" subtitle="Demo pilot — not an operational payment or logistics service." />
      <div className="card-surface space-y-4 p-6 text-sm leading-relaxed text-muted-foreground">
        <p>PartLoop connects people. It does not buy devices, guarantee parts, or process payments in this version.</p>
        <p>Sample listings, names and requests are fictional. Demo sessions are not real accounts.</p>
        <p>You agree to describe faults honestly, meet safely, and inspect goods before paying.</p>
        <p>We may reset demo data. Live terms will be published when the production backend is launched.</p>
      </div>
    </div>
  );
}
