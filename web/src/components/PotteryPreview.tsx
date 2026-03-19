import { FiringResult, color3ToCss } from '../lib/glaze';
import { useLocale } from '../lib/i18n';

interface Props {
  result: FiringResult | null;
  isIntuition?: boolean;
}

export default function PotteryPreview({ result, isIntuition }: Props) {
  const { t } = useLocale();
  const surface = result ? color3ToCss(result.surfaceColor) : '#6b5b4f';
  const rim = result ? color3ToCss(result.rimColor) : '#7a6a5e';
  const roughness = result?.roughness ?? 0.65;
  const speckle = result?.speckle ?? 0;
  const mottling = result?.mottling ?? 0;
  const opacity = result ? result.opacity : 0.5;
  const filterId = isIntuition ? 'glazeFilterIntuition' : 'glazeFilter';

  return (
    <div className={`rounded-xl bg-stone-800 p-4 flex flex-col items-center relative ${
      isIntuition ? 'border-2 border-dashed border-amber-500/50' : ''
    }`}>
      {isIntuition && (
        <div className="absolute top-2 right-2 text-xs text-amber-400 font-semibold">
          {t('intuition.label')}
        </div>
      )}
      <div className={isIntuition ? 'relative' : ''}>
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
        {isIntuition && (
          <div className="absolute inset-0 backdrop-blur-[1px] rounded-lg pointer-events-none" />
        )}
      </div>
      {result && !isIntuition && (
        <div className="text-xs text-stone-500 mt-1 text-center">
          {t('result.burnRisk')}: {(result.burnRisk * 100).toFixed(0)}% &middot; {t('result.stability')}: {(result.stability * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
}
