import type { Locale } from "./config";

const es = {
  meta: {
    title: "Crochet hecho a mano por encargo",
    description:
      "Amigurumis, bolsos y accesorios de crochet tejidos a mano, uno a uno y por encargo. Envíos a toda Europa y pago seguro.",
  },
  nav: { shop: "Tienda", how: "Cómo funciona", faq: "Preguntas" },
  hero: {
    badge: "Hecho a mano · por encargo",
    title: "Crochet con alma, tejido solo para ti",
    subtitle:
      "Cada pieza se teje a mano cuando la pides. Sin stock, sin prisas y con todo el color del mundo.",
    cta: "Ver la colección",
    cta2: "Cómo funciona",
  },
  trust: [
    "100 % hecho a mano",
    "Tejido por encargo",
    "Envíos a toda Europa",
    "Pago seguro con Stripe",
  ],
  products: {
    title: "Nuestras piezas",
    subtitle: "Elige la tuya y nos ponemos a tejer.",
    view: "Ver pieza",
    empty: "Muy pronto, nuevas piezas.",
  },
  how: {
    title: "Así de fácil",
    steps: [
      { title: "Elige tu pieza", text: "Escoge lo que más te guste y haz tu pedido en un minuto." },
      { title: "La tejemos para ti", text: "Empezamos a tejer tu pieza a mano, punto a punto." },
      { title: "Llega a tu casa", text: "Te la enviamos bien envuelta, lista para regalar o disfrutar." },
    ],
  },
  why: {
    title: "Por qué te va a encantar",
    items: [
      { title: "Única de verdad", text: "No hay dos iguales: cada pieza sale de unas manos, no de una máquina." },
      { title: "Materiales suaves", text: "Hilos de calidad, agradables al tacto y pensados para durar." },
      { title: "El regalo perfecto", text: "Un detalle con historia que se nota que está hecho con cariño." },
    ],
  },
  faq: {
    title: "Preguntas frecuentes",
    items: [
      { q: "¿Cuánto tarda mi pedido?", a: "Cada pieza se teje por encargo. En su ficha verás el plazo de elaboración; después, el envío tarda entre 2 y 7 días según el país." },
      { q: "¿A dónde enviáis?", a: "A España, Andorra y toda la Unión Europea. El coste de envío se calcula antes de pagar." },
      { q: "¿Puedo pedir otro color?", a: "Sí. Indícalo en las notas del pedido y te confirmamos si es posible." },
      { q: "¿Es seguro el pago?", a: "El pago se realiza en la pasarela de Stripe. Nunca vemos ni guardamos los datos de tu tarjeta." },
    ],
  },
  cta: {
    title: "¿Tejemos algo para ti?",
    text: "Elige tu pieza favorita y empezamos hoy mismo.",
    button: "Ir a la tienda",
  },
  product: {
    buy: "Comprar ahora",
    leadTime: "Hecho por encargo · lista en {days} días",
    freeShipping: "Envío gratis desde {amount}",
    secure: "Pago seguro con Stripe",
    handmade: "Tejido a mano, pieza única",
    description: "Descripción",
    back: "Volver a la tienda",
    more: "También te puede gustar",
  },
  checkout: {
    title: "Tu pedido",
    quantity: "Cantidad",
    contact: "Tus datos",
    name: "Nombre y apellidos",
    email: "Email",
    phone: "Teléfono",
    address: "Dirección de envío",
    address1: "Calle y número",
    address2: "Piso, puerta… (opcional)",
    city: "Ciudad",
    region: "Provincia / región",
    postal: "Código postal",
    country: "País",
    notes: "Notas del pedido (opcional)",
    notesPlaceholder: "Color preferido, es un regalo…",
    subtotal: "Subtotal",
    shipping: "Envío",
    total: "Total",
    free: "Gratis",
    pay: "Continuar al pago",
    payNote: "Pagarás de forma segura en Stripe.",
    errorFields: "Revisa los campos marcados, falta algún dato.",
    errorGeneric: "No hemos podido iniciar el pago. Inténtalo de nuevo.",
    errorDemo: "Tienda en modo demo: conecta Supabase y Stripe para aceptar pedidos.",
  },
  success: {
    title: "¡Gracias por tu pedido!",
    text: "Hemos recibido tu pago y ya estamos preparando los ovillos. Te escribiremos por email cuando tu pieza salga de camino.",
    pending: "Estamos confirmando tu pago. Recibirás un email en cuanto se complete.",
    order: "Pedido n.º",
    back: "Volver a la tienda",
  },
  /** Rango de fechas de entrega; ver formatDeliveryRange en src/lib/delivery.ts. */
  delivery: { between: "entre el {min} y el {max}" },
  footer: { tagline: "Tejido a mano con mucho cariño.", rights: "Todos los derechos reservados." },
};

export type Dict = typeof es;

const ca: Dict = {
  meta: {
    title: "Ganxet fet a mà per encàrrec",
    description:
      "Amigurumis, bosses i accessoris de ganxet teixits a mà, un a un i per encàrrec. Enviaments a tot Europa i pagament segur.",
  },
  nav: { shop: "Botiga", how: "Com funciona", faq: "Preguntes" },
  hero: {
    badge: "Fet a mà · per encàrrec",
    title: "Ganxet amb ànima, teixit només per a tu",
    subtitle:
      "Cada peça es teixeix a mà quan la demanes. Sense estoc, sense presses i amb tot el color del món.",
    cta: "Veure la col·lecció",
    cta2: "Com funciona",
  },
  trust: [
    "100 % fet a mà",
    "Teixit per encàrrec",
    "Enviaments a tot Europa",
    "Pagament segur amb Stripe",
  ],
  products: {
    title: "Les nostres peces",
    subtitle: "Tria la teva i ens posem a teixir.",
    view: "Veure peça",
    empty: "Ben aviat, noves peces.",
  },
  how: {
    title: "Així de fàcil",
    steps: [
      { title: "Tria la teva peça", text: "Escull el que més t'agradi i fes la comanda en un minut." },
      { title: "La teixim per a tu", text: "Comencem a teixir la teva peça a mà, punt a punt." },
      { title: "Arriba a casa teva", text: "Te l'enviem ben embolicada, a punt per regalar o gaudir." },
    ],
  },
  why: {
    title: "Per què t'encantarà",
    items: [
      { title: "Única de debò", text: "No n'hi ha dues d'iguals: cada peça surt d'unes mans, no d'una màquina." },
      { title: "Materials suaus", text: "Fils de qualitat, agradables al tacte i pensats per durar." },
      { title: "El regal perfecte", text: "Un detall amb història que es nota que està fet amb afecte." },
    ],
  },
  faq: {
    title: "Preguntes freqüents",
    items: [
      { q: "Quant triga la meva comanda?", a: "Cada peça es teixeix per encàrrec. A la seva fitxa veuràs el termini d'elaboració; després, l'enviament triga entre 2 i 7 dies segons el país." },
      { q: "On envieu?", a: "A Espanya, Andorra i tota la Unió Europea. El cost d'enviament es calcula abans de pagar." },
      { q: "Puc demanar un altre color?", a: "Sí. Indica-ho a les notes de la comanda i et confirmem si és possible." },
      { q: "És segur el pagament?", a: "El pagament es fa a la passarel·la de Stripe. Mai veiem ni guardem les dades de la teva targeta." },
    ],
  },
  cta: {
    title: "Teixim alguna cosa per a tu?",
    text: "Tria la teva peça preferida i comencem avui mateix.",
    button: "Anar a la botiga",
  },
  product: {
    buy: "Comprar ara",
    leadTime: "Fet per encàrrec · a punt en {days} dies",
    freeShipping: "Enviament gratuït des de {amount}",
    secure: "Pagament segur amb Stripe",
    handmade: "Teixit a mà, peça única",
    description: "Descripció",
    back: "Tornar a la botiga",
    more: "També et pot agradar",
  },
  checkout: {
    title: "La teva comanda",
    quantity: "Quantitat",
    contact: "Les teves dades",
    name: "Nom i cognoms",
    email: "Correu electrònic",
    phone: "Telèfon",
    address: "Adreça d'enviament",
    address1: "Carrer i número",
    address2: "Pis, porta… (opcional)",
    city: "Ciutat",
    region: "Província / regió",
    postal: "Codi postal",
    country: "País",
    notes: "Notes de la comanda (opcional)",
    notesPlaceholder: "Color preferit, és un regal…",
    subtotal: "Subtotal",
    shipping: "Enviament",
    total: "Total",
    free: "Gratuït",
    pay: "Continuar al pagament",
    payNote: "Pagaràs de manera segura a Stripe.",
    errorFields: "Revisa els camps marcats, hi falta alguna dada.",
    errorGeneric: "No hem pogut iniciar el pagament. Torna-ho a provar.",
    errorDemo: "Botiga en mode demo: connecta Supabase i Stripe per acceptar comandes.",
  },
  success: {
    title: "Gràcies per la teva comanda!",
    text: "Hem rebut el teu pagament i ja estem preparant els cabdells. T'escriurem per correu quan la teva peça surti de camí.",
    pending: "Estem confirmant el teu pagament. Rebràs un correu tan bon punt es completi.",
    order: "Comanda núm.",
    back: "Tornar a la botiga",
  },
  /** Rango de fechas de entrega; ver formatDeliveryRange en src/lib/delivery.ts. */
  delivery: { between: "entre el {min} i el {max}" },
  footer: { tagline: "Teixit a mà amb molt d'afecte.", rights: "Tots els drets reservats." },
};

const en: Dict = {
  meta: {
    title: "Handmade crochet, made to order",
    description:
      "Amigurumi, bags and crochet accessories made by hand, one by one and to order. Shipping across Europe and secure payment.",
  },
  nav: { shop: "Shop", how: "How it works", faq: "FAQ" },
  hero: {
    badge: "Handmade · made to order",
    title: "Crochet with soul, made just for you",
    subtitle:
      "Every piece is crocheted by hand when you order it. No stock, no rush, and all the colour in the world.",
    cta: "See the collection",
    cta2: "How it works",
  },
  trust: [
    "100% handmade",
    "Made to order",
    "Shipping across Europe",
    "Secure payment with Stripe",
  ],
  products: {
    title: "Our pieces",
    subtitle: "Pick yours and we'll start crocheting.",
    view: "View piece",
    empty: "New pieces coming soon.",
  },
  how: {
    title: "Easy as that",
    steps: [
      { title: "Pick your piece", text: "Choose your favourite and place your order in a minute." },
      { title: "We crochet it for you", text: "We start making your piece by hand, stitch by stitch." },
      { title: "It arrives at your door", text: "We ship it carefully wrapped, ready to gift or enjoy." },
    ],
  },
  why: {
    title: "Why you'll love it",
    items: [
      { title: "Truly one of a kind", text: "No two are the same: each piece comes from hands, not a machine." },
      { title: "Soft materials", text: "Quality yarns that feel lovely and are made to last." },
      { title: "The perfect gift", text: "A present with a story, clearly made with care." },
    ],
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      { q: "How long does my order take?", a: "Every piece is made to order. Its page shows the making time; after that, delivery takes 2 to 7 days depending on the country." },
      { q: "Where do you ship?", a: "To Spain, Andorra and the whole European Union. Shipping cost is shown before you pay." },
      { q: "Can I ask for a different colour?", a: "Yes. Tell us in the order notes and we'll confirm whether it's possible." },
      { q: "Is payment secure?", a: "Payment happens on Stripe's checkout. We never see or store your card details." },
    ],
  },
  cta: {
    title: "Shall we crochet something for you?",
    text: "Pick your favourite piece and we'll start today.",
    button: "Go to the shop",
  },
  product: {
    buy: "Buy now",
    leadTime: "Made to order · ready in {days} days",
    freeShipping: "Free shipping from {amount}",
    secure: "Secure payment with Stripe",
    handmade: "Handmade, one of a kind",
    description: "Description",
    back: "Back to the shop",
    more: "You may also like",
  },
  checkout: {
    title: "Your order",
    quantity: "Quantity",
    contact: "Your details",
    name: "Full name",
    email: "Email",
    phone: "Phone",
    address: "Shipping address",
    address1: "Street and number",
    address2: "Flat, door… (optional)",
    city: "City",
    region: "Province / region",
    postal: "Postcode",
    country: "Country",
    notes: "Order notes (optional)",
    notesPlaceholder: "Preferred colour, it's a gift…",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    free: "Free",
    pay: "Continue to payment",
    payNote: "You'll pay securely on Stripe.",
    errorFields: "Please check the form, some details are missing.",
    errorGeneric: "We couldn't start the payment. Please try again.",
    errorDemo: "Shop in demo mode: connect Supabase and Stripe to accept orders.",
  },
  success: {
    title: "Thank you for your order!",
    text: "We've received your payment and we're already getting the yarn ready. We'll email you when your piece is on its way.",
    pending: "We're confirming your payment. You'll get an email as soon as it completes.",
    order: "Order no.",
    back: "Back to the shop",
  },
  /** Rango de fechas de entrega; ver formatDeliveryRange en src/lib/delivery.ts. */
  delivery: { between: "between {min} and {max}" },
  footer: { tagline: "Handmade with lots of love.", rights: "All rights reserved." },
};

const fr: Dict = {
  meta: {
    title: "Crochet fait main sur commande",
    description:
      "Amigurumis, sacs et accessoires au crochet faits main, un par un et sur commande. Livraison dans toute l'Europe et paiement sécurisé.",
  },
  nav: { shop: "Boutique", how: "Comment ça marche", faq: "Questions" },
  hero: {
    badge: "Fait main · sur commande",
    title: "Du crochet avec une âme, fait rien que pour vous",
    subtitle:
      "Chaque pièce est crochetée à la main quand vous la commandez. Pas de stock, pas de précipitation, et toutes les couleurs du monde.",
    cta: "Voir la collection",
    cta2: "Comment ça marche",
  },
  trust: [
    "100 % fait main",
    "Fabriqué sur commande",
    "Livraison dans toute l'Europe",
    "Paiement sécurisé avec Stripe",
  ],
  products: {
    title: "Nos pièces",
    subtitle: "Choisissez la vôtre et nous nous mettons au crochet.",
    view: "Voir la pièce",
    empty: "De nouvelles pièces très bientôt.",
  },
  how: {
    title: "Simple comme tout",
    steps: [
      { title: "Choisissez votre pièce", text: "Sélectionnez votre préférée et commandez en une minute." },
      { title: "Nous la crochetons pour vous", text: "Nous commençons votre pièce à la main, maille après maille." },
      { title: "Elle arrive chez vous", text: "Nous l'envoyons soigneusement emballée, prête à offrir ou à savourer." },
    ],
  },
  why: {
    title: "Pourquoi vous allez l'adorer",
    items: [
      { title: "Vraiment unique", text: "Il n'y en a pas deux pareilles : chaque pièce sort de mains, pas d'une machine." },
      { title: "Matières douces", text: "Des fils de qualité, agréables au toucher et faits pour durer." },
      { title: "Le cadeau parfait", text: "Une attention qui a une histoire, faite avec tendresse." },
    ],
  },
  faq: {
    title: "Questions fréquentes",
    items: [
      { q: "Combien de temps prend ma commande ?", a: "Chaque pièce est faite sur commande. Sa fiche indique le délai de fabrication ; ensuite, la livraison prend de 2 à 7 jours selon le pays." },
      { q: "Où livrez-vous ?", a: "En Espagne, en Andorre et dans toute l'Union européenne. Les frais de port sont indiqués avant le paiement." },
      { q: "Puis-je demander une autre couleur ?", a: "Oui. Indiquez-le dans les notes de commande et nous vous confirmerons si c'est possible." },
      { q: "Le paiement est-il sécurisé ?", a: "Le paiement se fait sur la page de Stripe. Nous ne voyons ni ne conservons jamais vos données bancaires." },
    ],
  },
  cta: {
    title: "On crochète quelque chose pour vous ?",
    text: "Choisissez votre pièce préférée et nous commençons aujourd'hui.",
    button: "Aller à la boutique",
  },
  product: {
    buy: "Acheter maintenant",
    leadTime: "Fait sur commande · prêt en {days} jours",
    freeShipping: "Livraison offerte dès {amount}",
    secure: "Paiement sécurisé avec Stripe",
    handmade: "Fait main, pièce unique",
    description: "Description",
    back: "Retour à la boutique",
    more: "Vous aimerez aussi",
  },
  checkout: {
    title: "Votre commande",
    quantity: "Quantité",
    contact: "Vos coordonnées",
    name: "Nom et prénom",
    email: "E-mail",
    phone: "Téléphone",
    address: "Adresse de livraison",
    address1: "Rue et numéro",
    address2: "Étage, porte… (facultatif)",
    city: "Ville",
    region: "Département / région",
    postal: "Code postal",
    country: "Pays",
    notes: "Notes de commande (facultatif)",
    notesPlaceholder: "Couleur préférée, c'est un cadeau…",
    subtotal: "Sous-total",
    shipping: "Livraison",
    total: "Total",
    free: "Offerte",
    pay: "Continuer vers le paiement",
    payNote: "Vous paierez en toute sécurité sur Stripe.",
    errorFields: "Vérifiez le formulaire, il manque des informations.",
    errorGeneric: "Impossible de lancer le paiement. Veuillez réessayer.",
    errorDemo: "Boutique en mode démo : connectez Supabase et Stripe pour accepter des commandes.",
  },
  success: {
    title: "Merci pour votre commande !",
    text: "Nous avons bien reçu votre paiement et préparons déjà les pelotes. Nous vous écrirons par e-mail dès que votre pièce sera en route.",
    pending: "Nous confirmons votre paiement. Vous recevrez un e-mail dès qu'il sera finalisé.",
    order: "Commande n°",
    back: "Retour à la boutique",
  },
  /** Rango de fechas de entrega; ver formatDeliveryRange en src/lib/delivery.ts. */
  delivery: { between: "entre le {min} et le {max}" },
  footer: { tagline: "Fait main avec beaucoup d'amour.", rights: "Tous droits réservés." },
};

const dicts: Record<Locale, Dict> = { es, ca, en, fr };
export const getDict = (locale: Locale) => dicts[locale];
