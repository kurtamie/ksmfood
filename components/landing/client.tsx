import React from "react";
import LogoLoop from "../LogoLoop";

const imageLogosTop = [
  { src: "/images/client/Alcon.webp", alt: "Alcon" },
  { src: "/images/client/Bakamla.webp", alt: "Bakamla" },
  {
    src: "/images/client/Bandara-Internasional-Batam.webp",
    alt: "Bandara Internasional Batam",
  },
  { src: "/images/client/Bank-BI.webp", alt: "Bank BI" },
  { src: "/images/client/Bank-BRI.webp", alt: "Bank BRI" },
  { src: "/images/client/BCA.webp", alt: "BCA" },
  { src: "/images/client/BP-Batam.webp", alt: "BP Batam" },
  { src: "/images/client/BPK.webp", alt: "BPK" },
  { src: "/images/client/BPKP.webp", alt: "BPKP" },
  {
    src: "/images/client/Central-Group-Batam.webp",
    alt: "Central Group Batam",
  },
  { src: "/images/client/Garuda-Indonesia.webp", alt: "Garuda Indonesia" },
  { src: "/images/client/images.webp", alt: "Client Logo" },
  { src: "/images/client/baker-hughes.webp", alt: "baker-hughes" },
  { src: "/images/client/dynacast.webp", alt: "dynacast" },
  { src: "/images/client/eaton.webp", alt: "eaton" },
  { src: "/images/client/Ecogreen.webp", alt: "Ecogreen" },
  { src: "/images/client/epson.webp", alt: "epson" },
  { src: "/images/client/excelitas.webp", alt: "excelitas" },
  { src: "/images/client/Flex.webp", alt: "Flex" },
  { src: "/images/client/Honeywell.webp", alt: "Honeywell" },
  { src: "/images/client/inmarsat.webp", alt: "inmarsat" },
  { src: "/images/client/nissinkogyobatam.webp", alt: "nissinkogyobatam" },
  { src: "/images/client/nittoh.webp", alt: "nittoh" },
];

const imageLogosBottom = [
  {
    src: "/images/client/Kemetrian-Kelautan-dan-perikanan.webp",
    alt: "Kementerian Kelautan dan Perikanan",
  },
  { src: "/images/client/KPKNL.webp", alt: "KPKNL" },
  { src: "/images/client/KPU RI.webp", alt: "KPU RI" },
  { src: "/images/client/Mcdermott.webp", alt: "Mcdermott" },
  { src: "/images/client/Pemko Batam.webp", alt: "Pemko Batam" },
  { src: "/images/client/PSDKP.webp", alt: "PSDKP" },
  { src: "/images/client/PT-BSTC.webp", alt: "PT BSTC" },
  {
    src: "/images/client/PT-Data Center First.webp",
    alt: "PT Data Center First",
  },
  { src: "/images/client/PT-Pegaunihan.webp", alt: "PT Pegaunihan" },
  {
    src: "/images/client/PT-Rainbow-Tubulars-Manufacture.webp",
    alt: "PT Rainbow Tubulars Manufacture",
  },
  { src: "/images/client/PT-SMOE-Indonesia.webp", alt: "PT SMOE Indonesia" },
  { src: "/images/client/PT-Timas.webp", alt: "PT Timas" },
  { src: "/images/client/Yonif-Batam.webp", alt: "Yonif Batam" },
  { src: "/images/client/Panasonic.webp", alt: "Panasonic" },
  { src: "/images/client/patlite.webp", alt: "patlite" },
  { src: "/images/client/Rigspek.webp", alt: "Rigspek" },
  { src: "/images/client/rubycon.webp", alt: "rubycon" },
  { src: "/images/client/siix.webp", alt: "siix" },
  { src: "/images/client/sumitomo.webp", alt: "sumitomo" },
  { src: "/images/client/tdk.webp", alt: "tdk" },
  { src: "/images/client/tec.webp", alt: "tec" },
  { src: "/images/client/triplus.webp", alt: "triplus" },
  { src: "/images/client/varta.webp", alt: "varta" },
  { src: "/images/client/WIK.webp", alt: "WIK" },
  { src: "/images/client/yokogawa.webp", alt: "yokogawa" },
];

function Client() {
  return (
    <div className="relative flex flex-col gap-12 mt-16" style={{ overflowX: 'clip' }}>
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
