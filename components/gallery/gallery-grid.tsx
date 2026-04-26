"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

type GalleryGridProps = {
  items: GalleryItem[];
};

export default function GalleryGrid({ items }: GalleryGridProps) {
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="group relative overflow-hidden rounded-2xl bg-neutral-100 text-left shadow-sm transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            onClick={() => setActiveIndex(index)}
          >
            <div className="relative aspect-video">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {/* Item name label */}
            <div className="px-3 py-2">
              <p className="text-lg text-black truncate font-bold text-center capitalize">
                {item.caption}
              </p>
            </div>
          </button>
        ))}
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
              className="relative w-full max-w-6xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-950 shadow-2xl">
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              <div className="mt-3 flex items-center justify-center flex-col gap-4 text-sm text-white/85">
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