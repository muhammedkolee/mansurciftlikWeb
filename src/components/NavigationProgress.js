'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Simple top progress bar that shows on route changes
function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const barRef = useRef(null);
  const timerRef = useRef(null);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const currentPath = pathname + searchParams.toString();
    const prevPath = prevPathRef.current;

    if (currentPath === prevPath) return;
    prevPathRef.current = currentPath;

    const bar = barRef.current;
    if (!bar) return;

    // Clear any existing animation
    clearTimeout(timerRef.current);

    // Start progress bar
    bar.style.transition = 'none';
    bar.style.width = '0%';
    bar.style.opacity = '1';

    // Force reflow
    bar.getBoundingClientRect();

    bar.style.transition = 'width 0.4s ease';
    bar.style.width = '70%';

    timerRef.current = setTimeout(() => {
      bar.style.transition = 'width 0.3s ease, opacity 0.4s ease 0.2s';
      bar.style.width = '100%';

      setTimeout(() => {
        bar.style.opacity = '0';
        setTimeout(() => {
          bar.style.width = '0%';
          bar.style.transition = 'none';
        }, 400);
      }, 200);
    }, 100);

    return () => clearTimeout(timerRef.current);
  }, [pathname, searchParams]);

  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: '0%',
        background: 'linear-gradient(90deg, var(--brand-brown) 0%, var(--brand-blue) 100%)',
        zIndex: 9999,
        borderRadius: '0 2px 2px 0',
        opacity: 0,
        boxShadow: '0 0 10px rgba(107,63,31,0.5)',
        pointerEvents: 'none',
      }}
    />
  );
}

export default function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <TopProgressBar />
    </Suspense>
  );
}
