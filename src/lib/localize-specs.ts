/** Spanish → English maps for technical datasheet specs. */
const SPEC_KEY_EN: Record<string, string> = {
  Presentación: "Presentation",
  Ancho: "Width",
  Largo: "Length",
  Espesor: "Thickness",
  Grosor: "Thickness",
  Lubricante: "Lubricant",
  Formato: "Format",
  "Formato foil": "Foil format",
  Material: "Material",
  Dimensiones: "Dimensions",
  Envase: "Packaging",
  Sobre: "Sachet",
  Volumen: "Volume",
  Capacidad: "Capacity",
  Contenido: "Contents",
  "Contenido del kit": "Kit contents",
  Densidad: "Density",
  Base: "Base",
  Extracto: "Extract",
  Filtración: "Filtration",
  Tipo: "Type",
  Uso: "Use",
  Variante: "Variant",
  Marca: "Brand",
  Muestra: "Sample",
  Autodiagnóstico: "Self-test",
  "Sabor/Color": "Flavour/Colour",
};

const SPEC_VALUE_EN: Record<string, string> = {
  "Caja de 144 unidades": "Box of 144 units",
  "Caja de 100 unidades": "Box of 100 units",
  "Caja de 1000 unidades": "Box of 1000 units",
  "Bolsa 100 unidades": "Bag of 100 units",
  "Paquete de 10 unidades": "Pack of 10 units",
  Paquete: "Pack",
  "Frasco 250 ml": "250 ml bottle",
  "Preservativo rectangular": "Rectangular condom",
  Cuadrado: "Square",
  "100% látex natural": "100% natural latex",
  "Látex natural": "Natural latex",
  "Sin látex": "Latex-free",
  "Nitrilo / Látex natural": "Nitrile / Natural latex",
  "85 x 120 mm opaco": "85 x 120 mm opaque",
  "Glicerina y agua": "Glycerine and water",
  Media: "Medium",
  Alta: "High",
  Externo: "External",
  Extrafuerte: "Extra strong",
  Prevención: "Prevention",
  "Protección sanitaria": "Healthcare protection",
  Quirúrgica: "Surgical",
  Manzana: "Apple",
  Plátano: "Banana",
  Fresa: "Strawberry",
  "Árbol de té": "Tea tree",
  "Nasofaríngea / orofaríngea": "Nasopharyngeal / oropharyngeal",
  "Sangre, suero o plasma": "Blood, serum or plasma",
  Antígenos: "Antigens",
  Sí: "Yes",
  "Transductor ecográfico lumbar-abdominal": "Lumbar-abdominal ultrasound transducer",
  "10 tests en casete + 10 pipetas + búfer 3ml + manual":
    "10 cassette tests + 10 pipettes + 3 ml buffer + manual",
  "20 tests + 20 hisopos + 20 tubos + 2 búferes + soporte + manual":
    "20 tests + 20 swabs + 20 tubes + 2 buffers + stand + manual",
};

const CERT_EN: Record<string, string> = {
  "ISO 10993 Biocompatibilidad": "ISO 10993 Biocompatibility",
};

function localizeSpecs(specs: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(specs)) {
    out[SPEC_KEY_EN[key] ?? key] = SPEC_VALUE_EN[value] ?? value;
  }
  return out;
}

function localizeCertifications(certs: string[]): string[] {
  return certs.map((c) => CERT_EN[c] ?? c);
}

export function localizeProductFields(
  product: {
    specs: Record<string, string>;
    certifications: string[];
    datasheetVariants?: Array<{ name: string; specs: Record<string, string> }>;
  },
  locale: "es" | "en"
) {
  if (locale !== "en") {
    return {
      specs: product.specs,
      certifications: product.certifications,
      datasheetVariants: product.datasheetVariants,
    };
  }

  return {
    specs: localizeSpecs(product.specs),
    certifications: localizeCertifications(product.certifications),
    datasheetVariants: product.datasheetVariants?.map((variant) => ({
      ...variant,
      specs: localizeSpecs(variant.specs),
    })),
  };
}
