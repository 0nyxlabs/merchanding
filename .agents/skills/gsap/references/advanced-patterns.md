# GSAP Advanced Patterns (React)

## Complex Timeline Orchestration

### Master Timeline with Labels

```typescript
import { gsap } from '@/utils/gsap';

export function createMasterTimeline(): gsap.core.Timeline {
  const master = gsap.timeline({ paused: true });

  master
    .add('intro')
    .add(createIntroSequence(), 'intro')
    .add('main', '+=0.5')
    .add(createMainSequence(), 'main')
    .add('outro', '+=1')
    .add(createOutroSequence(), 'outro');

  return master;
}

// Jump to specific point
master.play('main');
master.tweenTo('outro', { duration: 0.5 });
```

### Using Master Timeline in a React Component

```tsx
import { FC, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { createMasterTimeline } from '@/utils/animations';

export const StartupSequence: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const logo = containerRef.current.querySelector<HTMLElement>('.logo');
    const panels = Array.from(containerRef.current.querySelectorAll<HTMLElement>('.panel'));
    const status = containerRef.current.querySelector<HTMLElement>('.status');

    if (!logo || !panels.length || !status) return;

    timelineRef.current = createMasterTimeline();
    timelineRef.current.play();
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <div className="logo">Logo</div>
      <div className="panel">Panel 1</div>
      <div className="panel">Panel 2</div>
      <div className="status">Status</div>
    </div>
  );
};
```

## Custom Easing

```typescript
import { gsap } from 'gsap';

// Register custom ease
gsap.registerEase('customSnap', function(progress: number) {
  // Quick start, snappy finish
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
});

// Usage
gsap.to(element, {
  x: 100,
  ease: 'customSnap',
});
```

## Physics-Based Animation

### Spring Animation

```typescript
import { gsap } from '@/utils/gsap';

export function springTo(
  element: HTMLElement,
  props: gsap.TweenVars,
  config: { stiffness?: number; damping?: number } = {}
): gsap.core.Tween {
  const { stiffness = 100, damping = 10 } = config;

  return gsap.to(element, {
    ...props,
    ease: `elastic.out(${stiffness / 100}, ${damping / 100})`,
    duration: Math.sqrt(1 / (stiffness / 1000)),
  });
}
```

### Spring Hook

```typescript
// src/hooks/useSpringAnimation.ts
import { useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/utils/gsap';

interface SpringConfig {
  stiffness?: number;
  damping?: number;
}

export const useSpringAnimation = (
  elementRef: React.RefObject<HTMLElement | null>,
  config: SpringConfig = {}
) => {
  const { stiffness = 100, damping = 10 } = config;
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    return () => {
      tweenRef.current?.kill();
    };
  }, { scope: elementRef });

  const springTo = useCallback((props: gsap.TweenVars) => {
    if (!elementRef.current) return;

    tweenRef.current?.kill();
    tweenRef.current = gsap.to(elementRef.current, {
      ...props,
      ease: `elastic.out(${stiffness / 100}, ${damping / 100})`,
      duration: Math.sqrt(1 / (stiffness / 1000)),
    });
  }, [elementRef, stiffness, damping]);

  return { springTo };
};
```

## Morphing Paths

```typescript
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

// Morph between shapes
gsap.to('#shape1', {
  morphSVG: '#shape2',
  duration: 1,
  ease: 'power2.inOut',
});
```

## Flip Animation

```typescript
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

export function flipLayout(items: HTMLElement[], newParent: HTMLElement): gsap.core.Timeline {
  // Record current state
  const state = Flip.getState(items);

  // Move items to new parent
  items.forEach(item => newParent.appendChild(item));

  // Animate the change
  return Flip.from(state, {
    duration: 0.5,
    ease: 'power2.inOut',
    stagger: 0.05,
  });
}
```

### Flip Hook for React

```typescript
// src/hooks/useFlipAnimation.ts
import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

export const useFlipAnimation = () => {
  const stateRef = useRef<Flip.FlipState | null>(null);

  const captureState = useCallback((targets: string | HTMLElement | HTMLElement[]) => {
    stateRef.current = Flip.getState(targets);
  }, []);

  const animateFlip = useCallback((options: Flip.FromToVars = {}) => {
    if (!stateRef.current) return null;

    return Flip.from(stateRef.current, {
      duration: 0.5,
      ease: 'power2.inOut',
      ...options,
    });
  }, []);

  return { captureState, animateFlip };
};
```

## Performance Optimization

### Batch Updates

```typescript
import { gsap } from '@/utils/gsap';

// Batch multiple property changes
gsap.set(elements, {
  x: (i: number) => i * 10,
  y: (i: number) => i * 5,
  rotation: (i: number) => i * 15,
  immediateRender: true,
});

// Use quickSetter for frequent updates (e.g., mouse tracking)
const setX = gsap.quickSetter(element, 'x', 'px');
const setY = gsap.quickSetter(element, 'y', 'px');

// In animation loop or event handler
function update(mouseX: number, mouseY: number) {
  setX(mouseX);
  setY(mouseY);
}
```

### quickSetter Hook for Mouse Tracking

```typescript
// src/hooks/useMouseTracker.ts
import { useRef, useEffect } from 'react';
import { gsap } from '@/utils/gsap';

export const useMouseTracker = (elementRef: React.RefObject<HTMLElement | null>) => {
  const setXRef = useRef<gsap.QuickSetter | null>(null);
  const setYRef = useRef<gsap.QuickSetter | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    setXRef.current = gsap.quickSetter(elementRef.current, 'x', 'px');
    setYRef.current = gsap.quickSetter(elementRef.current, 'y', 'px');

    const handleMouseMove = (e: MouseEvent) => {
      setXRef.current?.(e.clientX);
      setYRef.current?.(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [elementRef]);
};
```
