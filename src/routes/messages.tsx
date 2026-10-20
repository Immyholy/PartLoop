import { createFileRoute, Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/site/Cards";
import { DemoNotice, NeedSession, PageHeader } from "@/components/site/PageBits";
import { selectThreads, selectUser, useDemo } from "@/services/demo-store";
import { timeAgo } from "@/lib/format";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — PartLoop" },
      { name: "description", content: "Demo inbox for PartLoop conversations stored on this device." },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const user = useDemo(selectUser);
  const threads = useDemo(selectThreads);
  if (!user) {
    return <NeedSession next="/messages" reason="Start a session to see the demo inbox." />;
  }
  const inbox = threads.filter((t) => t.ownerId === user.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader title="Messages" subtitle="Local demo threads — not delivered to anyone." />
      <DemoNotice>When Supabase is connected, these threads should move to a messages table. They are not live chat.</DemoNotice>
      {inbox.length ? (
        <ul className="space-y-2">
          {inbox.map((t) => (
            <li key={t.id}>
              <Link to="/messages/$id" params={{ id: t.id }} className="card-surface flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-sm text-muted-foreground">{t.otherName}</p>
                </div>
                <span className="text-xs text-muted-foreground">{timeAgo(t.updatedAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="Inbox empty" body="Open a listing and tap Message seller to start a demo thread." />
      )}
    </div>
  );
}
