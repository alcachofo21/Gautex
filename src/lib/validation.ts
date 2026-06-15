import { z } from "zod";

const honeypot = z.string().max(0).optional();

export const contactSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional(),
  message: z.string().min(1).max(5000),
  type: z.enum(["contact", "newsletter"]).optional(),
  website: honeypot,
});

export const quoteSchema = z.object({
  type: z.enum(["cart", "campaign"]),
  firstName: z.string().min(1).max(100),
  lastName: z.string().max(100).optional(),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional(),
  company: z.string().max(200).optional(),
  cif: z.string().max(50).optional(),
  sector: z.string().max(100).optional(),
  message: z.string().max(5000).optional(),
  quantity: z.string().max(50).optional(),
  formatId: z.string().max(50).optional(),
  formatName: z.string().max(200).optional(),
  variantId: z.string().max(50).optional(),
  variantName: z.string().max(200).optional(),
  presentationId: z.string().max(50).optional(),
  presentationName: z.string().max(200).optional(),
  productId: z.string().max(50).optional(),
  logoFileName: z.string().max(300).optional(),
  logoUrl: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string(),
        quantity: z.number().int().positive(),
        priceLabel: z.string(),
      })
    )
    .optional(),
  website: honeypot,
});

export type ContactInput = z.infer<typeof contactSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
