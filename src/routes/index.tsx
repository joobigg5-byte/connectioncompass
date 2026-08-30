import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Wheel } from "@/components/Wheel";
import { AppToolbar } from "@/components/AppToolbar";  // <--- ADDED IMPORT
import { currentWeekIndex, decks, getWeekSet, weekStart } from "@/lib/decks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Five Wheels — Conversation Prompts for Love, Purpose, Friendship & Money" },
      {
        name: "description",
        content:
          "Spin a wheel, answer honestly. Deep questions for couples, founders, friends, hustlers, and anyone auditing their life.",
      },
      { property: "og:title", content: "Five Wheels — Prompts for Love, Purpose, Friendship & Money" },
      {
        property: "og:description",
        content:
          "A calm, warm spin-the-wheel game with deep questions for couples, founders, friends, hustlers, and the life you're building.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TIMER_SECONDS = 60;

function Index() {
  const [deckIndex, setDeckIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [seconds, setSeconds] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [asked, setAsked] = useState<number[]>([]);
  const timerRef = useRef<number | null>(null);

  const deck = decks[deckIndex]!;
  const weekIndex = useMemo(() => currentWeekIndex(), []);
  const set = getWeekSet(deck, weekIndex);
  const setNumber = (((weekIndex % deck.weeks.length) + deck.weeks.length) % deck.weeks.length) + 1;
  const nextSwap = useMemo(() => weekStart(weekIndex + 1), [weekIndex]);
  const daysLeft = Math.max(1, Math.ceil((nextSwap.getTime() - Date.now()) / 86_400_000));
  const n = set.prompts.length;

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const remaining = useMemo(
    () => Array.from({ length: n }, (_, i) => i).filter((i) => !asked.includes(i)),
    [asked, n],
  );

  const startTimer = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setSeconds(TIMER_SECONDS);
    timerRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s === null) return null;
        if (s <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, []);

  const spin = () => {
    if (spinning) return;
    const pool = remaining.length ? remaining : Array.from({ length: n }, (_, i) => i);
    if (!remaining.length) setAsked([]);
    const pick = pool[Math.floor(Math.random() * pool.length)]!;

    const arc = 360 / n;
    const target = 360 * 6 + (360 - (pick * arc + arc / 2));
    const base = Math.ceil(rotation / 360) * 360;

    setSpinning(true);
    setPrompt(null);
    setSeconds(null);
    setRotation(base + target);

    window.setTimeout(() => {
      setSpinning(false);
      setPrompt(set.prompts[pick]!);
      setLabel(set.labels[pick]!);
      setAsked((a) => [...a, pick]);
      setStreak((s) => s + 1);
      startTimer();
    }, 5300);
  };

  const switchDeck = (i: number) => {
    if (spinning || i === deckIndex) return;
    if (timerRef.current) window.clearInterval(timerRef.current);
    setDeckIndex(i);
    setPrompt(null);
    setLabel(null);
    setSeconds(null);
    setAsked([]);
  };

  const low = seconds !== null && seconds <= 10;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-5 py-12">
      <header className="text-center">
        <p className="font-sans text-[0.7rem] uppercase tracking-[0.4em] text-muted-foreground">
          Five wheels · one honest hour
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
          Say the thing you'd normally skip
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance-pretty text-base leading-relaxed text-muted-foreground">
          Spin, read the prompt aloud, and answer before the minute runs out. No editing, no
          hedging.
        </p>
      </header>

      <div className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-1 rounded-3xl border border-border bg-card p-1 shadow-[var(--shadow-soft)] sm:grid-cols-2 lg:grid-cols-5 lg:rounded-full">
        {decks.map((d, i) => (
          <button
            key={d.id}
            onClick={() => switchDeck(i)}
            className={`rounded-full px-4 py-3 text-sm font-semibold transition-colors ${
              i === deckIndex
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>
      <p className="mt-3 max-w-md text-center text-sm text-muted-foreground">{deck.blurb}</p>
      <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        Set {setNumber} of {deck.weeks.length} · new questions in {daysLeft} day
        {daysLeft === 1 ? "" : "s"}
      </p>

      <div className="mt-10 flex flex-col items-center">
        <Wheel
          labels={set.labels}
          colors={deck.colors}
          rotation={rotation}
          spinning={spinning}
        />

        <button
          onClick={spin}
          disabled={spinning}
          className="mt-9 rounded-full bg-primary px-14 py-4 font-display text-lg font-semibold tracking-wide text-primary-foreground shadow-[var(--shadow-lift)] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {spinning ? "Spinning…" : prompt ? "Next question" : "Spin the wheel"}
        </button>

        <div className="mt-5 flex items-center gap-5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          <span>{remaining.length} left</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{streak} answered</span>
        </div>
      </div>

      <section className="mt-10 w-full max-w-2xl">
        <div className="card-soft rounded-3xl px-7 py-8 text-center">
          {label && prompt ? (
            <>
              <span className="inline-block rounded-full bg-secondary px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-secondary-foreground">
                {label}
              </span>
              <p className="mt-5 font-display text-xl leading-relaxed text-foreground sm:text-2xl">
                {prompt}
              </p>
            </>
          ) : (
            <p className="py-4 font-display text-lg italic text-muted-foreground">
              {deck.tagline}
            </p>
          )}
        </div>

        {seconds !== null && (
          <div className="mt-7 flex flex-col items-center">
            <div className="h-1.5 w-56 overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${
                  low ? "bg-destructive" : "bg-primary"
                }`}
                style={{ width: `${(seconds / TIMER_SECONDS) * 100}%` }}
              />
            </div>
            <p
              className={`mt-3 font-display text-4xl font-semibold tabular-nums ${
                low ? "text-destructive" : "text-foreground"
              }`}
            >
              {seconds}
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {seconds === 0 ? "Time — pass the wheel" : "seconds to answer"}
            </p>
          </div>
        )}
      </section>

      <footer className="mt-16 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Answer honestly or not at all
      </footer>

      <AppToolbar />  {/* <--- ADDED TOOLBAR COMPONENT */}
    </main>
  );
}