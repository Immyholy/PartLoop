import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { DemoNotice, NeedSession, PageHeader } from "@/components/site/PageBits";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { demo, selectMessages, selectThreads, selectUser, useDemo } from "@/services/demo-store";

export const Route = createFileRoute("/messages/$id")({
  head: () => ({
    meta: [{ title: "Conversation — PartLoop" }, { name: "description", content: "A demo PartLoop message thread." }],
  }),
  component: MessageThreadPage,
});

function MessageThreadPage() {
  const { id } = Route.useParams();
  const user = useDemo(selectUser);
  const threads = useDemo(selectThreads);
  const messages = useDemo(selectMessages);
  const [body, setBody] = useState("");
  if (!user) {
    return <NeedSession next={`/messages/${id}`} reason="Start a session to open this demo thread." />;
  }
  const thread = threads.find((t) => t.id === id && t.ownerId === user.id);
  if (!thread) throw notFound();
  const chat = messages.filter((m) => m.threadId === id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link to="/messages" className="text-sm text-muted-foreground hover:text-foreground">← Inbox</Link>
      <PageHeader title={thread.title} subtitle={thread.otherName} />
      <DemoNotice>Replies stay on this browser. The other person is a sample name, not a live user.</DemoNotice>
      <div className="card-surface space-y-3 p-4">
        {chat.map((m) => (
          <div key={m.id} className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.authorName === user.name ? "ml-auto bg-primary text-primary-foreground" : "bg-secondary"}`}>
            <p className="text-[11px] opacity-70">{m.authorName}</p>
            <p>{m.body}</p>
          </div>
        ))}
      </div>
      <form
        className="mt-4 space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          demo.sendMessage(id, body);
          setBody("");
        }}
      >
        <label htmlFor="msg" className="sr-only">Message</label>
        <Textarea id="msg" value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Write a demo message…" className="bg-card" />
        <Button type="submit" className="rounded-full" disabled={!body.trim()}>Send (demo)</Button>
      </form>
    </div>
  );
}
