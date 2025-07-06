import { GraduationCap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between w-full px-4 py-3 border-b shrink-0 bg-background/80 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <GraduationCap className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-foreground">CampusConnect</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
          Alex Doe
        </span>
        <Avatar className="w-9 h-9">
          <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="profile picture" alt="User Avatar" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
