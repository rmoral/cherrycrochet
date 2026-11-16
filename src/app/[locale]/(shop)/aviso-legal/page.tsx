import { LegalPageView, legalMetadata } from "@/components/LegalPage";

export const generateMetadata = legalMetadata("notice");

export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  return <LegalPageView params={params} page="notice" />;
}
