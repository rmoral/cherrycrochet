import type { L10n, Product, ProductColor } from "./types";

// Colores de muestra (solo modo demo).
const c = (id: string, hex: string, es: string, ca: string, en: string, fr: string): ProductColor => ({
  id,
  hex,
  name: { es, ca, en, fr },
});
const palette = {
  coral: c("coral", "#FF5C6C", "Coral", "Coral", "Coral", "Corail"),
  mostaza: c("mostaza", "#FFC83D", "Mostaza", "Mostassa", "Mustard", "Moutarde"),
  menta: c("menta", "#22B8A7", "Menta", "Menta", "Mint", "Menthe"),
  lila: c("lila", "#7A55C7", "Lila", "Lila", "Lilac", "Lilas"),
  crudo: c("crudo", "#F3E9D8", "Crudo", "Cru", "Natural", "Écru"),
};

type Extra = { colors?: ProductColor[]; details?: L10n; care?: L10n };

// Productos de muestra: se ven mientras Supabase no está configurado.
const p = (
  n: number,
  slug: string,
  es: string,
  ca: string,
  en: string,
  fr: string,
  price: number,
  days: number,
  featured = false,
  extra: Extra = {},
): Product => ({
  id: `demo-${n}`,
  slug,
  name: { es, ca, en, fr },
  tagline: {
    es: "Tejido a mano, punto a punto",
    ca: "Teixit a mà, punt a punt",
    en: "Handmade, stitch by stitch",
    fr: "Fait main, maille après maille",
  },
  description: {
    es: "Pieza de muestra. Sustitúyela desde el back office por tus productos reales: añade fotos o vídeo, descripción y precio.\n\nAlgodón suave, relleno hipoalergénico y mucho mimo en cada puntada.",
    ca: "Peça de mostra. Substitueix-la des del back office pels teus productes reals.\n\nCotó suau, farciment hipoal·lergènic i molta cura a cada punt.",
    en: "Sample piece. Replace it from the back office with your real products.\n\nSoft cotton, hypoallergenic filling and lots of care in every stitch.",
    fr: "Pièce d'exemple. Remplacez-la depuis le back-office par vos vrais produits.\n\nCoton doux, rembourrage hypoallergénique et beaucoup de soin à chaque maille.",
  },
  price_cents: price,
  compare_at_cents: null,
  media: [{ type: "image", url: `/demo/${n}.svg` }],
  colors: extra.colors ?? [],
  details: extra.details ?? {},
  care: extra.care ?? {},
  lead_time_days: days,
  featured,
  active: true,
  sort_order: n,
});

export const demoProducts: Product[] = [
  p(1, "pulpo-amigurumi", "Pulpo amigurumi", "Pop amigurumi", "Amigurumi octopus", "Pieuvre amigurumi", 2400, 7, true, {
    colors: [palette.coral, palette.mostaza, palette.menta, palette.lila, palette.crudo],
    details: {
      es: "Unos 20 cm de alto. Algodón 100 % y relleno hipoalergénico. (Texto de muestra)",
      ca: "Uns 20 cm d'alçada. Cotó 100 % i farciment hipoal·lergènic. (Text de mostra)",
      en: "About 20 cm tall. 100% cotton and hypoallergenic filling. (Sample text)",
      fr: "Environ 20 cm de haut. 100 % coton et rembourrage hypoallergénique. (Texte d'exemple)",
    },
    care: {
      es: "Lavar a mano en agua fría y secar en plano. (Texto de muestra)",
      ca: "Rentar a mà amb aigua freda i assecar en pla. (Text de mostra)",
      en: "Hand wash in cold water and dry flat. (Sample text)",
      fr: "Laver à la main à l'eau froide et sécher à plat. (Texte d'exemple)",
    },
  }),
  p(2, "bolso-granny", "Bolso granny square", "Bossa granny square", "Granny square bag", "Sac granny square", 4500, 12, true),
  p(3, "gorro-pompon", "Gorro con pompón", "Gorro amb pompó", "Pom-pom beanie", "Bonnet à pompon", 2900, 8, true, {
    colors: [palette.mostaza, palette.lila, palette.crudo],
  }),
  p(4, "manta-bebe", "Manta de bebé arcoíris", "Manta de nadó arc de Sant Martí", "Rainbow baby blanket", "Couverture bébé arc-en-ciel", 6900, 15),
  p(5, "ramo-flores", "Ramo de flores eterno", "Ram de flors etern", "Everlasting flower bouquet", "Bouquet de fleurs éternel", 3500, 10),
  p(6, "posavasos", "Set de 4 posavasos", "Set de 4 posagots", "Set of 4 coasters", "Lot de 4 dessous de verre", 1800, 5),
];
