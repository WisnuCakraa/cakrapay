"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, animate } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  currency?: string;
}

export function AnimatedCounter({ value, currency }: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const rounded = useSpring(count, { stiffness: 50, damping: 15 });
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [count, value]);

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = new Intl.NumberFormat('en-US', {
        style: currency ? 'currency' : 'decimal',
        currency: currency || 'USD',
        minimumFractionDigits: 2,
      }).format(value);
    }

    return rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = new Intl.NumberFormat('en-US', {
          style: currency ? 'currency' : 'decimal',
          currency: currency || 'USD',
          minimumFractionDigits: 2,
        }).format(latest);
      }
    });
  }, [rounded, currency, value]);

  return <span ref={ref} />;
}
