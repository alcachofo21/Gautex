export function createApiRequest(path: string, init?: RequestInit): Request {
  const headers = new Headers(init?.headers);
  if (!headers.has("origin")) {
    headers.set("origin", "http://localhost:3000");
  }
  return new Request(`http://localhost:3000${path}`, { ...init, headers });
}

export const validContactBody = {
  firstName: "Juan",
  lastName: "García",
  email: "juan@example.com",
  phone: "600123456",
  message: "Hola, necesito información",
  type: "contact" as const,
  locale: "es",
};

export const validQuoteBody = {
  type: "cart" as const,
  firstName: "María",
  lastName: "López",
  email: "maria@example.com",
  message: "Presupuesto carrito",
  locale: "es",
  items: [
    {
      productId: "matrix-condoms",
      name: "Preservativos Matrix",
      quantity: 1,
      priceLabel: "20,90 €",
    },
  ],
};

export function makeCartItem() {
  return {
    productId: "matrix-condoms",
    slug: "matrix-condoms",
    name: "Preservativos Matrix",
    category: "preventivo",
    quantity: 1,
    priceLabel: "20,90 €",
    color: "#1e4f7a",
    image: "/images/products/matrix-condoms.webp",
  };
}
