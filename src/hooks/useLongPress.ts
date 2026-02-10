import { useCallback, useRef } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  delay?: number;
}

export function useLongPress({ onLongPress, delay = 500 }: UseLongPressOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const start = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    // Prevent default to avoid text selection on long press
    event.preventDefault();

    isLongPress.current = false;

    timeoutRef.current = setTimeout(() => {
      isLongPress.current = true;
      onLongPress();
    }, delay);
  }, [onLongPress, delay]);

  const clear = useCallback((event?: React.TouchEvent | React.MouseEvent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const clickHandler = useCallback((event: React.MouseEvent) => {
    // If it was a long press, don't trigger click
    if (isLongPress.current) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, []);

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchMove: clear,
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onClick: clickHandler,
  };
}