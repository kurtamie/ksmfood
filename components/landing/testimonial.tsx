"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import testimonialImage from "@/public/images/bubbleChat.svg";

const testimonials = [
  {
    id: 1,
    name: "Rina Maharani",
    text: "Pesanan untuk acara keluarga datang tepat waktu, tampilannya rapi, dan rasanya konsisten enak dari awal sampai akhir.",
  },
  {
    id: 2,
    name: "Fajar Nugroho",
    text: "Tim KSM sangat mudah diajak koordinasi. Menu prasmanannya lengkap dan tamu kantor kami banyak yang minta rekomendasinya.",
  },
  {
    id: 3,
    name: "Dewi Lestari",
    text: "Saya suka karena porsinya pas, bumbunya terasa, dan penyajiannya bikin acara lamaran kami terlihat lebih berkelas.",
  },
  {
    id: 4,
    name: "Aldo Pratama",
    text: "Snack box dan makan siangnya sama-sama memuaskan. Packaging bersih dan semua pesanan diterima sesuai permintaan.",
  },
  {
    id: 5,
    name: "Nadia Permata",
    text: "Pilihan menunya fleksibel dan rasanya cocok untuk tamu dari berbagai usia. Ini sangat membantu saat acara besar keluarga.",
  },
  {
    id: 6,
    name: "Rizky Ananda",
    text: "Pelayanannya cepat saat kami butuh revisi jumlah porsi. Respons admin juga jelas dan tidak bertele-tele.",
  },
  {
    id: 7,
    name: "Salsa Kirana",
    text: "Saya paling suka kualitas lauk dan sayurnya tetap fresh walaupun untuk jumlah tamu yang banyak. Sangat layak dipakai lagi.",
  },
  {
    id: 8,
    name: "Bagas Saputra",
    text: "KSM bantu bikin acara syukuran kami jauh lebih tenang. Makanannya enak, penyajiannya rapi, dan tamu banyak yang puas.",
  },
];

function Testimonial() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  });
  const [scrollValue, setScrollValue] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

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
    <div className="mt-12 flex w-full max-w-7xl flex-col gap-8 sm:mt-20 lg:mt-28">
      <div
        ref={scrollRef}
        className="flex cursor-grab gap-4 overflow-x-auto pb-4 select-none active:cursor-grabbing sm:gap-6 [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: "none",
          WebkitUserSelect: "none",
          touchAction: "pan-y",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDragStart={(event) => event.preventDefault()}
      >
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.id}
            className="flex w-[88%] shrink-0 flex-col items-center sm:w-[70%] md:w-[calc((100%-24px)/2)] xl:w-[calc((100%-48px)/3)]"
          >
            <div className="pointer-events-none relative w-full overflow-hidden rounded-[2rem]">
              <Image
                src={testimonialImage}
                alt={`Testimoni ${testimonial.name}`}
                className="h-auto w-full"
                priority={testimonial.id <= 3}
              />
              <div className="absolute inset-x-[11%] top-[18%] flex items-center justify-center">
                <p className="text-center text-xs font-medium leading-5 text-white sm:text-sm sm:leading-6 md:text-base xl:text-lg">
                  {testimonial.text}
                </p>
              </div>
            </div>
            <p className="mt-5 text-center text-base font-semibold text-[#332929] sm:text-lg">
              {testimonial.name}
            </p>
          </article>
        ))}
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
          aria-label="Slider testimonial"
        />
      </div>
    </div>
  );
}

export default Testimonial;
