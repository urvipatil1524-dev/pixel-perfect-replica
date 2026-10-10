import { createFileRoute } from "@tanstack/react-router";
import { BatteryCharging, Leaf, MapPin, Package, Recycle } from "lucide-react";
import { Layout, PageTitle } from "@/components/Layout";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Waste Segregation Guide — CleanCity" },
      { name: "description", content: "Learn which bin to use for wet waste, dry waste, and e-waste." },
      { property: "og:title", content: "Waste Segregation Guide — CleanCity" },
      { property: "og:description", content: "A simple guide to sorting your waste." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Guide,
});

const bins = [
  { name: "Green Bin", kind: "Wet waste", items: "Food scraps, fruit and vegetable peels, tea leaves, and garden trimmings.", icon: Leaf, tone: "wet" },
  { name: "Blue Bin", kind: "Dry waste", items: "Clean paper and cardboard, glass bottles, metal cans, and recyclable plastic.", icon: Package, tone: "dry" },
  { name: "Red Bin", kind: "E-waste", items: "Batteries, chargers, small electronics, and other electronic accessories.", icon: BatteryCharging, tone: "ewaste" },
];

const nearby = [
  { name: "Central Park Gate", distance: "200 m" },
  { name: "City Market, Lane 2", distance: "450 m" },
  { name: "Bus Stand Corner", distance: "700 m" },
];

function Guide() {
  return (
    <Layout>
      <div className="guide-page">
        <PageTitle title="Waste Segregation Guide" sub="A little sorting goes a long way. Find the right bin for everyday waste." />
        <section aria-label="Waste sorting categories">
          <div className="guide-section-heading">
            <span className="guide-eyebrow"><Recycle aria-hidden="true" /> Sort it right</span>
            <p>Keep items clean and dry where possible before recycling.</p>
          </div>
          <div className="guide-bin-grid">
            {bins.map(({ name, kind, items, icon: Icon, tone }) => (
              <article key={name} className={`guide-bin-card guide-bin-card--${tone}`}>
                <div className="guide-bin-card-top">
                  <span className="guide-bin-icon"><Icon aria-hidden="true" /></span>
                  <span className="guide-bin-label">{kind}</span>
                </div>
                <h2>{name}</h2>
                <p className="guide-bin-items">{items}</p>
                <div className="guide-bin-rule" />
                <p className="guide-bin-tip">Place items loose in the bin. Avoid tying recyclables in plastic bags.</p>
              </article>
            ))}
          </div>
        </section>
        <section className="guide-nearby" aria-labelledby="nearby-heading">
          <div className="guide-nearby-heading">
            <div>
              <span className="guide-eyebrow"><MapPin aria-hidden="true" /> Around your neighborhood</span>
              <h2 id="nearby-heading">Nearby drop-off points</h2>
            </div>
            <p>Choose a convenient collection point for items that need a dedicated bin.</p>
          </div>
          <div className="guide-nearby-list">
            {nearby.map(({ name, distance }) => (
              <article key={name} className="guide-nearby-card">
                <span className="guide-nearby-pin"><MapPin aria-hidden="true" /></span>
                <div><h3>{name}</h3><p>Community collection point</p></div>
                <span className="guide-distance">{distance}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
