import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/supabase";
import { selectUser, useDemo } from "@/services/demo-store";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}

export function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <p className="mb-6 rounded-xl border border-warning/30 bg-warning-soft px-4 py-3 text-sm">
      {children}
    </p>
  );
}

export function NeedSession({ next, reason }: { next: string; reason: string }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <PageHeader title="Demo session needed" subtitle={reason} />
      <DemoNotice>
        This is not a live login wall. PartLoop will store a labelled demo session on this browser only
        {isSupabaseConfigured() ? ", unless you use the live Supabase form on the account page." : "."}
      </DemoNotice>
      <Button asChild className="rounded-full">
        <Link to="/auth" search={{ next }}>Continue in demo mode</Link>
      </Button>
    </div>
  );
}

export function useRequiredUser() {
  return useDemo(selectUser);
}
