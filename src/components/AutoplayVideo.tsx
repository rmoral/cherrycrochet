"use client";
import { useEffect, useRef, type VideoHTMLAttributes } from "react";

/**
 * Vídeo en bucle y silenciado que solo se reproduce mientras está en pantalla y nunca si la
 * persona pide menos movimiento. Sin `autoPlay` en el HTML: hasta hidratar se ve el póster.
 */
export function AutoplayVideo(props: VideoHTMLAttributes<HTMLVideoElement> & { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return <video ref={ref} muted loop playsInline preload="metadata" {...props} />;
}
