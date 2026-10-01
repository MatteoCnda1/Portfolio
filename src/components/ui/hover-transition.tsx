import { cn } from '@/lib/utils';
import * as React from 'react';

export const hoverTransitionEffects = [
  'wipe',
  'ripple',
  'parallax',
  'curtain',
  'diagonal',
  'morph',
  'strips',
  'slide',
] as const;

export const hoverTransitionDirections = [
  'top',
  'right',
  'bottom',
  'left',
  'top-left',
  'top-right',
  'bottom-right',
  'bottom-left',
  'center',
] as const;

export type HoverTransitionEffect = (typeof hoverTransitionEffects)[number];
export type HoverTransitionDirection = (typeof hoverTransitionDirections)[number];

export interface HoverTransitionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: React.ReactNode;
  defaultComponent?: React.ReactNode;
  hoverComponent?: React.ReactNode;
  effect?: HoverTransitionEffect;
  direction?: HoverTransitionDirection;
  duration?: number;
  easing?: string;
  label?: string;
  enableTilt?: boolean;
}

type Vector = { x: number; y: number };

const directionVectors: Record<HoverTransitionDirection, Vector> = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  'top-left': { x: -1, y: -1 },
  'top-right': { x: 1, y: -1 },
  'bottom-right': { x: 1, y: 1 },
  'bottom-left': { x: -1, y: 1 },
  center: { x: 0, y: 0 },
};

const rippleOrigins: Record<HoverTransitionDirection, string> = {
  top: '50% 0%',
  right: '100% 50%',
  bottom: '50% 100%',
  left: '0% 50%',
  'top-left': '0% 0%',
  'top-right': '100% 0%',
  'bottom-right': '100% 100%',
  'bottom-left': '0% 100%',
  center: '50% 50%',
};

function hiddenInset(direction: HoverTransitionDirection) {
  switch (direction) {
    case 'top':
      return 'inset(0 0 100% 0)';
    case 'right':
      return 'inset(0 0 0 100%)';
    case 'bottom':
      return 'inset(100% 0 0 0)';
    case 'left':
      return 'inset(0 100% 0 0)';
    case 'top-left':
      return 'inset(0 100% 100% 0)';
    case 'top-right':
      return 'inset(0 0 100% 100%)';
    case 'bottom-right':
      return 'inset(100% 0 0 100%)';
    case 'bottom-left':
      return 'inset(100% 100% 0 0)';
    default:
      return 'inset(50%)';
  }
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
}

function Layer({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('hover-layer', className)}
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        inset: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function HoverTransition({
  children,
  defaultComponent,
  hoverComponent,
  effect = 'wipe',
  direction = 'right',
  duration = 0.65,
  easing = 'cubic-bezier(0.22, 1, 0.36, 1)',
  label = 'Interactive hover transition',
  className,
  enableTilt = true,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onPointerMove,
  onPointerLeave,
  tabIndex,
  ...props
}: HoverTransitionProps) {
  const [active, setActive] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const before = defaultComponent ?? children;
  const after = hoverComponent ?? children;

  const transitionFor = React.useCallback(
    (properties: string[], delay = 0) => {
      if (reducedMotion) return 'none';
      return properties
        .map((prop) => `${prop} ${duration}s ${easing} ${delay}s`)
        .join(', ');
    },
    [duration, easing, reducedMotion],
  );

  const activate = (event: React.MouseEvent<HTMLDivElement>) => {
    setActive(true);
    onMouseEnter?.(event);
  };

  const deactivate = (event: React.MouseEvent<HTMLDivElement>) => {
    setActive(false);
    onMouseLeave?.(event);
  };

  const trackPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!rootRef.current || reducedMotion || !enableTilt) return;
    const rect = rootRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const tiltX = (0.5 - y) * 9;
    const tiltY = (x - 0.5) * 9;

    rootRef.current.style.setProperty('--hover-tilt-x', `${tiltX.toFixed(2)}deg`);
    rootRef.current.style.setProperty('--hover-tilt-y', `${tiltY.toFixed(2)}deg`);
    rootRef.current.style.setProperty('--hover-glare-x', `${(x * 100).toFixed(1)}%`);
    rootRef.current.style.setProperty('--hover-glare-y', `${(y * 100).toFixed(1)}%`);

    onPointerMove?.(event);
  };

  const resetTilt = () => {
    if (!rootRef.current) return;
    rootRef.current.style.setProperty('--hover-tilt-x', '0deg');
    rootRef.current.style.setProperty('--hover-tilt-y', '0deg');
    rootRef.current.style.setProperty('--hover-glare-x', '50%');
    rootRef.current.style.setProperty('--hover-glare-y', '50%');
  };

  const hoverLayer = (style?: React.CSSProperties) => (
    <Layer
      style={{
        ...style,
        transition: transitionFor(['clip-path', 'opacity', 'transform', 'filter']),
      }}
    >
      {after}
    </Layer>
  );

  let animatedLayers: React.ReactNode;

  switch (effect) {
    case 'curtain': {
      const half = direction === 'top' || direction === 'bottom' ? 'vertical' : 'horizontal';
      animatedLayers = (
        <>
          <Layer
            style={{
              clipPath: active
                ? 'inset(0)'
                : half === 'vertical'
                  ? 'inset(0 0 50% 0)'
                  : 'inset(0 50% 0 0)',
              transform: active
                ? 'scale(1)'
                : half === 'vertical'
                  ? 'translateY(-6%)'
                  : 'translateX(-6%)',
              opacity: active ? 1 : 0.85,
              transition: transitionFor(['clip-path', 'transform', 'opacity']),
            }}
          >
            {after}
          </Layer>
          <Layer
            style={{
              clipPath: active
                ? 'inset(0)'
                : half === 'vertical'
                  ? 'inset(50% 0 0 0)'
                  : 'inset(0 0 0 50%)',
              transform: active
                ? 'scale(1)'
                : half === 'vertical'
                  ? 'translateY(6%)'
                  : 'translateX(6%)',
              opacity: active ? 1 : 0.85,
              transition: transitionFor(['clip-path', 'transform', 'opacity']),
            }}
          >
            {after}
          </Layer>
        </>
      );
      break;
    }

    case 'diagonal':
      animatedLayers = hoverLayer({
        clipPath: active
          ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
          : 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        transform: active ? 'scale(1)' : 'scale(1.04) translateY(4%)',
      });
      break;

    case 'ripple':
      animatedLayers = hoverLayer({
        clipPath: active ? 'circle(150% at 50% 50%)' : `circle(0% at ${rippleOrigins[direction]})`,
        transform: active ? 'scale(1)' : 'scale(0.96)',
      });
      break;

    case 'slide': {
      const vector = directionVectors[direction];
      animatedLayers = hoverLayer({
        opacity: active ? 1 : 0,
        transform: active
          ? 'translate3d(0, 0, 0)'
          : `translate3d(${-vector.x * 25}%, ${-vector.y * 25}%, 0)`,
      });
      break;
    }

    case 'wipe':
    default:
      animatedLayers = hoverLayer({
        clipPath: active ? 'inset(0)' : hiddenInset(direction),
        filter: active ? 'blur(0px)' : 'blur(1.5px)',
        transform: active ? 'scale(1)' : 'scale(1.025)',
        transformOrigin: rippleOrigins[direction],
      });
      break;
  }

  return (
    <div
      {...props}
      ref={rootRef}
      role="group"
      aria-label={label}
      tabIndex={tabIndex ?? 0}
      data-active={active ? 'true' : 'false'}
      data-effect={effect}
      className={cn('hover-transition-root', className)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        outline: 'none',
        display: 'block',
        ...props.style,
      }}
      onMouseEnter={activate}
      onMouseLeave={deactivate}
      onPointerMove={trackPointer}
      onPointerLeave={(event) => {
        resetTilt();
        onPointerLeave?.(event);
      }}
      onFocus={(event) => {
        setActive(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setActive(false);
        }
        onBlur?.(event);
      }}
    >
      <div
        className="hover-transition-inner"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transform: reducedMotion || !enableTilt
            ? 'none'
            : `perspective(1000px) rotateX(var(--hover-tilt-x, 0deg)) rotateY(var(--hover-tilt-y, 0deg)) scale(${active ? 1.012 : 1})`,
          transformStyle: 'preserve-3d',
          transition: reducedMotion
            ? 'none'
            : `transform ${active ? 0.22 : 0.55}s ${easing}`,
        }}
      >
        <div
          className="hover-default-layer"
          style={{
            width: '100%',
            height: '100%',
            filter: active ? 'brightness(0.92) saturate(0.95)' : 'none',
            transform: active ? 'scale(1.02)' : 'scale(1)',
            transition: transitionFor(['transform', 'filter']),
          }}
        >
          {before}
        </div>
        {animatedLayers}
        <div
          aria-hidden="true"
          className="hover-glare"
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            inset: 0,
            mixBlendMode: 'screen',
            background:
              'radial-gradient(circle 240px at var(--hover-glare-x, 50%) var(--hover-glare-y, 50%), rgba(255,255,255,0.25), rgba(255,255,255,0.05) 50%, transparent 80%)',
            opacity: active && !reducedMotion && enableTilt ? 0.18 : 0,
            transition: reducedMotion ? 'none' : `opacity 0.3s ${easing}`,
          }}
        />
      </div>
    </div>
  );
}

export default HoverTransition;
