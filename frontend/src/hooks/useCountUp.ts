import { useState, useEffect } from 'react';

export function useCountUp(target: number, duration = 2000, startOnInView = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(!startOnInView);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    const endValue = target;

    function animate(currentTime: number) {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function - easeOutQuad
      const easedProgress = progress * (2 - progress);
      
      setCount(Math.floor(easedProgress * endValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [target, duration, hasStarted]);

  return { count, start: () => setHasStarted(true) };
}
