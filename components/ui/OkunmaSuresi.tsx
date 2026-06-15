import { okumaSuresiLabel } from '@/lib/utils';

interface Props {
  dakika: number;
  className?: string;
}

export function OkunmaSuresi({ dakika, className = '' }: Props) {
  return (
    <span className={`font-mono text-[11px] uppercase tracking-[0.14em] text-ink-mute ${className}`}>
      {okumaSuresiLabel(dakika)}
    </span>
  );
}
