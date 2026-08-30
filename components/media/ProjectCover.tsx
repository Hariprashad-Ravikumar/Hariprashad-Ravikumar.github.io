"use client";

import { useEffect, useRef } from "react";
import Picture from "@/components/ui/Picture";
import { prefersReducedMotion } from "@/lib/motion";

export type CoverMode =
  | { mode: "generated"; src: string; alt: string }
  | {
      mode: "split";
      photo: string;
      photoAlt: string;
      title: string;
      sub: string;
      tags: string[];
    }
  | { mode: "video"; mp4: string; webm: string; poster: string; alt: string };

export default function ProjectCover(props: CoverMode) {
  if (props.mode === "generated") {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-t-[var(--r-md)]">
        <Picture
          src={props.src}
          alt={props.alt}
          width={1280}
          height={720}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (props.mode === "split") {
    return (
      <div
        className="grid aspect-video w-full overflow-hidden rounded-t-[var(--r-md)] bg-[var(--brand-900)]"
        style={{ gridTemplateColumns: "1fr 1.15fr" }}
      >
        <div className="overflow-hidden">
          <Picture
            src={props.photo}
            alt={props.photoAlt}
            width={640}
            height={720}
            sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 45vw"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-1.5 p-6 text-white">
          <span className="text-h3">{props.title}</span>
          <span className="text-small text-white/80">{props.sub}</span>
          <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs text-white/70">
            {props.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <VideoCover {...props} />;
}

function VideoCover({
  mp4,
  webm,
  poster,
  alt,
}: Extract<CoverMode, { mode: "video" }>) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const saveData =
      "connection" in navigator &&
      (navigator as { connection?: { saveData?: boolean } }).connection?.saveData;

    if (prefersReducedMotion() || saveData) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-t-[var(--r-md)] bg-[var(--ink-900)]">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        aria-label={alt}
        className="h-full w-full object-cover"
      >
        <source src={webm} type="video/webm" />
        <source src={mp4} type="video/mp4" />
      </video>
    </div>
  );
}
