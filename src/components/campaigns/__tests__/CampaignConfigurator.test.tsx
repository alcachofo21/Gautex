/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
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
});
