"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import pattern from "@/public/images/patternred.webp";

const IMAGES = [
  { src: "/images/prasmanan.webp", alt: "Momen KSM 1" },
  { src: "/images/opor-ayam.webp", alt: "Momen KSM 2" },
  { src: "/images/bg-hero.webp", alt: "Momen KSM 3" },
  { src: "/images/about.webp", alt: "Momen KSM 4" },
  { src: "/images/prasmanan.webp", alt: "Momen KSM 5" },
  { src: "/images/selectMenu.webp", alt: "Momen KSM 6" },
];

const SLIDE_WIDTH = 280;
const SLIDE_HEIGHT = 500;
const GAP = 36;
const SPEED = 50;

const CLONED = [...IMAGES, ...IMAGES, ...IMAGES];
const LOOP_LENGTH = IMAGES.length * (SLIDE_WIDTH + GAP);

export default function CarouselMoment() {
  const t = useTranslations("portfolio");
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const animateFnRef = useRef<(ts: number) => void>(() => {});

  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    animateFnRef.current = (ts: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = ts;
      const delta = ts - lastTimeRef.current;
      lastTimeRef.current = ts;

      if (!isPausedRef.current) {
        offsetRef.current += (SPEED * delta) / 1000;
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

  // Jalankan loop sekali saat mount
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

    // Resume auto-scroll setelah 3 detik
    setTimeout(() => {
      isPausedRef.current = false;
      lastTimeRef.current = null;
    }, 3000);
  };

  return (
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
            variant="outline"
            className="mt-8 h-12 border-white bg-transparent px-8 text-base font-bold text-white  hover:bg-white hover:text-[#8D0000] sm:mt-10 sm:text-lg lg:mt-14"
          >
            {t("cta")}
          </Button>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden">
          <div
            className="overflow-hidden rounded-md"
            onMouseEnter={() => {
              isPausedRef.current = true;
            }}
            onMouseLeave={() => {
              isPausedRef.current = false;
              lastTimeRef.current = null;
            }}
          >
            <div
              ref={trackRef}
              className="flex will-change-transform"
              style={{ gap: GAP }}
            >
              {CLONED.map((img, i) => (
                <div
                  key={i}
                  className="shrink-0 overflow-hidden rounded-md"
                  style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={SLIDE_WIDTH}
                    height={SLIDE_HEIGHT}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
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
  );
}
