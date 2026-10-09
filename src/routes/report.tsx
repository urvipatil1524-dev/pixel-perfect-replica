import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Camera, LocateFixed } from "lucide-react";
import { Layout, PageTitle } from "@/components/Layout";
import { addItem } from "@/lib/store";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report Waste — Smart Waste City" },
      { name: "description", content: "Report overflowing bins, garbage on roads, missed pickups or illegal dumping." },
      { property: "og:title", content: "Report Waste — Smart Waste City" },
      { property: "og:description", content: "Report waste problems in your area in a few taps." },
    ],
  }),
  component: Report,
});

const types = ["Overflowing Bin", "Garbage on Road", "Missed Pickup", "Illegal Dumping"];

function Report() {
  const [type, setType] = useState(types[0]);
  const [location, setLocation] = useState("");
  const [done, setDone] = useState<string | null>(null);

  const useGps = () => navigator.geolocation?.getCurrentPosition(
    (p) => setLocation(`${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`),
    () => alert("Could not get your location. Please type it."),
  );

  if (done) return (
    <Layout>
      <div className="card-box mx-auto max-w-lg text-center">
        <CheckCircle2 className="mx-auto h-20 w-20 text-success" />
        <h1 className="mt-4 text-2xl font-extrabold">Your complaint has been submitted successfully.</h1>
        <p className="mt-3 text-lg">Your ID: <b className="text-secondary">{done}</b></p>
        <p className="text-muted-foreground">Save this ID to track your complaint.</p>
        <button className="btn mt-6" onClick={() => setDone(null)}>Report another</button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <PageTitle title="Report Waste" sub="Tell us about a waste problem near you." />
      <form className="card-box mx-auto max-w-2xl space-y-6" onSubmit={(e) => { e.preventDefault(); setDone(addItem({ kind: "Complaint", type, location }).id); }}>
        <div>
          <p className="mb-3 font-bold">1. What is the problem?</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {types.map((t) => (
              <button type="button" key={t} onClick={() => setType(t)} className={`rounded-2xl border-2 p-4 text-lg font-bold ${type === t ? "border-primary bg-accent" : "bg-card"}`}>{t}</button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="mb-2 flex items-center gap-2 font-bold"><Camera className="h-5 w-5" /> 2. Upload photo</span>
          <input type="file" accept="image/*" className="field" />
        </label>
        <div>
          <span className="mb-2 block font-bold">3. Location</span>
          <input required className="field" placeholder="Street, area or landmark" value={location} onChange={(e) => setLocation(e.target.value)} />
          <button type="button" onClick={useGps} className="btn btn-blue mt-3"><LocateFixed className="h-5 w-5" /> Use my current location</button>
        </div>
        <label className="block">
          <span className="mb-2 block font-bold">4. Short description</span>
          <textarea className="field" rows={3} placeholder="Describe the problem" />
        </label>
        <button className="btn w-full">Submit</button>
      </form>
    </Layout>
  );
}
