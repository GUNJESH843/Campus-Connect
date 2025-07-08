'use client';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, Loader2, SendHorizonal, User, HeartPulse, Wind, Ear } from 'lucide-react';

import { askWellnessCoach } from '@/ai/flows/wellness-coach-flow';
import { convertTextToSpeech } from '@/ai/flows/text-to-speech-flow';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

const formSchema = z.object({
  query: z.string().min(1, 'Please enter a message.'),
});

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

const breathingExerciseText = "Let's do a simple breathing exercise. I'll guide you. Find a comfortable position. Close your eyes if you'd like. Now, breathe in slowly through your nose for four counts. One... two... three... four. Hold your breath for four counts. One... two... three... four. Now, exhale slowly through your mouth for six counts. One... two... three... four... five... six. Let's repeat that two more times.";

export default function WellnessCoach() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [audioData, setAudioData] = useState<string | null>(null);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: '' },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
          scrollAreaRef.current?.querySelector('[data-last-message]')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
  }, [messages]);
  
  useEffect(() => {
    if (audioData && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioData]);

  const handleSendMessage = async (query: string) => {
    setIsLoading(true);
    const userMessage: ChatMessage = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    try {
      const result = await askWellnessCoach({
        query: query,
        history: messages.map(m => ({ role: m.role, content: [{ text: m.content }] })),
      });
      const assistantMessage: ChatMessage = {
        role: 'model',
        content: result.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: "Sorry, I couldn't get a response at this time.",
      });
      console.error(e);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleGenerateAudioExercise = async () => {
    setIsSynthesizing(true);
    setAudioData(null);
    const userMessage: ChatMessage = { role: 'user', content: "Let's do a breathing exercise." };
    const assistantMessage: ChatMessage = { role: 'model', content: "Of course. Click the 'Listen' badge above to start the audio when it's ready." };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    
    try {
        const result = await convertTextToSpeech(breathingExerciseText);
        setAudioData(result.media);
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Audio Error',
        description: "Couldn't generate the audio exercise. Please try again.",
      });
      console.error(error);
      setMessages((prev) => prev.slice(0, -2)); // Remove the request/response
    } finally {
        setIsSynthesizing(false);
    }
  }

  return (
    <Card className="flex flex-col max-h-[calc(100vh-10rem)]">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <HeartPulse />
                    AI Wellness Coach
                </CardTitle>
                <CardDescription>A safe space for support and mindfulness.</CardDescription>
            </div>
            {audioData && (
                <Badge className="cursor-pointer" onClick={() => audioRef.current?.play()}>
                    <Ear className="mr-2 h-4 w-4" /> Listen to Exercise
                </Badge>
            )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow gap-4">
        <ScrollArea className="flex-grow h-0 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
                <div className="flex h-full min-h-[300px] items-center justify-center text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-4">
                        <HeartPulse className="h-10 w-10"/>
                        <p>How are you feeling today?</p>
                        <div className="flex gap-2">
                           <Button variant="outline" size="sm" onClick={() => handleSendMessage("I'm feeling stressed about my exams.")}>
                                Exam Stress
                           </Button>
                           <Button variant="outline" size="sm" disabled={isSynthesizing} onClick={handleGenerateAudioExercise}>
                               {isSynthesizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wind className="mr-2 h-4 w-4"/>}
                                Breathing Exercise
                           </Button>
                        </div>
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
            onSubmit={form.handleSubmit(d => handleSendMessage(d.query))}
            className="flex items-center gap-2"
          >
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      placeholder="You can tell me anything..."
                      {...field}
                      disabled={isLoading || isSynthesizing}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading || isSynthesizing} size="icon">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizonal className="h-4 w-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </Form>
        {audioData && <audio ref={audioRef} src={audioData} />}
      </CardContent>
    </Card>
  );
}
