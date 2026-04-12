import React from 'react'
import LogoLoop from '../LogoLoop';

const imageLogosTop = [
  { src: '/images/client/Alcon.png', alt: 'Alcon' },
  { src: '/images/client/Bakamla.png', alt: 'Bakamla' },
  { src: '/images/client/Bandara-Internasional-Batam.webp', alt: 'Bandara Internasional Batam' },
  { src: '/images/client/Bank-BI.png', alt: 'Bank BI' },
  { src: '/images/client/Bank-BRI.png', alt: 'Bank BRI' },
  { src: '/images/client/BCA.png', alt: 'BCA' },
  { src: '/images/client/BP-Batam.jpeg', alt: 'BP Batam' },
  { src: '/images/client/BPK.png', alt: 'BPK' },
  { src: '/images/client/BPKP.png', alt: 'BPKP' },
  { src: '/images/client/Central-Group-Batam.png', alt: 'Central Group Batam' },
  { src: '/images/client/Garuda-Indonesia.png', alt: 'Garuda Indonesia' },
  { src: '/images/client/images.png', alt: 'Client Logo' },
  { src: '/images/client/Infineon.png', alt: 'Infineon' },
];

const imageLogosBottom = [
  { src: '/images/client/Kemetrian-Kelautan-dan-perikanan.png', alt: 'Kementerian Kelautan dan Perikanan' },
  { src: '/images/client/KPKNL.png', alt: 'KPKNL' },
  { src: '/images/client/KPU RI.png', alt: 'KPU RI' },
  { src: '/images/client/Mcdermott.png', alt: 'Mcdermott' },
  { src: '/images/client/Pemko Batam.png', alt: 'Pemko Batam' },
  { src: '/images/client/PSDKP.jpg', alt: 'PSDKP' },
  { src: '/images/client/PT-BSTC.png', alt: 'PT BSTC' },
  { src: '/images/client/PT-Data Center First.jpg', alt: 'PT Data Center First' },
  { src: '/images/client/PT-Pegaunihan.webp', alt: 'PT Pegaunihan' },
  { src: '/images/client/PT-Rainbow-Tubulars-Manufacture.jpg', alt: 'PT Rainbow Tubulars Manufacture' },
  { src: '/images/client/PT-SMOE-Indonesia.jpg', alt: 'PT SMOE Indonesia' },
  { src: '/images/client/PT-Timas.png', alt: 'PT Timas' },
  { src: '/images/client/Yonif-Batam.png', alt: 'Yonif Batam' },
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
        hoverSpeed={0}
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
        hoverSpeed={0}
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Client logos bottom"
        />
    </div>
  )
}

export default Client
