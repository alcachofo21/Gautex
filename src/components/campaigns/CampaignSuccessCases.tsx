"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import casesEs from "../../../content/campaign-cases.json";
import casesEn from "../../../content/campaign-cases-en.json";
import { getUi, localizedPath, type Locale } from "@/lib/locale";

interface CampaignSuccessCasesProps {
  locale?: Locale;
  compact?: boolean;
}

export function CampaignSuccessCases({ locale = "es", compact = false }: CampaignSuccessCasesProps) {
  const cases = locale === "en" ? casesEn : casesEs;
  const ui = getUi(locale).campaignCases;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <section className={compact ? "py-12 sm:py-16" : "mt-16"}>
        <div className={compact ? "container-page" : ""}>
          <h2 className="mb-2 font-display text-2xl font-bold">{ui.title}</h2>
          <p className="mb-8 max-w-2xl text-text-muted">{ui.desc}</p>
          <div className="grid gap-6 md:grid-cols-3">
            {cases.map((item) => (
              <article
                key={`${item.entity}-${item.format}`}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[16/10] bg-surface">
                  <Image
                    src={item.image}
                    alt={item.format}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={75}
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">{item.entity}</p>
                  <h3 className="mt-1 font-display font-bold">{item.format}</h3>
                  <p className="mt-2 text-sm text-text-muted">{item.result}</p>
                </div>
              </article>
            ))}
          </div>
          {compact && (
            <div className="mt-6 text-center">
              <Link
                href={localizedPath("/campanas", locale)}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {ui.viewAll} →
              </Link>
            </div>
          )}
        </div>
      </section>

      {!compact && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 p-3 backdrop-blur-md transition-transform duration-300 lg:hidden ${
            visible ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <Link
            href="#configurador"
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-accent font-semibold text-white"
          >
            {getUi(locale).campaignsPage.stickyCta}
          </Link>
        </div>
      )}
    </>
  );
}
