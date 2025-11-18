import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background-secondary flex items-center justify-center p-4">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse">
              <div className="w-24 h-24 mx-auto rounded-full bg-primary/20 blur-xl"></div>
            </div>
            <img 
              src="/logo.png" 
              alt="SafeGuard Nigeria" 
              className="w-24 h-24 object-contain mx-auto relative z-10 animate-pulse"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">SafeGuard Nigeria</h2>
            <p className="text-muted-foreground">Securing your safety...</p>
          </div>
          <div className="flex justify-center">
            <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-[slide-in-right_1.5s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
