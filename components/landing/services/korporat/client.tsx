import LogoLoop from "@/components/LogoLoop";
import React from "react";

const imageLogosTop = [
  { src: "/images/services/korporat/logo/Alcon.webp", alt: "Alcon" },
  {
    src: "/images/services/korporat/logo/baker-hughes.webp",
    alt: "baker-hughes",
  },
  { src: "/images/services/korporat/logo/dynacast.webp", alt: "dynacast" },
  { src: "/images/services/korporat/logo/eaton.webp", alt: "eaton" },
  { src: "/images/services/korporat/logo/Ecogreen.webp", alt: "Ecogreen" },
  { src: "/images/services/korporat/logo/epson.webp", alt: "epson" },
  { src: "/images/services/korporat/logo/excelitas.webp", alt: "excelitas" },
  { src: "/images/services/korporat/logo/Flex.webp", alt: "Flex" },
  {
    src: "/images/services/korporat/logo/Garuda-Indonesia.webp",
    alt: "Garuda-Indonesia",
  },
  { src: "/images/services/korporat/logo/Honeywell.webp", alt: "Honeywell" },
  { src: "/images/services/korporat/logo/Infineon.webp", alt: "Infineon" },
  { src: "/images/services/korporat/logo/inmarsat.webp", alt: "inmarsat" },
  {
    src: "/images/services/korporat/logo/nissinkogyobatam.webp",
    alt: "nissinkogyobatam",
  },
  { src: "/images/services/korporat/logo/nittoh.webp", alt: "nittoh" },
  { src: "/images/services/korporat/logo/Panasonic.webp", alt: "Panasonic" },
];

const imageLogosBottom = [
  { src: "/images/services/korporat/logo/patlite.webp", alt: "patlite" },
  { src: "/images/services/korporat/logo/PT-BSTC.webp", alt: "PT BSTC" },
  {
    src: "/images/services/korporat/logo/PT-Pegaunihan.webp",
    alt: "PT Pegaunihan",
  },
  {
    src: "/images/services/korporat/logo/PT-SMOE-Indonesia.webp",
    alt: "PT SMOE Indonesia",
  },
  { src: "/images/services/korporat/logo/PT-Timas.webp", alt: "PT Timas" },
  { src: "/images/services/korporat/logo/Rigspek.webp", alt: "Rigspek" },
  { src: "/images/services/korporat/logo/rubycon.webp", alt: "rubycon" },
  { src: "/images/services/korporat/logo/siix.webp", alt: "siix" },
  { src: "/images/services/korporat/logo/sumitomo.webp", alt: "sumitomo" },
  { src: "/images/services/korporat/logo/tdk.webp", alt: "tdk" },
  { src: "/images/services/korporat/logo/tec.webp", alt: "tec" },
  { src: "/images/services/korporat/logo/triplus.webp", alt: "triplus" },
  { src: "/images/services/korporat/logo/varta.webp", alt: "varta" },
  { src: "/images/services/korporat/logo/WIK.webp", alt: "WIK" },
  { src: "/images/services/korporat/logo/yokogawa.webp", alt: "yokogawa" },
];

function Client() {
  return (
    <div className="relative overflow-x-hidden flex flex-col gap-12 mt-16">
      <LogoLoop
        logos={imageLogosTop}
        speed={50}
        direction="left"
        logoHeight={48}
        gap={40}
        hoverSpeed={50}
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Client logos top"
      />

      <LogoLoop
        logos={imageLogosBottom}
        speed={50}
        direction="right"
        logoHeight={48}
        gap={40}
        hoverSpeed={50}
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Client logos bottom"
      />
    </div>
  );
}

export default Client;
