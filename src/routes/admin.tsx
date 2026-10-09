import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ClipboardList, Clock, Truck, Users } from "lucide-react";
import { Layout, PageTitle } from "@/components/Layout";
import { getItems, saveItems, STATUSES, type Item, type Status } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Smart Waste City" },
      { name: "description", content: "Manage complaints, pickups and collectors." },
      { property: "og:title", content: "Admin Dashboard — Smart Waste City" },
      { property: "og:description", content: "Manage complaints, pickups and collectors." },
    ],
  }),
  component: Admin,
});

const collectors = ["Ravi Kumar", "Sita Devi", "Amit Shah", "Priya Nair"];

function Admin() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => setItems(getItems()), []);
  const update = (id: string, patch: Partial<Item>) => {
    const next = items.map((i) => (i.id === id ? { ...i, ...patch } : i));
    setItems(next); saveItems(next);
  };
  const stats = [
    { l: "Total complaints", n: items.filter((i) => i.kind === "Complaint").length, icon: ClipboardList },
    { l: "Pending requests", n: items.filter((i) => i.status !== "Resolved").length, icon: Clock },
    { l: "Completed pickups", n: items.filter((i) => i.kind === "Pickup" && i.status === "Resolved").length, icon: Truck },
    { l: "Active workers", n: collectors.length, icon: Users },
  ];
  return (
    <Layout>
      <PageTitle title="Admin Dashboard" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="card-box"><s.icon className="h-8 w-8 text-secondary" /><p className="mt-2 text-3xl font-extrabold">{s.n}</p><p className="text-muted-foreground">{s.l}</p></div>
        ))}
      </div>
      <h2 className="mb-4 mt-10 text-2xl font-extrabold">Complaints & requests</h2>
      <div className="space-y-4">
        {items.map((i) => (
          <div key={i.id} className="card-box grid gap-3 md:grid-cols-[1.5fr_1fr_1fr] md:items-center">
            <div>
              <p className="font-extrabold">{i.id} · {i.type}</p>
              <p className="text-muted-foreground">{i.location} · {i.date}</p>
              <span className="mt-1 inline-block rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">{i.status}</span>
            </div>
            <select className="field" value={i.collector ?? ""} onChange={(e) => update(i.id, { collector: e.target.value, status: i.status === "Submitted" ? "Assigned" : i.status })}>
              <option value="">Assign collector</option>
              {collectors.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select className="field" value={i.status} onChange={(e) => update(i.id, { status: e.target.value as Status })}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
    </Layout>
  );
}
