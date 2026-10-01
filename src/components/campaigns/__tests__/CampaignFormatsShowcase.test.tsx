/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CampaignFormatsShowcase } from "@/components/campaigns/CampaignFormatsShowcase";

describe("CampaignFormatsShowcase", () => {
  it("lists campaign formats", () => {
    render(<CampaignFormatsShowcase locale="es" />);
    expect(screen.getByText(/Nuestros formatos/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Modelo Estuche/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Funda PVC/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Flow Pack$/i })).toBeInTheDocument();
  });

  it("links to contact for quote", () => {
    render(<CampaignFormatsShowcase locale="es" />);
    const cta = screen.getByRole("link", { name: /Solicitar presupuesto/i });
    expect(cta).toHaveAttribute("href", "/contacto");
  });
});
