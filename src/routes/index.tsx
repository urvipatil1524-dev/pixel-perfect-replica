import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Truck, MapPin, CheckCircle2, Scale, Trash2 } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Waste Management City — Keep Our City Clean" },
      { name: "description", content: "Report waste problems, request pickup, and help make our city cleaner." },
      { property: "og:title", content: "Smart Waste Management City" },
      { property: "og:description", content: "Report waste problems, request pickup, and help make our city cleaner." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const actions = [
    { to: "/report", label: "Report Waste", icon: AlertTriangle, cls: "bg-primary text-primary-foreground" },
    { to: "/pickup", label: "Request Pickup", icon: Truck, cls: "bg-secondary text-secondary-foreground" },
    { to: "/guide", label: "Find Nearby Bin", icon: MapPin, cls: "bg-accent text-accent-foreground" },
  ] as const;
  const stats = [
    { n: "12,480", l: "Complaints resolved", icon: CheckCircle2 },
    { n: "3,200 tons", l: "Waste collected", icon: Scale },
    { n: "8,950", l: "Bins cleaned", icon: Trash2 },
  ];
  return (
    <Layout>
      <section className="py-8 text-center">
        <h1 className="text-4xl font-extrabold text-primary sm:text-6xl">Keep Our City Clean</h1>
        <p className="mx-auto mt-4 max-w-xl text-xl text-muted-foreground">Report waste problems, request pickup, and help make our city cleaner.</p>
      </section>
      <section className="grid gap-5 sm:grid-cols-3">
        {actions.map((a) => (
          <Link key={a.label} to={a.to} className={`flex flex-col items-center gap-3 rounded-3xl p-8 text-2xl font-extrabold shadow-lg transition hover:-translate-y-1 ${a.cls}`}>
            <a.icon className="h-14 w-14" /> {a.label}
          </Link>
        ))}
      </section>
      <section className="mt-12 grid gap-5 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.l} className="card-box flex items-center gap-4">
            <s.icon className="h-10 w-10 text-secondary" />
            <div><p className="text-3xl font-extrabold">{s.n}</p><p className="text-muted-foreground">{s.l}</p></div>
          </div>
        ))}
      </section>
    </Layout>
  );
}
