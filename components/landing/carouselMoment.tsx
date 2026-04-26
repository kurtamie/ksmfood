"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import pattern from "@/public/images/patternred.webp";

const IMAGES = [
  { src: "/images/gallery/event/galeri-event6.webp", alt: "Momen KSM 1" },
  { src: "/images/gallery/event/galeri-event8.webp", alt: "Momen KSM 2" },
  { src: "/images/gallery/event/galeri-event3.webp", alt: "Momen KSM 3" },
  { src: "/images/gallery/event/galeri-event4.webp", alt: "Momen KSM 4" },
  { src: "/images/gallery/event/galeri-event3.webp", alt: "Momen KSM 5" },
  { src: "/images/gallery/event/galeri-event1.webp", alt: "Momen KSM 6" },
];

const SLIDE_WIDTH = 280;
const SLIDE_HEIGHT = 500;
const GAP = 36;
const SPEED = 50;
const HOVER_SPEED = 50;

const CLONED = [...IMAGES, ...IMAGES, ...IMAGES];
const LOOP_LENGTH = IMAGES.length * (SLIDE_WIDTH + GAP);

export default function CarouselMoment() {
  const t = useTranslations("portfolio");
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const speedRef = useRef(SPEED);
  const animateFnRef = useRef<(ts: number) => void>(() => {});

  const [activeDot, setActiveDot] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isLightboxOpen = lightboxIndex !== null;
  const currentIndex = lightboxIndex ?? 0;

  // Pause carousel & lock body scroll saat lightbox terbuka
  useEffect(() => {
    if (!isLightboxOpen) return;

    isPausedRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) =>
          i === null ? null : Math.min(i + 1, IMAGES.length - 1),
        );
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i === null ? null : Math.max(i - 1, 0)));
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      // Resume carousel setelah lightbox ditutup
      isPausedRef.current = false;
      lastTimeRef.current = null;
    };
  }, [isLightboxOpen]);

  useEffect(() => {
    animateFnRef.current = (ts: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = ts;
      const delta = ts - lastTimeRef.current;
      lastTimeRef.current = ts;

      if (!isPausedRef.current) {
        offsetRef.current += (speedRef.current * delta) / 1000;
        if (offsetRef.current >= LOOP_LENGTH) {
          offsetRef.current -= LOOP_LENGTH;
        }
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
      }

      setActiveDot(
        Math.round(offsetRef.current / (SLIDE_WIDTH + GAP)) % IMAGES.length,
      );

      rafRef.current = requestAnimationFrame(animateFnRef.current);
    };
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame((ts) => animateFnRef.current(ts));
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const goToSlide = (idx: number) => {
    isPausedRef.current = true;
    offsetRef.current = idx * (SLIDE_WIDTH + GAP);
    lastTimeRef.current = null;
    setActiveDot(idx);

    setTimeout(() => {
      isPausedRef.current = false;
      lastTimeRef.current = null;
    }, 3000);
  };

  const openLightbox = (realIndex: number) => {
    const originalIndex = realIndex % IMAGES.length;
    setLightboxIndex(originalIndex);
  };

  const closeLightbox = () => setLightboxIndex(null);

  return (
    <>
      <section className="relative flex w-full items-center justify-center overflow-hidden bg-[#8D0000] px-6 py-16 sm:px-8 lg:px-16">
        <Image
          src={pattern}
          alt=""
          aria-hidden="true"
          className="absolute left-0 -top-48 z-0 h-auto w-32 sm:w-40"
        />
        <Image
          src={pattern}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 left-120 z-0 h-auto w-32 sm:w-40"
        />

        <div className="relative z-10 flex w-full max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:gap-12">
          <div className="shrink-0 max-w-xl text-center lg:text-left">
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-6xl">
              {t("title")}
            </h2>
            <Button
              asChild
              variant="outline"
              className="mt-8 h-12 border-white bg-transparent px-8 text-base font-bold text-white hover:bg-white hover:text-[#8D0000] sm:mt-10 sm:text-lg lg:mt-14"
            >
              <a href="/gallery/event">{t("cta")}</a>
            </Button>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden">
            <div
              className="overflow-hidden rounded-md"
              onMouseEnter={() => {
                speedRef.current = HOVER_SPEED;
              }}
              onMouseLeave={() => {
                speedRef.current = SPEED;
              }}
            >
              <div
                ref={trackRef}
                className="flex will-change-transform"
                style={{ gap: GAP }}
              >
                {CLONED.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className="shrink-0 overflow-hidden rounded-md cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                    style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT }}
                    onClick={() => openLightbox(i)}
                    aria-label={`Buka gambar: ${img.alt}`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={SLIDE_WIDTH}
                      height={SLIDE_HEIGHT}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`rounded-full transition-all duration-300 ${
                    activeDot === i
                      ? "h-1.5 w-9 bg-red-800"
                      : "h-1.5 w-6 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={t("slide", { number: i + 1 })}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Viewer */}
      {typeof document !== "undefined" &&
        isLightboxOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/88 p-4 sm:p-6"
            onClick={closeLightbox}
          >
            {/* Tombol tutup */}
            <button
              type="button"
              aria-label="Tutup viewer gambar"
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="size-5" />
            </button>

            {/* Tombol prev */}
            <button
              type="button"
              aria-label="Gambar sebelumnya"
              className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentIndex === 0}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) =>
                  i === null ? null : Math.max(i - 1, 0),
                );
              }}
            >
              <ChevronLeft className="size-5" />
            </button>

            {/* Tombol next */}
            <button
              type="button"
              aria-label="Gambar berikutnya"
              className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentIndex === IMAGES.length - 1}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) =>
                  i === null ? null : Math.min(i + 1, IMAGES.length - 1),
                );
              }}
            >
              <ChevronRight className="size-5" />
            </button>

            {/* Gambar utama */}
            <div
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-9/16 sm:aspect-video overflow-hidden rounded-2xl bg-neutral-950 shadow-2xl">
                <Image
                  src={IMAGES[currentIndex].src}
                  alt={IMAGES[currentIndex].alt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              {/* Counter */}
              <div className="mt-3 flex items-center justify-center gap-4 text-sm text-white/85">
                <p className="shrink-0">
                  {currentIndex + 1} / {IMAGES.length}
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
