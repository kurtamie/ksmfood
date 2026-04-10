import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";

function Faq() {
  return (
    <div id="faq" className="mt-12 w-full max-w-4xl">
      <Accordion
        type="single"
        collapsible
        defaultValue="type"
        className="w-full rounded-[2rem] border border-black/10 bg-white px-5 py-2 shadow-sm sm:px-8"
      >
        <AccordionItem value="type">
          <AccordionTrigger>
            Apakah KSM Katering melayani berbagai jenis acara?
          </AccordionTrigger>
          <AccordionContent>
            Ya, kami melayani berbagai jenis acara seperti pernikahan, aqiqah,
            acara kantor, dan kebutuhan lainnya.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="minimal">
          <AccordionTrigger>
            Berapa minimal pemesanan katering?
          </AccordionTrigger>
          <AccordionContent>
            Minimal pemesanan katering kami adalah 20 porsi untuk setiap jenis
            acara.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="support">
          <AccordionTrigger>
            Bagaimana cara menghubungi layanan pelanggan?
          </AccordionTrigger>
          <AccordionContent>
            Anda dapat menghubungi kami melalui email, obrolan langsung, atau
            telepon. Kami akan merespons dalam waktu 24 jam pada hari kerja.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger>
            Apakah harga sudah termasuk perlengkapan dan pelayanan?
          </AccordionTrigger>
          <AccordionContent>
            Ya, harga yang kami tawarkan sudah termasuk perlengkapan dan
            pelayanan.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="order">
          <AccordionTrigger>
            Bagaimana cara melakukan pemesanan?
          </AccordionTrigger>
          <AccordionContent>
            Anda dapat melakukan pemesanan melalui email, obrolan langsung, atau
            telepon. Kami akan merespons dalam waktu 24 jam pada hari kerja.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center">
        <h3 className="text-lg font-bold text-[#332929] sm:text-xl">
          Masih Memiliki Pertanyaan?
        </h3>
        <Button
          variant="outline"
          className="h-11 border-red-800 px-6 font-bold text-red-800 hover:border-red-800 hover:bg-red-800 hover:text-white"
        >
          Konsultasi Sekarang
        </Button>
      </div>
    </div>
  );
}

export default Faq;
