"use client";

import { useEffect, useState } from "react";

import { PROFILE_TAGLINES } from "@/content/profile";

const TYPE_SPEED_MS = 85;
const DELETE_SPEED_MS = 45;
const HOLD_COMPLETE_MS = 1000;

type TypewriterPhase = "typing" | "holding" | "deleting";

export default function Home() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const [phase, setPhase] = useState<TypewriterPhase>("typing");

  const currentTagline = PROFILE_TAGLINES[taglineIndex];
  const displayedTagline = currentTagline.slice(0, visibleCharacters);
  const shouldShowCursor = phase === "holding" ? isCursorVisible : true;

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIsCursorVisible((isVisible) => !isVisible);
    }, 500);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (phase === "typing") {
      if (visibleCharacters < currentTagline.length) {
        const timeoutId = window.setTimeout(() => {
          setVisibleCharacters((count) => count + 1);
        }, TYPE_SPEED_MS);

        return () => window.clearTimeout(timeoutId);
      }

      const timeoutId = window.setTimeout(() => {
        setPhase("holding");
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    if (phase === "holding") {
      const timeoutId = window.setTimeout(() => {
        setPhase("deleting");
      }, HOLD_COMPLETE_MS);

      return () => window.clearTimeout(timeoutId);
    }

    if (phase === "deleting") {
      if (visibleCharacters > 0) {
        const timeoutId = window.setTimeout(() => {
          setVisibleCharacters((count) => count - 1);
        }, DELETE_SPEED_MS);

        return () => window.clearTimeout(timeoutId);
      }

      const timeoutId = window.setTimeout(() => {
        setTaglineIndex((index) => (index + 1) % PROFILE_TAGLINES.length);
        setPhase("typing");
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [currentTagline.length, phase, visibleCharacters]);

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-[#111111] px-6 text-white">
      <section className="w-fit max-w-full text-left">
        <h1 className="text-5xl font-black tracking-tight sm:text-7xl md:text-8xl">
          Xavier Callait
        </h1>

        <p
          className="mt-6 min-h-10 text-2xl font-semibold text-zinc-300 sm:text-3xl"
          aria-live="polite"
        >
          <span>{displayedTagline}</span>
          <span
            aria-hidden="true"
            className={`ml-1 inline-block h-8 w-0.5 translate-y-1 bg-zinc-300 ${
              shouldShowCursor ? "opacity-100" : "opacity-0"
            }`}
          />
        </p>
      </section>
    </main>
  );
}
