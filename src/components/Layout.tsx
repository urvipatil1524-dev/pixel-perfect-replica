import { Link } from "@tanstack/react-router";
import { Recycle, Menu, X, Phone } from "lucide-react";
import { useState, type ReactNode } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/report", label: "Report Waste" },
  { to: "/pickup", label: "Request Pickup" },
  { to: "/guide", label: "Segregation Guide" },
  { to: "/track", label: "Track Request" },
  { to: "/admin", label: "Admin" },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-primary">
            <Recycle className="h-8 w-8" /> CleanCity
          </Link>
          <nav className="hidden gap-1 lg:flex">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="rounded-full px-4 py-2 font-bold hover:bg-accent" activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary" }} activeOptions={{ exact: true }}>{l.label}</Link>
            ))}
          </nav>
          <button className="rounded-full p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </button>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t px-4 py-3 lg:hidden">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-lg font-bold hover:bg-accent" activeProps={{ className: "bg-primary text-primary-foreground" }} activeOptions={{ exact: true }}>{l.label}</Link>
            ))}
          </nav>
        )}
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <footer className="bg-secondary text-secondary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-center sm:flex-row">
          <p className="font-bold">Smart Waste Management City Website</p>
          <a href="tel:18001234567" className="flex items-center gap-2 font-bold"><Phone className="h-5 w-5" /> Help: 1800-123-4567</a>
        </div>
      </footer>
    </div>
  );
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
      {sub && <p className="mt-2 text-lg text-muted-foreground">{sub}</p>}
    </div>
  );
}
