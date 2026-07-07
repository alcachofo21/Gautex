"use client";

import { useRef } from "react";
import { FlipHorizontal2, Upload } from "lucide-react";
import type { FoilProductSpec } from "@/types";
import type { Locale } from "@/lib/locale";

export interface FoilSideState {
  file: File | null;
  fileName: string;
  previewUrl: string | null;
  scale: number;
}

interface FoilPreviewProps {
  productSpec: FoilProductSpec | null;
  productName: string;
  finish: "matte" | "gloss";
  sidesMode: "front-only" | "front-back";
  activeSide: "front" | "back";
  front: FoilSideState;
  back: FoilSideState;
  locale?: Locale;
  labels: {
    front: string;
    back: string;
    uploadFront: string;
    uploadBack: string;
    zoom: string;
    specsTitle: string;
    printArea: string;
    deposit: string;
    wrapper: string;
    flipHint: string;
    noImage: string;
    width: string;
    length: string;
    thickness: string;
    lubricant: string;
    yes: string;
  };
  onActiveSideChange: (side: "front" | "back") => void;
  onFrontChange: (state: Partial<FoilSideState>) => void;
  onBackChange: (state: Partial<FoilSideState>) => void;
}

const FOIL_RATIO = 52 / 70;

export function FoilPreview({
  productSpec,
  productName,
  finish,
  sidesMode,
  activeSide,
  front,
  back,
  labels,
  onActiveSideChange,
  onFrontChange,
  onBackChange,
}: FoilPreviewProps) {
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const active = activeSide === "front" ? front : back;
  const onActiveChange = activeSide === "front" ? onFrontChange : onBackChange;

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    onActiveChange({ file, fileName: file.name, previewUrl, scale: 1 });
  };

  const metallicClass =
    finish === "gloss"
      ? "bg-gradient-to-br from-slate-200 via-white to-slate-300"
      : "bg-gradient-to-br from-slate-300 via-slate-100 to-slate-400";

  const specRows = productSpec
    ? [
        { label: labels.wrapper, value: productSpec.wrapper },
        { label: labels.width, value: `${productSpec.widthMm} mm` },
        { label: labels.length, value: `${productSpec.lengthMm} mm` },
        { label: labels.thickness, value: `${productSpec.thicknessMicron} µ` },
        { label: labels.lubricant, value: productSpec.lubricantMg },
        { label: labels.deposit, value: productSpec.deposit ? labels.yes : "-" },
      ]
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
      <div>
        {sidesMode === "front-back" && (
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => onActiveSideChange("front")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                activeSide === "front"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 text-text-muted hover:border-primary/30"
              }`}
            >
              {labels.front}
              {front.previewUrl && (
                <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
              )}
            </button>
            <button
              type="button"
              onClick={() => onActiveSideChange("back")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                activeSide === "back"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 text-text-muted hover:border-primary/30"
              }`}
            >
              <FlipHorizontal2 className="h-4 w-4" />
              {labels.back}
              {back.previewUrl && (
                <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
              )}
            </button>
          </div>
        )}

        <div
          className="relative mx-auto w-full max-w-[280px] shadow-xl"
          style={{ aspectRatio: FOIL_RATIO }}
        >
          <div
            className={`absolute inset-0 overflow-hidden rounded-[14px] border border-slate-400/60 shadow-inner ${metallicClass}`}
          >
            {/* Tear notch */}
            <div className="absolute left-1/2 top-0 z-20 h-3 w-6 -translate-x-1/2 rounded-b-full bg-slate-500/30" />

            {/* Print area */}
            <div
              className="absolute z-10 overflow-hidden rounded-md border border-dashed border-primary/25 bg-white/10"
              style={{
                top: "10%",
                left: "7%",
                right: "7%",
                bottom: "22%",
              }}
            >
              {active.previewUrl ? (
                <img
                  src={active.previewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{
                    transform: `scale(${active.scale})`,
                    transformOrigin: "center center",
                  }}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-xs text-slate-500">
                  <Upload className="h-6 w-6 opacity-40" />
                  <span>{labels.noImage}</span>
                </div>
              )}
            </div>

            {/* Deposit bubble */}
            {productSpec?.deposit !== false && (
              <div
                className="absolute bottom-[6%] left-1/2 z-20 -translate-x-1/2 rounded-full border border-slate-400/50 bg-gradient-to-b from-white/80 to-slate-200/60 shadow-sm"
                style={{ width: "28%", height: "14%" }}
              />
            )}

            {/* Brand watermark */}
            <div className="absolute bottom-[2%] left-0 right-0 z-30 text-center text-[9px] font-medium tracking-wide text-slate-600/70">
              {productName}
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-text-muted">{labels.printArea}</p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            ref={activeSide === "front" ? frontInputRef : backInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() =>
              (activeSide === "front" ? frontInputRef : backInputRef).current?.click()
            }
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 text-sm font-semibold text-primary hover:border-primary hover:bg-primary/10"
          >
            <Upload className="h-4 w-4" />
            {activeSide === "front" ? labels.uploadFront : labels.uploadBack}
          </button>
          {active.fileName && (
            <span className="truncate text-sm text-text-muted">{active.fileName}</span>
          )}
        </div>

        {active.previewUrl && (
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-text">
              {labels.zoom}: {Math.round(active.scale * 100)}%
            </label>
            <input
              type="range"
              min={100}
              max={150}
              value={Math.round(active.scale * 100)}
              onChange={(e) =>
                onActiveChange({ scale: Number(e.target.value) / 100 })
              }
              className="w-full accent-primary"
            />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-surface p-4">
        <h4 className="mb-3 font-display text-sm font-bold text-text">
          {labels.specsTitle}
        </h4>
        <ul className="space-y-2 text-xs text-text-muted">
          {specRows.map((row) => (
            <li key={row.label} className="flex justify-between gap-2 border-b border-gray-100 pb-1.5">
              <span>{row.label}</span>
              <span className="font-medium text-text">{row.value}</span>
            </li>
          ))}
        </ul>
        {sidesMode === "front-back" && (
          <p className="mt-3 text-[11px] text-text-muted">{labels.flipHint}</p>
        )}
      </div>
    </div>
  );
}
