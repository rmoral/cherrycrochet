"use client";
import Image from "next/image";
import { useState } from "react";
import type { Media } from "@/lib/types";
import { Icon } from "./ui/Icon";

export function Gallery({ media, alt }: { media: Media[]; alt: string }) {
  const [i, setI] = useState(0);
  const current = media[i];
  return (
    <div className="flex flex-col gap-3">
      <div className="card relative aspect-square overflow-hidden bg-blush">
        {current?.type === "video" ? (
          <video
            key={current.url}
            src={current.url}
            controls
            muted
            loop
            playsInline
            autoPlay
            className="size-full object-cover"
          />
        ) : current ? (
          <Image
            src={current.url}
            alt={alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={current.url.endsWith(".svg")}
            className="object-cover"
          />
        ) : null}
      </div>
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {media.map((m, idx) => (
            <button
              key={m.url}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`${alt} ${idx + 1}`}
              className={`relative size-16 shrink-0 overflow-hidden rounded-xl border-2 ${
                idx === i ? "border-coral-deep" : "border-ink/20"
              }`}
            >
              {m.type === "video" ? (
                <span className="grid size-full place-items-center bg-ink text-white">
                  <Icon name="play" />
                </span>
              ) : (
                <Image src={m.url} alt="" fill sizes="64px" unoptimized={m.url.endsWith(".svg")} className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
