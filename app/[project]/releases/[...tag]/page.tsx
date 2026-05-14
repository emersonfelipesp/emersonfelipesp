import {
  createReleaseDetailPageMetadata,
  renderReleaseDetailPage,
  type ReleaseDetailPageProps,
} from "@/lib/page-shells";

export const dynamic = "force-dynamic";

export const generateMetadata = createReleaseDetailPageMetadata;

export default async function Page({
  params,
  searchParams,
}: ReleaseDetailPageProps): Promise<React.JSX.Element> {
  return renderReleaseDetailPage({ params, searchParams });
}
