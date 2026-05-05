import { HomeContent } from "@/components/home/HomeContent";
import { incrementView } from "@/lib/views";

export const dynamic = "force-dynamic";

export default async function HomePage(): Promise<React.JSX.Element> {
  await incrementView("/");
  return <HomeContent />;
}
