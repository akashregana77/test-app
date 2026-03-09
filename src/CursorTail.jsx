import React, { useEffect, useRef, useState } from "react";
import pencilImg from "./assets/pencil.png";
import pencil2Img from "./assets/pencil2.png";

/**
 * Persistent-surface ink trail.
 * New ink is drawn as smooth connected curves onto an offscreen canvas.
 * Every frame the entire surface is uniformly faded using destination-out,
 * so the trail dissolves naturally — no individual segments or dots.
 */
function CursorTail() {
  const pencilRef = useRef(null);
  const canvasRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    /* Offscreen canvas keeps the persistent ink surface */
    const off = document.createElement("canvas");
    const oCtx = off.getContext("2d");

    let dpr = window.devicePixelRatio || 1;
    let W, H;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      off.width = W * dpr;
      off.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      oCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    /* Cursor position & history for smooth curves */
    let cx = -100, cy = -100;
    let lastX = null, lastY = null;
    let p1 = null; /* one-back point  */
    let p2 = null; /* two-back point  */

    const handleMove = (e) => {
      cx = e.clientX;
      cy = e.clientY;
    };

    const handleOver = (e) => {
      const el = e.target;
      if (!el) return;
      const t = el.tagName;
      const interactive =
        t === "BUTTON" || t === "A" || t === "INPUT" ||
        t === "TEXTAREA" || t === "SELECT" || t === "LABEL" ||
        el.getAttribute("role") === "button" ||
        el.closest("button") || el.closest("a");
      setHovering(!!interactive);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("mouseover", handleOver);

    const FADE = 0.06;           /* opacity removed per frame (~1s trail) */
    const INK  = "rgba(124,58,237,0.6)";
    const LINE_W = 2;
    let frameCount = 0;

    let raf;
    const loop = () => {
      frameCount++;

      /* ── position pencil image ── */
      if (pencilRef.current) {
        pencilRef.current.style.transform = `translate(${cx}px,${cy}px)`;
      }

      /* ── fade the offscreen surface ── */
      oCtx.save();
      oCtx.setTransform(1, 0, 0, 1, 0, 0);
      oCtx.globalCompositeOperation = "destination-out";
      oCtx.fillStyle = `rgba(0,0,0,${FADE})`;
      oCtx.fillRect(0, 0, off.width, off.height);

      /* Every 30 frames, sweep away near-invisible residue
         (8-bit rounding can leave ghost pixels that never fully fade) */
      if (frameCount % 30 === 0) {
        const img = oCtx.getImageData(0, 0, off.width, off.height);
        const d = img.data;
        for (let i = 3; i < d.length; i += 4) {
          if (d[i] < 10) d[i] = 0;
        }
        oCtx.putImageData(img, 0, 0);
      }

      oCtx.restore();
      oCtx.globalCompositeOperation = "source-over";

      /* ── draw new ink onto the offscreen surface ── */
      if (lastX !== null) {
        const dx = cx - lastX;
        const dy = cy - lastY;
        if (dx * dx + dy * dy > 2) {
          oCtx.strokeStyle = INK;
          oCtx.lineWidth   = LINE_W;
          oCtx.lineCap     = "round";
          oCtx.lineJoin    = "round";
          oCtx.beginPath();

          if (p2 && p1) {
            /* Smooth quadratic curve through midpoints */
            const ax = (p2.x + p1.x) / 2;
            const ay = (p2.y + p1.y) / 2;
            const bx = (p1.x + lastX) / 2;
            const by = (p1.y + lastY) / 2;
            const mx = (lastX + cx) / 2;
            const my = (lastY + cy) / 2;
            oCtx.moveTo(ax, ay);
            oCtx.quadraticCurveTo(p1.x, p1.y, bx, by);
            oCtx.quadraticCurveTo(lastX, lastY, mx, my);
          } else if (p1) {
            const bx = (p1.x + lastX) / 2;
            const by = (p1.y + lastY) / 2;
            const mx = (lastX + cx) / 2;
            const my = (lastY + cy) / 2;
            oCtx.moveTo(bx, by);
            oCtx.quadraticCurveTo(lastX, lastY, mx, my);
          } else {
            oCtx.moveTo(lastX, lastY);
            oCtx.lineTo(cx, cy);
          }

          oCtx.stroke();
          p2 = p1;
          p1 = { x: lastX, y: lastY };
          lastX = cx;
          lastY = cy;
        }
      } else {
        lastX = cx;
        lastY = cy;
      }

      /* ── composite offscreen → visible canvas ── */
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(off, 0, 0);
      ctx.restore();

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="cursor-tail" aria-hidden>
      <canvas ref={canvasRef} className="cursor-canvas" />
      <img
        ref={pencilRef}
        src={hovering ? pencil2Img : pencilImg}
        alt=""
        className="cursor-pencil"
      />
    </div>
  );
}

export default CursorTail;
