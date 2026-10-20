import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import {
  ArrowRight,
  Cpu,
  Laptop,
  Mail,
  Monitor,
  Search,
  Smartphone,
  TabletSmartphone,
  Wrench,
} from "lucide-react";

import { useState, type FormEvent } from "react";

import hero from "@/assets/hero-loop.jpg";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeviceCard } from "@/components/site/Cards";

import {
  selectDevices,
  useDemo,
} from "@/services/demo-store";

// =====================================
// PARTLOOP HOMEPAGE
// =====================================

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "PartLoop — Give Every Device a Second Life",
      },
      {
        name: "description",
        content:
          "PartLoop connects damaged electronics owners, repair technicians, and spare-parts buyers.",
      },
    ],
  }),

  component: HomePage,
});

// =====================================
// DEVICE CATEGORIES
// =====================================

const categories = [
  {
    name: "Phones",
    search: "phone",
    icon: Smartphone,
  },
  {
    name: "Laptops",
    search: "laptop",
    icon: Laptop,
  },
  {
    name: "Tablets",
    search: "tablet",
    icon: TabletSmartphone,
  },
  {
    name: "Desktops",
    search: "desktop",
    icon: Monitor,
  },
  {
    name: "Components",
    search: "motherboard",
    icon: Cpu,
  },
];

// =====================================
// HOME COMPONENT
// =====================================

function HomePage() {
  const navigate = useNavigate();

  const devices = useDemo(selectDevices);

  const [search, setSearch] = useState("");

  const featuredDevices = devices
    .filter((device) => device.status === "published")
    .slice(0, 3);

  function searchMarketplace(value: string) {
    navigate({
      to: "/explore",
      search: {
        q: value.trim(),
      },
    });
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    searchMarketplace(search);
  }

  return (
    <div className="min-w-0 overflow-x-hidden bg-background">

      {/* ==================================
          SECTION 1 — HERO
      ================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50">

        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:py-16">

          <div>

            <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-xs font-semibold text-green-800">

              <span className="h-2 w-2 rounded-full bg-green-500" />

              Connecting Nigeria's repair ecosystem

            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">

              Broken to you.

              <br />

              <span className="text-green-600">
                Valuable
              </span>

              <br />

              to someone else.

            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">

              Sell damaged electronics, discover reusable
              parts, and connect with people who can
              bring devices back to life.

            </p>

            {/* SEARCH BAR */}

            <form
              onSubmit={handleSearch}
              role="search"
              className="mt-7 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
            >

              <Search
                className="ml-2 h-5 w-5 shrink-0 text-slate-400"
                aria-hidden="true"
              />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search phones, laptops, parts..."
                aria-label="Search devices and parts"
                className="min-w-0 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
              />

              <Button
                type="submit"
                className="shrink-0 rounded-xl"
              >
                Search
              </Button>

            </form>

            {/* QUICK ACTIONS */}

            <div className="mt-6 flex flex-wrap gap-3">

              <Button
                asChild
                size="lg"
                className="rounded-full"
              >
                <Link to="/sell/new">

                  Sell a device

                  <ArrowRight className="ml-2 h-4 w-4" />

                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full bg-white"
              >
                <Link to="/explore">
                  Find spare parts
                </Link>
              </Button>

            </div>

            <p className="mt-5 text-xs font-medium text-slate-500">

              Starting in Abuja, Nigeria.

            </p>

          </div>

          {/* HERO IMAGE */}

          <div className="relative mx-auto w-full max-w-md">

            <div className="overflow-hidden rounded-3xl border border-white bg-white/70 p-5 shadow-xl shadow-green-900/10">

              <img
                src={hero}
                alt="Reusable electronic components"
                width={1200}
                height={1008}
                className="mx-auto h-auto max-h-72 w-full object-contain"
              />

              <div className="mt-3 rounded-xl bg-green-50 px-4 py-3 text-center">

                <p className="text-sm font-bold text-green-800">
                  Every device has value.
                </p>

                <p className="mt-1 text-xs text-green-700">
                  Repair. Reuse. Reconnect.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ==================================
          SECTION 2 — MARKETPLACE
      ================================== */}

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">

        {/* CATEGORIES */}

        <div className="flex items-end justify-between gap-3">

          <div>

            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Explore categories
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Find devices and components quickly.
            </p>

          </div>

          <Link
            to="/explore"
            className="text-sm font-semibold text-green-700 hover:underline"
          >
            View all →
          </Link>

        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

          {categories.map(
            ({ name, search: categorySearch, icon: Icon }) => (

              <button
                key={name}
                type="button"
                onClick={() =>
                  searchMarketplace(categorySearch)
                }
                className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-6 transition-all hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">

                  <Icon className="h-6 w-6" />

                </div>

                <span className="mt-3 text-sm font-semibold">
                  {name}
                </span>

              </button>

            )
          )}

        </div>

        {/* FEATURED PRODUCTS */}

        <div className="mt-12 flex items-end justify-between gap-3">

          <div>

            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Discover devices
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Explore electronics and potential spare parts.
            </p>

          </div>

          <Link
            to="/explore"
            className="text-sm font-semibold text-green-700 hover:underline"
          >
            See all →
          </Link>

        </div>

        {featuredDevices.length > 0 ? (

          <>
            <p className="mt-3 text-xs text-muted-foreground">
              Preview listings shown below are examples,
              not verified products currently for sale.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {featuredDevices.map((device) => (

                <DeviceCard
                  key={device.id}
                  d={device}
                />

              ))}

            </div>
          </>

        ) : (

          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-10 text-center">

            <p className="font-semibold">
              Devices will appear here soon.
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Browse the marketplace to discover available listings.
            </p>

          </div>

        )}

      </section>

      {/* ==================================
          SECTION 3 — QUICK INTRODUCTION
      ================================== */}

      <section className="bg-slate-50">

        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">

          <div className="grid items-center gap-6 rounded-3xl bg-slate-950 p-7 text-white sm:p-10 md:grid-cols-[1fr_auto]">

            <div>

              <h2 className="text-2xl font-bold sm:text-3xl">

                Your device deserves another chance.

              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">

                Whether you're selling a damaged device,
                searching for a component, or looking for
                repair assistance, PartLoop connects you
                with the right opportunities.

              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <Button
                asChild
                className="rounded-full bg-green-500 text-slate-950 hover:bg-green-400"
              >

                <Link to="/how-it-works">

                  How it works

                  <ArrowRight className="ml-2 h-4 w-4" />

                </Link>

              </Button>

              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >

                <a href="mailto:partloop.ng@gmail.com?subject=Repair%20Assistance">

                  <Wrench className="mr-2 h-4 w-4" />

                  Repair help

                </a>

              </Button>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}