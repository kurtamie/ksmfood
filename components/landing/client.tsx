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
  { src: "/images/client/Infineon.webp", alt: "Infineon" },
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
