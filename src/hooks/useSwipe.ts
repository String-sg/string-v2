import { useCallback, useRef, useState } from 'react';

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 50 }: UseSwipeOptions) {
  const [isSwipeMenuOpen, setIsSwipeMenuOpen] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);
  const isSwipe = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
    isSwipe.current = false;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEnd.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };

    if (touchStart.current && touchEnd.current) {
      const deltaX = touchStart.current.x - touchEnd.current.x;
      const deltaY = Math.abs(touchStart.current.y - touchEnd.current.y);

      // If we've moved enough horizontally and not too much vertically, it's a swipe
      if (Math.abs(deltaX) > threshold && deltaY < threshold) {
        isSwipe.current = true;
      }
    }
  }, [threshold]);

  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return;

    const deltaX = touchStart.current.x - touchEnd.current.x;
    const deltaY = Math.abs(touchStart.current.y - touchEnd.current.y);

    // Only trigger swipe if movement was primarily horizontal
    if (Math.abs(deltaX) > threshold && deltaY < threshold) {
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
    isSwipe.current = false;
  }, [onSwipeLeft, onSwipeRight, threshold]);

  const onClick = useCallback((e: React.MouseEvent) => {
    // Prevent click if it was a swipe gesture
    if (isSwipe.current) {
      e.preventDefault();
      e.stopPropagation();
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