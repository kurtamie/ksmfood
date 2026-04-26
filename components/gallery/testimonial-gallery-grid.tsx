"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { GalleryItem } from "@/app/gallery/_lib";

type TestimonialGalleryGridProps = {
  items: GalleryItem[];
};

const FALLBACK_WIDTH = 1200;
const FALLBACK_HEIGHT = 1600;

function getImageSize(item: GalleryItem) {
  return {
    width: item.width ?? FALLBACK_WIDTH,
    height: item.height ?? FALLBACK_HEIGHT,
  };
}

export default function TestimonialGalleryGrid({
  items,
}: TestimonialGalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex === null ? null : items[activeIndex];
  const isViewerOpen = activeItem !== null;
  const currentIndex = activeIndex ?? 0;

  useEffect(() => {
    if (!isViewerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((index) =>
          index === null ? null : Math.min(index + 1, items.length - 1),
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((index) =>
          index === null ? null : Math.max(index - 1, 0),
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isViewerOpen, items.length]);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 xl:columns-4">
        {items.map((item, index) => {
          const { width, height } = getImageSize(item);

          return (
            <button
              key={item.id}
              type="button"
              className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-neutral-100 text-left shadow-sm transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={width}
                height={height}
                sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          );
        })}
      </div>

      {typeof document !== "undefined" &&
        isViewerOpen &&
        activeItem &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/88 p-4 sm:p-6"
            onClick={() => setActiveIndex(null)}
          >
            <button
              type="button"
              aria-label="Close image viewer"
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
              onClick={() => setActiveIndex(null)}
            >
              <X className="size-5" />
            </button>

            <button
              type="button"
              aria-label="Previous image"
              className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentIndex === 0}
              onClick={(event) => {
                event.stopPropagation();
                setActiveIndex((index) =>
                  index === null ? null : Math.max(index - 1, 0),
                );
              }}
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              aria-label="Next image"
              className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentIndex === items.length - 1}
              onClick={(event) => {
                event.stopPropagation();
                setActiveIndex((index) =>
                  index === null ? null : Math.min(index + 1, items.length - 1),
                );
              }}
            >
              <ChevronRight className="size-5" />
            </button>

            <div
              className="flex max-h-[88vh] w-full max-w-6xl flex-col items-center"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={activeItem.src}
                alt={activeItem.alt}
                width={getImageSize(activeItem).width}
                height={getImageSize(activeItem).height}
                priority
                sizes="100vw"
                className="h-auto max-h-[82vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              />
              <div className="mt-3 flex w-full max-w-6xl items-center justify-between gap-4 text-sm text-white/85">
                <p className="truncate">{activeItem.caption}</p>
                <p className="shrink-0">
                  {currentIndex + 1} / {items.length}
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
