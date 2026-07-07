/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CampaignConfigurator } from "@/components/campaigns/CampaignConfigurator";

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

vi.mock("next/dynamic", () => ({
  default: () => () => <div data-testid="foil-preview">Foil Preview</div>,
}));

describe("CampaignConfigurator", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
  });

  it("renders format selection step", () => {
    render(<CampaignConfigurator locale="es" />);
    expect(screen.getByText(/Paso 1: Elige el formato/i)).toBeInTheDocument();
  });

  it("shows available campaign formats", () => {
    render(<CampaignConfigurator locale="es" />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("allows skipping logo upload step without a file", async () => {
    const user = userEvent.setup();
    render(<CampaignConfigurator locale="es" />);

    await user.click(screen.getByLabelText(/Modelo Estuche/i));
    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    await user.click(screen.getByRole("button", { name: "Preservativos Matrix" }));
    await user.click(screen.getByRole("button", { name: "Siguiente" }));

    expect(screen.getByText(/Paso 3: Sube tu logo/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Saltar este paso" }));

    expect(screen.getByText(/Paso 4: Datos y cantidad/i)).toBeInTheDocument();
  });

  it("allows skipping foil step for custom condoms without uploading", async () => {
    const user = userEvent.setup();
    render(<CampaignConfigurator locale="es" />);

    await user.click(screen.getByLabelText(/Preservativos Personalizados/i));
    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    await user.click(screen.getByRole("button", { name: /Tira de 3 preservativos/i }));
    await user.click(screen.getByRole("button", { name: "Preservativos Matrix" }));
    await user.click(screen.getByRole("button", { name: /Solo frontal/i }));
    await user.click(screen.getByRole("button", { name: /Mate metalizado/i }));
    await user.click(screen.getByRole("button", { name: "Siguiente" }));

    expect(screen.getByText(/Paso 3: Diseña tu foil/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Saltar este paso" }));

    expect(screen.getByText(/Paso 4: Datos y cantidad/i)).toBeInTheDocument();
  });
});
