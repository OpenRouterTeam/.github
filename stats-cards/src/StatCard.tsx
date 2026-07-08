import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {loadFont} from '@remotion/google-fonts/Inter';

const {fontFamily} = loadFont();

export const statCardSchema = z.object({
  value: z.number(),
  suffix: z.string(),
  label: z.string(),
  sub: z.string(),
  accent: z.string(),
  accent2: z.string(),
  theme: z.enum(['dark', 'light']),
  // Position of this card in the row (0..n-1). Used to vary the background
  // gradient/glow and phase-shift the loop so the four cards flow into each
  // other side-by-side (and stacked) instead of looking identical.
  variant: z.number().default(0),
});

type Props = z.infer<typeof statCardSchema>;

const THEMES = {
  dark: {
    surface: (angle: number) =>
      `linear-gradient(${angle}deg, #101114 0%, #0A0B0D 55%, #0E0F13 100%)`,
    border: '#3B3D42',
    text: '#DDE0E2',
    sub: '#8B8D98',
    dot: '#ffffff0c',
    shineBase: '#DDE0E2',
  },
  light: {
    surface: (angle: number) =>
      `linear-gradient(${angle}deg, #FFFFFF 0%, #FAFAFB 55%, #F4F4F6 100%)`,
    border: '#E4E4E7',
    text: '#09090B',
    sub: '#52525B',
    dot: '#09090B14',
    shineBase: '#09090B',
  },
} as const;

const formatValue = (v: number, target: number) => {
  const decimals = Number.isInteger(target) ? 0 : 1;
  return v.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Seamless 0→1→0 loop helper
const pingPong = (frame: number, duration: number) => {
  const t = (frame % duration) / duration;
  return t < 0.5 ? t * 2 : 2 - t * 2;
};

export const StatCard: React.FC<Props> = ({
  value,
  suffix,
  label,
  sub,
  accent,
  accent2,
  theme,
  variant = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width, height} = useVideoConfig();
  const t = THEMES[theme];

  // 0..1 across the row of four cards; drives the background variation.
  const flow = variant / 3;
  // Gradient tilts progressively left-to-right so adjacent edges continue
  // into each other; also reads as a diagonal cascade when cards wrap 2x2.
  const surfaceAngle = 115 + flow * 60; // 115 / 135 / 155 / 175
  // Phase-shift the looping effects so the row animates as a wave.
  const phase = (variant * durationInFrames) / 4;
  const loopFrame = (frame + phase) % durationInFrames;

  // --- Entrance ---
  const enter = spring({frame, fps, config: {damping: 16, stiffness: 120}});
  const rise = interpolate(enter, [0, 1], [24, 0]);

  // Count-up with spring overshoot feel
  const countSpring = spring({
    frame: frame - 4,
    fps,
    config: {damping: 30, stiffness: 60},
    durationInFrames: 30,
  });
  const displayed = formatValue(countSpring * value, value);

  // Theme loop easing: cubic-bezier(0.4, 0, 0.6, 1)
  const loop = pingPong(loopFrame, durationInFrames);
  const glow = interpolate(loop, [0, 1], [0.35, 0.75], {
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });

  // Conic border sweep (full rotation per loop = seamless)
  const sweep = (loopFrame / durationInFrames) * 360;

  // Beam of light traveling across the top edge
  const beamX = interpolate(loopFrame, [0, durationInFrames], [-30, 130]);

  // Shine sweeping across the number. Completes early and clamps at a
  // position where the accent stripe (and its repeat tile) sit fully
  // outside the text, so the final held frame is clean digits.
  const shineX = interpolate(
    frame,
    [0, durationInFrames * 0.7],
    [-120, 130],
    {extrapolateRight: 'clamp'}
  );

  return (
    // Transparent canvas: GIF alpha is 1-bit, so no exterior glows/shadows.
    <AbsoluteFill className="items-center justify-center" style={{fontFamily}}>
      {/* Card with animated gradient border */}
      {/* Large radius: GIF alpha is 1-bit, so anti-aliased corner pixels get
          thresholded to opaque. With a big radius the stair-step follows the
          curve; with a small one it filled the corners in as solid wedges. */}
      <div
        className="relative rounded-[28px]"
        style={{
          width: width - 8,
          height: height - 8,
          padding: 1.5,
          transform: `translateY(${rise}px) scale(${0.96 + enter * 0.04})`,
          opacity: enter,
          background: `conic-gradient(from ${sweep}deg at 50% 50%, ${accent}B0 0deg, transparent 70deg, transparent 180deg, ${accent2}70 250deg, transparent 310deg, ${accent}B0 360deg), linear-gradient(${t.border}, ${t.border})`,
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-[26.5px] px-12"
          style={{background: t.surface(surfaceAngle)}}
        >
          {/* Ambient glow, clipped inside the card */}
          <div
            className="absolute rounded-full"
            style={{
              width: width * 0.8,
              height: height * 1.2,
              // Glow center drifts across the row (left on card 0, right on
              // card 3) so the highlight appears to travel through the set.
              left: -width * 0.35 + flow * width * 0.7,
              top: -height * 0.45,
              background: `radial-gradient(circle, ${accent}${theme === 'dark' ? '18' : '10'} 0%, transparent 70%)`,
              opacity: glow,
              filter: 'blur(20px)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: width * 0.8,
              height: height * 1.2,
              right: -width * 0.35 + (1 - flow) * width * 0.7,
              bottom: -height * 0.45,
              background: `radial-gradient(circle, ${accent2}${theme === 'dark' ? '14' : '0c'} 0%, transparent 70%)`,
              opacity: 1 - glow * 0.6,
              filter: 'blur(20px)',
            }}
          />

          {/* Dot grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, ${t.dot} 1px, transparent 1px)`,
              backgroundSize: '22px 22px',
              maskImage: `radial-gradient(ellipse at ${20 + flow * 40}% 40%, black 20%, transparent 75%)`,
            }}
          />

          {/* Traveling beam on top edge */}
          <div
            className="absolute top-0 h-px w-40"
            style={{
              left: `${beamX}%`,
              transform: 'translateX(-50%)',
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              boxShadow: `0 0 12px 2px ${accent}80`,
            }}
          />

          {/* Content */}
          <div className="relative flex h-full flex-col justify-center">
            <div className="flex items-baseline gap-1 overflow-hidden">
              <span
                className="text-[9.5rem] leading-none font-extrabold tracking-tight text-transparent"
                style={{
                  backgroundImage: `linear-gradient(100deg, ${t.shineBase} 30%, ${accent2} 50%, ${t.shineBase} 70%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  backgroundSize: '250% 100%',
                  backgroundPosition: `${shineX}% 0%`,
                  fontVariantNumeric: 'tabular-nums',
                  filter: `drop-shadow(0 0 ${6 + glow * 8}px ${accent}35)`,
                }}
              >
                {displayed}
              </span>
              <span
                className="text-8xl font-bold"
                style={{color: accent, filter: `drop-shadow(0 0 8px ${accent}50)`}}
              >
                {suffix}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <span
                className="text-4xl font-semibold uppercase tracking-[0.25em]"
                style={{color: t.text}}
              >
                {label}
              </span>
              <span
                className="h-px flex-1"
                style={{
                  background: `linear-gradient(90deg, ${accent}60, transparent)`,
                }}
              />
            </div>
            <span className="mt-2 text-[1.75rem]" style={{color: t.sub}}>
              {sub}
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
