import PageHeader from '@/components/layout/page-header';
import CourseReviews from '@/components/course-reviews';

export default function CoursesPage() {
  return (
    <>
      <PageHeader
        title="Course Reviews"
        description="Browse student reviews and share your own experiences."
      />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <CourseReviews />
      </main>
    </>
  );
}
