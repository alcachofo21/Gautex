import { describe, it, expect } from "vitest";
import {
  getLocaleFromPath,
  localizedPath,
  switchLocalePath,
  getCorporate,
  getCategories,
  getUi,
  sectorPath,
  getSectorAlternatePaths,
  getBlogPosts,
  getBlogPost,
  getSectors,
  getSector,
  getProductText,
  getPartners,
  getTestimonials,
  getCampaigns,
} from "@/lib/locale";

describe("locale", () => {
  it("detects locale from path", () => {
    expect(getLocaleFromPath("/en/productos")).toBe("en");
    expect(getLocaleFromPath("/productos")).toBe("es");
  });

  it("builds localized paths", () => {
    expect(localizedPath("/contacto", "en")).toBe("/en/contacto");
    expect(localizedPath("/contacto", "es")).toBe("/contacto");
    expect(localizedPath("/", "en")).toBe("/en");
  });

  it("switches locale path", () => {
    expect(switchLocalePath("/en/contacto")).toBe("/contacto");
    expect(switchLocalePath("/contacto")).toBe("/en/contacto");
  });

  it("loads localized content", () => {
    expect(getCorporate("es")).toBeTruthy();
    expect(getCorporate("en")).toBeTruthy();
    expect(getCategories("es").length).toBeGreaterThan(0);
    expect(getUi("en").nav).toBeTruthy();
    expect(getBlogPosts("es").length).toBeGreaterThanOrEqual(0);
    expect(getPartners("es")).toBeTruthy();
    expect(getTestimonials("es").length).toBeGreaterThan(0);
  });

  it("gets blog post and sector by id", () => {
    const posts = getBlogPosts("es");
    if (posts[0]) {
      expect(getBlogPost(posts[0].slug, "es")?.slug).toBe(posts[0].slug);
    }
    const sectors = getSectors("es");
    if (sectors[0]) {
      expect(getSector(sectors[0].id, "es")?.id).toBe(sectors[0].id);
    }
  });

  it("localizes product text helper", () => {
    const text = getProductText(
      { name: "Test", shortDescription: "S", description: "D", priceLabel: "P" },
      "en",
      { name: "EN Test" }
    );
    expect(text.name).toBe("EN Test");
  });

  it("builds sector paths", () => {
    expect(sectorPath("farmacia", "es")).toBe("/sectores/farmacia");
    expect(sectorPath("farmacia", "en")).toBe("/en/sectors/farmacia");
  });

  it("returns sector alternate paths", () => {
    const paths = getSectorAlternatePaths("farmacia");
    expect(paths?.es).toContain("/sectores/");
    expect(paths?.en).toContain("/en/sectors/");
  });

  it("returns Spanish product text unchanged", () => {
    const product = {
      name: "Test",
      shortDescription: "S",
      description: "D",
      priceLabel: "P",
    };
    expect(getProductText(product, "es")).toBe(product);
  });

  it("loads campaigns per locale", () => {
    expect(getCampaigns("es").formats.length).toBeGreaterThan(0);
    expect(getCampaigns("en").formats.length).toBeGreaterThan(0);
  });
});
