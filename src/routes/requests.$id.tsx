import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { MapPin, Wrench } from "lucide-react";
import { toast } from "sonner";
import { DemoNotice, PageHeader } from "@/components/site/PageBits";
import { Button } from "@/components/ui/button";
import { formatNGN } from "@/lib/format";
import { demo, selectRequests, selectUser, useDemo } from "@/services/demo-store";

export const Route = createFileRoute("/requests/$id")({
  head: () => ({
    meta: [
      { title: "Parts request — PartLoop" },
      { name: "description", content: "A technician or buyer looking for a specific part on PartLoop." },
    ],
  }),
  component: RequestDetail,
});

function RequestDetail() {
  const { id } = Route.useParams();
  const requests = useDemo(selectRequests);
  const user = useDemo(selectUser);
  const navigate = useNavigate();
  const r = requests.find((x) => x.id === id);
  if (!r) throw notFound();

  const message = () => {
    if (!user) {
      toast("Sign in to continue", { action: { label: "Sign in", onClick: () => { void navigate({ to: "/auth", search: { next: `/requests/${r.id}` } }); } } });
      return;
    }
    const thread = demo.openThread({
      title: `${r.component} · ${r.model}`,
      otherName: r.requesterName,
      requestId: r.id,
    });
    toast.success("Demo thread opened");
    void navigate({ to: "/messages/$id", params: { id: thread.id } });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/requests" className="text-sm text-muted-foreground hover:text-foreground">← All requests</Link>
      <div className="mt-6 card-surface p-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-accent-foreground">
          <Wrench className="h-3.5 w-3.5" />{r.status}
        </span>
        <PageHeader title={r.component} subtitle={`${r.brand} · ${r.model}`} />
        {r.details ? <p className="text-sm leading-relaxed">{r.details}</p> : null}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <span className="font-semibold">{formatNGN(r.budgetMin)} – {formatNGN(r.budgetMax)}</span>
          <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" />{r.area}</span>
          <span className="text-muted-foreground">{r.requesterName}</span>
        </div>
        <DemoNotice>Contacting the requester in demo mode writes a local message thread only.</DemoNotice>
        <Button className="rounded-full" onClick={message}>Message requester (demo)</Button>
      </div>
    </div>
  );
}
