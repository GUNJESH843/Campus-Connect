'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from '@vis.gl/react-google-maps';

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
} from '@/components/ui/form';
import { Bot, Loader2, SendHorizonal, User, MapPin } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import type { CampusLocation } from '@/lib/data';

const formSchema = z.object({
  query: z.string().min(1, 'Please enter a question.'),
});

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const MAP_ID = 'campus-connect-map';

export default function CampusMapInteractive() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pin, setPin] = useState<CampusLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Default to a central point on our fictional campus
  const [mapCenter, setMapCenter] = useState({
    lat: 37.4275,
    lng: -122.1697,
  });
  const [zoom, setZoom] = useState(16);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

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

      if (result.location) {
        setPin(result.location);
        setMapCenter(result.location.coordinates);
        setZoom(18); // Zoom in on the pin
      } else {
        setPin(null);
      }
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

  const ChatPanel = () => (
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
  );

  return (
    <div className="grid lg:grid-cols-2 gap-8 h-full">
      <Card className="flex flex-col">
        <CardHeader>
          <h2 className="text-xl font-semibold">Campus Map</h2>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden border">
            {apiKey ? (
              <APIProvider apiKey={apiKey}>
                <Map
                  center={mapCenter}
                  zoom={zoom}
                  mapId={MAP_ID}
                  gestureHandling={'greedy'}
                  disableDefaultUI={true}
                  className="h-full w-full"
                >
                  {pin && (
                    <AdvancedMarker position={pin.coordinates} title={pin.name}>
                      <Pin
                        background={'hsl(var(--destructive))'}
                        borderColor={'hsl(var(--destructive))'}
                        glyphColor={'hsl(var(--destructive-foreground))'}
                      />
                    </AdvancedMarker>
                  )}
                </Map>
              </APIProvider>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-destructive">
                  Google Maps API Key Missing
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Please add your Google Maps API Key to the `.env` file as
                  `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to enable the map.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <ChatPanel />
    </div>
  );
}
