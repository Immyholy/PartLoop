import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageBits";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — PartLoop" },
      { name: "description", content: "What the PartLoop demo stores on your device, and what live mode would store later." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PageHeader title="Privacy" subtitle="Short version for the Abuja demo pilot. This is not legal advice." />
      <div className="card-surface space-y-4 p-6 text-sm leading-relaxed text-muted-foreground">
        <p>Listings show an area (for example Kubwa), never a street address.</p>
        <p>Demo sessions, saved listings and demo messages are stored in your browser (localStorage). We do not send that data to a server in demo mode.</p>
        <p>If you enable live Supabase later, account email and listings would be stored in your Supabase project. Do not put secrets in the client beyond the public anon key.</p>
        <p>Do not upload ID documents or bank details into this demo.</p>
      </div>
    </div>
  );
}
