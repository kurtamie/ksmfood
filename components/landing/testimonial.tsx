"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import testimonialImage from "@/public/images/bubbleChat.webp";
import { Button } from "../ui/button";

const testimonials = [
  {
    id: 1,
    name: "Nurlela0900 Joenjklelha 97",
    text: "Suka kali pesan di disini, makananan nya enak fast respon, ramah. Solusi sih kalau ada acara mendadak",
  },
  {
    id: 2,
    name: "my doni",
    text: "Kemaren aku pesan untuk acara syukuran kata tetangga makanan nya enak, next acara aku mau pesan di catering ini lagi 😄",
  },
  {
    id: 3,
    name: "Cahaya Butarbutar",
    text: "Saya senang pesan catering di ksm dilayani dengan baik saat pesta langsung gercep tim nya, terimakasih ksm atas pelayanan nya🥰",
  },
  {
    id: 4,
    name: "Maulya Safa",
    text: "Catering mantap rasa nyaa enak dan worth it, abang2 di lapangan pada baik2, mantapp",
  },
  {
    id: 5,
    name: "Darwinto Winto",
    text: "Nasi kotak murah dan worth it enak masakannya ges",
  },
  {
    id: 6,
    name: "Riski Gulo",
    text: "Rekomendasi untuk acara rumahan enakk",
  },
  {
    id: 7,
    name: "Thienna San",
    text: "pelayanan nya bagus",
  },
  {
    id: 8,
    name: "Andra Yunisa",
    text: "enak lengkap🌸",
  },
  {
    id: 9,
    name: "virlo sitorus",
    text: "Ksm mantap👍",
  },
  {
    id: 10,
    name: "Marta Endarwati",
    text: "Great company",
  },
];

function Testimonial() {
  const t = useTranslations("testimonials");
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  });
  const [scrollValue, setScrollValue] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const testimonialsText = t.raw("items") as Array<{
    id: number;
    name: string;
    text: string;
  }>;

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    const updateScrollMetrics = () => {
      setMaxScroll(element.scrollWidth - element.clientWidth);
      setScrollValue(element.scrollLeft);
    };

    updateScrollMetrics();
    element.addEventListener("scroll", updateScrollMetrics, { passive: true });
    window.addEventListener("resize", updateScrollMetrics);

    return () => {
      element.removeEventListener("scroll", updateScrollMetrics);
      window.removeEventListener("resize", updateScrollMetrics);
    };
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = scrollRef.current;

    if (!element || event.pointerType !== "mouse") {
      return;
    }

    event.preventDefault();

    dragRef.current = {
      isDragging: true,
      startX: event.clientX,
      scrollLeft: element.scrollLeft,
    };
    element.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = scrollRef.current;

    if (
      !element ||
      !dragRef.current.isDragging ||
      event.pointerType !== "mouse"
    ) {
      return;
    }

    event.preventDefault();

    const distance = event.clientX - dragRef.current.startX;
    element.scrollLeft = dragRef.current.scrollLeft - distance;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    dragRef.current.isDragging = false;
    if (element.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="mt-28 flex w-full max-w-7xl flex-col gap-8">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 select-none cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: "none",
          WebkitUserSelect: "none",
          touchAction: "auto",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDragStart={(event) => event.preventDefault()}
      >
        {testimonials.map((testimonial) => {
          const translated = testimonialsText.find(
            (item) => item.id === testimonial.id,
          );

          return (
            <article
              key={testimonial.id}
              className="flex w-full shrink-0 flex-col items-center md:w-[calc((100%-24px)/2)] xl:w-[calc((100%-48px)/3)]"
            >
              <div className="pointer-events-none relative w-full overflow-hidden rounded-[2rem]">
                <Image
                  src={testimonialImage}
                  alt={`Testimoni ${translated?.name ?? testimonial.name}`}
                  className="h-auto w-full"
                  priority={testimonial.id <= 3}
                />
                <div className="absolute inset-x-[11%] top-[18%] flex items-center justify-center">
                  <p className="text-center text-sm font-medium leading-6 text-white md:text-base xl:text-lg">
                    {translated?.text ?? testimonial.text}
                  </p>
                </div>
              </div>
              <p className="mt-5 text-center text-lg font-semibold text-[#332929]">
                {translated?.name ?? testimonial.name}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mx-auto flex w-full max-w-xl items-center gap-4 px-2">
        <input
          type="range"
          min={0}
          max={Math.max(maxScroll, 0)}
          value={Math.min(scrollValue, Math.max(maxScroll, 0))}
          onChange={(event) => {
            const element = scrollRef.current;
            const nextValue = Number(event.target.value);

            setScrollValue(nextValue);

            if (element) {
              element.scrollTo({ left: nextValue, behavior: "smooth" });
            }
          }}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-red-200 accent-red-800"
          aria-label={t("sliderLabel")}
        />
      </div>
      <div className="flex items-center justify-center py-6">
        <Button
          asChild
          variant="outline"
          className="mt-8 h-12 border-[#8D0000] bg-transparent px-8 text-base font-bold text-[#8D0000] hover:bg-[#8D0000] hover:text-white sm:mt-10 sm:text-lg lg:mt-14"
        >
          <a href="/gallery/testimonial">{t("cta")}</a>
        </Button>
      </div>
    </div>
  );
}

export default Testimonial;
