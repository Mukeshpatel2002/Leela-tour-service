import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export default function ScrollJump() {
  const { pathname } = useLocation();
  const [goingUp, setGoingUp] = useState(false);
  const [visible, setVisible] = useState(false);
  const isPortal = pathname.startsWith("/admin");

  useEffect(() => {
    if (isPortal) return undefined;

    const measure = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollable > window.innerHeight * 0.5);
      setGoingUp(
        window.scrollY > 0 &&
          (window.scrollY >= scrollable * 0.5 ||
            scrollable - window.scrollY <= 120)
      );
    };
    // No requestAnimationFrame throttle here: a hidden/background tab never runs
    // animation frames, which leaves the arrow pointing the wrong way.
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
    };
  }, [isPortal, pathname]);

  if (isPortal || !visible) return null;

  const step = () => {
    // One screen per click with a small overlap, so nothing between screens is
    // skipped the way a jump to the very top/bottom would.
    const distance = window.innerHeight * 0.85;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const target = goingUp ? window.scrollY - distance : window.scrollY + distance;
    window.scrollTo({
      top: Math.min(Math.max(target, 0), max),
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={step}
      aria-label={goingUp ? "Scroll up" : "Scroll down"}
      className="fixed bottom-6 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#07569b] text-white shadow-[0_6px_18px_rgba(7,86,155,0.35)] transition hover:bg-[#064a86] active:scale-95"
    >
      {goingUp ? <FaArrowUp /> : <FaArrowDown />}
    </button>
  );
}
