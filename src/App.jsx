import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   ATHENAS PDA — Plano de Ação Gamificado
   Design: Refined minimal · Navy + Cyan on white
   ═══════════════════════════════════════════════════════════ */

const C = {
  navy: "#021852",
  cyan: "#02BBF1",
  gray: "#404040",
  light: "#F6F7FA",
  silver: "#ADADAF",
  white: "#FFFFFF",
  cyanSoft: "#E8F8FE",
  navyFade: "rgba(2,24,82,0.06)",
  success: "#00C853",
  warn: "#FF9100",
};

const FONT = `'DM Sans', system-ui, sans-serif`;
const FONT_DISPLAY = `'Playfair Display', Georgia, serif`;

// ── Persistence ─────────────────────────────────────────────
function usePersistedState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(`athenas_${key}`);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(`athenas_${key}`, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

// ── Data ────────────────────────────────────────────────────
const MONTHS = [
  { m: "Mar", full: "Março", target: 10000, clients: 4, newClients: 3 },
  { m: "Abr", full: "Abril", target: 15000, clients: 6, newClients: 3 },
  { m: "Mai", full: "Maio", target: 20000, clients: 8, newClients: 3 },
  { m: "Jun", full: "Junho", target: 25000, clients: 10, newClients: 3 },
  { m: "Jul", full: "Julho", target: 30000, clients: 11, newClients: 2 },
  { m: "Ago", full: "Agosto", target: 35000, clients: 12, newClients: 2 },
  { m: "Set", full: "Setembro", target: 38000, clients: 13, newClients: 2 },
  { m: "Out", full: "Outubro", target: 42000, clients: 14, newClients: 2 },
  { m: "Nov", full: "Novembro", target: 46000, clients: 15, newClients: 2 },
  { m: "Dez", full: "Dezembro", target: 50000, clients: 16, newClients: 2 },
];

const ACTIONS = [
  { id: "w1", text: "Criar/otimizar campanha de tráfego", area: "Tráfego", pts: 5, icon: "📡" },
  { id: "w2", text: "Analisar métricas da LP", area: "Análise", pts: 5, icon: "📊" },
  { id: "w3", text: "Gerar mínimo 5 leads qualificados", area: "Leads", pts: 20, icon: "🎯" },
  { id: "w4", text: "Realizar 2+ reuniões de vendas", area: "Comercial", pts: 10, icon: "🤝" },
  { id: "w5", text: "Enviar 2+ propostas", area: "Comercial", pts: 15, icon: "📄" },
  { id: "w6", text: "Follow-up em todos os leads", area: "Comercial", pts: 5, icon: "📞" },
  { id: "w7", text: "Postar 3+ conteúdos nas redes", area: "Marketing", pts: 5, icon: "📱" },
  { id: "w8", text: "Entregar relatórios aos clientes", area: "Entrega", pts: 5, icon: "📈" },
  { id: "w9", text: "Revisar metas no PDA", area: "Gestão", pts: 5, icon: "🧭" },
];

const STRATEGIC = {
  "Fundação": {
    emoji: "🏗️", period: "Março 2026",
    items: [
      { id: "s1", text: "Lançar LP com tráfego pago", resp: "Tráfego", prio: "alta", pts: 50 },
      { id: "s2", text: "Configurar funil de vendas", resp: "Comercial", prio: "alta", pts: 30 },
      { id: "s3", text: "Criar kit de proposta comercial", resp: "Design", prio: "alta", pts: 20 },
      { id: "s4", text: "Fechar lead de R$ 1.500", resp: "Comercial", prio: "alta", pts: 50 },
      { id: "s5", text: "Criar portfólio/case do 1º cliente", resp: "Design", prio: "média", pts: 15 },
      { id: "s6", text: "Configurar CRM básico", resp: "Comercial", prio: "média", pts: 15 },
      { id: "s7", text: "Definir script de vendas", resp: "Comercial", prio: "média", pts: 15 },
      { id: "s8", text: "Perfis otimizados Instagram/LinkedIn", resp: "Design", prio: "baixa", pts: 10 },
      { id: "s9", text: "Estruturar onboarding do cliente", resp: "Tráfego", prio: "baixa", pts: 10 },
    ],
  },
  "Crescimento": {
    emoji: "📈", period: "Abril – Junho",
    items: [
      { id: "s10", text: "Escalar tráfego pago (2x budget)", resp: "Tráfego", prio: "alta", pts: 30 },
      { id: "s11", text: "Programa de indicação com clientes", resp: "Comercial", prio: "alta", pts: 25 },
      { id: "s12", text: "Fechar 3 novos clientes/mês", resp: "Comercial", prio: "alta", pts: 50 },
      { id: "s13", text: "Criar 3+ cases de sucesso", resp: "Design", prio: "média", pts: 20 },
      { id: "s14", text: "Estratégia de conteúdo orgânico", resp: "Design", prio: "média", pts: 15 },
      { id: "s15", text: "Testar Google Ads", resp: "Tráfego", prio: "média", pts: 15 },
      { id: "s16", text: "Propor upsell para planos maiores", resp: "Comercial", prio: "média", pts: 30 },
      { id: "s17", text: "Automatizar relatórios mensais", resp: "Tráfego", prio: "baixa", pts: 10 },
      { id: "s18", text: "2 eventos de networking/mês", resp: "Comercial", prio: "baixa", pts: 10 },
    ],
  },
  "Escala": {
    emoji: "🔥", period: "Julho – Dezembro",
    items: [
      { id: "s19", text: "Migrar clientes p/ planos 3-5", resp: "Comercial", prio: "alta", pts: 50 },
      { id: "s20", text: "Contratar freelancer/estagiário", resp: "Gestão", prio: "alta", pts: 25 },
      { id: "s21", text: "Manter churn abaixo de 10%", resp: "Todos", prio: "alta", pts: 50 },
      { id: "s22", text: "Pacote premium foto + vídeo", resp: "Design", prio: "média", pts: 20 },
      { id: "s23", text: "Implementar NPS mensal", resp: "Comercial", prio: "média", pts: 15 },
      { id: "s24", text: "Parcerias com 2+ empresas", resp: "Comercial", prio: "média", pts: 20 },
      { id: "s25", text: "Webinar/workshop mensal gratuito", resp: "Tráfego", prio: "média", pts: 15 },
      { id: "s26", text: "Criar site institucional", resp: "Design", prio: "baixa", pts: 10 },
      { id: "s27", text: "Processos p/ escalar 20+ clientes", resp: "Gestão", prio: "baixa", pts: 15 },
    ],
  },
};

const LEVELS = [
  { name: "Bronze", min: 0, icon: "🥉" },
  { name: "Prata", min: 200, icon: "🥈" },
  { name: "Ouro", min: 500, icon: "🥇" },
  { name: "Diamante", min: 1000, icon: "💎" },
  { name: "Lendário", min: 2000, icon: "👑" },
];

function getLevel(pts) {
  let lvl = LEVELS[0];
  for (const l of LEVELS) if (pts >= l.min) lvl = l;
  return lvl;
}
function getNextLevel(pts) {
  for (const l of LEVELS) if (pts < l.min) return l;
  return null;
}

// ── Particle burst (canvas) ─────────────────────────────────
function ParticleBurst({ x, y, onDone }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 140, H = 140;
    canvas.width = W; canvas.height = H;
    const colors = [C.cyan, C.navy, "#FFD700", C.success, "#E040FB", "#FF6B6B", "#00E5FF"];
    const particles = Array.from({ length: 18 }, () => ({
      x: W / 2, y: H / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10 - 3,
      r: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      shape: Math.random() > 0.5 ? "circle" : "rect",
    }));
    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        p.vx *= 0.98;
        p.life -= 0.022;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        const s = p.r * p.life;
        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(p.x - s, p.y - s, s * 2, s * 2);
        }
      }
      if (alive) frame = requestAnimationFrame(draw);
      else onDone();
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", left: x - 70, top: y - 70,
      width: 140, height: 140, pointerEvents: "none", zIndex: 9999,
    }} />
  );
}

// ── Score popup ─────────────────────────────────────────────
function ScorePopup({ x, y, pts, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 900);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position: "fixed", left: x - 30, top: y - 20,
      fontFamily: FONT, fontWeight: 800, fontSize: 18,
      color: C.cyan, pointerEvents: "none", zIndex: 9999,
      animation: "scoreUp 0.9s ease-out forwards",
      textShadow: `0 0 12px ${C.cyan}66`,
    }}>
      +{pts}
    </div>
  );
}

// ── Animated check ──────────────────────────────────────────
function AnimatedCheck({ checked, onToggle, pts }) {
  const ref = useRef(null);
  const [burst, setBurst] = useState(null);
  const [popup, setPopup] = useState(null);

  const handleClick = () => {
    if (!checked) {
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setBurst({ x: cx, y: cy, key: Date.now() });
      setPopup({ x: cx + 24, y: cy - 14, key: Date.now() + 1 });
    }
    onToggle();
  };

  return (
    <>
      <button ref={ref} onClick={handleClick} style={{
        width: 30, height: 30, borderRadius: 9,
        border: checked ? "none" : `2px solid ${C.silver}44`,
        background: checked ? `linear-gradient(135deg, ${C.cyan}, ${C.navy})` : C.white,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        flexShrink: 0,
        boxShadow: checked ? `0 3px 14px ${C.cyan}40` : `0 1px 3px rgba(0,0,0,0.04)`,
      }}>
        {checked && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{ animation: "checkPop 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <path d="M2 7.5L5.5 11L12 3" stroke="white" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 20, animation: "drawLine 0.35s ease-out" }} />
          </svg>
        )}
      </button>
      {burst && <ParticleBurst x={burst.x} y={burst.y} onDone={() => setBurst(null)} />}
      {popup && <ScorePopup x={popup.x} y={popup.y} pts={pts} onDone={() => setPopup(null)} />}
    </>
  );
}

// ── Progress ring ───────────────────────────────────────────
function ProgressRing({ pct, size = 80, stroke = 5, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(pct, 1));
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.cyan} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.34,1.2,0.64,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

// ── Mini bar ────────────────────────────────────────────────
function MiniBar({ pct, height = 4, bg }) {
  return (
    <div style={{ width: "100%", height, borderRadius: height, background: bg || C.navyFade, overflow: "hidden" }}>
      <div style={{
        height: "100%", borderRadius: height,
        width: `${Math.min(pct * 100, 100)}%`,
        background: `linear-gradient(90deg, ${C.cyan}, ${C.navy})`,
        transition: "width 1s cubic-bezier(0.34,1.2,0.64,1)",
      }} />
    </div>
  );
}

// ── Priority dot ────────────────────────────────────────────
function PrioDot({ prio }) {
  const color = prio === "alta" ? "#FF5252" : prio === "média" ? C.warn : C.silver;
  return <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />;
}

// ── Tabs ────────────────────────────────────────────────────
const TABS = [
  { id: "home", label: "Home", icon: "⚡" },
  { id: "weekly", label: "Semanal", icon: "✅" },
  { id: "strategy", label: "Plano", icon: "🗺️" },
  { id: "funnel", label: "Funil", icon: "🔄" },
  { id: "rank", label: "Ranking", icon: "🏆" },
];

const STAGES = [
  { id: "lead frio", label: "Frio", color: C.silver },
  { id: "qualificado", label: "Qualific.", color: C.warn },
  { id: "reunião", label: "Reunião", color: C.cyan },
  { id: "proposta", label: "Proposta", color: C.navy },
  { id: "negociação", label: "Negoc.", color: "#E040FB" },
  { id: "fechado", label: "Fechado", color: C.success },
  { id: "perdido", label: "Perdido", color: "#FF5252" },
];

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("home");
  const [checks, setChecks] = usePersistedState("checks", {});
  const [monthData, setMonthData] = usePersistedState("months",
    MONTHS.map((_, i) => ({ revenue: i === 0 ? 2000 : 0, clients: i === 0 ? 1 : 0 }))
  );
  const [leads, setLeads] = usePersistedState("leads", [
    { id: 1, name: "Lead R$ 1.500", stage: "negociação", value: 1500, note: "Lead quente" },
  ]);
  const [editMonth, setEditMonth] = useState(null);
  const [newLead, setNewLead] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  const toggle = useCallback((id) => {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // ── Calculate points ──────────────────────────────────────
  const allItems = [...ACTIONS, ...Object.values(STRATEGIC).flatMap(p => p.items)];
  const totalPts = allItems.filter(a => checks[a.id]).reduce((s, a) => s + a.pts, 0);
  const weeklyDone = ACTIONS.filter(a => checks[a.id]).length;
  const weeklyPts = ACTIONS.filter(a => checks[a.id]).reduce((s, a) => s + a.pts, 0);
  const stratItems = Object.values(STRATEGIC).flatMap(p => p.items);
  const stratDone = stratItems.filter(a => checks[a.id]).length;
  const level = getLevel(totalPts);
  const nextLevel = getNextLevel(totalPts);
  const currentRevenue = monthData.reduce((max, m) => m.revenue > 0 ? m.revenue : max, 0) || monthData[0].revenue;

  // ── Shared styles ─────────────────────────────────────────
  const card = {
    background: C.white, borderRadius: 16, padding: "16px",
    margin: "0 16px 10px",
    boxShadow: "0 1px 4px rgba(2,24,82,0.05)",
  };
  const sLabel = {
    fontFamily: FONT, fontSize: 10, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: 1.8,
    color: C.silver, margin: "20px 16px 8px",
  };

  // ── HOME ──────────────────────────────────────────────────
  const renderHome = () => (
    <div>
      <div style={{
        background: `linear-gradient(160deg, ${C.navy} 0%, #0D347A 100%)`,
        padding: "40px 20px 28px", borderRadius: "0 0 32px 32px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "rgba(2,187,241,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>⚡</div>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, color: C.white }}>Athenas</div>
            <div style={{ fontSize: 10, color: `${C.cyan}cc`, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 600 }}>
              Plano de Ação 2026
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div style={{
              background: "rgba(2,187,241,0.15)", borderRadius: 10, padding: "6px 12px",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ fontSize: 14 }}>{level.icon}</span>
              <span style={{ fontSize: 11, color: C.cyan, fontWeight: 700 }}>{totalPts} pts</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 6, letterSpacing: 1 }}>
              FATURAMENTO ATUAL
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, fontWeight: 700, color: C.white, lineHeight: 1 }}>
              R$ {currentRevenue.toLocaleString("pt-BR")}
            </div>
            <div style={{ fontSize: 12, color: C.cyan, marginTop: 6, fontWeight: 500 }}>
              Meta: R$ 50.000/mês
            </div>
          </div>
          <ProgressRing pct={currentRevenue / 50000} size={76}>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 16, color: C.white }}>
              {Math.round((currentRevenue / 50000) * 100)}%
            </span>
          </ProgressRing>
        </div>

        <div style={{ marginTop: 16 }}>
          <MiniBar pct={currentRevenue / 50000} height={5} bg="rgba(255,255,255,0.1)" />
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, margin: "16px 16px 4px" }}>
        {[
          { label: "Nível", value: `${level.icon} ${level.name}`, color: C.navy },
          { label: "Clientes", value: monthData.reduce((max, m) => Math.max(max, m.clients), 0), color: C.navy },
          { label: "Ações feitas", value: `${weeklyDone + stratDone}`, color: C.cyan },
        ].map((s, i) => (
          <div key={i} style={{ ...card, margin: 0, padding: "14px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.silver, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Monthly roadmap */}
      <div style={sLabel}>Roadmap mensal</div>
      <div style={card}>
        {MONTHS.map((m, i) => {
          const rev = monthData[i].revenue;
          const pct = m.target > 0 ? rev / m.target : 0;
          const done = pct >= 1;
          return (
            <div key={m.m} onClick={() => setEditMonth(editMonth === i ? null : i)} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 0", cursor: "pointer",
              borderBottom: i < MONTHS.length - 1 ? `1px solid ${C.light}` : "none",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: done ? `linear-gradient(135deg, ${C.cyan}, ${C.navy})` : C.light,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: done ? 14 : 11, fontWeight: 700,
                color: done ? C.white : C.navy,
                transition: "all 0.4s ease",
              }}>
                {done ? "✓" : m.m}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>R$ {m.target.toLocaleString("pt-BR")}</span>
                  <span style={{ fontSize: 11, color: C.silver }}>{m.clients} clientes</span>
                </div>
                <MiniBar pct={pct} />
                {rev > 0 && (
                  <div style={{ fontSize: 10, color: C.cyan, marginTop: 3, fontWeight: 600 }}>
                    R$ {rev.toLocaleString("pt-BR")} realizado
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit month modal */}
      {editMonth !== null && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(2,24,82,0.5)",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          zIndex: 200, animation: "fadeIn 0.2s ease",
        }} onClick={(e) => { if (e.target === e.currentTarget) setEditMonth(null); }}>
          <div style={{
            background: C.white, borderRadius: "24px 24px 0 0",
            padding: "24px 20px 36px", width: "100%", maxWidth: 430,
            animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: C.navyFade, margin: "0 auto 16px" }} />
            <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 16 }}>
              {MONTHS[editMonth].full} 2026
            </div>
            <label style={{ fontSize: 11, color: C.silver, display: "block", marginBottom: 4, letterSpacing: 1 }}>
              FATURAMENTO REAL (R$)
            </label>
            <input
              type="number"
              value={monthData[editMonth].revenue || ""}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setMonthData(prev => prev.map((m, i) => i === editMonth ? { ...m, revenue: val } : m));
              }}
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 12,
                border: `2px solid ${C.light}`, fontFamily: FONT, fontSize: 18, fontWeight: 700,
                outline: "none", marginBottom: 12, color: C.navy, background: C.light,
              }}
              onFocus={(e) => e.target.style.borderColor = C.cyan}
              onBlur={(e) => e.target.style.borderColor = C.light}
            />
            <label style={{ fontSize: 11, color: C.silver, display: "block", marginBottom: 4, letterSpacing: 1 }}>
              CLIENTES ATIVOS
            </label>
            <input
              type="number"
              value={monthData[editMonth].clients || ""}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setMonthData(prev => prev.map((m, i) => i === editMonth ? { ...m, clients: val } : m));
              }}
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 12,
                border: `2px solid ${C.light}`, fontFamily: FONT, fontSize: 18, fontWeight: 700,
                outline: "none", marginBottom: 16, color: C.navy, background: C.light,
              }}
              onFocus={(e) => e.target.style.borderColor = C.cyan}
              onBlur={(e) => e.target.style.borderColor = C.light}
            />
            <button onClick={() => setEditMonth(null)} style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg, ${C.cyan}, ${C.navy})`,
              color: C.white, fontFamily: FONT, fontSize: 15, fontWeight: 700, cursor: "pointer",
            }}>
              Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ── WEEKLY ────────────────────────────────────────────────
  const renderWeekly = () => (
    <div>
      <div style={{
        background: C.white, padding: "32px 20px 20px",
        borderRadius: "0 0 28px 28px", margin: "0 0 12px",
        boxShadow: "0 1px 4px rgba(2,24,82,0.05)",
      }}>
        <div style={{ fontSize: 10, color: C.silver, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>
          Ações da semana
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 700, color: C.navy }}>{weeklyDone}</span>
          <span style={{ fontSize: 14, color: C.silver }}>/ {ACTIONS.length}</span>
        </div>
        <MiniBar pct={weeklyDone / ACTIONS.length} height={5} />
        <div style={{ fontSize: 12, color: C.cyan, fontWeight: 700, marginTop: 8 }}>
          +{weeklyPts} pontos
        </div>
      </div>

      {ACTIONS.map((a, i) => {
        const done = !!checks[a.id];
        return (
          <div key={a.id} style={{
            ...card, display: "flex", alignItems: "center", gap: 14,
            opacity: done ? 0.55 : 1,
            transition: "all 0.4s ease",
            animation: `fadeSlideIn 0.4s ease ${i * 0.04}s both`,
          }}>
            <AnimatedCheck checked={done} onToggle={() => toggle(a.id)} pts={a.pts} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: 500, color: C.navy,
                textDecoration: done ? "line-through" : "none",
                transition: "all 0.3s ease",
              }}>
                {a.icon} {a.text}
              </div>
              <div style={{ fontSize: 10, color: C.silver, marginTop: 2 }}>{a.area}</div>
            </div>
            <div style={{
              fontSize: 11, fontWeight: 700,
              color: done ? C.success : C.cyan,
              background: done ? `${C.success}15` : C.cyanSoft,
              padding: "3px 8px", borderRadius: 6,
              transition: "all 0.3s ease",
            }}>
              {a.pts}
            </div>
          </div>
        );
      })}

      {weeklyDone === ACTIONS.length && (
        <div style={{
          ...card, textAlign: "center", padding: "24px",
          background: `linear-gradient(135deg, ${C.cyanSoft}, ${C.white})`,
          animation: "fadeSlideIn 0.5s ease both",
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>Semana completa!</div>
          <div style={{ fontSize: 12, color: C.cyan, marginTop: 4 }}>+{weeklyPts} pontos conquistados</div>
        </div>
      )}
    </div>
  );

  // ── STRATEGY ──────────────────────────────────────────────
  const renderStrategy = () => (
    <div>
      <div style={{
        background: C.white, padding: "32px 20px 20px",
        borderRadius: "0 0 28px 28px", margin: "0 0 4px",
        boxShadow: "0 1px 4px rgba(2,24,82,0.05)",
      }}>
        <div style={{ fontSize: 10, color: C.silver, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>
          Plano estratégico
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 700, color: C.navy }}>{stratDone}</span>
          <span style={{ fontSize: 14, color: C.silver }}>/ {stratItems.length}</span>
        </div>
        <MiniBar pct={stratDone / stratItems.length} height={5} />
      </div>

      {Object.entries(STRATEGIC).map(([phase, data]) => {
        const pDone = data.items.filter(a => checks[a.id]).length;
        return (
          <div key={phase}>
            <div style={{ ...sLabel, display: "flex", justifyContent: "space-between" }}>
              <span>{data.emoji} {phase} · {data.period}</span>
              <span style={{ color: C.cyan, fontWeight: 800 }}>{pDone}/{data.items.length}</span>
            </div>
            {data.items.map((a, i) => {
              const done = !!checks[a.id];
              return (
                <div key={a.id} style={{
                  ...card, display: "flex", alignItems: "center", gap: 12,
                  opacity: done ? 0.5 : 1, transition: "all 0.4s ease",
                  animation: `fadeSlideIn 0.3s ease ${i * 0.03}s both`,
                }}>
                  <AnimatedCheck checked={done} onToggle={() => toggle(a.id)} pts={a.pts} />
                  <PrioDot prio={a.prio} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, textDecoration: done ? "line-through" : "none" }}>{a.text}</div>
                    <div style={{ fontSize: 10, color: C.silver, marginTop: 1 }}>{a.resp}</div>
                  </div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: C.cyan,
                    background: C.cyanSoft, padding: "2px 7px", borderRadius: 5,
                  }}>{a.pts}</div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );

  // ── FUNNEL ────────────────────────────────────────────────
  const renderFunnel = () => (
    <div>
      <div style={{
        background: C.white, padding: "32px 20px 20px",
        borderRadius: "0 0 28px 28px", margin: "0 0 12px",
        boxShadow: "0 1px 4px rgba(2,24,82,0.05)",
      }}>
        <div style={{ fontSize: 10, color: C.silver, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>
          Funil de vendas
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 700, color: C.navy }}>{leads.length}</span>
          <span style={{ fontSize: 14, color: C.silver }}>leads</span>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
          {["fechado", "negociação", "proposta"].map(s => {
            const count = leads.filter(l => l.stage === s).length;
            const st = STAGES.find(x => x.id === s);
            return count > 0 ? (
              <div key={s} style={{ fontSize: 11, color: st.color, fontWeight: 600 }}>
                {count} {st.label.toLowerCase()}
              </div>
            ) : null;
          })}
        </div>
      </div>

      <div style={{ ...card, display: "flex", gap: 8 }}>
        <input value={newLead} onChange={e => setNewLead(e.target.value)}
          placeholder="Nome do novo lead..."
          style={{
            flex: 1, padding: "12px 14px", borderRadius: 12,
            border: `2px solid ${C.light}`, fontFamily: FONT, fontSize: 13,
            outline: "none", background: C.light, color: C.navy,
          }}
          onFocus={e => e.target.style.borderColor = C.cyan}
          onBlur={e => e.target.style.borderColor = C.light}
          onKeyDown={e => {
            if (e.key === "Enter" && newLead.trim()) {
              setLeads(prev => [...prev, { id: Date.now(), name: newLead.trim(), stage: "lead frio", value: 0, note: "" }]);
              setNewLead("");
            }
          }}
        />
        <button onClick={() => {
          if (!newLead.trim()) return;
          setLeads(prev => [...prev, { id: Date.now(), name: newLead.trim(), stage: "lead frio", value: 0, note: "" }]);
          setNewLead("");
        }} style={{
          width: 46, height: 46, borderRadius: 12, border: "none",
          background: C.navy, color: C.white, fontSize: 20, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>+</button>
      </div>

      {leads.map(lead => {
        const st = STAGES.find(s => s.id === lead.stage);
        return (
          <div key={lead.id} style={{ ...card, animation: "fadeSlideIn 0.3s ease both" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{lead.name}</div>
              <button onClick={() => setLeads(prev => prev.filter(l => l.id !== lead.id))}
                style={{ background: "none", border: "none", fontSize: 16, color: C.silver, cursor: "pointer", padding: 4 }}>×</button>
            </div>
            {lead.value > 0 && (
              <div style={{ fontSize: 13, fontWeight: 700, color: C.cyan, marginBottom: 8 }}>
                R$ {lead.value.toLocaleString("pt-BR")}
              </div>
            )}
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {STAGES.map(s => (
                <button key={s.id}
                  onClick={() => setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, stage: s.id } : l))}
                  style={{
                    padding: "5px 10px", borderRadius: 20, border: "none",
                    fontSize: 10, fontWeight: 600, fontFamily: FONT, cursor: "pointer",
                    background: lead.stage === s.id ? s.color : C.light,
                    color: lead.stage === s.id ? C.white : C.gray,
                    transition: "all 0.25s ease",
                    transform: lead.stage === s.id ? "scale(1.05)" : "scale(1)",
                  }}>{s.label}</button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── RANKING ───────────────────────────────────────────────
  const renderRank = () => {
    const ptsForNext = nextLevel ? nextLevel.min - totalPts : 0;
    const stratPts = stratItems.filter(a => checks[a.id]).reduce((s, a) => s + a.pts, 0);
    return (
      <div>
        <div style={{
          background: `linear-gradient(160deg, ${C.navy} 0%, #0D347A 100%)`,
          padding: "40px 20px 32px", borderRadius: "0 0 32px 32px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 52, marginBottom: 8, animation: "pulse 2.5s ease-in-out infinite" }}>{level.icon}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700, color: C.white, marginBottom: 2 }}>{level.name}</div>
          <div style={{ fontSize: 44, fontWeight: 800, color: C.cyan, fontFamily: FONT, lineHeight: 1.1 }}>{totalPts}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4, letterSpacing: 1 }}>PONTOS ACUMULADOS</div>

          {nextLevel && (
            <div style={{ marginTop: 20, padding: "0 20px" }}>
              <MiniBar pct={level.min === nextLevel.min ? 1 : (totalPts - level.min) / (nextLevel.min - level.min)} height={6} bg="rgba(255,255,255,0.1)" />
              <div style={{ fontSize: 11, color: C.cyan, marginTop: 8, fontWeight: 500 }}>
                {ptsForNext} pontos para {nextLevel.icon} {nextLevel.name}
              </div>
            </div>
          )}
          {!nextLevel && (
            <div style={{ fontSize: 14, color: "#FFD700", marginTop: 16, fontWeight: 700 }}>
              Você é Lendário! 🎉
            </div>
          )}
        </div>

        <div style={sLabel}>Níveis</div>
        {LEVELS.map((l, i) => {
          const active = level.name === l.name;
          const achieved = totalPts >= l.min;
          return (
            <div key={l.name} style={{
              ...card, display: "flex", alignItems: "center", gap: 14,
              border: active ? `2px solid ${C.cyan}` : "2px solid transparent",
              opacity: achieved ? 1 : 0.35,
              animation: `fadeSlideIn 0.3s ease ${i * 0.06}s both`,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: achieved ? C.cyanSoft : C.light,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              }}>{l.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{l.name}</div>
                <div style={{ fontSize: 11, color: C.silver }}>{l.min}+ pontos</div>
              </div>
              {active && (
                <div style={{
                  fontSize: 9, fontWeight: 800, color: C.cyan,
                  background: C.cyanSoft, padding: "4px 10px", borderRadius: 6,
                  letterSpacing: 1,
                }}>ATUAL</div>
              )}
              {achieved && !active && <span style={{ fontSize: 16, color: C.success }}>✓</span>}
            </div>
          );
        })}

        <div style={sLabel}>Detalhamento</div>
        <div style={card}>
          {[
            { label: "Ações semanais", val: weeklyPts },
            { label: "Plano estratégico", val: stratPts },
            { label: "Total", val: totalPts, bold: true },
          ].map((row, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: i < 2 ? `1px solid ${C.light}` : "none",
              fontWeight: row.bold ? 700 : 400, fontSize: row.bold ? 15 : 13,
            }}>
              <span>{row.label}</span>
              <span style={{ color: C.cyan, fontWeight: 700 }}>{row.val} pts</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── RENDER ────────────────────────────────────────────────
  return (
    <div style={{
      fontFamily: FONT, background: C.light, minHeight: "100vh",
      maxWidth: 430, margin: "0 auto", paddingBottom: 82, color: C.navy,
      opacity: mounted ? 1 : 0, transition: "opacity 0.4s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        html, body, #root { height: 100%; }
        body { background: ${C.light}; overflow-x: hidden; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        input::placeholder { color: ${C.silver}; }
        ::-webkit-scrollbar { width: 0; }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes scoreUp {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          40% { opacity: 1; transform: translateY(-28px) scale(1.3); }
          100% { opacity: 0; transform: translateY(-52px) scale(0.7); }
        }
        @keyframes drawLine {
          from { stroke-dashoffset: 20; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes checkPop {
          0% { opacity: 0; transform: scale(0.3) rotate(-20deg); }
          60% { transform: scale(1.15) rotate(5deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>

      {tab === "home" && renderHome()}
      {tab === "weekly" && renderWeekly()}
      {tab === "strategy" && renderStrategy()}
      {tab === "funnel" && renderFunnel()}
      {tab === "rank" && renderRank()}

      {/* Bottom nav */}
      <nav style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderTop: `1px solid ${C.navyFade}`,
        display: "flex", justifyContent: "space-around",
        padding: "6px 0 max(env(safe-area-inset-bottom), 8px)",
        zIndex: 100,
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 1, padding: "6px 14px", transition: "all 0.2s ease",
          }}>
            <span style={{
              fontSize: 20,
              filter: tab === t.id ? "none" : "grayscale(1)",
              opacity: tab === t.id ? 1 : 0.35,
              transition: "all 0.25s ease",
              transform: tab === t.id ? "scale(1.18) translateY(-1px)" : "scale(1)",
            }}>{t.icon}</span>
            <span style={{
              fontFamily: FONT, fontSize: 9, fontWeight: 700,
              color: tab === t.id ? C.navy : C.silver,
              transition: "color 0.2s ease", letterSpacing: 0.3,
            }}>{t.label}</span>
            {tab === t.id && (
              <div style={{
                width: 4, height: 4, borderRadius: "50%",
                background: C.cyan, marginTop: 1,
                animation: "fadeIn 0.3s ease",
              }} />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
