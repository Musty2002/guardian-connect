import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatusCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  status: "safe" | "warning" | "danger";
  onClick?: () => void;
}

export const StatusCard = ({ icon: Icon, title, value, status, onClick }: StatusCardProps) => {
  const statusColors = {
    safe: "border-success/20 bg-gradient-to-br from-success/10 to-success/5",
    warning: "border-warning/20 bg-gradient-to-br from-warning/10 to-warning/5",
    danger: "border-emergency/20 bg-gradient-to-br from-emergency/10 to-emergency/5",
  };

  const iconColors = {
    safe: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    danger: "bg-emergency/15 text-emergency",
  };

  const textColors = {
    safe: "text-success",
    warning: "text-warning",
    danger: "text-emergency",
  };

  return (
    <Card
      className={`p-4 border-2 ${statusColors[status]} cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl ${iconColors[status]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-muted-foreground text-xs font-medium mb-1 uppercase tracking-wide">{title}</p>
          <p className={`text-xl font-bold ${textColors[status]} truncate`}>{value}</p>
        </div>
      </div>
    </Card>
  );
};
