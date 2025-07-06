'use client';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BrainCircuit, Bot, Loader2, SendHorizonal, User, BookOpen } from 'lucide-react';

import { askAITutor } from '@/ai/flows/ai-tutor-flow';
import { useToast } from '@/hooks/use-toast';
import { tutorSubjects } from '@/lib/data';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';

const formSchema = z.object({
  query: z.string().min(1, 'Please enter a question.'),
});

interface ChatMessage {
  role: 'user' | 'model';
  content: { text: string }[];
}

export default function AITutor() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [subject, setSubject] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A bit of a hack to scroll to the bottom.
        // Direct scrollIntoView on the last element is more reliable.
        setTimeout(() => {
          scrollAreaRef.current?.querySelector('[data-last-message]')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
  }, [messages]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!subject) {
      toast({
        variant: 'destructive',
        title: 'No subject selected',
        description: 'Please select a subject before asking a question.',
      });
      return;
    }

    setIsLoading(true);
    const userMessage: ChatMessage = { role: 'user', content: [{ text: values.query }] };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    try {
      const result = await askAITutor({
        subject: subject,
        query: values.query,
        history: messages,
      });
      const assistantMessage: ChatMessage = {
        role: 'model',
        content: [{ text: result.response }],
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
  
  const handleSelectSubject = (selectedSubject: string) => {
    setSubject(selectedSubject);
    setMessages([]); // Reset chat history when subject changes
  }

  return (
    <Card className="flex flex-col max-h-[calc(100vh-10rem)]">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <BrainCircuit />
                    AI Tutor
                </CardTitle>
                <CardDescription>Select a subject to start your session.</CardDescription>
            </div>
            <div className="w-full sm:w-64">
                <Select onValueChange={handleSelectSubject} defaultValue={subject ?? ''}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a subject..." />
                    </SelectTrigger>
                    <SelectContent>
                        {tutorSubjects.map((s) => (
                        <SelectItem key={s} value={s}>
                            {s}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow gap-4">
        <ScrollArea className="flex-grow h-0 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
                <div className="flex h-full min-h-[300px] items-center justify-center text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                        <BookOpen className="h-10 w-10"/>
                        <p>{subject ? `Ask me anything about ${subject}!` : 'Select a subject to begin.'}</p>
                    </div>
                </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                data-last-message={index === messages.length - 1 ? 'true' : undefined}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.role === 'model' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-4 py-2 text-sm max-w-[80%] whitespace-pre-wrap ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p>{message.content[0].text}</p>
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
                      placeholder={subject ? `Ask about ${subject}...` : "Select a subject first"}
                      {...field}
                      disabled={isLoading || !subject}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading || !subject} size="icon">
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
  );
}
