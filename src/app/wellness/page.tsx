import PageHeader from '@/components/layout/page-header';
import WellnessCoach from '@/components/wellness-coach';

export default function WellnessPage() {
  return (
    <>
      <PageHeader
        title="AI Wellness Coach"
        description="A safe space to find support and practice mindfulness."
      />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <WellnessCoach />
      </main>
    </>
  );
}
