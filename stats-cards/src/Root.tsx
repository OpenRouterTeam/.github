import {Composition} from 'remotion';
import {StatCard, statCardSchema} from './StatCard';
import './style.css';

const FPS = 30;
const DURATION = 90; // 3s seamless loop
const WIDTH = 640;
const HEIGHT = 260;

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="models"
        component={StatCard}
        schema={statCardSchema}
        durationInFrames={DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          value: 343,
          suffix: '+',
          label: 'Models',
          sub: 'one API for every frontier lab',
          accent: '#60a5fa',
          accent2: '#a78bfa',
        }}
      />
      <Composition
        id="providers"
        component={StatCard}
        schema={statCardSchema}
        durationInFrames={DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          value: 90,
          suffix: '+',
          label: 'Providers',
          sub: 'automatic fallbacks & smart routing',
          accent: '#34d399',
          accent2: '#60a5fa',
        }}
      />
      <Composition
        id="tokens"
        component={StatCard}
        schema={statCardSchema}
        durationInFrames={DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          value: 46.8,
          suffix: 'T',
          label: 'Tokens / week',
          sub: 'routed across the network',
          accent: '#f472b6',
          accent2: '#fb923c',
        }}
      />
    </>
  );
};
