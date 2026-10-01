import React from 'react';
import { HoverTransition, type HoverTransitionEffect, type HoverTransitionDirection } from './hover-transition';
import { cn } from '@/lib/utils';

export interface FeaturedMediaProps {
  imageSrc?: string;
  imageAlt?: string;
  number: string;
  category: string;
  title: string;
  readLabel: string;
  effect?: HoverTransitionEffect;
  direction?: HoverTransitionDirection;
  fit?: 'cover' | 'contain';
  objectPosition?: string;
  className?: string;
  children?: React.ReactNode;
}

export function FeaturedMedia({
  imageSrc,
  imageAlt = '',
  number,
  category,
  title,
  readLabel,
  effect = 'diagonal',
  direction = 'top-right',
  fit = 'cover',
  objectPosition,
  className,
  children,
}: FeaturedMediaProps) {
  const defaultView = (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {children ? (
        children
      ) : imageSrc ? (
        <img
          src={imageSrc}
          alt={imageAlt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: fit,
            objectPosition: objectPosition || 'center',
            display: 'block',
          }}
          loading="lazy"
        />
      ) : null}
    </div>
  );

  const hoverView = (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(20px, 3.5vw, 40px)',
        background: 'linear-gradient(135deg, rgba(31, 53, 80, 0.94) 0%, rgba(47, 74, 107, 0.96) 100%)',
        color: '#f4f1ea',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Telemetry Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--f-mono)',
          fontSize: 'var(--fs-mono)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          borderBottom: '1px solid rgba(244, 241, 234, 0.25)',
          paddingBottom: '12px',
        }}
      >
        <span style={{ color: '#ebe6db' }}>PROJET {number}</span>
        <span
          style={{
            background: 'rgba(244, 241, 234, 0.15)',
            padding: '3px 8px',
            borderRadius: '2px',
            fontSize: '0.7rem',
          }}
        >
          {category}
        </span>
      </div>

      {/* Center Title highlight */}
      <div style={{ margin: 'auto 0' }}>
        <p
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 'clamp(1.5rem, 1.3rem + 1vw, 2.4rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            margin: 0,
            color: '#faf8f3',
          }}
        >
          {title}
        </p>
      </div>

      {/* Bottom CTA Arrow */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--f-mono)',
          fontSize: 'var(--fs-mono)',
          letterSpacing: '0.08em',
          color: '#f4f1ea',
          borderTop: '1px solid rgba(244, 241, 234, 0.25)',
          paddingTop: '12px',
        }}
      >
        <span>{readLabel}</span>
        <span style={{ fontSize: '1.2rem', transform: 'translateX(2px)' }}>→</span>
      </div>
    </div>
  );

  return (
    <HoverTransition
      effect={effect}
      direction={direction}
      duration={0.55}
      defaultComponent={defaultView}
      hoverComponent={hoverView}
      enableTilt={true}
      className={cn('featured-media-hover-card', className)}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 'var(--radius)',
      }}
    />
  );
}

export default FeaturedMedia;
