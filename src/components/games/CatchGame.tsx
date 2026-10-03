"use client";

import { Heart, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScoreForm } from "./ScoreForm";

type Item = { x: number; y: number; emoji: string; points: number; bad?: string; speed: number };
type Phase = "ready" | "playing" | "over";

const GOOD = [
  { emoji: "🐟", points: 1 },
  { emoji: "🥫", points: 2 },
  { emoji: "💧", points: 1 },
];
const BAD = [
  { emoji: "🍫", tip: "Çikolata kediler için zehirli!" },
  { emoji: "🧅", tip: "Soğan kan hücrelerine zarar verir!" },
  { emoji: "🍇", tip: "Üzüm böbreklere zarar verir!" },
  { emoji: "🥛", tip: "Yetişkin kediler sütü sindiremez!" },
];
const LIVES = 3;
const EMOJI_FONT = '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';

/** Düşen mamaları yakala, zararlı yiyeceklerden kaç. Fare, dokunma ya da ok tuşlarıyla oynanır. */
export function CatchGame() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [tip, setTip] = useState<string | null>(null);
  const [round, setRound] = useState(0);

  const game = useRef({
    width: 360,
    height: 440,
    playerX: 180,
    targetX: 180,
    keys: { left: false, right: false },
    items: [] as Item[],
    spawnIn: 0,
    elapsed: 0,
    score: 0,
    lives: LIVES,
    hitFlash: 0,
  });

  // Tuval boyutu kutuya göre ayarlanır (keskin çizim için cihaz piksel oranıyla).
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const resize = () => {
      const width = wrap.clientWidth;
      const height = Math.round(Math.min(520, Math.max(380, width * 1.1)));
      const ratio = window.devicePixelRatio || 1;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.height = `${height}px`;
      canvas.getContext("2d")?.setTransform(ratio, 0, 0, ratio, 0, 0);
      const g = game.current;
      g.width = width;
      g.height = height;
      g.playerX = Math.min(g.playerX, width - 40);
      g.targetX = g.playerX;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  const start = useCallback(() => {
    const g = game.current;
    Object.assign(g, {
      items: [],
      spawnIn: 0.4,
      elapsed: 0,
      score: 0,
      lives: LIVES,
      hitFlash: 0,
      playerX: g.width / 2,
      targetX: g.width / 2,
    });
    setScore(0);
    setLives(LIVES);
    setTip(null);
    setRound((value) => value + 1);
    setPhase("playing");
    canvasRef.current?.focus({ preventScroll: true });
  }, []);

  // Oyun döngüsü
  useEffect(() => {
    if (phase !== "playing") return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const styles = getComputedStyle(canvas);
    const ink = styles.getPropertyValue("--color-ink").trim() || "#0a0a0a";
    const brand = styles.getPropertyValue("--color-brand").trim() || "#e30a17";
    const g = game.current;
    let frame = 0;
    let last = performance.now();
    let tipTimer: ReturnType<typeof setTimeout> | undefined;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      g.elapsed += dt;
      const level = Math.min(1, g.elapsed / 90);

      // Oyuncu hareketi
      if (g.keys.left) g.targetX -= 520 * dt;
      if (g.keys.right) g.targetX += 520 * dt;
      g.targetX = Math.max(36, Math.min(g.width - 36, g.targetX));
      g.playerX += (g.targetX - g.playerX) * Math.min(1, dt * 14);

      // Yeni yiyecek
      g.spawnIn -= dt;
      if (g.spawnIn <= 0) {
        g.spawnIn = 0.95 - level * 0.55 + Math.random() * 0.25;
        const isBad = Math.random() < 0.22 + level * 0.18;
        const pick = isBad
          ? BAD[Math.floor(Math.random() * BAD.length)]
          : GOOD[Math.floor(Math.random() * GOOD.length)];
        g.items.push({
          x: 24 + Math.random() * (g.width - 48),
          y: -24,
          emoji: pick.emoji,
          points: "points" in pick ? pick.points : 0,
          bad: "tip" in pick ? pick.tip : undefined,
          speed: 150 + level * 230 + Math.random() * 60,
        });
      }

      // Düşme ve yakalama
      const bowlY = g.height - 56;
      g.items = g.items.filter((item) => {
        item.y += item.speed * dt;
        const caught = Math.abs(item.x - g.playerX) < 42 && item.y > bowlY - 30 && item.y < bowlY + 14;
        if (caught) {
          if (item.bad) {
            g.lives -= 1;
            g.hitFlash = 0.35;
            setLives(g.lives);
            setTip(item.bad);
            clearTimeout(tipTimer);
            tipTimer = setTimeout(() => setTip(null), 1800);
          } else {
            g.score += item.points;
            setScore(g.score);
          }
          return false;
        }
        return item.y < g.height + 30;
      });

      // Çizim
      ctx.clearRect(0, 0, g.width, g.height);
      if (g.hitFlash > 0) {
        g.hitFlash -= dt;
        ctx.fillStyle = `${brand}22`;
        ctx.fillRect(0, 0, g.width, g.height);
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `30px ${EMOJI_FONT}`;
      for (const item of g.items) ctx.fillText(item.emoji, item.x, item.y);

      // Mama kabı + kedi
      ctx.fillStyle = brand;
      ctx.strokeStyle = ink;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(g.playerX - 40, bowlY);
      ctx.lineTo(g.playerX + 40, bowlY);
      ctx.lineTo(g.playerX + 30, bowlY + 24);
      ctx.lineTo(g.playerX - 30, bowlY + 24);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.font = `38px ${EMOJI_FONT}`;
      ctx.fillText("🐱", g.playerX, bowlY - 18);

      if (g.lives <= 0) {
        setPhase("over");
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(tipTimer);
    };
  }, [phase, round]);

  // Klavye
  useEffect(() => {
    const set = (event: KeyboardEvent, down: boolean) => {
      if (phase !== "playing") return;
      const key = event.key.toLowerCase();
      if (key === "arrowleft" || key === "a") game.current.keys.left = down;
      else if (key === "arrowright" || key === "d") game.current.keys.right = down;
      else return;
      event.preventDefault();
    };
    const onDown = (event: KeyboardEvent) => set(event, true);
    const onUp = (event: KeyboardEvent) => set(event, false);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [phase]);

  const follow = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    game.current.targetX = event.clientX - rect.left;
  };

  return (
    <div ref={wrapRef} className="card bg-mist relative overflow-hidden select-none">
      <div className="bg-paper border-ink relative z-10 flex items-center justify-between border-b-2 px-4 py-2.5">
        <span className="font-display text-xl font-extrabold">{score} puan</span>
        <span className="flex gap-1" role="img" aria-label={`${lives} can`}>
          {Array.from({ length: LIVES }, (_, i) => (
            <Heart
              key={i}
              className={`size-5 ${i < lives ? "fill-brand text-brand" : "text-ink/25"}`}
              aria-hidden="true"
            />
          ))}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        tabIndex={0}
        aria-label="Mama Yakala oyun alanı. Ok tuşlarıyla ya da dokunarak kediyi hareket ettir."
        onPointerMove={follow}
        onPointerDown={follow}
        className="bg-paws block w-full touch-none outline-none"
      />

      {tip && phase === "playing" && (
        <p className="bg-brand text-paper absolute top-16 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-sm font-bold whitespace-nowrap">
          {tip}
        </p>
      )}

      {phase !== "playing" && (
        <div className="bg-paper/90 absolute inset-0 top-12 flex flex-col items-center justify-center gap-4 p-6 text-center backdrop-blur-sm">
          {phase === "ready" ? (
            <>
              <p className="text-5xl" aria-hidden="true">
                🐱🥫
              </p>
              <h3 className="font-display text-3xl font-extrabold">Mama Yakala</h3>
              <p className="text-ink-soft max-w-xs">
                Kediyi sağa sola kaydır, <b>🐟 🥫 💧</b> topla. <b>🍫 🧅 🍇 🥛</b> kediler için zararlı; yakalarsan can
                gider!
              </p>
              <button type="button" onClick={start} className="btn btn-red px-7 py-3 text-lg">
                <Play className="size-5" aria-hidden="true" /> Başla
              </button>
            </>
          ) : (
            <>
              <p className="text-5xl" aria-hidden="true">
                😿
              </p>
              <h3 className="font-display text-3xl font-extrabold">Oyun bitti!</h3>
              <p className="font-display text-brand text-5xl font-extrabold">{score} puan</p>
              {score > 0 && <ScoreForm key={round} game="mama" score={score} />}
              <button type="button" onClick={start} className="btn btn-white">
                <RotateCcw className="size-4" aria-hidden="true" /> Tekrar oyna
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
