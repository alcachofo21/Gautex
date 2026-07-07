/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { COOKIE_CONSENT_KEY, hasAnalyticsConsent, trackEvent } from "@/lib/analytics";

describe("analytics", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    localStorage.clear();
    window.gtag = vi.fn();
    window.plausible = vi.fn();
  });

  it("checks analytics consent", () => {
    expect(hasAnalyticsConsent()).toBe(false);
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    expect(hasAnalyticsConsent()).toBe(true);
  });

  it("tracks event with GA when consented", () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-TEST");
    trackEvent("contact_submit");
    expect(window.gtag).toHaveBeenCalledWith("event", "contact_submit", undefined);
  });

  it("tracks event with Plausible when consented", () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    vi.stubEnv("NEXT_PUBLIC_PLAUSIBLE_DOMAIN", "gautex.com");
    trackEvent("newsletter_signup");
    expect(window.plausible).toHaveBeenCalled();
  });

  it("does not track without consent", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-TEST");
    trackEvent("contact_submit");
    expect(window.gtag).not.toHaveBeenCalled();
  });
});
