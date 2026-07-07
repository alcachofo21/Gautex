import Image from "next/image";
import Link from "next/link";
import { Award, ClipboardCheck, FileCheck, RefreshCw, ShieldCheck, Truck, Users, Download } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type corporateEs from "../../../content/corporate.json";

type QualityData = (typeof corporateEs)["quality"];

const pillarIcons = [ShieldCheck, FileCheck, ClipboardCheck];
const processIcons = [Users, ClipboardCheck, Truck, RefreshCw];

interface QualityPageContentProps {
  quality: QualityData;
  resourcesHref?: string;
  resourcesLabel?: string;
}

export function QualityPageContent({ quality, resourcesHref = "/recursos", resourcesLabel }: QualityPageContentProps) {
  return (
    <>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-text-muted">{quality.intro}</p>

      <div className="mt-10 flex flex-wrap gap-3">
        {quality.badges.map((label) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-2xl border border-primary/20 bg-white px-5 py-3 shadow-sm"
          >
            <Award className="h-5 w-5 shrink-0 text-primary" />
            <span className="font-display text-sm font-bold text-text">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
        {quality.certifications.map((cert) => (
          <div key={cert.name} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Award className="h-7 w-7 text-primary" />
            </div>
            <Badge variant="outline" className="mb-3">
              {cert.scope}
            </Badge>
            <h2 className="font-display text-xl font-bold">{cert.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">{cert.description}</p>
          </div>
        ))}
        </div>
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/quality/certificaciones.webp"
                alt="Certificaciones Gautex Medica"
                fill
                className="object-cover"
                sizes="320px"
                quality={80}
              />
            </div>
          </div>
          {resourcesLabel && (
            <Link
              href={resourcesHref}
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10"
            >
              <Download className="h-4 w-4" />
              {resourcesLabel}
            </Link>
          )}
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-4 rounded-2xl bg-primary/5 p-8 sm:flex-row sm:items-start">
        <ShieldCheck className="h-12 w-12 shrink-0 text-primary" />
        <div>
          <h2 className="font-display text-lg font-bold">{quality.notifiedBody.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">{quality.notifiedBody.description}</p>
          <p className="mt-4 rounded-xl border border-primary/15 bg-white/60 px-4 py-3 text-sm leading-relaxed text-text-muted">
            {quality.ceNote}
          </p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-display text-2xl font-bold">{quality.pillarsTitle}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {quality.pillars.map((pillar, i) => {
            const Icon = pillarIcons[i] || ShieldCheck;
            return (
              <div key={pillar.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-display text-2xl font-bold">{quality.processTitle}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quality.processSteps.map((step, i) => {
            const Icon = processIcons[i] || ClipboardCheck;
            return (
              <div key={step.title} className="relative rounded-2xl bg-surface p-6">
                <span className="text-sm font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-display font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
