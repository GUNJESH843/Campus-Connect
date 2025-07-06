'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  findStudyBuddy,
  type FindStudyBuddyOutput,
} from '@/ai/flows/find-study-buddy';
import { useToast } from '@/hooks/use-toast';
import { studentProfiles } from '@/lib/data';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Loader2, Sparkles, User, Users } from 'lucide-react';
import { Progress } from './ui/progress';

const allCourses = [
  'CS101', 'PHYS201', 'MATH300', 'CHEM101', 'HIST101', 'ENG202', 'BIO210', 'ART101'
];
const studyStyles = ['Quiet', 'Group', 'Collaborative', 'Focused', 'Online'];
const currentUser = studentProfiles[0]; // For demonstration purposes

const formSchema = z.object({
  courses: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one course.',
  }),
  studyStyle: z.string({
    required_error: 'Please select a study style.',
  }),
});

export default function StudyBuddyFinder() {
  const [matches, setMatches] = useState<FindStudyBuddyOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courses: currentUser.courses,
      studyStyle: currentUser.studyStyle,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setMatches(null);

    try {
      const result = await findStudyBuddy({
        currentUser: { ...currentUser, ...values },
        potentialBuddies: studentProfiles,
      });
      setMatches(result);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description:
          "Sorry, we couldn't find matches at this time. Please try again later.",
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Update your courses and study style to find the best matches.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="courses"
                  render={() => (
                    <FormItem>
                      <FormLabel>Your Courses</FormLabel>
                      <div className="space-y-2">
                        {allCourses.map((course) => (
                          <FormField
                            key={course}
                            control={form.control}
                            name="courses"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={course}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(course)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              course,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== course
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {course}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studyStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Study Style</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your preference" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {studyStyles.map((style) => (
                            <SelectItem key={style} value={style}>
                              {style}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Find My Buddies
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Potential Study Buddies</CardTitle>
            <CardDescription>
              Our AI has found these potential partners for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}

            {!isLoading && !matches && (
              <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed rounded-lg">
                <Users className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  Your matches will appear here once you search.
                </p>
              </div>
            )}
            
            {!isLoading && matches && matches.matches.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed rounded-lg">
                  <Users className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    No matches found. Try selecting different courses.
                  </p>
                </div>
            )}

            {matches && matches.matches.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.matches.map((match) => (
                  <Card key={match.name} className="animate-in fade-in duration-500">
                    <CardHeader className="items-center">
                      <Avatar className="h-16 w-16 mb-2">
                        <AvatarImage
                          src={`https://placehold.co/100x100.png`}
                          data-ai-hint="profile picture"
                        />
                        <AvatarFallback>
                          {match.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-lg">{match.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                       <p className="text-sm text-muted-foreground font-medium mb-3">{studentProfiles.find(p => p.name === match.name)?.major}</p>
                      <div className="text-sm text-muted-foreground mb-3">
                        {match.reason}
                      </div>
                      <div className="flex flex-wrap gap-1 justify-center mb-4">
                         {match.matchedCourses.map(course => (
                           <Badge key={course} variant="secondary">{course}</Badge>
                         ))}
                       </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                      <div className="w-full text-center">
                        <span className="text-sm font-semibold">{match.similarityScore}% Match</span>
                        <Progress value={match.similarityScore} className="h-2 mt-1" />
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
