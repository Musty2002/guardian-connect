import { Home, Map, Users, Settings, Shield } from "lucide-react";
import { NavLink } from "@/components/NavLink";

export const BottomNav = () => {
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Map, label: "Map", path: "/map" },
    { icon: Shield, label: "Emergency", path: "/emergency" },
    { icon: Users, label: "Family", path: "/family" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border/50 z-50 safe-area-bottom shadow-lg">
      <div className="flex justify-around items-center h-18 max-w-screen-sm mx-auto px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex flex-col items-center justify-center flex-1 h-full py-2 text-muted-foreground hover:text-foreground transition-all duration-200 rounded-xl active:scale-95"
            activeClassName="text-primary font-semibold"
          >
            <item.icon className="w-6 h-6 mb-1.5" strokeWidth={2.5} />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
