import { createFileRoute, Link } from "@tanstack/react-router";
import { DeviceCard, EmptyState, RequestCard } from "@/components/site/Cards";
import { DemoNotice, NeedSession, PageHeader } from "@/components/site/PageBits";
import { Button } from "@/components/ui/button";
import { formatNGN } from "@/lib/format";
import { demo, selectDevices, selectFavorites, selectRequests, selectThreads, selectUser, useDemo } from "@/services/demo-store";
import { ROLE_LABEL, type DeviceStatus } from "@/types";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Dashboard — PartLoop" },
      { name: "description", content: "Your demo seller, technician or buyer dashboard on PartLoop." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const user = useDemo(selectUser);
  const devices = useDemo(selectDevices);
  const requests = useDemo(selectRequests);
  const favs = useDemo(selectFavorites);
  const threads = useDemo(selectThreads);
  if (!user) {
    return <NeedSession next="/account" reason="Open a demo session (or live Supabase sign-in when configured) to see a dashboard." />;
  }

  const mine = devices.filter((d) => d.sellerId === user.id);
  const myRequests = requests.filter((r) => r.requesterId === user.id);
  const saved = devices.filter((d) => favs.includes(d.id));
  const inbox = threads.filter((t) => t.ownerId === user.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader title={`${ROLE_LABEL[user.role]} dashboard`} subtitle={`${user.name} · ${user.email}`} />
      <DemoNotice>
        {user.source === "demo"
          ? "Demo dashboard — listings and messages here are local sample data, not a live marketplace account."
          : "Signed in with Supabase. Listings and messages below still use the local demo store until tables are connected."}
      </DemoNotice>

      <div className="mb-10 flex flex-wrap gap-2">
        {(user.role === "seller" || user.role === "technician") && (
          <Button asChild className="rounded-full"><Link to="/sell/new">New listing</Link></Button>
        )}
        {(user.role === "technician" || user.role === "buyer") && (
          <Button asChild variant="outline" className="rounded-full"><Link to="/requests/new">New parts request</Link></Button>
        )}
        <Button asChild variant="outline" className="rounded-full"><Link to="/messages">Messages</Link></Button>
        <Button variant="ghost" className="rounded-full" onClick={() => demo.signOut()}>Sign out</Button>
      </div>

      {(user.role === "seller" || user.role === "technician") && (
        <section className="mb-12">
          <h2 className="text-xl font-bold">My listings</h2>
          {mine.length ? (
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {mine.map((d) => (
                <div key={d.id} className="space-y-2">
                  <DeviceCard d={d} />
                  <div className="flex flex-wrap gap-1 px-1">
                    {(["published", "reserved", "sold"] as DeviceStatus[]).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => demo.setDeviceStatus(d.id, status)}
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${d.status === status ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}
                      >
                        {status}
                      </button>
                    ))}
                    <span className="ml-auto text-[11px] text-muted-foreground">{formatNGN(d.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4"><EmptyState title="No listings yet" body="Publish a damaged device so technicians can find the parts." action={<Button asChild className="rounded-full"><Link to="/sell/new">Sell a device</Link></Button>} /></div>
          )}
        </section>
      )}

      {(user.role === "technician" || user.role === "buyer") && (
        <section className="mb-12">
          <h2 className="text-xl font-bold">My parts requests</h2>
          {myRequests.length ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myRequests.map((r) => (
                <Link key={r.id} to="/requests/$id" params={{ id: r.id }}><RequestCard r={r} /></Link>
              ))}
            </div>
          ) : (
            <div className="mt-4"><EmptyState title="No requests yet" body="Ask for a specific camera, board or screen." action={<Button asChild className="rounded-full"><Link to="/requests/new">Post a request</Link></Button>} /></div>
          )}
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-xl font-bold">Saved devices</h2>
        {saved.length ? (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{saved.map((d) => <DeviceCard key={d.id} d={d} />)}</div>
        ) : (
          <div className="mt-4"><EmptyState title="Nothing saved" body="Tap the heart on a listing while you have a session." action={<Button asChild variant="outline" className="rounded-full"><Link to="/explore">Explore</Link></Button>} /></div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold">Recent messages</h2>
        {inbox.length ? (
          <ul className="mt-4 space-y-2">
            {inbox.slice(0, 5).map((t) => (
              <li key={t.id}>
                <Link to="/messages/$id" params={{ id: t.id }} className="card-surface block p-4 hover:bg-secondary/40">
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.otherName}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4"><EmptyState title="No threads" body="Message a seller from a listing to start a demo conversation." /></div>
        )}
      </section>
    </div>
  );
}
