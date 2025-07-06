import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { events } from "@/lib/data";
import { Separator } from "./ui/separator";

export default function EventCalendar() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Upcoming Events</CardTitle>
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {events.map((event, index) => (
            <li key={event.id}>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center p-2 text-center rounded-md bg-muted/50 aspect-square h-14 w-14">
                  <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
                    {event.date.split(" ")[0]}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {event.date.split(" ")[1]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{event.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.location}
                  </p>
                </div>
              </div>
              {index < events.length - 1 && <Separator className="my-4" />}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
