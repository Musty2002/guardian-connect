import { useEffect, useState } from "react";
import { Shield } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 0: Logo appears (0-2000ms)
    const timer1 = setTimeout(() => setStage(1), 2000);
    
    // Stage 1: Text appears (2000-4000ms)
    const timer2 = setTimeout(() => setStage(2), 4000);
    
    // Stage 2: Progress bar (4000-9000ms)
    const timer3 = setTimeout(() => setStage(3), 9000);
    
    // Stage 3: Fade out (9000-10000ms)
    const timer4 = setTimeout(() => {
      onComplete();
    }, 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-gradient-to-br from-primary via-primary/90 to-accent flex items-center justify-center transition-opacity duration-500 ${
        stage === 3 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Animated background glow */}
        <div className="absolute inset-0 -z-10">
          <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/20 blur-3xl transition-all duration-1000 ${
              stage >= 1 ? 'scale-150 opacity-100' : 'scale-0 opacity-0'
            }`}
          />
        </div>

        {/* Logo container */}
        <div 
          className={`relative mb-8 transition-all duration-700 ${
            stage >= 0 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          {/* Pulsing rings */}
          <div className="absolute inset-0 -m-8">
            <div 
              className={`absolute inset-0 rounded-full border-2 border-white/30 transition-all duration-1000 ${
                stage >= 1 ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
              }`}
            />
            <div 
              className={`absolute inset-0 rounded-full border-2 border-white/20 transition-all duration-1000 delay-200 ${
                stage >= 1 ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
              }`}
            />
          </div>

          {/* Logo */}
          <div className="relative w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="SafeGuard Nigeria" 
              className="w-20 h-20 object-contain"
            />
          </div>

          {/* Shield icon overlay */}
          <div 
            className={`absolute -bottom-4 -right-4 w-16 h-16 bg-accent rounded-full shadow-lg flex items-center justify-center transition-all duration-500 delay-300 ${
              stage >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
          >
            <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* App name and tagline */}
        <div 
          className={`text-center space-y-2 transition-all duration-700 delay-500 ${
            stage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <h1 className="text-4xl font-bold text-white tracking-tight">
            SafeGuard Nigeria
          </h1>
          <p className="text-white/80 text-lg font-medium">
            Your Safety, Our Priority
          </p>
        </div>

        {/* Progress bar */}
        <div 
          className={`mt-12 w-64 h-1.5 bg-white/20 rounded-full overflow-hidden transition-all duration-500 delay-700 ${
            stage >= 2 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className={`h-full bg-white rounded-full transition-all duration-1000 ease-out ${
              stage >= 2 ? 'w-full' : 'w-0'
            }`}
          />
        </div>

        {/* Loading text */}
        <p 
          className={`mt-6 text-white/60 text-sm font-medium transition-all duration-500 delay-1000 ${
            stage >= 2 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Initializing security features...
        </p>
      </div>
    </div>
  );
};
