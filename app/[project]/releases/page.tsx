import {
  createReleaseListPageMetadata,
  renderReleaseListPage,
  type ReleaseListPageProps,
} from "@/lib/page-shells";

export const dynamic = "force-dynamic";

export const generateMetadata = createReleaseListPageMetadata;

export default async function Page({
  params,
  searchParams,
}: ReleaseListPageProps): Promise<React.JSX.Element> {
  return renderReleaseListPage({ params, searchParams });
}
