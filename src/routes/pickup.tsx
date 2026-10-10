import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Layout, PageTitle } from "@/components/Layout";
import { addItem } from "@/lib/store";

export const Route = createFileRoute("/pickup")({
  head: () => ({
    meta: [
      { title: "Request Pickup — Smart Waste City" },
      { name: "description", content: "Book a home waste pickup for wet, dry, recyclable or e-waste." },
      { property: "og:title", content: "Request Pickup — Smart Waste City" },
      { property: "og:description", content: "Book a home waste pickup easily." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pickup,
});

const types = ["Wet Waste", "Dry Waste", "Recyclable Waste", "E-Waste"];

function Pickup() {
  const [type, setType] = useState<string>(types[0]!);
  const [address, setAddress] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitPickup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const item = await addItem({ data: { kind: "Pickup", type, location: address, contactName: name, contactPhone: phone, preferredDate } });
      setDone(item.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not submit your pickup request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return (
    <Layout>
      <div className="card-box mx-auto max-w-lg text-center">
        <CheckCircle2 className="mx-auto h-20 w-20 text-success" />
        <h1 className="mt-4 text-2xl font-extrabold">Your pickup request has been submitted.</h1>
        <p className="mt-3 text-lg">Your ID: <b className="text-secondary">{done}</b></p>
        <button className="btn mt-6" onClick={() => setDone(null)}>New request</button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <PageTitle title="Request Pickup" sub="We will collect waste from your home." />
      <form className="card-box mx-auto max-w-2xl space-y-5" onSubmit={submitPickup}>
        <label className="block"><span className="mb-2 block font-bold">Name</span><input required maxLength={120} className="field" value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label className="block"><span className="mb-2 block font-bold">Mobile number</span><input required type="tel" pattern="[0-9+ ]{10,14}" className="field" value={phone} onChange={(event) => setPhone(event.target.value)} /></label>
        <label className="block"><span className="mb-2 block font-bold">Address</span><textarea required rows={2} className="field" value={address} onChange={(e) => setAddress(e.target.value)} /></label>
        <div>
          <span className="mb-2 block font-bold">Waste type</span>
          <div className="grid gap-3 sm:grid-cols-2">
            {types.map((t) => (
              <button type="button" key={t} onClick={() => setType(t)} className={`rounded-2xl border-2 p-4 text-lg font-bold ${type === t ? "border-secondary bg-accent" : "bg-card"}`}>{t}</button>
            ))}
          </div>
        </div>
        <label className="block"><span className="mb-2 block font-bold">Preferred pickup date</span><input required type="date" className="field" value={preferredDate} onChange={(event) => setPreferredDate(event.target.value)} /></label>
        {error && <p role="alert" className="text-sm font-bold text-destructive">{error}</p>}
        <button className="btn btn-blue w-full" disabled={submitting}>{submitting ? "Submitting…" : "Submit request"}</button>
      </form>
    </Layout>
  );
}
