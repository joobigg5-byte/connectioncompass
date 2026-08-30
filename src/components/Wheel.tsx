import { useEffect, useRef } from "react";

type WheelProps = {
  labels: string[];
  colors: string[];
  rotation: number;
  spinning: boolean;
  size?: number;
};

export function Wheel({ labels, colors, rotation, spinning, size = 340 }: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const r = size / 2;
    const n = labels.length;
    const arc = (Math.PI * 2) / n;

    for (let i = 0; i < n; i++) {
      const start = i * arc - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(r, r);
      ctx.arc(r, r, r - 6, start, start + arc);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length]!;
      ctx.fill();
      ctx.strokeStyle = "rgba(38,18,12,0.28)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(r, r);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(255,247,235,0.96)";
      ctx.font = `700 ${Math.max(11, size * 0.042)}px Karla, system-ui, sans-serif`;
      ctx.fillText(labels[i]!.toUpperCase(), r - 24, 5);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(r, r, r - 6, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(48,24,14,0.55)";
    ctx.lineWidth = 8;
    ctx.stroke();
  }, [labels, colors, size]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div
        className="absolute -inset-3 rounded-full"
        style={{
          background: "conic-gradient(var(--brass), var(--clay), var(--brass), var(--clay), var(--brass))",
          boxShadow: "var(--shadow-lift)",
        }}
      />
      <div className="absolute -inset-1 rounded-full bg-ink/80" />

      <div
        className="absolute inset-0 rounded-full"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? "transform 5.2s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: size, height: size }}
          className="rounded-full"
        />
      </div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-brass bg-ink text-center font-display text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-background shadow-[var(--shadow-soft)]">
        Spin
      </div>

      <div className="pointer-events-none absolute -top-5 left-1/2 h-9 w-7 -translate-x-1/2">
        <svg viewBox="0 0 24 32" className="h-full w-full drop-shadow-md">
          <path d="M12 32 L2 6 A10 10 0 0 1 22 6 Z" fill="var(--ink)" />
          <circle cx="12" cy="8" r="3.2" fill="var(--brass)" />
        </svg>
      </div>
    </div>
  );
}
