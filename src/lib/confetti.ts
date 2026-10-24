/**
 * Lightweight canvas confetti / particle burst (< 2 KB, zero dependencies).
 * Honors prefers-reduced-motion automatically.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  vRot: number;
  alpha: number;
}

const COLORS = ['#FF7F11', '#FFB800', '#D81159', '#E83F6F', '#06D6A0', '#FFF8E7'];

export function triggerFestiveBurst(durationMs = 2500): void {
  if (typeof window === 'undefined') return;

  // Respect reduced-motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const particles: Particle[] = Array.from({ length: 90 }, () => ({
    x: width / 2,
    y: height * 0.4,
    vx: (Math.random() - 0.5) * 18,
    vy: (Math.random() - 0.7) * 20,
    color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? '#FF7F11',
    size: Math.random() * 8 + 4,
    rotation: Math.random() * 360,
    vRot: (Math.random() - 0.5) * 12,
    alpha: 1,
  }));

  const startTime = performance.now();

  function render(time: number) {
    const elapsed = time - startTime;
    if (elapsed > durationMs) {
      canvas.remove();
      return;
    }

    ctx?.clearRect(0, 0, width, height);
    const progress = elapsed / durationMs;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.vx *= 0.98; // air resistance
      p.rotation += p.vRot;
      p.alpha = Math.max(0, 1 - progress);

      if (ctx) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
