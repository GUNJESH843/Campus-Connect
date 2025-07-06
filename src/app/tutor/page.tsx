import PageHeader from '@/components/layout/page-header';
import AITutor from '@/components/ai-tutor';

export default function TutorPage() {
  return (
    <>
      <PageHeader
        title="AI Tutor"
        description="Get help with your coursework from a knowledgeable AI assistant."
      />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <AITutor />
      </main>
    </>
  );
}
