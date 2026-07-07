import { describe, it, expect } from "vitest";
import { contactEmailHtml, quoteEmailHtml, userConfirmationHtml } from "@/lib/email";

describe("email HTML escaping", () => {
  it("escapes script tags in contact email", () => {
    const html = contactEmailHtml({
      firstName: "<script>",
      lastName: "Test",
      email: "a@b.com",
      message: "<img onerror=alert(1)>",
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&lt;img onerror=alert(1)&gt;");
  });

  it("escapes quote email fields", () => {
    const html = quoteEmailHtml({
      type: "cart",
      firstName: "<b>",
      email: "a@b.com",
      message: "test",
    });
    expect(html).toContain("&lt;b&gt;");
  });

  it("escapes user confirmation name", () => {
    const html = userConfirmationHtml("es", "contact", "<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("escapes URLs in quote attachments", () => {
    const html = quoteEmailHtml({
      type: "campaign",
      firstName: "Ana",
      email: "a@b.com",
      logoUrl: 'https://example.com"><script>',
      logoFileName: 'evil"><img',
    });
    expect(html).not.toContain('"><script>');
    expect(html).toContain("&lt;img");
  });

  it("renders foil attachment links in quote email", () => {
    const html = quoteEmailHtml({
      type: "campaign",
      firstName: "Ana",
      email: "a@b.com",
      foilFrontUrl: "https://cdn.example.com/front.png",
      foilFrontFileName: "front.png",
      foilBackUrl: "https://cdn.example.com/back.png",
      foilBackFileName: "back.png",
    });
    expect(html).toContain("Foil frontal");
    expect(html).toContain("Foil reverso");
  });
});
