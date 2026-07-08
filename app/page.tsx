"use client";

import { useEffect, useState } from "react";

import { PROFILE_TAGLINES } from "@/content/profile";

const TYPE_SPEED_MS = 85;
const DELETE_SPEED_MS = 45;
const HOLD_COMPLETE_MS = 2000;

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

  const navItems = ["Experience", "Projects", "Education"];

  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center bg-[#111111] px-6 py-28 text-white">
      <header className="absolute left-0 top-0 flex w-full flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div className="text-lg font-bold tracking-tight">All things Xavier</div>

        <nav className="flex flex-wrap gap-2 sm:justify-end" aria-label="Primary navigation">
          <ul className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className="rounded-md px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="rounded-md px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            Contact
          </button>
        </nav>
      </header>

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
