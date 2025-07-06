import { Megaphone } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { announcements } from "@/lib/data";
import { Separator } from "./ui/separator";

export default function AnnouncementsFeed() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Announcements</CardTitle>
          <Megaphone className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {announcements.map((item, index) => (
            <li key={item.id}>
              <div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.content}
                </p>
                <p className="text-xs text-muted-foreground/80 pt-2">
                  {item.date}
                </p>
              </div>
              {index < announcements.length - 1 && (
                <Separator className="my-4" />
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
