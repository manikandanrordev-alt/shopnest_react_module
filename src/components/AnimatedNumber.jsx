import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

export default function AnimatedNumber({ value, format = (v) => Math.round(v).toString(), countUp = false }) {
  const ref = useRef(null);
  const previous = useRef(countUp ? 0 : value);

  useEffect(() => {
    const controls = animate(previous.current, value, {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v);
      },
    });
    previous.current = value;
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span ref={ref}>{format(countUp ? 0 : value)}</span>;
}
