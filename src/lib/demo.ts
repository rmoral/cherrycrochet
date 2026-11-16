import type { Product } from "./types";

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
  lead_time_days: days,
  featured,
  active: true,
  sort_order: n,
});

export const demoProducts: Product[] = [
  p(1, "pulpo-amigurumi", "Pulpo amigurumi", "Pop amigurumi", "Amigurumi octopus", "Pieuvre amigurumi", 2400, 7, true),
  p(2, "bolso-granny", "Bolso granny square", "Bossa granny square", "Granny square bag", "Sac granny square", 4500, 12, true),
  p(3, "gorro-pompon", "Gorro con pompón", "Gorro amb pompó", "Pom-pom beanie", "Bonnet à pompon", 2900, 8, true),
  p(4, "manta-bebe", "Manta de bebé arcoíris", "Manta de nadó arc de Sant Martí", "Rainbow baby blanket", "Couverture bébé arc-en-ciel", 6900, 15),
  p(5, "ramo-flores", "Ramo de flores eterno", "Ram de flors etern", "Everlasting flower bouquet", "Bouquet de fleurs éternel", 3500, 10),
  p(6, "posavasos", "Set de 4 posavasos", "Set de 4 posagots", "Set of 4 coasters", "Lot de 4 dessous de verre", 1800, 5),
];
