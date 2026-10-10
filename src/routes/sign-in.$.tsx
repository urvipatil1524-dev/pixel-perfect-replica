import { SignIn } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-in/$")({
  component: Page,
});

function Page() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <section className="w-full max-w-md">
        <a href="/" className="mb-6 flex items-center justify-center gap-2 text-xl font-extrabold text-primary"><span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">C</span>CleanCity</a>
        <SignIn />
      </section>
    </main>
  );
}
