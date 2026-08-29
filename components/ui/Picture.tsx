/**
 * Renders a manually-generated responsive srcset (see scripts/optimize-images.mjs,
 * Phase 3) since `next/image`'s optimizer needs a server and this site is a
 * static export (§2.3). Explicit width/height prevent layout shift.
 */
const DEFAULT_WIDTHS = [640, 960, 1440, 1920] as const;

export default function Picture({
  src,
  alt,
  width,
  height,
  widths = DEFAULT_WIDTHS as unknown as number[],
  sizes = "100vw",
  priority = false,
  className = "",
}: {
  /** Base path without extension, e.g. "/images/hero/headshot" */
  src: string;
  alt: string;
  width: number;
  height: number;
  widths?: number[];
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const srcSet = widths.map((w) => `${src}-${w}.webp ${w}w`).join(", ");
  const fallback = `${src}-${widths[widths.length - 1]}.webp`;

  return (
    <img
      src={fallback}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={className}
    />
  );
}
