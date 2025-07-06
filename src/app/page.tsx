import AnnouncementsFeed from "@/components/announcements-feed";
import EventCalendar from "@/components/event-calendar";
import Header from "@/components/layout/header";
import PersonalizedRecommendations from "@/components/personalized-recommendations";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
      <main className="flex-1 w-full max-w-screen-xl px-4 py-8 mx-auto md:px-6 md:py-12">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <PersonalizedRecommendations />
          </div>
          <div className="space-y-8">
            <AnnouncementsFeed />
            <EventCalendar />
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
