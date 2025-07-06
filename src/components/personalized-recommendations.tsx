"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  recommendGroups,
  type GroupRecommendationOutput,
} from "@/ai/flows/group-recommendation";
import { campusGroups, campusActivities } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  interests: z.string().min(10, {
    message: "Please tell us a bit more about your interests.",
  }),
});

export default function PersonalizedRecommendations() {
  const [recommendations, setRecommendations] =
    useState<GroupRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations(null);

    try {
      const result = await recommendGroups({
        interests: values.interests,
        campusGroups: campusGroups.join(", "),
        campusActivities: campusActivities.join(", "),
      });
      setRecommendations(result);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description:
          "Sorry, we couldn't get recommendations at this time. Please try again later.",
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const recommendedGroupsArray =
    recommendations?.recommendedGroups
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) || [];
  const recommendedActivitiesArray =
    recommendations?.recommendedActivities
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) || [];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-accent" />
          <CardTitle className="text-xl font-semibold">
            Discover Your Community
          </CardTitle>
        </div>
        <CardDescription>
          Tell us your interests, and our AI will suggest groups and activities
          you might like!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Interests</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I love playing guitar, hiking on weekends, and learning about new technologies like AI and blockchain."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding Your Vibe...
                </>
              ) : (
                "Get Recommendations"
              )}
            </Button>
          </form>
        </Form>

        {(isLoading || recommendations) && <Separator className="my-6" />}

        {isLoading && (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {recommendations && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div>
              <h3 className="font-semibold mb-3">Recommended Groups</h3>
              {recommendedGroupsArray.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {recommendedGroupsArray.map((group, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                      {group}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No specific group recommendations found. Try broadening your
                  interests!
                </p>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-3">Recommended Activities</h3>
              {recommendedActivitiesArray.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {recommendedActivitiesArray.map((activity, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                      {activity}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No specific activity recommendations found. Try broadening
                  your interests!
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
