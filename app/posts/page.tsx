import type { Metadata } from "next";
import { PostsContent } from "@/components/posts/PostsContent";
import { incrementView } from "@/lib/views";

export const metadata: Metadata = {
  title: "Posts ~ emersonfelipesp",
  description:
    "Articles and comparison guides on proxmox-sdk, netbox-sdk, and the broader NetBox + Proxmox ecosystem.",
  alternates: { canonical: "/posts" },
};

export const dynamic = "force-dynamic";

export default async function PostsPage(): Promise<React.JSX.Element> {
  await incrementView("/posts");
  return <PostsContent />;
}
