"use client";

import { AccordionItem } from "@/components/ui/Accordion";
import { getUi, type Locale } from "@/lib/locale";

interface FaqSectionProps {
  locale?: Locale;
  className?: string;
}

export function FaqSection({ locale = "es", className = "" }: FaqSectionProps) {
  const faq = getUi(locale).faq;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className={className}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h2 className="text-fluid-title font-display font-bold">{faq.title}</h2>
      {faq.subtitle && <p className="mt-2 max-w-2xl text-text-muted">{faq.subtitle}</p>}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white px-6 shadow-sm">
        {faq.items.map((item) => (
          <AccordionItem key={item.q} title={item.q}>
            <p className="text-sm leading-relaxed">{item.a}</p>
          </AccordionItem>
        ))}
      </div>
    </section>
  );
}
