import { useCallback, useRef, useState, useEffect } from 'react';

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  autoCloseDelay?: number; // milliseconds to auto-close after opening (default: 2000ms)
}

export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 100, autoCloseDelay = 2000 }: UseSwipeOptions) {
  const [isSwipeMenuOpen, setIsSwipeMenuOpen] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);
  const swipeCompleted = useRef(false);
  const autoCloseTimer = useRef<NodeJS.Timeout | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
    swipeCompleted.current = false;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return;

    const deltaX = touchStart.current.x - touchEnd.current.x;
    const deltaY = touchStart.current.y - touchEnd.current.y;

    // Only trigger swipe if movement was primarily horizontal and exceeded threshold
    if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      swipeCompleted.current = true;
      if (deltaX > 0 && onSwipeLeft) {
        onSwipeLeft();
        setIsSwipeMenuOpen(true);
      } else if (deltaX < 0 && onSwipeRight) {
        onSwipeRight();
        setIsSwipeMenuOpen(false);
      }
    }

    touchStart.current = null;
    touchEnd.current = null;
  }, [onSwipeLeft, onSwipeRight, threshold]);

  const onClick = useCallback((e: React.MouseEvent) => {
    // Only prevent click if an actual swipe gesture completed
    if (swipeCompleted.current) {
      e.preventDefault();
      e.stopPropagation();
      swipeCompleted.current = false;
    }
  }, []);

  const closeSwipeMenu = useCallback(() => {
    setIsSwipeMenuOpen(false);
  }, []);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onClick,
    isSwipeMenuOpen,
    closeSwipeMenu,
    setIsSwipeMenuOpen
  };
}