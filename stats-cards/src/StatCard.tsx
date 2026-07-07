import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {z} from 'zod';

export const statCardSchema = z.object({
  value: z.number(),
  suffix: z.string(),
  label: z.string(),
  sub: z.string(),
  accent: z.string(),
  accent2: z.string(),
});

type Props = z.infer<typeof statCardSchema>;

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
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width, height} = useVideoConfig();

  // --- Entrance ---
  const enter = spring({frame, fps, config: {damping: 16, stiffness: 120}});
  const rise = interpolate(enter, [0, 1], [24, 0]);

  // Count-up with spring overshoot feel
  const countSpring = spring({
    frame: frame - 4,
    fps,
    config: {damping: 30, stiffness: 60},
    durationInFrames: 45,
  });
  const displayed = formatValue(countSpring * value, value);

  // --- Seamless looping ambience ---
  const loop = pingPong(frame, durationInFrames);
  const glow = interpolate(loop, [0, 1], [0.35, 0.75]);

  // Conic border sweep (full rotation per loop = seamless)
  const sweep = (frame / durationInFrames) * 360;

  // Beam of light traveling across the top edge (aceternity-style)
  const beamX = interpolate(frame % durationInFrames, [0, durationInFrames], [-30, 130]);

  // Shine sweeping across the number
  const shineX = interpolate(frame % durationInFrames, [0, durationInFrames], [-120, 220]);

  return (
    <AbsoluteFill className="items-center justify-center" style={{backgroundColor: '#02040a'}}>
      {/* Ambient background glow orbs */}
      <div
        className="absolute rounded-full"
        style={{
          width: width * 0.9,
          height: height * 1.4,
          left: -width * 0.25,
          top: -height * 0.5,
          background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
          opacity: glow,
          filter: 'blur(20px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: width * 0.9,
          height: height * 1.4,
          right: -width * 0.25,
          bottom: -height * 0.5,
          background: `radial-gradient(circle, ${accent2}22 0%, transparent 70%)`,
          opacity: 1 - glow * 0.6,
          filter: 'blur(20px)',
        }}
      />

      {/* Card with animated gradient border */}
      <div
        className="relative rounded-2xl"
        style={{
          width: width - 48,
          height: height - 48,
          padding: 1.5,
          transform: `translateY(${rise}px) scale(${0.96 + enter * 0.04})`,
          opacity: enter,
          background: `conic-gradient(from ${sweep}deg at 50% 50%, ${accent} 0deg, transparent 60deg, transparent 180deg, ${accent2} 240deg, transparent 300deg, ${accent} 360deg), linear-gradient(#1e293b, #1e293b)`,
          boxShadow: `0 0 ${30 + glow * 30}px ${accent}30, 0 20px 50px #00000090`,
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-2xl px-10"
          style={{
            background:
              'linear-gradient(145deg, #0b1120 0%, #060a14 55%, #0a0f1e 100%)',
          }}
        >
          {/* Dot grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle, #ffffff10 1px, transparent 1px)',
              backgroundSize: '22px 22px',
              maskImage:
                'radial-gradient(ellipse at 30% 40%, black 20%, transparent 75%)',
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
                className="text-8xl font-extrabold tracking-tight text-transparent"
                style={{
                  backgroundImage: `linear-gradient(100deg, #f8fafc 30%, ${accent} 50%, #f8fafc 70%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  backgroundSize: '250% 100%',
                  backgroundPosition: `${shineX}% 0%`,
                  fontVariantNumeric: 'tabular-nums',
                  filter: `drop-shadow(0 0 ${8 + glow * 14}px ${accent}50)`,
                }}
              >
                {displayed}
              </span>
              <span
                className="text-6xl font-bold"
                style={{color: accent, filter: `drop-shadow(0 0 10px ${accent}80)`}}
              >
                {suffix}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <span className="text-2xl font-semibold uppercase tracking-[0.25em] text-slate-200">
                {label}
              </span>
              <span
                className="h-px flex-1"
                style={{
                  background: `linear-gradient(90deg, ${accent}70, transparent)`,
                }}
              />
            </div>
            <span className="mt-1 text-lg text-slate-400">{sub}</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
