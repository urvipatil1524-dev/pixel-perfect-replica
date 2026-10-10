import { Link } from "@tanstack/react-router";
import { Leaf, Menu, X, Phone } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/tanstack-react-start";

const links = [
  { to: "/", label: "Home" },
  { to: "/report", label: "Report Waste" },
  { to: "/pickup", label: "Request Pickup" },
  { to: "/guide", label: "Segregation Guide" },
  { to: "/track", label: "Track Request" },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="site-brand">
            <span className="site-brand-mark"><Leaf aria-hidden="true" /></span>
            CleanCity
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="site-nav-link" activeProps={{ className: "is-active" }} activeOptions={{ exact: true }}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Show when="signed-out">
              <SignInButton>
                <Button variant="ghost" size="sm">Sign in</Button>
              </SignInButton>
              <SignUpButton>
                <Button size="sm">Sign up</Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in"><UserButton /></Show>
          </div>
          <Button variant="ghost" size="icon" className="site-menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation">
            {open ? <X /> : <Menu />}
          </Button>
        </div>
        {open && (
          <nav id="mobile-navigation" className="site-mobile-nav" aria-label="Mobile navigation">
            {links.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="site-mobile-link" activeProps={{ className: "is-active" }} activeOptions={{ exact: true }}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p className="site-footer-brand">A cleaner city is something we create together.</p>
          <a href="tel:18001234567" className="site-help"><Phone aria-hidden="true" /> Help: 1800-123-4567</a>
        </div>
      </footer>
    </div>
  );
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="site-page-title">
      <h1>{title}</h1>
      {sub && <p>{sub}</p>}
    </div>
  );
}
