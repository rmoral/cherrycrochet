"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/i18n";
import { fill } from "@/lib/text";
import type { Media } from "@/lib/types";
import { Badge } from "./ui/Badge";
import { Icon } from "./ui/Icon";

type Labels = Pick<Dict["product"], "gallery" | "photo" | "video" | "play" | "pause">;

/**
 * Galería deslizable con scroll-snap. El vídeo va primero (silenciado, en bucle, con póster).
 * Las miniaturas y el contador siguen a la diapositiva visible.
 */
export function Gallery({
  media,
  alt,
  badge,
  t,
}: {
  media: Media[];
  alt: string;
  badge?: string | null;
  t: Labels;
}) {
  const items = [...media.filter((m) => m.type === "video"), ...media.filter((m) => m.type === "image")];
  const poster = media.find((m) => m.type === "image")?.url;
  const track = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  // Sin reproducción automática para quien pide menos movimiento.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) video.current?.pause();
  }, []);

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: i * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  };

  const onScroll = () => {
    const el = track.current;
    if (el) setIndex(Math.min(items.length - 1, Math.round(el.scrollLeft / el.clientWidth)));
  };

  const togglePlay = () => {
    const v = video.current;
    if (v) void (v.paused ? v.play() : v.pause());
  };

  return (
    <section aria-label={fill(t.gallery, { name: alt })} className="flex flex-col gap-2.5">
      <div className="relative">
        <div
          ref={track}
          onScroll={onScroll}
          className="flex aspect-square snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-3xl border-2 border-ink bg-blush shadow-[0_5px_0_var(--color-ink)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((m, i) => (
            <div key={m.url} className="relative size-full shrink-0 snap-start snap-always">
              {m.type === "video" ? (
                <video
                  ref={i === 0 ? video : undefined}
                  src={m.url}
                  poster={poster}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  className="size-full object-cover"
                />
              ) : (
                <Image
                  src={m.url}
                  alt={i === 0 || (i === 1 && items[0].type === "video") ? alt : ""}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 560px"
                  unoptimized={m.url.endsWith(".svg")}
                  className="object-cover"
                />
              )}
            </div>
          ))}
        </div>

        {badge && <Badge className="pointer-events-none absolute left-3 top-3">{badge}</Badge>}
        {items[0]?.type === "video" && index === 0 && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? t.pause : t.play}
            className="absolute bottom-3 left-3 grid size-11 place-items-center rounded-full border-2 border-ink bg-white"
          >
            <Icon name={playing ? "pause" : "play"} strokeWidth={3} />
          </button>
        )}
        {items.length > 1 && (
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink px-2.5 py-0.5 text-[13px] font-bold text-cream"
          >
            {index + 1} / {items.length}
          </span>
        )}
      </div>

      {items.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.map((m, i) => (
            <button
              key={m.url}
              type="button"
              onClick={() => goTo(i)}
              aria-label={m.type === "video" ? t.video : fill(t.photo, { n: i + 1 })}
              aria-current={i === index}
              className={`relative size-[62px] shrink-0 overflow-hidden rounded-[14px] bg-blush ${
                i === index ? "border-[3px] border-coral-deep" : "border-2 border-ink"
              }`}
            >
              {m.type === "video" ? (
                <span className="grid size-full place-items-center bg-ink text-cream">
                  <Icon name="play" />
                </span>
              ) : (
                <Image src={m.url} alt="" fill sizes="62px" unoptimized={m.url.endsWith(".svg")} className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
