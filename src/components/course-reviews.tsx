'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Star, Loader2, Sparkles } from 'lucide-react';

import { courses, type Course, type Review } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { summarizeCourseReviews } from '@/ai/flows/summarize-course-reviews';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const reviewFormSchema = z.object({
  rating: z.string().nonempty({ message: 'Please select a rating.' }),
  comment: z.string().min(10, {
    message: 'Comment must be at least 10 characters.',
  }),
});

export default function CourseReviews() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(courses[0] || null);
  const [reviews, setReviews] = useState<Record<string, Review[]>>(
    courses.reduce((acc, course) => ({ ...acc, [course.id]: course.reviews }), {})
  );
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { rating: '', comment: '' },
  });

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setSummary(null); // Reset summary when changing course
    form.reset();
  };

  const handleGenerateSummary = async () => {
    if (!selectedCourse) return;
    setIsSummarizing(true);
    setSummary(null);
    try {
      const courseReviews = reviews[selectedCourse.id].map((r) => r.comment);
      if (courseReviews.length < 2) {
          toast({
            variant: 'destructive',
            title: 'Not enough reviews',
            description: 'Need at least 2 reviews to generate a summary.',
          });
          return;
      }
      
      const result = await summarizeCourseReviews({
        courseName: selectedCourse.name,
        reviews: courseReviews,
      });
      setSummary(result.summary);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error generating summary',
        description: 'Could not generate summary at this time. Please try again later.',
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  function onSubmit(data: z.infer<typeof reviewFormSchema>) {
    if (!selectedCourse) return;

    const newReview: Review = {
      id: Date.now(),
      author: 'Alex Doe (You)',
      rating: parseInt(data.rating, 10),
      comment: data.comment,
    };
    
    setReviews(prev => ({
        ...prev,
        [selectedCourse.id]: [newReview, ...prev[selectedCourse.id]]
    }));

    toast({
      title: 'Review submitted!',
      description: 'Thank you for your feedback.',
    });
    form.reset();
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {courses.map((course) => (
                <Button
                  key={course.id}
                  variant={selectedCourse?.id === course.id ? 'secondary' : 'ghost'}
                  className="justify-start text-left h-auto"
                  onClick={() => handleSelectCourse(course)}
                >
                  <div>
                    <p className="font-semibold">{course.id}: {course.name}</p>
                    <p className="text-sm text-muted-foreground">{course.department}</p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2 space-y-8">
        {selectedCourse ? (
          <>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{selectedCourse.name}</CardTitle>
                        <CardDescription>{selectedCourse.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{selectedCourse.id}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button onClick={handleGenerateSummary} disabled={isSummarizing}>
                  {isSummarizing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {isSummarizing ? 'Generating...' : 'AI Summary of Reviews'}
                </Button>
                {summary && (
                  <Alert className="mt-4">
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>AI-Generated Summary</AlertTitle>
                    <AlertDescription>{summary}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Student Reviews ({reviews[selectedCourse.id].length})</h3>
                 {reviews[selectedCourse.id].map((review) => (
                    <Card key={review.id}>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <p className="font-semibold">{review.author}</p>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                           <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </CardContent>
                    </Card>
                 ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
                <CardDescription>Share your experience with this course.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Your Rating</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex"
                            >
                              {[1, 2, 3, 4, 5].map(v => (
                                <FormItem key={v} className="flex items-center space-x-2 space-y-0">
                                  <FormControl><RadioGroupItem value={String(v)} /></FormControl>
                                  <FormLabel className="font-normal flex items-center">{v} <Star className="h-4 w-4 ml-1"/></FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Comment</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your experience..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit Review</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Select a course to see details.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
