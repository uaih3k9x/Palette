import { FiringResult, color3ToCss } from '../lib/glaze';

interface Props {
  result: FiringResult | null;
}

export default function PotteryPreview({ result }: Props) {
  const surface = result ? color3ToCss(result.surfaceColor) : '#6b5b4f';
  const rim = result ? color3ToCss(result.rimColor) : '#7a6a5e';
  const roughness = result?.roughness ?? 0.65;
  const speckle = result?.speckle ?? 0;
  const mottling = result?.mottling ?? 0;
  const opacity = result ? result.opacity : 0.5;
  const filterId = 'glazeFilter';

  return (
    <div className="rounded-xl bg-stone-800 p-4 flex flex-col items-center">
      <svg viewBox="0 0 200 220" width="200" height="220">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={roughness * 1.5} result="blur" />
            <feTurbulence type="fractalNoise" baseFrequency={0.02 + speckle * 0.08}
              numOctaves={3} seed={42} result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="grayNoise" />
            <feBlend in="blur" in2="grayNoise" mode="overlay" result="speckled" />
            {mottling > 0.05 && (
              <>
                <feTurbulence type="turbulence" baseFrequency={0.01 + mottling * 0.03}
                  numOctaves={2} seed={7} result="mottle" />
                <feDisplacementMap in="speckled" in2="mottle" scale={mottling * 12}
                  xChannelSelector="R" yChannelSelector="G" />
              </>
            )}
          </filter>
        </defs>

        {/* Bowl body */}
        <path d="M40,80 Q40,180 100,190 Q160,180 160,80 Z"
          fill={surface} opacity={opacity} filter={`url(#${filterId})`} />

        {/* Rim */}
        <ellipse cx="100" cy="80" rx="60" ry="14"
          fill={rim} stroke={rim} strokeWidth="2" />

        {/* Inner shadow */}
        <ellipse cx="100" cy="82" rx="52" ry="10"
          fill="rgba(0,0,0,0.15)" />
      </svg>
      {result && (
        <div className="text-xs text-stone-500 mt-1 text-center">
          Burn Risk: {(result.burnRisk * 100).toFixed(0)}% &middot; Stability: {(result.stability * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
}
