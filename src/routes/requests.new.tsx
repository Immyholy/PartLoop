import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { RequestForm } from "@/components/forms/RequestForm";
import { DemoNotice, NeedSession, PageHeader } from "@/components/site/PageBits";
import type { RequestInput } from "@/lib/schemas";
import { demo, selectUser, useDemo } from "@/services/demo-store";

export const Route = createFileRoute("/requests/new")({
  head: () => ({
    meta: [
      { title: "Post a parts request — PartLoop" },
      { name: "description", content: "Tell sellers which part you need and your budget in Abuja." },
    ],
  }),
  component: RequestNew,
});

function RequestNew() {
  const user = useDemo(selectUser);
  const navigate = useNavigate();
  if (!user) {
    return <NeedSession next="/requests/new" reason="Start a demo session so the request can show who asked." />;
  }

  const onSubmit = (values: RequestInput) => {
    const req = demo.addRequest({
      category: values.category,
      brand: values.brand,
      model: values.model,
      component: values.component,
      details: values.details,
      budgetMin: values.budgetMin,
      budgetMax: values.budgetMax,
      area: values.area,
    });
    toast.success("Request saved on this device (demo)");
    void navigate({ to: "/requests/$id", params: { id: req.id } });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <PageHeader title="Post a parts request" subtitle={`Asking as ${user.name}.`} />
      <DemoNotice>Requests in demo mode are not sent to other people. They appear only in this browser.</DemoNotice>
      <div className="card-surface p-6">
        <RequestForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
