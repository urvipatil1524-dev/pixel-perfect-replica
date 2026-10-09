import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Search } from "lucide-react";
import { Layout, PageTitle } from "@/components/Layout";
import { getItems, STATUSES, type Item } from "@/lib/store";
import { Button } from "@/components/ui/button";

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
      <PageTitle title="Track My Request" sub="Check the progress of your complaint or pickup." />
      <form className="mx-auto flex max-w-2xl flex-col items-stretch gap-3 sm:flex-row sm:items-end" onSubmit={(e) => { e.preventDefault(); setResult(getItems().find((i) => i.id.toLowerCase() === id.trim().toLowerCase()) ?? null); }}>
        <label className="min-w-0 flex-1"><span className="mb-2 block font-bold">Complaint or request ID</span><input className="field" placeholder="e.g. CMP-1001" value={id} onChange={(e) => { setId(e.target.value); setResult(undefined); }} required /></label>
        <Button type="submit" className="h-14 rounded-full px-7 text-lg"><Search /> Track request</Button>
      </form>
      {result === null && <p role="alert" className="mt-6 text-center text-lg font-bold text-destructive">No request found with this ID. Please check the ID and try again.</p>}
      {result && (
        <div className="card-box mx-auto mt-6 max-w-2xl">
          <p className="font-bold text-primary">{result.id}</p>
          <h2 className="mt-1 text-2xl font-extrabold">{result.type}</h2>
          <p className="mt-1 break-words text-muted-foreground">{result.location}</p>
          <p className="mt-2 text-sm text-muted-foreground">Submitted: {result.date}</p>
          {result.collector && <p className="mt-1 text-sm">Collector: <b>{result.collector}</b></p>}
          <ol aria-label="Request progress" className="mt-6 space-y-4">
            {STATUSES.map((s, i) => (
              <li key={s} aria-current={i === step ? "step" : undefined} className="flex items-center gap-4">
                <span className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i <= step ? <Check /> : i + 1}</span>
                <span className={`text-xl ${i <= step ? "font-extrabold" : "text-muted-foreground"}`}>{s}{i === step && <span className="ml-2 text-sm text-primary">Current status</span>}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Layout>
  );
}
