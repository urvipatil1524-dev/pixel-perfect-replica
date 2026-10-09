import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ClipboardList, Clock, Truck, Users, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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

function RequestRow({ item, update }: { item: Item; update: (id: string, patch: Partial<Item>) => void }) {
  const [collector, setCollector] = useState(item.collector ?? "");
  const [status, setStatus] = useState<Status>(item.status);
  const [notice, setNotice] = useState("");
  return (
    <article className="card-box space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-muted-foreground">{item.kind} · {item.id}</p>
          <h3 className="mt-1 text-xl font-extrabold">{item.type}</h3>
          <p className="mt-1 break-words text-muted-foreground">{item.location}</p>
          <p className="mt-1 text-sm text-muted-foreground">Date: {item.date} · Collector: {item.collector || "Not assigned"}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${item.status === "Resolved" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>{item.status}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); if (!collector) return; const nextStatus = item.status === "Submitted" ? "Assigned" : item.status; update(item.id, { collector, status: nextStatus }); setStatus(nextStatus); setNotice(`Collector assigned: ${collector}.`); }}>
          <label className="min-w-0 flex-1"><span className="mb-2 block text-sm font-bold">Collector</span><select required className="field" value={collector} onChange={(e) => setCollector(e.target.value)}><option value="">Select collector</option>{collectors.map((c) => <option key={c}>{c}</option>)}</select></label>
          <Button type="submit" disabled={!collector} className="h-12 rounded-full px-5 text-base"><UserPlus /> Assign collector</Button>
        </form>
        <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); update(item.id, { status }); setNotice(`Status updated to ${status}.`); }}>
          <label className="min-w-0 flex-1"><span className="mb-2 block text-sm font-bold">Request status</span><select className="field" value={status} onChange={(e) => setStatus(e.target.value as Status)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
          <Button type="submit" variant="secondary" className="h-12 rounded-full px-5 text-base"><Check /> Update status</Button>
        </form>
      </div>
      {notice && <p role="status" className="text-sm font-bold text-success">{notice}</p>}
    </article>
  );
}

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
        {items.map((i) => <RequestRow key={i.id} item={i} update={update} />)}
        {items.length === 0 && <p className="py-6 text-muted-foreground">No complaints or pickup requests yet.</p>}
      </div>
    </Layout>
  );
}
