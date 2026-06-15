"use client";

import { useState } from "react";
import { FormatSelector } from "./FormatSelector";
import { FoilPreview, type FoilSideState } from "./FoilPreview";
import { Button } from "@/components/ui/Button";
import { getCampaigns, getUi, type Locale } from "@/lib/locale";
import type { CampaignFormat, ConfigOption, FlowPackVariant, FoilProductSpec } from "@/types";

const emptyFoilSide = (): FoilSideState => ({
  file: null,
  fileName: "",
  previewUrl: null,
  scale: 1,
});

function buildConfigSummary(
  options: ConfigOption[] | undefined,
  selections: Record<string, string | string[]>
): string {
  if (!options?.length) return "";
  return options
    .map((opt) => {
      const sel = selections[opt.id];
      if (opt.type === "single" && typeof sel === "string") {
        const choice = opt.choices.find((c) => c.id === sel);
        return choice ? `${opt.label}: ${choice.name}` : "";
      }
      if (opt.type === "multiple" && Array.isArray(sel) && sel.length) {
        const names = sel
          .map((id) => opt.choices.find((c) => c.id === id)?.name)
          .filter(Boolean);
        return names.length ? `${opt.label}: ${names.join(", ")}` : "";
      }
      return "";
    })
    .filter(Boolean)
    .join(" · ");
}

function isConfigValid(
  options: ConfigOption[] | undefined,
  selections: Record<string, string | string[]>
): boolean {
  if (!options?.length) return true;
  return options.every((opt) => {
    if (!opt.required) return true;
    const sel = selections[opt.id];
    if (opt.type === "single") return typeof sel === "string" && sel.length > 0;
    return Array.isArray(sel) && sel.length > 0;
  });
}

interface CampaignConfiguratorProps {
  locale?: Locale;
}

export function CampaignConfigurator({ locale = "es" }: CampaignConfiguratorProps) {
  const ui = getUi(locale);
  const t = ui.campaigns;
  const campaignData = getCampaigns(locale);
  const formats = campaignData.formats as CampaignFormat[];
  const baseProducts = campaignData.baseProducts;
  const foilSpecs = (campaignData as { foilSpecs?: Record<string, FoilProductSpec> }).foilSpecs;

  const [step, setStep] = useState(1);
  const [formatId, setFormatId] = useState<string | null>(null);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [presentationId, setPresentationId] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [configSelections, setConfigSelections] = useState<Record<string, string | string[]>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoName, setLogoName] = useState("");
  const [foilFront, setFoilFront] = useState<FoilSideState>(emptyFoilSide);
  const [foilBack, setFoilBack] = useState<FoilSideState>(emptyFoilSide);
  const [activeFoilSide, setActiveFoilSide] = useState<"front" | "back">("front");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    quantity: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const selectedFormat = formats.find((f) => f.id === formatId);
  const selectedVariant = selectedFormat?.variants?.find((v) => v.id === variantId);
  const selectedPresentation = selectedFormat?.presentationOptions?.find((p) => p.id === presentationId);
  const hasVariants = Boolean(selectedFormat?.variants?.length);
  const hasPresentations = Boolean(selectedFormat?.presentationOptions?.length);

  const hasConfigOptions = Boolean(selectedFormat?.configOptions?.length);
  const isCustomCondoms = selectedFormat?.id === "preservativos-personalizados";
  const foilSidesMode =
    configSelections["foil-sides"] === "front-back" ? "front-back" : "front-only";
  const foilFinish =
    configSelections["foil-finish"] === "gloss" ? "gloss" : "matte";
  const selectedProduct = baseProducts.find((p) => p.id === productId);
  const productFoilSpec = productId && foilSpecs ? foilSpecs[productId] : null;

  const availableProducts = hasVariants && selectedVariant
    ? baseProducts.filter((p) => selectedVariant.productIds.includes(p.id))
    : baseProducts.filter((p) => selectedFormat?.productIds?.includes(p.id) ?? false);

  const handleFormatSelect = (id: string) => {
    setFormatId(id);
    setVariantId(null);
    setPresentationId(null);
    setProductId(null);
    setConfigSelections({});
    setFoilFront(emptyFoilSide());
    setFoilBack(emptyFoilSide());
    setActiveFoilSide("front");
  };

  const handleVariantSelect = (variant: FlowPackVariant) => {
    setVariantId(variant.id);
    setProductId(variant.productIds.length === 1 ? variant.productIds[0] : null);
  };

  const setSingleConfig = (optionId: string, choiceId: string) => {
    setConfigSelections((prev) => ({ ...prev, [optionId]: choiceId }));
  };

  const toggleMultipleConfig = (optionId: string, choiceId: string) => {
    setConfigSelections((prev) => {
      const current = Array.isArray(prev[optionId]) ? (prev[optionId] as string[]) : [];
      const next = current.includes(choiceId)
        ? current.filter((id) => id !== choiceId)
        : [...current, choiceId];
      return { ...prev, [optionId]: next };
    });
  };

  const canProceedStep2 = (hasVariants
    ? Boolean(variantId && productId)
    : hasPresentations
      ? Boolean(presentationId && productId)
      : Boolean(productId)) && isConfigValid(selectedFormat?.configOptions, configSelections);

  const canProceedStep3 = isCustomCondoms
    ? Boolean(
        foilFront.file &&
          (foilSidesMode === "front-only" || foilBack.file)
      )
    : true;

  const configSummary = buildConfigSummary(selectedFormat?.configOptions, configSelections);

  const formatLabel = selectedFormat
    ? [selectedFormat.name, selectedVariant?.name, selectedPresentation?.name].filter(Boolean).join(" — ")
    : "";

  const step2Title = (() => {
    if (!selectedFormat) return t.step2Default;
    if (hasVariants) return t.step2FlowPack;
    if (selectedFormat.id === "preservativos-personalizados") return t.step2Foil;
    if (selectedFormat.id === "estuche") return t.step2Estuche;
    if (selectedFormat.id === "funda-pvc") return t.step2Funda;
    return t.step2Product;
  })();

  const formFields = [
    { key: "firstName", label: t.fields.firstName, type: "text" },
    { key: "lastName", label: t.fields.lastName, type: "text" },
    { key: "email", label: t.fields.email, type: "email" },
    { key: "phone", label: t.fields.phone, type: "tel" },
    { key: "company", label: t.fields.company, type: "text" },
    { key: "quantity", label: t.fields.quantity, type: "text" },
  ] as const;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoName(file.name);
    }
  };

  const uploadFile = async (file: File): Promise<string | undefined> => {
    const fd = new FormData();
    fd.append("file", file);
    const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
    if (!uploadRes.ok) throw new Error("upload failed");
    const uploadData = await uploadRes.json();
    return uploadData.url || uploadData.path;
  };

  const submit = async () => {
    setStatus("loading");
    try {
      let logoUrl: string | undefined;
      let foilFrontUrl: string | undefined;
      let foilBackUrl: string | undefined;

      if (isCustomCondoms) {
        if (foilFront.file) foilFrontUrl = await uploadFile(foilFront.file);
        if (foilSidesMode === "front-back" && foilBack.file) {
          foilBackUrl = await uploadFile(foilBack.file);
        }
      } else if (logoFile) {
        logoUrl = await uploadFile(logoFile);
      }

      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "campaign",
          formatId,
          formatName: formatLabel,
          variantId: variantId || undefined,
          variantName: selectedVariant?.name,
          presentationId: presentationId || undefined,
          presentationName: selectedPresentation?.name,
          productId,
          configOptionsSummary: configSummary || undefined,
          logoFileName: logoName || undefined,
          logoUrl,
          foilFrontFileName: foilFront.fileName || undefined,
          foilFrontUrl,
          foilBackFileName: foilBack.fileName || undefined,
          foilBackUrl,
          ...form,
        }),
      });
      if (res.ok) {
        setStatus("success");
        setStep(5);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
        <h3 className="font-display text-2xl font-bold text-primary">{t.successTitle}</h3>
        <p className="mt-4 text-text-muted">{t.successDesc}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8 flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`h-2 flex-1 rounded-full ${step >= s ? "bg-primary" : "bg-gray-200"}`} />
        ))}
      </div>

      {step === 1 && (
        <div>
          <h3 className="mb-2 font-display text-xl font-bold">{t.step1Title}</h3>
          <p className="mb-4 text-sm text-text-muted">{t.step1Desc}</p>
          <FormatSelector formats={formats} selected={formatId} onSelect={handleFormatSelect} locale={locale} />
          <div className="mt-6 flex justify-end">
            <Button disabled={!formatId} onClick={() => setStep(2)}>{t.next}</Button>
          </div>
        </div>
      )}

      {step === 2 && selectedFormat && (
        <div>
          <h3 className="mb-2 font-display text-xl font-bold">{step2Title}</h3>
          <p className="mb-4 text-sm text-text-muted">{selectedFormat.description}</p>

          {hasVariants && (
            <div className="grid gap-3 sm:grid-cols-2">
              {selectedFormat.variants?.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => handleVariantSelect(variant)}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    variantId === variant.id ? "border-primary bg-primary/5 shadow-sm" : "border-gray-200 hover:border-primary/40"
                  }`}
                >
                  <span className="font-display font-bold">{variant.name}</span>
                  <p className="mt-1 text-sm text-text-muted">{variant.description}</p>
                  <ul className="mt-2 space-y-0.5">
                    {variant.details.map((d) => (
                      <li key={d} className="text-xs text-text-muted">• {d}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          )}

          {hasPresentations && (
            <div className="mb-6">
              <h4 className="mb-3 font-semibold text-text">{t.presentationLabel}</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {selectedFormat.presentationOptions?.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPresentationId(opt.id)}
                    className={`rounded-xl border-2 p-4 text-left font-semibold ${
                      presentationId === opt.id ? "border-primary bg-primary/5" : "border-gray-200"
                    }`}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasConfigOptions && selectedFormat.configOptions?.map((opt) => (
            <div key={opt.id} className="mb-6">
              <h4 className="mb-3 font-semibold text-text">
                {opt.label}
                {opt.required ? " *" : ""}
              </h4>
              {opt.type === "single" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {opt.choices.map((choice) => (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => setSingleConfig(opt.id, choice.id)}
                      className={`rounded-xl border-2 p-4 text-left font-semibold transition-all ${
                        configSelections[opt.id] === choice.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-gray-200 hover:border-primary/40"
                      }`}
                    >
                      {choice.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {opt.choices.map((choice) => {
                    const selected = Array.isArray(configSelections[opt.id])
                      && (configSelections[opt.id] as string[]).includes(choice.id);
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => toggleMultipleConfig(opt.id, choice.id)}
                        className={`rounded-xl border-2 p-4 text-left transition-all ${
                          selected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-gray-200 hover:border-primary/40"
                        }`}
                      >
                        <span className="font-semibold">{choice.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {!hasVariants && availableProducts.length > 0 && (
            <div>
              <h4 className="mb-3 font-semibold text-text">
                {hasPresentations ? t.condomBrandLabel : t.condomLabel}
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {availableProducts.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProductId(p.id)}
                    className={`rounded-xl border-2 p-4 text-left font-semibold ${
                      productId === p.id ? "border-primary bg-primary/5" : "border-gray-200"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasVariants && selectedVariant && availableProducts.length > 1 && (
            <div className="mt-6">
              <h4 className="mb-3 font-semibold text-text">{t.condomBrandLabel}</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {availableProducts.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProductId(p.id)}
                    className={`rounded-xl border-2 p-4 text-left font-semibold ${
                      productId === p.id ? "border-primary bg-primary/5" : "border-gray-200"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasVariants && selectedVariant && availableProducts.length === 1 && (
            <p className="mt-4 rounded-xl bg-surface px-4 py-3 text-sm text-text-muted">
              {t.includedProduct} <strong className="text-text">{availableProducts[0].name}</strong>
            </p>
          )}

          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>{t.back}</Button>
            <Button disabled={!canProceedStep2} onClick={() => setStep(3)}>{t.next}</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="mb-4 font-display text-xl font-bold">
            {isCustomCondoms ? t.step3FoilTitle : t.step3Title}
          </h3>
          <p className="mb-4 text-sm text-text-muted">
            {isCustomCondoms ? t.step3FoilDesc : t.step3Desc}
          </p>

          {isCustomCondoms && productId ? (
            <FoilPreview
              productSpec={productFoilSpec}
              productName={selectedProduct?.name ?? ""}
              finish={foilFinish}
              sidesMode={foilSidesMode}
              activeSide={activeFoilSide}
              front={foilFront}
              back={foilBack}
              locale={locale}
              labels={t.foil}
              onActiveSideChange={setActiveFoilSide}
              onFrontChange={(patch) => setFoilFront((prev) => ({ ...prev, ...patch }))}
              onBackChange={(patch) => setFoilBack((prev) => ({ ...prev, ...patch }))}
            />
          ) : (
            <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 hover:border-primary">
              <input type="file" accept=".png,.pdf,.jpg,.jpeg" onChange={handleFile} className="hidden" />
              <span className="font-semibold text-primary">{t.selectFile}</span>
              {logoName && <span className="mt-2 text-sm text-text-muted">{logoName}</span>}
            </label>
          )}

          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(2)}>{t.back}</Button>
            <Button disabled={!canProceedStep3} onClick={() => setStep(4)}>{t.next}</Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h3 className="mb-4 font-display text-xl font-bold">{t.step4Title}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {formFields.map((field) => (
              <div key={field.key} className={field.key === "quantity" ? "sm:col-span-2" : ""}>
                <label className="mb-1 block text-sm font-medium">{field.label}</label>
                <input
                  type={field.type}
                  required={field.label.includes("*")}
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full min-h-[48px] rounded-xl border border-gray-300 px-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">{t.fields.message}</label>
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <input type="text" name="website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
          </div>
          {selectedFormat && (
            <div className="mt-4 rounded-xl bg-surface p-4 text-sm">
              <p><strong>{t.summaryFormat}</strong> {formatLabel}</p>
              <p><strong>{t.summaryProduct}</strong> {baseProducts.find((p) => p.id === productId)?.name}</p>
              {configSummary && <p><strong>{t.summaryOptions}</strong> {configSummary}</p>}
              {logoName && <p><strong>{t.summaryFile}</strong> {logoName}</p>}
              {foilFront.fileName && <p><strong>{t.summaryFoilFront}</strong> {foilFront.fileName}</p>}
              {foilBack.fileName && <p><strong>{t.summaryFoilBack}</strong> {foilBack.fileName}</p>}
            </div>
          )}
          {status === "error" && <p className="mt-4 text-sm text-red-500">{t.error}</p>}
          <div className="mt-6 flex justify-between" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
            <Button variant="ghost" onClick={() => setStep(3)}>{t.back}</Button>
            <Button onClick={submit} disabled={status === "loading" || !form.firstName || !form.email || !form.quantity}>
              {status === "loading" ? t.submitting : t.submit}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
