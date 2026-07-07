import { describe, it, expect } from "vitest";
import { escapeHtml, escapeHtmlWithBreaks } from "@/lib/escape-html";

describe("escapeHtml", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
    );
  });

  it("escapes ampersands", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });
});

describe("escapeHtmlWithBreaks", () => {
  it("escapes and converts newlines", () => {
    expect(escapeHtmlWithBreaks("line1\n<script>")).toBe("line1<br>&lt;script&gt;");
  });
});
