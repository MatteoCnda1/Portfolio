import { useEffect, useRef, useMemo } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import { TextMorph } from './text-morph';
import { KineticTextReveal } from './kinetic-text-reveal';
import { HoverTransition } from './hover-transition';

export interface ProofItem {
  value: string;
  label: string;
  sub: string;
}

export interface HeroGeometricProps {
  lang: 'fr' | 'en';
  role: string;
  location: string;
  coords: string;
  status: string;
  facts: string[];
  nameFirst?: string;
  nameLast?: string;
  statement: string;
  seeWorkLabel: string;
  contactLabel: string;
  proofs: ProofItem[];
  portraitSrc?: string;
  portraitAlt?: string;
  color1?: string; // Deep navy
  color2?: string; // Medium ink accent
  color3?: string; // Paper sunk / wash
  color4?: string; // Warm paper background
  className?: string;
}

// Default "Carnet de terrain" palette
const DEFAULT_COLOR_1 = '#1f3550'; // Deep ink navy
const DEFAULT_COLOR_2 = '#2f4a6b'; // Accent blue
const DEFAULT_COLOR_3 = '#ebe6db'; // Warm paper sunk
const DEFAULT_COLOR_4 = '#f4f1ea'; // Warm paper base

function parseHexColor(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  if (clean.length === 6) {
    const num = parseInt(clean, 16);
    return [
      ((num >> 16) & 255) / 255,
      ((num >> 8) & 255) / 255,
      (num & 255) / 255,
    ];
  }
  return [0.12, 0.21, 0.31];
}

const VERTEX_SHADER_SRC = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = (aPosition + 1.0) * 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
varying vec2 vUv;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float bayerDither4x4(vec2 uv) {
  int x = int(mod(uv.x, 4.0));
  int y = int(mod(uv.y, 4.0));
  int idx = y * 4 + x;
  if (idx == 0) return 0.0 / 16.0;
  if (idx == 1) return 8.0 / 16.0;
  if (idx == 2) return 2.0 / 16.0;
  if (idx == 3) return 10.0 / 16.0;
  if (idx == 4) return 12.0 / 16.0;
  if (idx == 5) return 4.0 / 16.0;
  if (idx == 6) return 14.0 / 16.0;
  if (idx == 7) return 6.0 / 16.0;
  if (idx == 8) return 3.0 / 16.0;
  if (idx == 9) return 11.0 / 16.0;
  if (idx == 10) return 1.0 / 16.0;
  if (idx == 11) return 9.0 / 16.0;
  if (idx == 12) return 15.0 / 16.0;
  if (idx == 13) return 7.0 / 16.0;
  if (idx == 14) return 13.0 / 16.0;
  return 5.0 / 16.0;
}

void main() {
  vec2 uv = vUv;
  vec2 coord = gl_FragCoord.xy;

  // Aspect ratio correction for square noise patterns
  vec2 aspectCorrection = vec2(uResolution.x / max(uResolution.x, uResolution.y), uResolution.y / max(uResolution.x, uResolution.y));
  
  // Interactive mouse influence
  vec2 mouseDelta = (uv - uMouse) * aspectCorrection;
  float mouseDist = length(mouseDelta);
  float mouseInfluence = exp(-mouseDist * 4.0) * 0.16;

  // Multi-octave organic noise
  vec2 noiseCoords = uv * aspectCorrection * 2.2 + vec2(uTime * 0.035, uTime * 0.02) + mouseDelta * mouseInfluence;
  float n1 = snoise(noiseCoords);
  float n2 = snoise(noiseCoords * 2.1 - vec2(uTime * 0.02)) * 0.5;
  float totalNoise = (n1 + n2) * 0.22;

  // Gentle diagonal flow reminiscent of signal waves / topography
  float flow = (uv.x * 0.75 + (1.0 - uv.y) * 0.65) * 0.6;
  float gradient = flow + totalNoise;

  vec3 color;
  if (gradient < 0.24) {
    color = uColor1; // Deep ink
  } else if (gradient < 0.44) {
    color = uColor2; // Accent blue
  } else if (gradient < 0.68) {
    color = uColor3; // Warm paper sunk
  } else {
    color = uColor4; // Warm paper
  }

  // Bayer dither texture
  float dither = bayerDither4x4(coord);
  float threshold = fract(gradient * 3.6);

  if (gradient < 0.24 && threshold > dither * 0.6) {
    color = uColor2;
  } else if (gradient >= 0.24 && gradient < 0.44 && threshold > dither * 0.6) {
    color = uColor3;
  } else if (gradient >= 0.44 && gradient < 0.68 && threshold > dither * 0.6) {
    color = uColor4;
  }

  // Soft vignette so text stays remarkably legible
  float vignette = smoothstep(1.3, 0.35, length(uv - vec2(0.5, 0.45)));
  color = mix(color, uColor4, (1.0 - vignette) * 0.42);

  // Soft edge dissolve into paper background
  float bottomFade = smoothstep(0.0, 0.18, uv.y);
  color = mix(uColor4, color, bottomFade);

  gl_FragColor = vec4(color, 0.78);
}
`;

function GeometricCanvas({
  color1 = DEFAULT_COLOR_1,
  color2 = DEFAULT_COLOR_2,
  color3 = DEFAULT_COLOR_3,
  color4 = DEFAULT_COLOR_4,
}: {
  color1?: string;
  color2?: string;
  color3?: string;
  color4?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'low-power' }) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) return;

    function compileShader(type: number, src: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.warn('Shader compile failed:', gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Program link failed:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Full screen quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const aPositionLoc = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, 'uTime');
    const uResolutionLoc = gl.getUniformLocation(program, 'uResolution');
    const uMouseLoc = gl.getUniformLocation(program, 'uMouse');
    const uColor1Loc = gl.getUniformLocation(program, 'uColor1');
    const uColor2Loc = gl.getUniformLocation(program, 'uColor2');
    const uColor3Loc = gl.getUniformLocation(program, 'uColor3');
    const uColor4Loc = gl.getUniformLocation(program, 'uColor4');

    const c1 = parseHexColor(color1);
    const c2 = parseHexColor(color2);
    const c3 = parseHexColor(color3);
    const c4 = parseHexColor(color4);

    gl.uniform3f(uColor1Loc, c1[0], c1[1], c1[2]);
    gl.uniform3f(uColor2Loc, c2[0], c2[1], c2[2]);
    gl.uniform3f(uColor3Loc, c3[0], c3[1], c3[2]);
    gl.uniform3f(uColor4Loc, c4[0], c4[1], c4[2]);

    let animationFrameId: number;
    let isVisible = true;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currentMouseX = 0.5;
    let currentMouseY = 0.5;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      targetMouseY = Math.max(0, Math.min(1, 1.0 - (e.clientY - rect.top) / rect.height));
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const width = Math.floor(rect.width * dpr);
      const height = Math.floor(rect.height * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        if (uResolutionLoc) gl.uniform2f(uResolutionLoc, width, height);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    handleResize();

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    intersectionObserver.observe(canvas);

    const startTime = performance.now();

    const render = (now: number) => {
      if (isVisible) {
        const elapsed = reducedMotion ? 1.0 : (now - startTime) * 0.001;
        currentMouseX += (targetMouseX - currentMouseX) * 0.06;
        currentMouseY += (targetMouseY - currentMouseY) * 0.06;

        gl.uniform1f(uTimeLoc, elapsed);
        gl.uniform2f(uMouseLoc, currentMouseX, currentMouseY);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
    };
  }, [color1, color2, color3, color4, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="hero-geometric-shader-container"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          opacity: 0.92,
        }}
      />
    </div>
  );
}

export function HeroGeometric({
  lang,
  role,
  location,
  coords,
  status,
  facts,
  nameFirst = 'Mattéo',
  nameLast = 'Canada',
  statement,
  seeWorkLabel,
  contactLabel,
  proofs,
  portraitSrc,
  portraitAlt,
  color1 = DEFAULT_COLOR_1,
  color2 = DEFAULT_COLOR_2,
  color3 = DEFAULT_COLOR_3,
  color4 = DEFAULT_COLOR_4,
  className,
}: HeroGeometricProps) {
  const morphWords = useMemo(
    () =>
      lang === 'fr'
        ? [
            'CYBERSÉCURITÉ',
            'INFRASTRUCTURE RÉSEAU',
            'AUTOMATISATION ANSIBLE',
            'SYSTÈMES EMBARQUÉS & IOT',
          ]
        : [
            'CYBERSECURITY',
            'NETWORK INFRASTRUCTURE',
            'ANSIBLE AUTOMATION',
            'EMBEDDED SYSTEMS & IOT',
          ],
    [lang],
  );

  return (
    <div
      className={cn('hero-geometric-wrapper', className)}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 'calc(var(--nav-h) + clamp(20px, 3.5vh, 48px))',
        paddingBottom: 'clamp(24px, 4vh, 48px)',
      }}
    >
      {/* 1. Deep Custom Shader Background */}
      <GeometricCanvas
        color1={color1}
        color2={color2}
        color3={color3}
        color4={color4}
      />

      {/* Subtle Blueprint & Topographic Lines Overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(var(--line) 1px, transparent 1px), linear-gradient(to right, rgba(220,214,201,0.2) 1px, transparent 1px)',
          backgroundSize: '48px 48px, 120px 120px',
          opacity: 0.5,
          zIndex: 1,
        }}
      />

      {/* Main Container Content */}
      <div
        className="wrap"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
          columnGap: 'var(--col-gap)',
          rowGap: 'clamp(20px, 3vh, 36px)',
          alignContent: 'end',
          width: '100%',
        }}
      >
        {/* Top Metadata Bar */}
        <div
          className="mono"
          style={{
            gridColumn: '1 / -1',
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            columnGap: 'var(--col-gap)',
            rowGap: '8px',
            alignItems: 'center',
            fontSize: 'var(--fs-mono)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--ink-2)',
            paddingBottom: 'clamp(16px, 2.5vh, 32px)',
            borderBottom: '1px solid rgba(220, 214, 201, 0.7)',
          }}
        >
          <div
            style={{
              gridColumn: '1 / span 5',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                fontWeight: 600,
                color: 'var(--accent-deep)',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#2b825b',
                  boxShadow: '0 0 0 3px rgba(43, 130, 91, 0.25)',
                  display: 'inline-block',
                }}
              />
              {status}
            </span>
            <span className="muted" style={{ display: 'none' }}>
              {role}
            </span>
          </div>

          <div
            style={{
              gridColumn: '6 / span 4',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: 'var(--accent)' }}
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{location}</span>
          </div>

          <div
            className="muted"
            style={{
              gridColumn: '10 / -1',
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {coords}
          </div>
        </div>

        {/* Morphing Specialization Badge */}
        <div
          style={{
            gridColumn: '1 / -1',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            paddingTop: '8px',
          }}
        >
          <span
            className="mono"
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              fontWeight: 600,
            }}
          >
            [ FOCUS DOMAINE ]
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 14px',
              borderRadius: '2px',
              background: 'var(--accent-wash)',
              border: '1px solid rgba(47, 74, 107, 0.2)',
              color: 'var(--accent-deep)',
              fontFamily: 'var(--f-mono)',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            <TextMorph words={morphWords} interval={2900} morphDuration={620} />
          </span>
        </div>

        {/* Grand Headline: Mattéo Canada with Kinetic Reveal */}
        <div
          style={{
            gridColumn: '1 / span 9',
            position: 'relative',
            zIndex: 3,
          }}
        >
          <h1
            id="hero-title"
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: 'var(--fs-display)',
              lineHeight: 0.9,
              letterSpacing: '-0.035em',
              fontWeight: 300,
              color: 'var(--ink)',
              margin: 0,
            }}
          >
            <span style={{ display: 'block' }}>
              <KineticTextReveal
                text={nameFirst}
                splitBy="characters"
                stagger={0.032}
                distance={32}
                delay={0.15}
              />
            </span>
            <span
              style={{
                display: 'block',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'var(--accent-deep)',
                paddingLeft: 'clamp(24px, 6vw, 120px)',
              }}
            >
              <KineticTextReveal
                text={nameLast}
                splitBy="characters"
                stagger={0.035}
                distance={36}
                delay={0.32}
              />
            </span>
          </h1>
        </div>

        {/* Portrait Figure with Status */}
        {portraitSrc && (
          <figure
            style={{
              gridColumn: '10 / -1',
              gridRow: '3 / span 2',
              alignSelf: 'start',
              margin: 0,
              width: '100%',
            }}
          >
            <div
              className="plate hover-color"
              style={{
                aspectRatio: '4 / 5',
                overflow: 'hidden',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--line)',
                boxShadow: '0 12px 32px -8px rgba(20, 19, 15, 0.12)',
              }}
            >
              <img
                src={portraitSrc}
                alt={portraitAlt || `${nameFirst} ${nameLast}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '50% 12%',
                  display: 'block',
                }}
                loading="eager"
              />
            </div>
            <figcaption
              className="mono"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                marginTop: '10px',
                fontSize: 'var(--fs-mono)',
                color: 'var(--ink-3)',
              }}
            >
              {facts.map((fact, idx) => (
                <span key={idx} style={{ display: 'block' }}>
                  {fact}
                </span>
              ))}
            </figcaption>
          </figure>
        )}

        {/* Editorial Statement Lead with Kinetic Reveal */}
        <div
          style={{
            gridColumn: '1 / span 8',
            maxWidth: '44rem',
            paddingTop: '8px',
          }}
        >
          <div
            style={{
              fontSize: 'var(--fs-lead)',
              lineHeight: 1.5,
              color: 'var(--ink-2)',
              fontFamily: 'var(--f-text)',
            }}
          >
            <KineticTextReveal
              text={statement}
              splitBy="words"
              stagger={0.016}
              distance={16}
              delay={0.5}
            />
          </div>

          {/* Action CTAs with Hover Transition */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              marginTop: 'clamp(20px, 3vh, 32px)',
            }}
          >
            <HoverTransition
              effect="wipe"
              direction="right"
              duration={0.4}
              enableTilt={false}
              style={{ display: 'inline-block' }}
            >
              <a
                href="#travaux"
                className="btn btn--down"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span>{seeWorkLabel}</span>
                <span className="btn__icon btn__icon--down" aria-hidden="true">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    width="14"
                    height="14"
                  >
                    <path d="M8 2v12M3 9l5 5 5-5" />
                  </svg>
                </span>
              </a>
            </HoverTransition>

            <HoverTransition
              effect="diagonal"
              duration={0.45}
              enableTilt={false}
              style={{ display: 'inline-block' }}
            >
              <a
                href="#contact-cta"
                className="btn btn--ghost"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {contactLabel}
              </a>
            </HoverTransition>
          </div>
        </div>

        {/* Bottom Proofs Ribbon with Sleek Hover Highlights */}
        <div
          style={{
            gridColumn: '1 / -1',
            paddingTop: 'clamp(24px, 4vh, 40px)',
            marginTop: '12px',
            borderTop: '1px solid var(--line)',
          }}
        >
          <ul
            role="list"
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'clamp(16px, 2.5vw, 32px)',
            }}
          >
            {proofs.map((proof, i) => (
              <li
                key={i}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius)',
                  background: 'rgba(255, 255, 255, 0.45)',
                  border: '1px solid rgba(220, 214, 201, 0.55)',
                  backdropFilter: 'blur(6px)',
                  transition: 'background 0.25s ease, transform 0.25s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: 'var(--fs-mono)',
                      color: 'var(--accent)',
                      fontWeight: 600,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--f-display)',
                      fontSize: 'clamp(1.4rem, 1.2rem + 0.6vw, 1.9rem)',
                      lineHeight: 1,
                      fontWeight: 600,
                      color: 'var(--ink)',
                    }}
                  >
                    {proof.value}
                  </span>
                </div>
                <span
                  style={{
                    fontWeight: 500,
                    fontSize: 'var(--fs-sm)',
                    color: 'var(--ink)',
                    marginTop: '2px',
                  }}
                >
                  {proof.label}
                </span>
                <span
                  className="mono"
                  style={{
                    fontSize: 'var(--fs-mono)',
                    color: 'var(--ink-3)',
                  }}
                >
                  {proof.sub}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HeroGeometric;
