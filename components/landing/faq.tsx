import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as Array<{
    id: string;
    question: string;
    answer: string;
  }>;

  return (
    <div id="faq" className="mt-12 w-full max-w-4xl">
      <Accordion
        type="single"
        collapsible
        defaultValue="type"
        className="w-full rounded-[2rem] border border-black/10 bg-white px-5 py-2 shadow-sm sm:px-8"
      >
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center">
        <h3 className="text-lg font-bold text-[#332929] sm:text-xl">
          {t("title")}
        </h3>
        <Button
          variant="outline"
          className="h-11 border-red-800 px-6 font-bold text-red-800 hover:border-red-800 hover:bg-red-800 hover:text-white"
        >
          {t("cta")}
        </Button>
      </div>
    </div>
  );
}

export default Faq;
