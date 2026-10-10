import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import { Check, Clock, ClipboardList, UserPlus } from "lucide-react";
import { UserButton } from "@clerk/tanstack-react-start";
import { Button } from "@/components/ui/button";
import { Layout, PageTitle } from "@/components/Layout";
import { getItems, saveItem, STATUSES, type Item, type Status } from "@/lib/store";

const getAdminAccess = createServerFn({ method: "GET" }).handler(async () => {
  const { auth, clerkClient } = await import("@clerk/tanstack-react-start/server");
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated || !userId) return { isAuthenticated: false, isAdmin: false };
  const user = await clerkClient().users.getUser(userId);
  return { isAuthenticated: true, isAdmin: user.publicMetadata["role"] === "admin" };
});

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — CleanCity" },
      { name: "description", content: "Manage waste reports and pickup requests." },
      { property: "og:title", content: "Admin Dashboard — CleanCity" },
      { property: "og:description", content: "Manage waste reports and pickup requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: async () => {
    const access = await getAdminAccess();
    if (!access.isAuthenticated) throw redirect({ to: "/sign-in" });
    return { isAdmin: access.isAdmin };
  },
  component: Admin,
});

const collectors = ["Ravi Kumar", "Sita Devi", "Amit Shah", "Priya Nair"];

function RequestRow({ item, update }: { item: Item; update: (id: string, patch: Partial<Item>) => Promise<void> }) {
  const [collector, setCollector] = useState(item.collector ?? "");
  const [status, setStatus] = useState<Status>(item.status);
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const assignCollector = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!collector) return;
    setSaving(true);
    try {
      const nextStatus = item.status === "Submitted" ? "Assigned" : item.status;
      await update(item.id, { collector, status: nextStatus });
      setStatus(nextStatus);
      setNotice(`Collector assigned: ${collector}.`);
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "Could not assign collector.");
    } finally { setSaving(false); }
  };
  const updateStatus = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await update(item.id, { status });
      setNotice(`Status updated to ${status}.`);
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "Could not update request status.");
    } finally { setSaving(false); }
  };
  return (
    <article className="card-box space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-muted-foreground">{item.kind} · {item.id}</p>
          <h3 className="mt-1 text-xl font-extrabold">{item.type}</h3>
          <p className="mt-1 break-words text-muted-foreground">{item.location}</p>
          {item.contactName && <p className="mt-1 text-sm text-muted-foreground">{item.contactName}{item.contactPhone ? ` · ${item.contactPhone}` : ""}</p>}
          {item.description && <p className="mt-2 text-sm">{item.description}</p>}
          {item.preferredDate && <p className="mt-1 text-sm text-muted-foreground">Preferred pickup: {item.preferredDate}</p>}
          <p className="mt-1 text-sm text-muted-foreground">Date: {item.date} · Collector: {item.collector || "Not assigned"}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${item.status === "Resolved" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>{item.status}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <form className="flex flex-wrap items-end gap-2" onSubmit={assignCollector}>
          <label className="min-w-0 flex-1"><span className="mb-2 block text-sm font-bold">Collector</span><select required className="field" value={collector} onChange={(event) => setCollector(event.target.value)}><option value="">Select collector</option>{collectors.map((name) => <option key={name}>{name}</option>)}</select></label>
          <Button type="submit" disabled={!collector || saving} className="h-12 rounded-full px-5 text-base"><UserPlus /> Assign collector</Button>
        </form>
        <form className="flex flex-wrap items-end gap-2" onSubmit={updateStatus}>
          <label className="min-w-0 flex-1"><span className="mb-2 block text-sm font-bold">Request status</span><select className="field" value={status} onChange={(event) => setStatus(event.target.value as Status)}>{STATUSES.map((value) => <option key={value}>{value}</option>)}</select></label>
          <Button type="submit" variant="secondary" disabled={saving} className="h-12 rounded-full px-5 text-base"><Check /> Update status</Button>
        </form>
      </div>
      {notice && <p role="status" className="text-sm font-bold text-success">{notice}</p>}
    </article>
  );
}

function Admin() {
  const { isAdmin } = Route.useRouteContext();
  if (!isAdmin) {
    return <Layout><section className="card-box mx-auto max-w-xl text-center"><h1 className="text-2xl font-extrabold">Admin access only</h1><p className="mt-2 text-muted-foreground">Your account is signed in but does not have the admin role.</p></section></Layout>;
  }
  return <AdminDashboard />;
}

function AdminDashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    getItems().then(setItems).catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Could not load requests.")).finally(() => setLoading(false));
  }, []);
  const update = async (id: string, patch: Partial<Item>) => {
    try {
      const dataPatch = {
        ...(patch.status !== undefined ? { status: patch.status } : {}),
        ...(patch.collector !== undefined ? { collector: patch.collector } : {}),
      };
      const saved = await saveItem({ data: { id, patch: dataPatch } });
      setItems((current) => current.map((item) => item.id === id ? saved : item));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update this request.");
      throw cause;
    }
  };
  const complaints = items.filter((item) => item.kind === "Complaint").length;
  const pickups = items.filter((item) => item.kind === "Pickup").length;
  const pending = items.filter((item) => item.status !== "Resolved").length;
  return (
    <Layout>
      <div className="mb-8 flex items-start justify-between gap-4">
        <PageTitle title="Admin Dashboard" sub="Review reports and coordinate neighborhood pickups." />
        <UserButton />
      </div>
      <div className="mb-9 grid gap-4 sm:grid-cols-3">
        {[{ label: "Total requests", value: items.length, icon: ClipboardList }, { label: "Need attention", value: pending, icon: Clock }, { label: "Pickup requests", value: pickups, icon: UserPlus }].map(({ label, value, icon: Icon }) => (
          <article key={label} className="card-box flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-primary"><Icon className="h-6 w-6" /></span><div><p className="text-2xl font-extrabold">{value}</p><p className="text-sm text-muted-foreground">{label}</p></div></article>
        ))}
      </div>
      <h2 className="mb-4 text-2xl font-extrabold">Complaints & requests <span className="text-sm font-semibold text-muted-foreground">({complaints} reports · {pickups} pickups)</span></h2>
      {error && <p role="alert" className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm font-semibold text-destructive">{error}</p>}
      {loading ? <p className="py-8 text-center text-muted-foreground">Loading requests…</p> : (
        <div className="space-y-4">
          {items.map((item) => <RequestRow key={item.id} item={item} update={update} />)}
          {items.length === 0 && <p className="card-box py-8 text-center text-muted-foreground">No complaints or pickup requests yet.</p>}
        </div>
      )}
    </Layout>
  );
}
