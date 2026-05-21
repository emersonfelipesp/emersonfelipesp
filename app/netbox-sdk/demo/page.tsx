import type { Metadata } from "next";
import { incrementView } from "@/lib/views";
import { DemoSwaggerUI } from "@/components/netbox-sdk/DemoSwaggerUI";

export const metadata: Metadata = {
  title: "netbox-sdk — Interactive API Demo",
  description:
    "Try the netbox-sdk Mock API live — browse all NetBox REST endpoints and test them interactively via Swagger UI.",
};

export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  await incrementView("/netbox-sdk/demo");
  return (
    <div data-palette="netbox" className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-mono text-2xl font-bold text-fg">
            netbox-sdk — Interactive API Demo
          </h1>
          <p className="mt-2 font-mono text-sm text-muted">
            NetBox REST endpoints running against the in-memory mock — try them
            live.
          </p>
        </div>
      </div>
      <DemoSwaggerUI />
    </div>
  );
}
