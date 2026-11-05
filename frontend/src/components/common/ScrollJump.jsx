import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function ScrollJump() {
  const { pathname } = useLocation();
  const [goingUp, setGoingUp] = useState(false);
  const [visible, setVisible] = useState(false);
  const isPortal = pathname.startsWith("/admin");
  const frame = useRef(0);

  useEffect(() => {
    if (isPortal) return undefined;

    const measure = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollable > window.innerHeight * 0.5);
      setGoingUp(
        window.scrollY > 0 &&
          (window.scrollY >= scrollable * 0.5 || scrollable - window.scrollY <= 120)
      );
    };
    const onScroll = () => measure();

    measure();
    // Pages fill in after mount (tour data, images), so the scrollable height has
    // to be re-measured on content growth, not only on scroll.
    const observer = new ResizeObserver(onScroll);
    observer.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame.current);
    };
  }, [isPortal, pathname]);

  if (isPortal || !visible) return null;

  const jump = () => {
    const from = window.scrollY;
    const to = goingUp ? 0 : document.documentElement.scrollHeight;
    const distance = Math.abs(to - from);
    if (distance < 4) return;

    // Long pages get a longer ride; short hops stay snappy.
    const duration = Math.min(1800, Math.max(450, distance / 6));
    const start = performance.now();
    cancelAnimationFrame(frame.current);

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      window.scrollTo(0, from + (to - from) * easeInOut(progress));
      frame.current = progress < 1 ? requestAnimationFrame(tick) : 0;
    };
    frame.current = requestAnimationFrame(tick);
  };

  return (
    <button
      type="button"
      onClick={jump}
      aria-label={goingUp ? "Scroll to top" : "Scroll to bottom"}
      className="fixed bottom-6 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#07569b] text-white shadow-[0_6px_18px_rgba(7,86,155,0.35)] transition hover:bg-[#064a86] active:scale-95"
    >
      {goingUp ? <FaArrowUp /> : <FaArrowDown />}
    </button>
  );
}
