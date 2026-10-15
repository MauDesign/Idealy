export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  image: string;
  alt: string;
  challenge: string;
  solution: string;
  result: string;
  link?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "wise",
    title: "Wise Facturación",
    category: "SaaS · Facturación electrónica",
    image: "/img/wise-case.webp",
    alt: "Panel de Wise Facturación con facturas electrónicas emitidas.",
    challenge: "Facturar CFDI 4.0 sin complicaciones para PyMEs.",
    solution: "Plataforma web propia, diseñada y operada por Idealy.",
    result: "+50,000 CFDI emitidos y alta disponibilidad 24/7.",
    link: "https://wisefacturacion.com"
  },
  {
    id: "orbeo",
    title: "Orbeo",
    category: "Agritech · Trazabilidad",
    image: "/img/orbeo-case.webp",
    alt: "Plataforma Orbeo con el historial de trazabilidad de un animal.",
    challenge: "Saber el historial de cada animal, del rancho al comprador.",
    solution: "Plataforma de trazabilidad ganadera.",
    result: "Control integral de inventario y trazabilidad desde el primer día."
  },
  {
    id: "mar-holidays",
    title: "Mar Holidays",
    category: "Turismo · Portal B2B",
    image: "/img/mar-holidays-case.webp",
    alt: "Portal B2B de Mar Holidays desarrollado por Idea.ly.",
    challenge: "Centralizar convenios de hospedaje y traslados turísticos en un solo canal B2B.",
    solution: "Portal web de reservaciones B2B diseñado a la medida.",
    result: "Gestión unificada de agencias y 70% menos tiempo en reservas."
  },
  {
    id: "padelpals",
    title: "PadelPals",
    category: "App móvil · Deporte",
    image: "/img/padel-case.webp",
    alt: "App PadelPals con marcador de partido y perfil de jugador.",
    challenge: "Llevar el marcador y los partidos de jugadores de pádel sin fricción.",
    solution: "App móvil con diseño UX intuitivo y dinámico.",
    result: "Experiencia ágil en cancha con seguimiento en vivo de estadísticas."
  }
];
