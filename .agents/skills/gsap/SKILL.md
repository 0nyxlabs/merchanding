---
name: gsap
description: GSAP animations for React — entrance/exit, status transitions, scroll effects, timelines, performance, and accessibility
model: sonnet
risk_level: LOW
version: 2.0.0
---

# GSAP Animation Skill (React)

> **File Organization**: This skill uses split structure. See `references/` for advanced patterns.

## 1. Overview

This skill provides GSAP (GreenSock Animation Platform) expertise for creating smooth, professional animations in a React 18+ TypeScript application.

**Risk Level**: LOW - Animation library with minimal security surface

**Primary Use Cases**:
- Component entrance/exit animations
- Status indicator transitions
- Data visualization animations
- Scroll-triggered effects
- Complex timeline sequences

## 2. Core Responsibilities

### 2.1 Fundamental Principles

1. **Performance Aware**: Use transforms/opacity for GPU acceleration, avoid layout thrashing
2. **Cleanup Required**: Always kill animations on component unmount via `useEffect` cleanup
3. **Timeline Organization**: Use timelines for complex sequences
4. **Easing Selection**: Choose appropriate easing for the desired feel
5. **Accessibility**: Respect `prefers-reduced-motion` preferences
6. **Memory Management**: Avoid memory leaks with proper cleanup in every hook

## 3. Technology Stack & Versions

### 3.1 Recommended Versions

| Package | Version | Notes |
|---------|---------|-------|
| gsap | ^3.12.0 | Core library |
| @gsap/react | ^2.1.0 | React integration (useGSAP hook) |
| ScrollTrigger | included | Scroll effects (register separately) |

### 3.2 React Setup

```typescript
// src/utils/gsap.ts — Initialize GSAP plugins once
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
```

### 3.3 Using @gsap/react (useGSAP)

The `@gsap/react` package provides `useGSAP`, a drop-in replacement for `useEffect`/`useLayoutEffect` that automatically handles GSAP cleanup:

```typescript
import { useGSAP } from '@gsap/react';
import { gsap } from '@/utils/gsap';

export const MyComponent: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Automatically cleans up all GSAP animations created inside
  useGSAP(() => {
    gsap.from('.animate-item', {
      opacity: 0,
      y: 20,
      stagger: 0.1,
    });
  }, { scope: containerRef }); // scope limits selectors to this container

  return (
    <div ref={containerRef}>
      <div className="animate-item">Item 1</div>
      <div className="animate-item">Item 2</div>
    </div>
  );
};
```

> **When to use `useGSAP` vs manual `useEffect`**: Prefer `useGSAP` for most cases — it handles cleanup automatically. Use manual `useEffect` + refs only when you need fine-grained control over individual tween references (e.g., play/pause/reverse on demand).

## 4. Implementation Patterns

### 4.1 Panel Entrance Animation (useGSAP)

```tsx
import { FC, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/utils/gsap';

interface PanelProps {
  children: React.ReactNode;
}

export const AnimatedPanel: FC<PanelProps> = ({ children }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!panelRef.current) return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(panelRef.current, { opacity: 1 });
      return;
    }

    gsap.from(panelRef.current, {
      opacity: 0,
      y: 20,
      scale: 0.95,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, { scope: panelRef });

  return (
    <div ref={panelRef} className="rounded-lg border p-4">
      {children}
    </div>
  );
};
```

### 4.2 Panel Entrance Animation (Manual useEffect)

```tsx
import { FC, useRef, useEffect } from 'react';
import { gsap } from '@/utils/gsap';

interface PanelProps {
  children: React.ReactNode;
}

export const AnimatedPanel: FC<PanelProps> = ({ children }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!panelRef.current) return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(panelRef.current, { opacity: 1 });
      return;
    }

    tweenRef.current = gsap.from(panelRef.current, {
      opacity: 0,
      y: 20,
      scale: 0.95,
      duration: 0.5,
      ease: 'power2.out',
    });

    // Cleanup on unmount
    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  return (
    <div ref={panelRef} className="rounded-lg border p-4">
      {children}
    </div>
  );
};
```

### 4.3 Status Indicator Animation (Custom Hook)

```typescript
// src/hooks/useStatusAnimation.ts
import { useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/utils/gsap';

export const useStatusAnimation = (elementRef: React.RefObject<HTMLElement | null>) => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // useGSAP handles cleanup automatically
  useGSAP(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, { scope: elementRef });

  const animateStatus = useCallback((status: string) => {
    if (!elementRef.current) return;

    timelineRef.current?.kill();
    timelineRef.current = gsap.timeline();

    switch (status) {
      case 'active':
        timelineRef.current
          .to(elementRef.current, {
            scale: 1.2,
            duration: 0.2,
            ease: 'power2.out',
          })
          .to(elementRef.current, {
            scale: 1,
            duration: 0.3,
            ease: 'elastic.out(1, 0.3)',
          });
        break;

      case 'warning':
        timelineRef.current.to(elementRef.current, {
          backgroundColor: '#f59e0b',
          boxShadow: '0 0 10px #f59e0b',
          duration: 0.3,
          repeat: 2,
          yoyo: true,
        });
        break;

      case 'error':
        timelineRef.current.to(elementRef.current, {
          x: -5,
          duration: 0.05,
          repeat: 5,
          yoyo: true,
        });
        break;
    }
  }, [elementRef]);

  return { animateStatus };
};
```

### 4.4 Data Visualization Animation (Reactive to Props)

```tsx
import { FC, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/utils/gsap';

interface BarChartProps {
  data: number[];
}

export const BarChart: FC<BarChartProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Re-runs when `data` changes; useGSAP cleans up previous animations
  useGSAP(() => {
    if (!containerRef.current) return;

    const bars = containerRef.current.querySelectorAll<HTMLElement>('.bar');

    bars.forEach((bar, index) => {
      gsap.to(bar, {
        height: `${data[index]}%`,
        duration: 0.5,
        delay: index * 0.05,
        ease: 'power2.out',
      });
    });
  }, { scope: containerRef, dependencies: [data] });

  return (
    <div ref={containerRef} className="flex items-end h-40 gap-1">
      {data.map((_, index) => (
        <div key={index} className="bar w-4 bg-primary" />
      ))}
    </div>
  );
};
```

### 4.5 Timeline Sequence (Standalone Function)

```typescript
// src/utils/animations.ts
import { gsap } from '@/utils/gsap';

// Create complex startup sequence
export function createStartupSequence(elements: {
  logo: HTMLElement;
  panels: HTMLElement[];
  status: HTMLElement;
}): gsap.core.Timeline {
  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
  });

  // Logo reveal
  tl.from(elements.logo, {
    opacity: 0,
    scale: 0,
    duration: 0.8,
    ease: 'back.out(1.7)',
  });

  // Panels stagger in
  tl.from(elements.panels, {
    opacity: 0,
    x: -30,
    stagger: 0.1,
    duration: 0.5,
  }, '-=0.3');

  // Status indicator
  tl.from(elements.status, {
    opacity: 0,
    y: 10,
    duration: 0.3,
  }, '-=0.2');

  return tl;
}
```

### 4.6 Scroll-Triggered Animation

```tsx
import { FC, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/utils/gsap';

interface ScrollSectionProps {
  children: React.ReactNode;
}

export const ScrollSection: FC<ScrollSectionProps> = ({ children }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.from(sectionRef.current.querySelectorAll('.animate-item'), {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.5,
    });

    // useGSAP handles ScrollTrigger cleanup automatically
  }, { scope: sectionRef });

  return (
    <div ref={sectionRef}>
      {children}
    </div>
  );
};
```

### 4.7 Controllable Animation (Play/Pause/Reverse)

```tsx
import { FC, useRef, useCallback } from 'react';
import { gsap } from '@/utils/gsap';
import { useGSAP } from '@gsap/react';
import { Button } from '@/components/ui/button';

export const AnimatedDrawer: FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!drawerRef.current) return;

    timelineRef.current = gsap.timeline({ paused: true })
      .to(drawerRef.current, { x: 0, duration: 0.3, ease: 'power2.out' });
  }, { scope: drawerRef });

  // React to isOpen prop changes
  useGSAP(() => {
    if (isOpen) {
      timelineRef.current?.play();
    } else {
      timelineRef.current?.reverse();
    }
  }, { dependencies: [isOpen] });

  return (
    <div ref={drawerRef} className="fixed right-0 top-0 h-full w-80 translate-x-full bg-background shadow-lg">
      {/* Drawer content */}
    </div>
  );
};
```

## 5. Quality Standards

### 5.1 Performance

```typescript
// GOOD — Use transforms for GPU acceleration
gsap.to(element, {
  x: 100,
  y: 50,
  rotation: 45,
  scale: 1.2,
});

// BAD — Triggers layout recalculation
gsap.to(element, {
  left: 100,
  top: 50,
  width: '120%',
});
```

### 5.2 Accessibility

```typescript
// Always respect reduced motion
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  gsap.set(element, { opacity: 1 });
} else {
  gsap.from(element, { opacity: 0, duration: 0.5 });
}
```

### 5.3 Custom Hook for Reduced Motion

```typescript
// src/hooks/useReducedMotion.ts
import { useState, useEffect } from 'react';

export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};
```

## 6. Performance Patterns

### 6.1 will-change Property Usage

```typescript
const animatePanel = (element: HTMLElement) => {
  element.style.willChange = 'transform, opacity';

  gsap.to(element, {
    x: 100,
    opacity: 0.8,
    duration: 0.5,
    onComplete: () => {
      element.style.willChange = 'auto'; // Always clean up
    },
  });
};
```

### 6.2 Transform vs Layout Properties

```typescript
// GOOD — GPU accelerated
gsap.to(element, {
  x: 100,           // translateX
  y: 50,            // translateY
  scale: 1.2,       // scale
  rotation: 45,     // rotate
  opacity: 0.5,     // opacity
});

// BAD — CPU, causes reflow
gsap.to(element, {
  left: 100,        // Triggers layout
  top: 50,          // Triggers layout
  width: '120%',    // Triggers layout
  height: 200,      // Triggers layout
  margin: 10,       // Triggers layout
});
```

### 6.3 Timeline Reuse

```typescript
// GOOD — Reuse timeline instance
const timeline = gsap.timeline({ paused: true });
timeline
  .to(element, { opacity: 1, duration: 0.3 })
  .to(element, { y: -20, duration: 0.5 });

const show = () => timeline.play();
const hide = () => timeline.reverse();

// BAD — Creating new timeline each time
const showBad = () => {
  gsap.timeline()
    .to(element, { opacity: 1, duration: 0.3 })
    .to(element, { y: -20, duration: 0.5 });
};
```

### 6.4 ScrollTrigger Batching

```typescript
// GOOD — Batch ScrollTrigger animations
ScrollTrigger.batch('.animate-item', {
  onEnter: (elements) => {
    gsap.to(elements, {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      overwrite: true,
    });
  },
  onLeave: (elements) => {
    gsap.to(elements, {
      opacity: 0,
      y: -20,
      overwrite: true,
    });
  },
});

// BAD — Individual ScrollTrigger per element (expensive)
document.querySelectorAll('.animate-item').forEach(item => {
  gsap.to(item, {
    scrollTrigger: { trigger: item, start: 'top 80%' },
    opacity: 1,
    y: 0,
  });
});
```

### 6.5 Lazy Initialization

```typescript
// GOOD — Initialize animations only when needed
const uselazyTimeline = (elementRef: React.RefObject<HTMLElement | null>) => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const getTimeline = useCallback(() => {
    if (!timelineRef.current && elementRef.current) {
      timelineRef.current = gsap.timeline({ paused: true })
        .from(elementRef.current, { opacity: 0, y: 20 });
    }
    return timelineRef.current;
  }, [elementRef]);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  return {
    play: () => getTimeline()?.play(),
    reverse: () => getTimeline()?.reverse(),
  };
};
```

## 7. Common Mistakes & Anti-Patterns

### 7.1 Missing Cleanup (Memory Leak)

```typescript
// BAD — Memory leak, animation persists after unmount
useEffect(() => {
  gsap.to(elementRef.current, { x: 100, duration: 1 });
}, []);

// GOOD — Proper cleanup
useEffect(() => {
  const tween = gsap.to(elementRef.current, { x: 100, duration: 1 });
  return () => tween.kill();
}, []);

// BEST — useGSAP handles cleanup automatically
useGSAP(() => {
  gsap.to(elementRef.current, { x: 100, duration: 1 });
}, { scope: elementRef });
```

### 7.2 Animating Layout Properties

```typescript
// BAD — Causes layout thrashing
gsap.to(element, { width: 200, height: 100 });

// GOOD — Use transforms
gsap.to(element, { scaleX: 2, scaleY: 1 });
```

### 7.3 Stale Ref in Callback

```typescript
// BAD — elementRef.current may be null or stale in async context
const handleClick = () => {
  gsap.to(elementRef.current, { x: 100 }); // Might be null!
};

// GOOD — Guard against null
const handleClick = () => {
  if (!elementRef.current) return;
  gsap.to(elementRef.current, { x: 100 });
};
```

### 7.4 Creating Animations on Every Render

```typescript
// BAD — Runs on every render
const MyComponent: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  gsap.to(ref.current, { x: 100 }); // Outside useEffect!
  return <div ref={ref} />;
};

// GOOD — Run inside useGSAP or useEffect
const MyComponent: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.to(ref.current, { x: 100 });
  }, { scope: ref });
  return <div ref={ref} />;
};
```

## 8. Pre-Implementation Checklist

### Before Writing Code

- [ ] Identify elements that need animation
- [ ] Define animation timing and easing requirements
- [ ] Plan cleanup strategy (prefer `useGSAP` for automatic cleanup)
- [ ] Check if reduced motion support is needed
- [ ] Decide between `useGSAP` (auto cleanup) vs manual `useEffect` (fine-grained control)

### During Implementation

- [ ] Use transforms/opacity only (no layout properties)
- [ ] Use `useRef` for element references and tween/timeline storage
- [ ] Apply will-change before, remove after animation
- [ ] Use timelines for multi-step sequences
- [ ] Batch ScrollTrigger animations
- [ ] Guard against null refs in all callbacks

### Before Committing

- [ ] All animations cleaned up on unmount (no memory leaks)
- [ ] Reduced motion preference respected
- [ ] 60fps maintained (test with DevTools Performance tab)
- [ ] ScrollTrigger instances properly cleaned up
- [ ] No animations created outside of `useEffect`/`useGSAP`

## 9. Summary

GSAP in React follows these core rules:

1. **Cleanup**: Use `useGSAP` for automatic cleanup, or manual `useEffect` return functions
2. **Performance**: Animate only transforms and opacity (GPU-accelerated)
3. **Accessibility**: Always respect `prefers-reduced-motion`
4. **Refs**: Use `useRef` for DOM elements and animation instances
5. **Organization**: Use timelines for sequences, custom hooks for reusability

**Remember**: Every animation must be cleaned up to prevent memory leaks. `useGSAP` is the recommended approach.

---

**References**:
- `references/advanced-patterns.md` - Complex animation patterns
