import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

interface MobileHeaderProps {
  title: string;
  onMenuClick?: () => void;
  onNotificationsClick?: () => void;
}

export const MobileHeader = ({ title, onMenuClick, onNotificationsClick }: MobileHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border/50 safe-area-top shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 max-w-screen-sm mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="text-foreground -ml-2"
        >
          <Menu className="w-6 h-6" />
        </Button>
        
        <h1 className="text-lg font-bold text-foreground tracking-tight">{title}</h1>
        
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationsClick}
            className="text-foreground relative -mr-2"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emergency rounded-full animate-pulse" />
          </Button>
        </div>
      </div>
    </header>
  );
};
