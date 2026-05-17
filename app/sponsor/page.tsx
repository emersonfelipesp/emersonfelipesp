import type { Metadata } from "next";
import { SponsorContent } from "@/components/home/SponsorContent";

export const metadata: Metadata = {
  title: "Sponsor ~ emersonfelipesp",
  description:
    "Sponsor Emerson Felipe on GitHub Sponsors to support open-source NetBox, Proxmox, and NetDevOps tooling.",
  alternates: { canonical: "/sponsor" },
};

export default function SponsorPage(): React.JSX.Element {
  return <SponsorContent />;
}
