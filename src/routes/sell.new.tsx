import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ListingForm } from "@/components/forms/ListingForm";
import { DemoNotice, NeedSession, PageHeader } from "@/components/site/PageBits";
import { sampleImageFor } from "@/lib/sample-image";
import { splitList, type ListingInput } from "@/lib/schemas";
import { demo, selectUser, useDemo } from "@/services/demo-store";

export const Route = createFileRoute("/sell/new")({
  head: () => ({
    meta: [
      { title: "Sell a damaged device — PartLoop" },
      { name: "description", content: "List a damaged phone, laptop or tablet for parts in Abuja." },
    ],
  }),
  component: SellNew,
});

function SellNew() {
  const user = useDemo(selectUser);
  const navigate = useNavigate();
  if (!user) {
    return <NeedSession next="/sell/new" reason="Start a demo session so the listing can show a seller name." />;
  }

  const onSubmit = (values: ListingInput) => {
    const device = demo.addDevice({
      category: values.category,
      brand: values.brand,
      model: values.model,
      title: values.title,
      description: values.description,
      faults: splitList(values.faults),
      workingParts: splitList(values.workingParts),
      price: values.price,
      area: values.area,
      pickup: values.pickup,
      status: "published",
      image: sampleImageFor(values.category),
    });
    toast.success("Listing saved on this device (demo)");
    void navigate({ to: "/devices/$id", params: { id: device.id } });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <PageHeader title="Sell a damaged device" subtitle={`Listing as ${user.name} (${user.role}).`} />
      <DemoNotice>
        Photo upload needs live storage. This demo attaches a sample photo for the category. Nothing is sent to a server.
      </DemoNotice>
      <div className="card-surface p-6">
        <ListingForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
