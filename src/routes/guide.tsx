import { createFileRoute } from "@tanstack/react-router";
import { Leaf, Package, BatteryCharging, MapPin, Trash2 } from "lucide-react";
import { Layout, PageTitle } from "@/components/Layout";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Waste Segregation Guide — Smart Waste City" },
      { name: "description", content: "Learn which bin to use: green for wet waste, blue for dry, red for e-waste." },
      { property: "og:title", content: "Waste Segregation Guide" },
      { property: "og:description", content: "Simple guide to sorting your waste." },
    ],
  }),
  component: Guide,
});

const bins = [
  { name: "Green Bin", kind: "Wet Waste", items: "Food waste, fruit peels, leaves", icon: Leaf, cls: "bg-wet" },
  { name: "Blue Bin", kind: "Dry Waste", items: "Paper, plastic, glass", icon: Package, cls: "bg-dry" },
  { name: "Red Bin", kind: "E-Waste", items: "Batteries, chargers, electronics", icon: BatteryCharging, cls: "bg-ewaste" },
];
const nearby = ["Central Park Gate — 200 m", "City Market, Lane 2 — 450 m", "Bus Stand Corner — 700 m"];

function Guide() {
  return (
    <Layout>
      <PageTitle title="Waste Segregation Guide" sub="Put the right waste in the right bin." />
      <div className="grid gap-5 md:grid-cols-3">
        {bins.map((b) => (
          <article key={b.name} className={`rounded-lg p-8 text-primary-foreground ${b.cls}`}>
            <div className="flex items-center justify-between"><Trash2 className="h-16 w-16" /><b.icon className="h-10 w-10" /></div>
            <h2 className="mt-4 text-3xl font-extrabold">{b.name}</h2>
            <p className="text-xl font-bold">{b.kind}</p>
            <p className="mt-2 text-lg opacity-90">{b.items}</p>
          </article>
        ))}
      </div>
      <h2 className="mb-4 mt-12 text-2xl font-extrabold">Nearby bins</h2>
      <div className="grid gap-3">
        {nearby.map((n) => (
          <div key={n} className="card-box flex items-center gap-3 py-4"><MapPin className="h-7 w-7 text-primary" /><span className="text-lg font-bold">{n}</span></div>
        ))}
      </div>
    </Layout>
  );
}
