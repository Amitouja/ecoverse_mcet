'use client';

import { useEffect } from 'react';

export default function CustomCursor() {
  useEffect(() => {
    let mx = 0, my = 0, tx = 0, ty = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const loop = () => {
      const dot = document.getElementById('dot');
      const ring = document.getElementById('ring');
      
      if (dot) {
        dot.style.cssText = `left:${mx - 3.5}px;top:${my - 3.5}px`;
      }
      
      tx += (mx - tx) * 0.1;
      ty += (my - ty) * 0.1;
      
      if (ring) {
        ring.style.cssText = `left:${tx - 15}px;top:${ty - 15}px`;
      }
      
      requestAnimationFrame(loop);
    };

    document.addEventListener('mousemove', handleMouseMove);
    loop();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <div id="dot" className="fixed w-[7px] h-[7px] bg-moss rounded-full pointer-events-none z-[9999] transition-transform duration-150" />
      <div id="ring" className="fixed w-[30px] h-[30px] border-[1.5px] border-moss/40 rounded-full pointer-events-none z-[9998]" />
    </>
  );
}
