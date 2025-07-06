import PageHeader from '@/components/layout/page-header';
import CampusMapInteractive from '@/components/campus-map-interactive';

export default function MapPage() {
  return (
    <>
      <PageHeader
        title="Campus Map"
        description="Ask our AI guide for help navigating the campus."
      />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <CampusMapInteractive />
      </main>
    </>
  );
}
