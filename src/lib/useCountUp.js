import { useEffect, useRef, useState } from 'react';

export function useCountUp(value, durationMs = 800) {
  const [display, setDisplay] = useState(0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (hasAnimatedRef.current) {
      setDisplay(value);
      return undefined;
    }

    hasAnimatedRef.current = true;
    const start = performance.now();
    let frameId;

    function step(timestamp) {
      const elapsed = timestamp - start;
      const progress = Math.min(1, elapsed / durationMs);
      setDisplay(Math.round(value * progress));
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    }

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [value, durationMs]);

  return display;
}
