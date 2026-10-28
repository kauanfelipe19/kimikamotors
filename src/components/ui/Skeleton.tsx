import { cn } from '@/lib/cn';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'rounded bg-superficie-2 bg-[length:800px_100%] motion-safe:animate-brilho',
        'bg-[linear-gradient(90deg,transparent_0,rgb(var(--texto)/0.06)_50%,transparent_100%)]',
        className,
      )}
    />
  );
}
