import StudyBuddyFinder from '@/components/study-buddy-finder';
import PageHeader from '@/components/layout/page-header';

export default function StudyBuddyPage() {
  return (
    <>
      <PageHeader
        title="Study Buddy Finder"
        description="Find compatible study partners for your courses."
      />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <StudyBuddyFinder />
      </main>
    </>
  );
}
