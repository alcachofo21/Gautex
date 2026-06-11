"use client";

import { useState } from "react";
import { campaigns } from "@/lib/products";
import { FormatSelector } from "./FormatSelector";
import { Button } from "@/components/ui/Button";
import type { CampaignFormat } from "@/types";

const formats = campaigns.formats as CampaignFormat[];
const baseProducts = campaigns.baseProducts;

export function CampaignConfigurator() {
  const [step, setStep] = useState(1);
  const [formatId, setFormatId] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoName, setLogoName] = useState("");
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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoName(file.name);
    }
  };

  const submit = async () => {
    setStatus("loading");
    try {
      let logoUrl: string | undefined;
      let logoPath: string | undefined;

      if (logoFile) {
        const fd = new FormData();
        fd.append("file", logoFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        if (!uploadRes.ok) throw new Error("upload failed");
        const uploadData = await uploadRes.json();
        logoUrl = uploadData.url;
        logoPath = uploadData.path;
      }

      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "campaign",
          formatId,
          formatName: selectedFormat?.name,
          productId,
          logoFileName: logoName,
          logoUrl: logoUrl || logoPath,
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
        <h3 className="font-display text-2xl font-bold text-primary">¡Solicitud enviada!</h3>
        <p className="mt-4 text-text-muted">
          Hemos recibido tu solicitud de campaña personalizada. Nos pondremos en contacto contigo pronto.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8 flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full ${step >= s ? "bg-primary" : "bg-gray-200"}`}
          />
        ))}
      </div>

      {step === 1 && (
        <div>
          <h3 className="mb-4 font-display text-xl font-bold">Paso 1: Elige el formato</h3>
          <FormatSelector formats={formats} selected={formatId} onSelect={setFormatId} />
          <div className="mt-6 flex justify-end">
            <Button disabled={!formatId} onClick={() => setStep(2)}>
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="mb-4 font-display text-xl font-bold">Paso 2: Producto base</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {baseProducts.map((p) => (
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
          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>Atrás</Button>
            <Button disabled={!productId} onClick={() => setStep(3)}>Siguiente</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="mb-4 font-display text-xl font-bold">Paso 3: Sube tu logo</h3>
          <p className="mb-4 text-sm text-text-muted">PNG, JPG o PDF. Máximo 5 MB.</p>
          <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 hover:border-primary">
            <input type="file" accept=".png,.pdf,.jpg,.jpeg" onChange={handleFile} className="hidden" />
            <span className="font-semibold text-primary">Seleccionar archivo</span>
            {logoName && <span className="mt-2 text-sm text-text-muted">{logoName}</span>}
          </label>
          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(2)}>Atrás</Button>
            <Button onClick={() => setStep(4)}>Siguiente</Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h3 className="mb-4 font-display text-xl font-bold">Paso 4: Datos y cantidad</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: "firstName", label: "Nombre *", type: "text" },
              { key: "lastName", label: "Apellidos *", type: "text" },
              { key: "email", label: "Email *", type: "email" },
              { key: "phone", label: "Teléfono", type: "tel" },
              { key: "company", label: "Empresa / CIF", type: "text" },
              { key: "quantity", label: "Cantidad estimada *", type: "text" },
            ].map((field) => (
              <div key={field.key} className={field.key === "quantity" ? "sm:col-span-2" : ""}>
                <label className="mb-1 block text-sm font-medium">{field.label}</label>
                <input
                  type={field.type}
                  required={field.label.includes("*")}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full min-h-[48px] rounded-xl border border-gray-300 px-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Mensaje adicional</label>
              <textarea
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
            />
          </div>
          {selectedFormat && (
            <div className="mt-4 rounded-xl bg-surface p-4 text-sm">
              <p><strong>Formato:</strong> {selectedFormat.name}</p>
              <p><strong>Producto:</strong> {baseProducts.find((p) => p.id === productId)?.name}</p>
              {logoName && <p><strong>Archivo:</strong> {logoName}</p>}
            </div>
          )}
          {status === "error" && (
            <p className="mt-4 text-sm text-red-500">Error al enviar. Inténtalo de nuevo.</p>
          )}
          <div
            className="mt-6 flex justify-between"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <Button variant="ghost" onClick={() => setStep(3)}>Atrás</Button>
            <Button
              onClick={submit}
              disabled={status === "loading" || !form.firstName || !form.email || !form.quantity}
            >
              {status === "loading" ? "Enviando..." : "Solicitar presupuesto"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
