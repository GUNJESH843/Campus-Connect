'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';

import { askCampusGuide } from '@/ai/flows/campus-guide';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Bot, Loader2, SendHorizonal, User } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const formSchema = z.object({
  query: z.string().min(1, 'Please enter a question.'),
});

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function CampusMapInteractive() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const userMessage: ChatMessage = { role: 'user', content: values.query };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    try {
      const result = await askCampusGuide({ query: values.query });
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: result.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description:
          "Sorry, I couldn't get a response at this time. Please try again later.",
      });
      console.error(e);
      // Remove the user message if the API call fails
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 h-full">
      <Card className="flex flex-col">
        <CardHeader>
          <h2 className="text-xl font-semibold">Campus Map</h2>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden border">
            <Image
              src="https://placehold.co/800x600.png"
              alt="Campus Map"
              layout="fill"
              objectFit="cover"
              data-ai-hint="campus map"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="flex flex-col max-h-[calc(100vh-10rem)]">
        <CardHeader>
          <h2 className="text-xl font-semibold">AI Campus Guide</h2>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow gap-4">
          <ScrollArea className="flex-grow h-0 pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        <Bot />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 text-sm max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        <Bot />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 text-sm bg-muted flex items-center">
                       <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
              )}
            </div>
          </ScrollArea>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-2"
            >
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        placeholder="e.g., Where is the library?"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="icon">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizonal className="h-4 w-4" />
                )}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
