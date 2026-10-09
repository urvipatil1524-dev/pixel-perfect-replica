import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Search } from "lucide-react";
import { Layout, PageTitle } from "@/components/Layout";
import { getItems, STATUSES, type Item } from "@/lib/store";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track My Request — Smart Waste City" },
      { name: "description", content: "Check the status of your complaint or pickup request." },
      { property: "og:title", content: "Track My Request" },
      { property: "og:description", content: "Check the status of your complaint or pickup request." },
    ],
  }),
  component: Track,
});

function Track() {
  const [id, setId] = useState("");
  const [result, setResult] = useState<Item | null | undefined>(undefined);
  const step = result ? STATUSES.indexOf(result.status) : -1;
  return (
    <Layout>
      <PageTitle title="Track My Request" sub="Enter your complaint or request ID (example: CMP-1001)." />
      <form className="card-box mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); setResult(getItems().find((i) => i.id.toLowerCase() === id.trim().toLowerCase()) ?? null); }}>
        <input className="field" placeholder="Your ID" value={id} onChange={(e) => setId(e.target.value)} required />
        <button className="btn"><Search className="h-5 w-5" /> Track</button>
      </form>
      {result === null && <p className="mt-6 text-center text-lg font-bold text-destructive">No request found with this ID.</p>}
      {result && (
        <div className="card-box mx-auto mt-6 max-w-2xl">
          <p className="text-lg"><b>{result.id}</b> · {result.type} · {result.location}</p>
          <ol className="mt-6 space-y-4">
            {STATUSES.map((s, i) => (
              <li key={s} className="flex items-center gap-4">
                <span className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i <= step ? <Check /> : i + 1}</span>
                <span className={`text-xl ${i <= step ? "font-extrabold" : "text-muted-foreground"}`}>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Layout>
  );
}
