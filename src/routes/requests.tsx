import { createFileRoute, Link } from "@tanstack/react-router";
import { RequestCard } from "@/components/site/Cards";
import { PageHeader } from "@/components/site/PageBits";
import { Button } from "@/components/ui/button";
import { selectRequests, useDemo } from "@/services/demo-store";

export const Route = createFileRoute("/requests")({
  head: () => ({
    meta: [
      { title: "Parts wanted — PartLoop" },
      { name: "description", content: "Open parts requests from technicians and buyers in Abuja." },
    ],
  }),
  component: RequestsPage,
});

function RequestsPage() {
  const requests = useDemo(selectRequests);
  const open = requests.filter((r) => r.status === "open");
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader title="Parts wanted" subtitle="Technicians and buyers looking for a specific donor part." />
        <Button asChild className="mb-8 rounded-full"><Link to="/requests/new">Post a request</Link></Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {open.map((r) => (
          <Link key={r.id} to="/requests/$id" params={{ id: r.id }} className="block">
            <RequestCard r={r} />
          </Link>
        ))}
      </div>
    </div>
  );
}
