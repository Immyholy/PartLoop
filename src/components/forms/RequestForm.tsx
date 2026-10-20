import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requestSchema, type RequestInput } from "@/lib/schemas";
import { AREAS, CATEGORIES, CATEGORY_LABEL } from "@/types";

export function RequestForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (values: RequestInput) => void;
  submitting?: boolean;
}) {
  const form = useForm<RequestInput>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      category: "phone",
      brand: "",
      model: "",
      component: "",
      details: "",
      budgetMin: 5000,
      budgetMax: 20000,
      area: "Wuse/Banex",
    },
  });

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-1.5">
        <Label>Category</Label>
        <Select value={form.watch("category")} onValueChange={(v) => form.setValue("category", v as RequestInput["category"])}>
          <SelectTrigger className="h-11 bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{CATEGORY_LABEL[c]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Brand</Label>
          <Input {...form.register("brand")} className="h-11 bg-card" />
          {form.formState.errors.brand && <p className="text-xs text-destructive">{form.formState.errors.brand.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Exact model</Label>
          <Input {...form.register("model")} className="h-11 bg-card" />
          {form.formState.errors.model && <p className="text-xs text-destructive">{form.formState.errors.model.message}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Part needed</Label>
        <Input {...form.register("component")} placeholder="Charging board, LCD, motherboard…" className="h-11 bg-card" />
        {form.formState.errors.component && <p className="text-xs text-destructive">{form.formState.errors.component.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Details</Label>
        <Textarea {...form.register("details")} rows={4} className="bg-card" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Min budget (₦)</Label>
          <Input type="number" {...form.register("budgetMin")} className="h-11 bg-card" />
        </div>
        <div className="space-y-1.5">
          <Label>Max budget (₦)</Label>
          <Input type="number" {...form.register("budgetMax")} className="h-11 bg-card" />
          {form.formState.errors.budgetMax && <p className="text-xs text-destructive">{form.formState.errors.budgetMax.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Area</Label>
          <Select value={form.watch("area")} onValueChange={(v) => form.setValue("area", v as RequestInput["area"])}>
            <SelectTrigger className="h-11 bg-card"><SelectValue /></SelectTrigger>
            <SelectContent>
              {AREAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" size="lg" className="rounded-full" disabled={submitting}>Post request (demo)</Button>
    </form>
  );
}
