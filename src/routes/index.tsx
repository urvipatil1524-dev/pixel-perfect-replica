import {
  ArrowRight,
  Check,
  Leaf,
  Truck,
  TriangleAlert,
} from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import "./Home.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CleanCity — A cleaner city starts with us" },
      { name: "description", content: "Report waste, schedule a pickup, and find a nearby bin. Small actions make a cleaner, healthier city." },
      { property: "og:title", content: "A cleaner city starts with us" },
      { property: "og:description", content: "Report waste, schedule a pickup, and find a nearby bin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const actions = [
  {
    title: "Report a waste issue",
    description:
      "Spotted overflowing bins, illegal dumping, or litter? Let the city team know where help is needed.",
    label: "Report an issue",
    href: "/report",
    Icon: TriangleAlert,
    tone: "orange",
  },
  {
    title: "Request a pickup",
    description:
      "Have bulky items or a special collection to arrange? Share a few details and plan your next step.",
    label: "Arrange a pickup",
    href: "/pickup",
    Icon: Truck,
    tone: "green",
  },

];

function Brand() {
  return (
    <a className="cc-brand" href="#top" aria-label="CleanCity home">
      <span className="cc-brand-mark"><Leaf aria-hidden="true" /></span>
      CleanCity
    </a>
  );
}

function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    href.startsWith("/") ? (
      <Link className={`cc-arrow-link ${className}`} to={href as "/report" | "/pickup" | "/guide"}>
        {children}<ArrowRight aria-hidden="true" />
      </Link>
    ) : (
      <a className={`cc-arrow-link ${className}`} href={href}>
        {children}<ArrowRight aria-hidden="true" />
      </a>
    )
  );
}

function Landscape({ className = "" }) {
  return (
    <div className={`cc-landscape ${className}`} aria-hidden="true">
      <span className="cc-sun" />
      <span className="cc-tree cc-tree-one" />
      <span className="cc-tree cc-tree-two" />
      <span className="cc-hills cc-hills-back" />
      <span className="cc-hills cc-hills-front" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="cc-home">
      <header className="cc-container cc-nav">
        <Brand />
        <nav className="cc-nav-links" aria-label="Main navigation">
          <a href="#services">What you can do</a>
          <a href="#impact">Our impact</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <Button asChild className="cc-button cc-nav-button"><a href="#services">Take action <ArrowRight /></a></Button>
      </header>

      <main id="top">
        <section className="cc-container cc-hero">
          <div className="cc-hero-copy">
            <span className="cc-eyebrow">A cleaner city, together</span>
            <h1>Small actions.<br /><span>Big impact.</span></h1>
            <p>A cleaner neighborhood starts with all of us. Report an issue, arrange a pickup, or find the right place for your waste.</p>
            <div className="cc-hero-actions">
              <Button asChild className="cc-button"><a href="#services">Make a difference <ArrowRight /></a></Button>
              <Button asChild variant="outline" className="cc-button cc-button-outline"><a href="#how-it-works">See how it works</a></Button>
            </div>
            <div className="cc-trust">
              <div className="cc-avatars" aria-hidden="true"><span>🌱</span><span>♻️</span><span>🏡</span><span>🌼</span></div>
              <span><strong>Neighbors in action</strong><br />Building a cleaner city, one step at a time</span>
            </div>
          </div>
          <div className="cc-hero-art">
            <Landscape />
            <article className="cc-city-card">
              <div className="cc-card-top"><span className="cc-live"><i /> Community in action</span><span className="cc-card-leaf"><Leaf /></span></div>
              <h2>A little care goes a long way.</h2>
              <p>Every report and responsible disposal makes a difference.</p>
              <div className="cc-progress-label"><span>Cleaner streets start here</span><span>Today</span></div>
              <div className="cc-progress"><span /></div>
            </article>
            <div className="cc-mini-note"><strong>One city</strong><span>Many helping hands</span></div>
          </div>
        </section>

        <section className="cc-container cc-stats" aria-label="Our shared goals">
          {[ ["Cleaner", "streets and public spaces"], ["Healthier", "neighborhoods for everyone"], ["Simpler", "ways to do the right thing"], ["Together", "we make lasting change"] ].map(([title, text]) => (
            <div className="cc-stat" key={title}><strong>{title}</strong><span>{text}</span></div>
          ))}
        </section>

        <section className="cc-container cc-section" id="services">
          <div className="cc-section-head"><div><span className="cc-eyebrow">Your next good deed</span><h2>Make a difference<br />right where you are.</h2></div><p>Pick the action that fits your day. A few details help the right service reach you faster.</p></div>
          <div className="cc-services">
            {actions.map(({ title, description, label, href, Icon, tone }) => (
              <article className="cc-service" key={title}>
                <span className={`cc-service-icon ${tone}`}><Icon aria-hidden="true" /></span>
                <h3>{title}</h3><p>{description}</p>
                <ArrowLink href={href}>{label}</ArrowLink>
              </article>
            ))}
          </div>
        </section>

        <section className="cc-container" id="impact">
          <div className="cc-impact">
            <div className="cc-impact-art"><Landscape /><div className="cc-impact-stat"><strong>One</strong><span>simple action can spark another.</span></div></div>
            <div className="cc-impact-copy"><span className="cc-eyebrow">Better starts nearby</span><h2>Good habits make a healthier home.</h2><p>When we sort thoughtfully, dispose responsibly, and speak up about problems, our shared spaces become safer and more welcoming for everyone.</p>
              <ul>{["Keep public spaces welcoming", "Make waste easier to manage", "Look out for neighbors and nature"].map((item) => <li key={item}><span><Check /></span>{item}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="cc-container cc-section" id="how-it-works">
          <div className="cc-section-head"><div><span className="cc-eyebrow">Easy as one, two, three</span><h2>Doing your part<br />is straightforward.</h2></div><p>Choose what you need and we’ll help you find the right next step.</p></div>
          <div className="cc-steps">{[["01", "Choose an action", "Report a problem, arrange a pickup, or look up how to dispose of an item."], ["02", "Share the details", "Tell us what and where. A clear location helps the right team or service respond."], ["03", "Help your city thrive", "Your thoughtful action helps make the neighborhood cleaner for all of us."]].map(([number, title, text]) => <article className="cc-step" key={number}><span className="cc-step-number">{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>

        <section className="cc-container" id="guide"><div className="cc-banner"><div><h2>Ready to make your corner of the city cleaner?</h2><p>Start with one small action today. Your neighbors will thank you.</p></div><Button asChild className="cc-button cc-button-light"><a href="#services">Choose an action <ArrowRight /></a></Button></div></section>
      </main>

      <footer className="cc-container cc-footer"><div className="cc-footer-inner"><Brand /><span>A cleaner city is something we create together.</span><nav aria-label="Footer"><a href="#services">Take action</a><a href="#impact">Our impact</a><a href="mailto:hello@cleancity.example">Get in touch</a></nav></div></footer>
    </div>
  );
}
