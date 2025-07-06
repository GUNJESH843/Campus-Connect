import AnnouncementsFeed from '@/components/announcements-feed';
import EventCalendar from '@/components/event-calendar';
import PageHeader from '@/components/layout/page-header';

export default function Home() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back, Alex. Here's what's happening on campus."
      />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Announcements & Events
            </h2>
            <AnnouncementsFeed />
          </div>
          <div className="space-y-8">
            <EventCalendar />
          </div>
        </div>
      </main>
    </>
  );
}
