import {Composition} from 'remotion';
import {StatCard, statCardSchema} from './StatCard';
import './style.css';

const FPS = 20; // rendered 1:1 into the GIF
const DURATION = 60; // 3s
const WIDTH = 880;
const HEIGHT = 356;

const ACCENT = '#6366F1'; // brand indigo (primary)
const ACCENT2 = '#7B82F8'; // link/info indigo

const STATS = [
  {
    id: 'models',
    value: 343,
    suffix: '+',
    label: 'Models',
    sub: 'one API for every frontier lab',
  },
  {
    id: 'providers',
    value: 90,
    suffix: '+',
    label: 'Providers',
    sub: 'automatic fallbacks & smart routing',
  },
  {
    id: 'tokens',
    value: 189,
    suffix: 'T',
    label: 'Tokens / month',
    sub: 'routed across the network',
  },
  {
    id: 'users',
    value: 10,
    suffix: 'M+',
    label: 'Global users',
    sub: 'developers building on OpenRouter',
  },
] as const;

export const Root: React.FC = () => {
  return (
    <>
      {STATS.flatMap((stat) =>
        (['dark', 'light'] as const).map((theme) => (
          <Composition
            key={`${stat.id}-${theme}`}
            id={`${stat.id}-${theme}`}
            component={StatCard}
            schema={statCardSchema}
            durationInFrames={DURATION}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
            defaultProps={{
              value: stat.value,
              suffix: stat.suffix,
              label: stat.label,
              sub: stat.sub,
              accent: ACCENT,
              accent2: ACCENT2,
              theme,
            }}
          />
        ))
      )}
    </>
  );
};
