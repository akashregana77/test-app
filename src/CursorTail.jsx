import React, { useEffect, useRef } from "react";

const DOT_COUNT = 12;
const FOLLOW_STRENGTH = 0.22;

function CursorTail() {
  const dotsRef = useRef([]);
  const pointsRef = useRef(Array.from({ length: DOT_COUNT }, () => ({ x: 0, y: 0 })));
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef();

  useEffect(() => {
    const handleMove = (event) => {
      targetRef.current.x = event.clientX;
      targetRef.current.y = event.clientY;
    };

    window.addEventListener("pointermove", handleMove);

    const animate = () => {
      const points = pointsRef.current;
      let leadX = targetRef.current.x;
      let leadY = targetRef.current.y;

      points.forEach((point, index) => {
        point.x += (leadX - point.x) * FOLLOW_STRENGTH;
        point.y += (leadY - point.y) * FOLLOW_STRENGTH;
        leadX = point.x;
        leadY = point.y;

        const dot = dotsRef.current[index];
        if (dot) {
          const scale = 1 - index / (DOT_COUNT * 1.15);
          dot.style.transform = `translate(${point.x}px, ${point.y}px) scale(${scale})`;
          dot.style.opacity = `${0.9 - index * 0.06}`;
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="cursor-tail" aria-hidden>
      {Array.from({ length: DOT_COUNT }).map((_, index) => (
        <span
          key={index}
          ref={(el) => {
            dotsRef.current[index] = el;
          }}
          className="cursor-dot"
        />
      ))}
    </div>
  );
}

export default CursorTail;
