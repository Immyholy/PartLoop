import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { listingSchema, type ListingInput } from "@/lib/schemas";
import { AREAS, CATEGORIES, CATEGORY_LABEL, PICKUP, PICKUP_LABEL } from "@/types";

export function ListingForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (values: ListingInput) => void;
  submitting?: boolean;
}) {
  const form = useForm<ListingInput>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      category: "phone",
      brand: "",
      model: "",
      title: "",
      description: "",
      faults: "",
      workingParts: "",
      price: 10000,
      area: "Wuse/Banex",
      pickup: "meet_public",
    },
  });

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <Field label="Category" error={form.formState.errors.category?.message}>
        <Select value={form.watch("category")} onValueChange={(v) => form.setValue("category", v as ListingInput["category"])}>
          <SelectTrigger className="h-11 bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{CATEGORY_LABEL[c]}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Brand" error={form.formState.errors.brand?.message}>
          <Input {...form.register("brand")} placeholder="Apple, Tecno, HP…" className="h-11 bg-card" />
        </Field>
        <Field label="Exact model" error={form.formState.errors.model?.message}>
          <Input {...form.register("model")} placeholder="iPhone 12 (A2403)" className="h-11 bg-card" />
        </Field>
      </div>
      <Field label="Title" error={form.formState.errors.title?.message}>
        <Input {...form.register("title")} placeholder="iPhone 12 — cracked screen, boots fine" className="h-11 bg-card" />
      </Field>
      <Field label="What's broken" error={form.formState.errors.faults?.message}>
        <Textarea {...form.register("faults")} placeholder="Cracked screen, no power… (comma or new line)" rows={3} className="bg-card" />
      </Field>
      <Field label="Working parts (unverified)" error={form.formState.errors.workingParts?.message}>
        <Textarea {...form.register("workingParts")} placeholder="Camera, board, battery…" rows={3} className="bg-card" />
      </Field>
      <Field label="More detail" error={form.formState.errors.description?.message}>
        <Textarea {...form.register("description")} rows={4} className="bg-card" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Asking price (₦)" error={form.formState.errors.price?.message}>
          <Input type="number" {...form.register("price")} className="h-11 bg-card" />
        </Field>
        <Field label="Area" error={form.formState.errors.area?.message}>
          <Select value={form.watch("area")} onValueChange={(v) => form.setValue("area", v as ListingInput["area"])}>
            <SelectTrigger className="h-11 bg-card"><SelectValue /></SelectTrigger>
            <SelectContent>
              {AREAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Field label="Handover" error={form.formState.errors.pickup?.message}>
        <Select value={form.watch("pickup")} onValueChange={(v) => form.setValue("pickup", v as ListingInput["pickup"])}>
          <SelectTrigger className="h-11 bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            {PICKUP.map((p) => <SelectItem key={p} value={p}>{PICKUP_LABEL[p]}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Button type="submit" size="lg" className="rounded-full" disabled={submitting}>Publish listing (demo)</Button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
