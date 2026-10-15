"use client";

/**
 * Idealy · Diagramas animados del proceso (4 etapas)
 * ---------------------------------------------------
 * - Next.js (App Router) + framer-motion
 * - Cada diagrama es un SVG 320×240 que llena su contenedor (aspect 4:3).
 * - La animación corre en loop solo mientras el SVG está en pantalla.
 * - Respeta prefers-reduced-motion: muestra el estado final estático.
 *
 * Uso:
 *   import { DiagnosticoDiagram } from "@/components/ProcessDiagrams";
 *   <div className="aspect-[4/3]"><DiagnosticoDiagram /></div>
 */

import { useRef } from "react";
import { motion, useInView, useReducedMotion, type Transition } from "framer-motion";

/* ---------- Tokens ---------- */
const TEAL = "#14D9C4";
const TEAL_SOFT = "rgba(20,217,196,0.16)";
const LINE = "rgba(255,255,255,0.14)";
const MUTED = "rgba(255,255,255,0.55)";
const BG = "#01131b";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/* ---------- Textos ES / EN ---------- */
const copy = {
  es: {
    d1Label: "Radar que analiza negocio, sitio y metas para generar una hoja de ruta",
    d1Nodes: ["NEGOCIO", "SITIO", "METAS"],
    d1Roadmap: "HOJA DE RUTA",
    d1Foot: "20 MIN · $0 MXN",
    d2Label: "Prototipo navegable: un cursor recorre tres pantallas conectadas",
    d2Screens: ["INICIO", "SERVICIOS", "CONTACTO"],
    d3Label: "Desarrollo por entregas: cuatro entregas semanales en una línea de tiempo",
    d3Week: "SEM",
    d3Cmd: "$ git push → demo semanal",
    d4Label: "Lanzamiento: sitio en vivo con SSL y gráfica de prospectos en crecimiento",
    d4Live: "EN VIVO",
    d4Leads: "+ PROSPECTOS",
  },
  en: {
    d1Label: "Radar scanning business, website and goals to produce a roadmap",
    d1Nodes: ["BUSINESS", "WEBSITE", "GOALS"],
    d1Roadmap: "ROADMAP",
    d1Foot: "20 MIN · $0 USD",
    d2Label: "Clickable prototype: a cursor moves through three connected screens",
    d2Screens: ["HOME", "SERVICES", "CONTACT"],
    d3Label: "Milestone development: four weekly releases on a timeline",
    d3Week: "WK",
    d3Cmd: "$ git push → weekly demo",
    d4Label: "Launch: live site with SSL and a growing leads chart",
    d4Live: "LIVE",
    d4Leads: "+ LEADS",
  },
};
type DiagramProps = { locale?: string };
const t = (locale?: string) => (locale === "en" ? copy.en : copy.es);

/* ---------- Helpers ---------- */
function usePlay() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const reduce = useReducedMotion();
  return { ref, play: inView && !reduce };
}

/** Transición en loop sincronizada (todas comparten duración y usan `times`). */
const loop = (play: boolean, duration: number, times: number[], ease: Transition["ease"] = "easeInOut"): Transition =>
  play ? { duration, times, repeat: Infinity, ease } : { duration: 0.3 };

/** Aparece entre `on` y `full`, se mantiene y se apaga al final del ciclo. */
const show = (on: number, full: number, end = 0.9) => ({
  values: [0, 0, 1, 1, 0],
  times: [0, on, full, end, 1],
});

/** Pulso infinito (anillo que crece y se desvanece). */
function Pulse({ cx, cy, play, delay = 0, r = 5 }: { cx: number; cy: number; play: boolean; delay?: number; r?: number }) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      stroke={TEAL}
      strokeWidth={1.2}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
      animate={play ? { scale: [1, 2.8], opacity: [0.7, 0] } : { opacity: 0 }}
      transition={play ? { duration: 1.6, repeat: Infinity, delay, ease: "easeOut" } : { duration: 0.2 }}
    />
  );
}

const svgProps = {
  viewBox: "0 0 320 240",
  fill: "none",
  role: "img",
  className: "h-full w-full",
} as const;

/* =========================================================
   01 · DIAGNÓSTICO — radar que detecta negocio/sitio/metas
   y las convierte en una hoja de ruta con checks
   ========================================================= */
export function DiagnosticoDiagram({ locale }: DiagramProps) {
  const { ref, play } = usePlay();
  const tx = t(locale);
  const D = 6;
  const cx = 95;
  const cy = 120;
  const nodes = [
    { x: 72, y: 76, label: tx.d1Nodes[0] },
    { x: 140, y: 140, label: tx.d1Nodes[1] },
    { x: 58, y: 164, label: tx.d1Nodes[2] },
  ];
  const rows = [100, 130, 160];

  return (
    <svg ref={ref} {...svgProps} aria-label={tx.d1Label}>
      {/* Radar */}
      {[28, 54, 80].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} stroke={LINE} />
      ))}
      <line x1={cx - 80} y1={cy} x2={cx + 80} y2={cy} stroke={LINE} />
      <line x1={cx} y1={cy - 80} x2={cx} y2={cy + 80} stroke={LINE} />

      <motion.g
        style={{ transformBox: "view-box", transformOrigin: `${cx}px ${cy}px` }}
        animate={play ? { rotate: 360 } : { rotate: 0 }}
        transition={play ? { duration: 3, repeat: Infinity, ease: "linear" } : { duration: 0 }}
      >
        <path d={`M${cx} ${cy} L${cx + 80} ${cy} A80 80 0 0 0 151.57 63.43 Z`} fill={TEAL} fillOpacity={0.12} />
        <line x1={cx} y1={cy} x2={cx + 80} y2={cy} stroke={TEAL} strokeWidth={1.5} />
      </motion.g>
      <circle cx={cx} cy={cy} r={3} fill={TEAL} />

      {/* Conexiones nodo → hoja de ruta */}
      {nodes.map((n, i) => {
        const s = show(0.42 + i * 0.07, 0.52 + i * 0.07);
        const ty = rows[i];
        const mx = (n.x + 200) / 2;
        return (
          <motion.path
            key={`c-${n.label}`}
            d={`M${n.x} ${n.y} C ${mx} ${n.y}, ${mx} ${ty}, 200 ${ty}`}
            stroke={TEAL}
            strokeOpacity={0.45}
            strokeWidth={1}
            animate={play ? { pathLength: s.values } : { pathLength: 1 }}
            transition={loop(play, D, s.times)}
          />
        );
      })}

      {/* Nodos detectados */}
      {nodes.map((n, i) => {
        const s = show(0.1 + i * 0.1, 0.16 + i * 0.1);
        return (
          <motion.g key={n.label} animate={play ? { opacity: s.values } : { opacity: 1 }} transition={loop(play, D, s.times)}>
            <Pulse cx={n.x} cy={n.y} play={play} delay={i * 0.4} />
            <circle cx={n.x} cy={n.y} r={5} fill={TEAL} />
            <text x={n.x} y={n.y - 11} textAnchor="middle" fontFamily={MONO} fontSize={8} fill={MUTED} letterSpacing={1}>
              {n.label}
            </text>
          </motion.g>
        );
      })}

      {/* Hoja de ruta */}
      <rect x={200} y={50} width={100} height={140} rx={12} fill={BG} stroke={LINE} />
      <text x={212} y={72} fontFamily={MONO} fontSize={8} fill={TEAL} letterSpacing={1}>
        {tx.d1Roadmap}
      </text>
      <line x1={212} y1={80} x2={288} y2={80} stroke={LINE} />
      {rows.map((y, i) => {
        const s = show(0.6 + i * 0.08, 0.68 + i * 0.08);
        return (
          <g key={y}>
            <rect x={212} y={y - 7} width={14} height={14} rx={3} stroke={LINE} />
            <motion.path
              d={`M215.5 ${y} L218.5 ${y + 3} L223 ${y - 3.5}`}
              stroke={TEAL}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={play ? { pathLength: s.values } : { pathLength: 1 }}
              transition={loop(play, D, s.times)}
            />
            <rect x={234} y={y - 3} width={54 - i * 12} height={6} rx={3} fill={LINE} />
          </g>
        );
      })}

      <text x={20} y={226} fontFamily={MONO} fontSize={9} fill={TEAL} letterSpacing={1}>
        {tx.d1Foot}
      </text>
    </svg>
  );
}

/* =========================================================
   02 · PROTOTIPO — cursor que navega 3 pantallas wireframe
   ========================================================= */
export function PrototipoDiagram({ locale }: DiagramProps) {
  const { ref, play } = usePlay();
  const tx = t(locale);
  const D = 7;
  const screens = [
    { x: 20, label: tx.d2Screens[0] },
    { x: 125, label: tx.d2Screens[1] },
    { x: 230, label: tx.d2Screens[2] },
  ];
  const highlight = [
    { values: [0, 0, 1, 1, 0, 0], times: [0, 0.04, 0.08, 0.26, 0.3, 1] },
    { values: [0, 0, 1, 1, 0, 0], times: [0, 0.3, 0.34, 0.56, 0.6, 1] },
    { values: [0, 0, 1, 1, 0, 0], times: [0, 0.62, 0.66, 0.88, 0.92, 1] },
  ];
  const arrows = [show(0.24, 0.32), show(0.54, 0.62)];
  const clicks = [
    { cx: 55, times: [0, 0.16, 0.18, 0.26, 1] },
    { cx: 160, times: [0, 0.46, 0.48, 0.56, 1] },
  ];

  return (
    <svg ref={ref} {...svgProps} aria-label={tx.d2Label}>
      {screens.map((s, i) => (
        <g key={s.label}>
          <rect x={s.x} y={50} width={70} height={130} rx={10} fill={BG} stroke={LINE} />
          <motion.rect
            x={s.x}
            y={50}
            width={70}
            height={130}
            rx={10}
            stroke={TEAL}
            strokeWidth={1.5}
            animate={play ? { opacity: highlight[i].values } : { opacity: i === 0 ? 1 : 0 }}
            transition={loop(play, D, highlight[i].times)}
          />
          {/* Contenido wireframe */}
          <rect x={s.x + 8} y={62} width={26} height={5} rx={2.5} fill={LINE} />
          <rect x={s.x + 8} y={76} width={54} height={34} rx={6} fill={TEAL_SOFT} />
          <rect x={s.x + 8} y={118} width={54} height={5} rx={2.5} fill={LINE} />
          <rect x={s.x + 8} y={128} width={38} height={5} rx={2.5} fill={LINE} />
          <rect x={s.x + 8} y={150} width={54} height={16} rx={8} stroke={TEAL} strokeOpacity={0.7} />
          <text x={s.x + 35} y={196} textAnchor="middle" fontFamily={MONO} fontSize={8} fill={MUTED} letterSpacing={1}>
            {s.label}
          </text>
        </g>
      ))}

      {/* Flechas de flujo */}
      {[92, 197].map((x, i) => (
        <g key={x}>
          <motion.path
            d={`M${x} 112 C ${x + 10} 96, ${x + 21} 96, ${x + 31} 112`}
            stroke={TEAL}
            strokeWidth={1.5}
            strokeLinecap="round"
            animate={play ? { pathLength: arrows[i].values } : { pathLength: 1 }}
            transition={loop(play, D, arrows[i].times)}
          />
          <motion.path
            d={`M${x + 26} 109 L${x + 31} 112 L${x + 32} 106`}
            stroke={TEAL}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={play ? { opacity: arrows[i].values } : { opacity: 1 }}
            transition={loop(play, D, arrows[i].times)}
          />
        </g>
      ))}

      {/* Ondas de clic */}
      {clicks.map((c) => (
        <motion.circle
          key={c.cx}
          cx={c.cx}
          cy={158}
          r={10}
          stroke={TEAL}
          strokeWidth={1.5}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={play ? { opacity: [0, 0, 0.9, 0, 0], scale: [0.3, 0.3, 0.4, 1.8, 1.8] } : { opacity: 0 }}
          transition={loop(play, D, c.times, "easeOut")}
        />
      ))}

      {/* Cursor */}
      <motion.g
        animate={
          play
            ? { x: [200, 52, 52, 157, 157, 255, 200], y: [218, 156, 156, 156, 156, 218, 218] }
            : { x: 52, y: 156 }
        }
        transition={loop(play, D, [0, 0.14, 0.26, 0.42, 0.56, 0.78, 1])}
      >
        <path
          d="M0 0 L0 16 L4.5 12 L8 19 L10.5 18 L7 11 L13 11 Z"
          fill="#fff"
          stroke={BG}
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
      </motion.g>
    </svg>
  );
}

/* =========================================================
   03 · DESARROLLO — línea de commits con entregas semanales
   ========================================================= */
export function DesarrolloDiagram({ locale }: DiagramProps) {
  const { ref, play } = usePlay();
  const tx = t(locale);
  const D = 8;
  const commits = [60, 130, 200, 270];
  // Momento (0–1) en que la línea principal llega a cada commit
  const at = commits.map((x) => 0.05 + ((x - 24) / 272) * 0.75);

  return (
    <svg ref={ref} {...svgProps} aria-label={tx.d3Label}>
      <text x={24} y={40} fontFamily={MONO} fontSize={8} fill={MUTED} letterSpacing={1}>
        MAIN
      </text>

      {/* Ramas de trabajo entre entregas */}
      {commits.slice(0, -1).map((x, i) => {
        const s = show(at[i] + 0.01, at[i + 1] - 0.02);
        return (
          <motion.path
            key={`b-${x}`}
            d={`M${x} 115 C ${x + 14} 72, ${x + 56} 72, ${x + 70} 115`}
            stroke={TEAL}
            strokeOpacity={0.4}
            strokeWidth={1.2}
            animate={play ? { pathLength: s.values } : { pathLength: 1 }}
            transition={loop(play, D, s.times)}
          />
        );
      })}

      {/* Línea principal */}
      <line x1={24} y1={115} x2={296} y2={115} stroke={LINE} strokeWidth={2} />
      <motion.path
        d="M24 115 H296"
        stroke={TEAL}
        strokeWidth={2}
        animate={play ? { pathLength: [0, 0, 1, 1, 0] } : { pathLength: 1 }}
        transition={loop(play, D, [0, 0.05, 0.8, 0.92, 1], "linear")}
      />

      {/* Commits / entregas */}
      {commits.map((x, i) => {
        const s = show(at[i], at[i] + 0.03, 0.92);
        return (
          <g key={x}>
            <circle cx={x} cy={115} r={7} fill={BG} stroke={TEAL} strokeOpacity={0.5} strokeWidth={1.5} />
            <motion.g animate={play ? { opacity: s.values } : { opacity: 1 }} transition={loop(play, D, s.times)}>
              <Pulse cx={x} cy={115} r={7} play={play} delay={i * 0.4} />
              <circle cx={x} cy={115} r={4} fill={TEAL} />
            </motion.g>
            <text x={x} y={140} textAnchor="middle" fontFamily={MONO} fontSize={8} fill={MUTED} letterSpacing={1}>
              {tx.d3Week} {i + 1}
            </text>
          </g>
        );
      })}

      {/* Barra de progreso escalonada */}
      <rect x={24} y={164} width={272} height={6} rx={3} fill={LINE} />
      <motion.rect
        x={24}
        y={164}
        width={272}
        height={6}
        rx={3}
        fill={TEAL}
        style={{ transformBox: "fill-box", transformOrigin: "left center" }}
        animate={
          play
            ? { scaleX: [0, 0, 0.25, 0.25, 0.5, 0.5, 0.75, 0.75, 1, 1, 0] }
            : { scaleX: 1 }
        }
        transition={loop(play, D, [
          0, at[0], at[0] + 0.03, at[1], at[1] + 0.03, at[2], at[2] + 0.03, at[3], at[3] + 0.03, 0.92, 1,
        ])}
      />

      {/* Terminal */}
      <text x={24} y={208} fontFamily={MONO} fontSize={10} fill={TEAL}>
        {tx.d3Cmd}{" "}
        <motion.tspan
          animate={play ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }}
          transition={play ? { duration: 1, times: [0, 0.5, 0.5, 1], repeat: Infinity } : { duration: 0 }}
        >
          ▍
        </motion.tspan>
      </text>
    </svg>
  );
}

/* =========================================================
   04 · LANZAMIENTO — gráfica ascendente + pulso de uptime
   ========================================================= */
export function LanzamientoDiagram({ locale }: DiagramProps) {
  const { ref, play } = usePlay();
  const tx = t(locale);
  const D = 6;
  const line = "M28 178 L78 166 L128 150 L178 124 L228 98 L290 54";
  const end = show(0.55, 0.6);

  return (
    <svg ref={ref} {...svgProps} aria-label={tx.d4Label}>
      <defs>
        <linearGradient id="lz-area" x1="0" y1="54" x2="0" y2="182" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={TEAL} stopOpacity={0.35} />
          <stop offset="1" stopColor={TEAL} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Badges */}
      <rect x={24} y={20} width={66} height={18} rx={9} stroke={TEAL_SOFT} />
      <Pulse cx={36} cy={29} r={3} play={play} />
      <circle cx={36} cy={29} r={3} fill={TEAL} />
      <text x={45} y={32} fontFamily={MONO} fontSize={8} fill={TEAL} letterSpacing={1}>
        {tx.d4Live}
      </text>
      <rect x={226} y={20} width={70} height={18} rx={9} stroke={LINE} />
      <text x={261} y={32} textAnchor="middle" fontFamily={MONO} fontSize={8} fill={MUTED} letterSpacing={1}>
        SSL · 24/7
      </text>

      {/* Retícula */}
      {[60, 100, 140, 180].map((y) => (
        <line key={y} x1={24} y1={y} x2={296} y2={y} stroke={LINE} strokeDasharray="2 5" />
      ))}

      {/* Área + línea */}
      <motion.path
        d={`${line} L290 182 L28 182 Z`}
        fill="url(#lz-area)"
        animate={play ? { opacity: [0, 0, 0, 1, 1, 0] } : { opacity: 1 }}
        transition={loop(play, D, [0, 0.05, 0.45, 0.62, 0.9, 1])}
      />
      <motion.path
        d={line}
        stroke={TEAL}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={play ? { pathLength: [0, 0, 1, 1, 0] } : { pathLength: 1 }}
        transition={loop(play, D, [0, 0.05, 0.55, 0.9, 1])}
      />

      {/* Punto final + etiqueta */}
      <motion.g animate={play ? { opacity: end.values } : { opacity: 1 }} transition={loop(play, D, end.times)}>
        <Pulse cx={290} cy={54} play={play} />
        <circle cx={290} cy={54} r={5} fill={TEAL} />
        <text x={280} y={46} textAnchor="end" fontFamily={MONO} fontSize={9} fill="#fff" letterSpacing={1}>
          {tx.d4Leads}
        </text>
      </motion.g>

      {/* Pulso de uptime */}
      <path d="M24 214 H120 L128 202 L136 226 L144 208 L150 214 H296" stroke={LINE} strokeWidth={1.5} />
      <motion.path
        d="M24 214 H120 L128 202 L136 226 L144 208 L150 214 H296"
        stroke={TEAL}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="50 400"
        animate={play ? { strokeDashoffset: [50, -310] } : { strokeDashoffset: -110 }}
        transition={play ? { duration: 2.4, repeat: Infinity, ease: "linear" } : { duration: 0 }}
      />
    </svg>
  );
}

/* ---------- Mapa por etapa (para usar en ProcessCards) ---------- */
export const processDiagrams = {
  "01": DiagnosticoDiagram,
  "02": PrototipoDiagram,
  "03": DesarrolloDiagram,
  "04": LanzamientoDiagram,
} as const;

/** Uso directo en JSX: <ProcessDiagram step="01" locale="es" /> */
export function ProcessDiagram({ step, locale }: { step: string; locale?: string }) {
  const Diagram = processDiagrams[step as keyof typeof processDiagrams];
  return Diagram ? <Diagram locale={locale} /> : null;
}