import { useEffect, useRef, useState } from "react";

interface UsePullToRefreshProps {
  onRefresh: () => Promise<void>;
  threshold?: number;
  resistance?: number;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
}: UsePullToRefreshProps) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    const container = containerRef.current;
    if (!container || isRefreshing) return;
    
    // Only allow pull to refresh when scrolled to top
    if (container.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    const container = containerRef.current;
    if (!container || isRefreshing || touchStartY.current === 0) return;

    const touchY = e.touches[0].clientY;
    const pullLength = touchY - touchStartY.current;

    if (pullLength > 0 && container.scrollTop === 0) {
      setPullDistance(pullLength / resistance);
      
      // Prevent default scrolling when pulling down
      if (pullLength > 10) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (isRefreshing) return;

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      setPullDistance(threshold);
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        touchStartY.current = 0;
      }
    } else {
      setPullDistance(0);
      touchStartY.current = 0;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isRefreshing, pullDistance]);

  return {
    containerRef,
    pullDistance,
    isRefreshing,
    threshold,
  };
};
