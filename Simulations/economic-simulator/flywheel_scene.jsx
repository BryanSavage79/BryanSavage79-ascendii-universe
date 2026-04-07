/**
 * flywheel_scene.jsx
 * Ascendii Universe — Economic Flywheel Scene
 *
 * Visualizes the self-reinforcing value cycle of the Interlink Crafting Protocol:
 * Community Engagement → Effort Points → Component Tokens → Crafting Ritual
 * → NFT Minting → Market Exchange → Burns / Pool Growth → DAO Treasury → (loop)
 *
 * Usage (Babel standalone / browser):
 *   <script type="text/babel" src="flywheel_scene.jsx"></script>
 *   ReactDOM.createRoot(document.getElementById('root')).render(<FlywheelScene />);
 */

const { useState, useEffect, useRef, useCallback } = React;

// ─── Palette ────────────────────────────────────────────────────────────────
const COLORS = {
  bg:        '#0d0e1a',
  card:      '#13152b',
  border:    '#1e2244',
  glow:      'rgba(99,102,241,0.35)',
  text:      '#e2e8f0',
  muted:     '#64748b',
  community: '#6366f1',
  effort:    '#f59e0b',
  components:'#10b981',
  crafting:  '#ef4444',
  nfts:      '#a78bfa',
  market:    '#3b82f6',
  burns:     '#f97316',
  dao:       '#14b8a6',
  water:     '#38bdf8',
  energy:    '#fbbf24',
  nature:    '#4ade80',
};

// ─── Flywheel Nodes (clockwise from top) ────────────────────────────────────
const NODES = [
  {
    id:    'community',
    label: 'Community\nEngagement',
    icon:  '🏆',
    color: COLORS.community,
    detail:'Quests, raids, onboarding, and guides accrue Effort Points (EP) and +10–20 XP to items used.',
  },
  {
    id:    'effort',
    label: 'Effort Points',
    icon:  '⚡',
    color: COLORS.effort,
    detail:'EP is the proof-of-engagement currency. Required to purchase Component Tokens on the bonding curve.',
  },
  {
    id:    'components',
    label: 'Component\nTokens',
    icon:  '🧩',
    color: COLORS.components,
    detail:'ERC-20 tokens (Steel Ingots, Frost Crystals…) priced on a linear bonding curve: P = Base + (Factor × Supply). Anti-whale by design.',
  },
  {
    id:    'crafting',
    label: 'Crafting\nRitual',
    icon:  '🔥',
    color: COLORS.crafting,
    detail:'Cross-chain forge (Ethereum + LayerZero). Base success 63–67 %. High-XP items boost probability by +5 % per tier.',
  },
  {
    id:    'nfts',
    label: 'NFT Minting',
    icon:  '💎',
    color: COLORS.nfts,
    detail:'Three tiers: Rumor (0–49 XP) → Renown (50–149 XP) → Legendary (150+ XP). Legendary NFTs are burn-exempt and vault-held.',
  },
  {
    id:    'market',
    label: 'Market\nExchange',
    icon:  '📈',
    color: COLORS.market,
    detail:'Interlink Exchange. XP accrues on every sale/use (+10–20 per event). Renown and Legendary items command premium prices.',
  },
  {
    id:    'burns',
    label: '20 % Burns\n+ Pool',
    icon:  '♻️',
    color: COLORS.burns,
    detail:'20 % of Regular/VCE pool sales are burned, controlling supply (~413 NFTs after 10 rounds vs. 500 without burns). Pool grows ~6 % per round.',
  },
  {
    id:    'dao',
    label: 'DAO\nTreasury',
    icon:  '🏛️',
    color: COLORS.dao,
    detail:'Protocol fees + XP-boosted sales fund the DAO. Treasury finances new quests, grants, and governance rewards — restarting the flywheel.',
  },
];

// ─── Trinity Stages ──────────────────────────────────────────────────────────
const TRINITY = [
  {
    id:      'aqua',
    label:   'Aqua Vitae',
    icon:    '💧',
    color:   COLORS.water,
    nft:     'Wellspring of Eternity',
    impact:  'Funds 1 clean-water well (charity:water)',
    cost:    '$180–220',
    success: '67 %',
    ep:      '10,000',
  },
  {
    id:      'helios',
    label:   'Helios Forge',
    icon:    '☀️',
    color:   COLORS.energy,
    nft:     'Eternal Dawnbringer',
    impact:  'Solar panels for 1 school / clinic (GivePower)',
    cost:    '$220–280',
    success: '65 %',
    ep:      '10,000+',
  },
  {
    id:      'arbor',
    label:   'Arbor Vitae',
    icon:    '🌳',
    color:   COLORS.nature,
    nft:     'Yggdrasil Ascendant',
    impact:  '10,000 trees + 500 t CO₂ removed (Pachama)',
    cost:    '$250–320',
    success: '63 %',
    ep:      '10,000+',
  },
];

// ─── Simulation constants ────────────────────────────────────────────────────
// Base pool growth rate per round (~0.6 %, matching simulation: pool ~10,599 after 10 rounds)
const BASE_POOL_GROWTH_RATE      = 0.006;
// Pool growth variance band: actual rate = BASE_POOL_GROWTH_RATE × U(MIN_VARIANCE, MIN_VARIANCE + VARIANCE_RANGE)
const POOL_GROWTH_MIN_VARIANCE   = 0.8;
const POOL_GROWTH_VARIANCE_RANGE = 0.4;
// Probability that a new Legendary holder advances to Architect status (15 %)
const ARCHITECT_PROMOTION_PROB   = 0.15;
// Max number of historical rounds kept for the sparkline chart
const MAX_HISTORY_LENGTH         = 20;

// ─── Simulation helpers ──────────────────────────────────────────────────────
const INITIAL_STATS = {
  nftSupply:  413,   // stable supply after 10 burn-inclusive rounds (vs 500 without burns)
  poolEth:    10599,
  legendary:  21,    // ~5 % of 413
  burnTotal:  87,    // cumulative burns over the pre-seeded rounds (~6 burns/round × 10 rounds + ramp-up)
  xpEvents:   1240,
  architects: 7,
  round:      0,
};

function simulateRound(prev) {
  const mintedRaw  = Math.floor(Math.random() * 12) + 8;   // 8–19 new NFTs
  const burned     = Math.floor(mintedRaw * 0.2);
  const netMinted  = mintedRaw - burned;
  const newLegend  = Math.random() < 0.05 ? 1 : 0;
  const variance   = POOL_GROWTH_MIN_VARIANCE + Math.random() * POOL_GROWTH_VARIANCE_RANGE;
  const poolGrowth = +(prev.poolEth * BASE_POOL_GROWTH_RATE * variance).toFixed(1);
  const xpDelta    = Math.floor(Math.random() * 80) + 40;

  return {
    nftSupply: prev.nftSupply + netMinted,
    poolEth:   Math.floor(prev.poolEth + poolGrowth),
    legendary: prev.legendary + newLegend,
    burnTotal: prev.burnTotal + burned,
    xpEvents:  prev.xpEvents + xpDelta,
    architects:prev.architects + (newLegend && Math.random() < ARCHITECT_PROMOTION_PROB ? 1 : 0),
    round:     prev.round + 1,
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, color, icon }) {
  return (
    <div style={{
      background: COLORS.card,
      border:     `1px solid ${COLORS.border}`,
      borderRadius: 10,
      padding:    '10px 14px',
      minWidth:   110,
      textAlign:  'center',
    }}>
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div style={{ color, fontWeight: 700, fontSize: 18, lineHeight: 1.2 }}>{value}</div>
      <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function TrinityCard({ stage, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background:   active ? `${stage.color}22` : COLORS.card,
        border:       `1.5px solid ${active ? stage.color : COLORS.border}`,
        borderRadius: 12,
        padding:      '14px 18px',
        cursor:       'pointer',
        textAlign:    'left',
        color:        COLORS.text,
        transition:   'all 0.2s',
        flex:         1,
      }}
    >
      <div style={{ fontSize: 22 }}>{stage.icon}</div>
      <div style={{ fontWeight: 700, marginTop: 4, color: active ? stage.color : COLORS.text }}>{stage.label}</div>
      <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{stage.nft}</div>
      {active && (
        <div style={{ marginTop: 8, fontSize: 12, lineHeight: 1.5 }}>
          <div>🌍 <span style={{ color: stage.color }}>{stage.impact}</span></div>
          <div style={{ marginTop: 4 }}>🎯 Success: <b style={{ color: stage.color }}>{stage.success}</b> &nbsp;|&nbsp; EP: <b>{stage.ep}</b> &nbsp;|&nbsp; ~{stage.cost}</div>
        </div>
      )}
    </button>
  );
}

// ─── Main SVG Flywheel ───────────────────────────────────────────────────────

function FlywheelSVG({ rotation, activeNode, onNodeHover, onNodeClick }) {
  const cx = 300;
  const cy = 300;
  const R  = 200;   // node orbit radius
  const n  = NODES.length;

  // Compute positions
  const nodePositions = NODES.map((node, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2; // start from top
    return {
      ...node,
      x: cx + R * Math.cos(angle),
      y: cy + R * Math.sin(angle),
      angle,
    };
  });

  // Spoke angles for the spinning wheel (8 spokes)
  const spokes = Array.from({ length: 8 }, (_, i) => (i / 8) * 360 + rotation);

  // Animated particles: we show 16 dots evenly spaced along the circular path
  const particleCount = 16;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const t = ((i / particleCount) + (rotation / 360)) % 1;
    const angle = t * 2 * Math.PI - Math.PI / 2;
    const r = R;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    // determine which arc segment this particle is in (for color)
    const segIdx = Math.floor(t * n) % n;
    return { px, py, color: NODES[segIdx].color };
  });

  return (
    <svg
      width={600}
      height={600}
      viewBox="0 0 600 600"
      style={{ display: 'block', maxWidth: '100%' }}
      aria-label="Ascendii Economic Flywheel"
    >
      <defs>
        {/* Radial glow */}
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0"   />
        </radialGradient>

        {/* Arc gradient for orbit ring */}
        <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.6" />
          <stop offset="50%"  stopColor="#14b8a6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.6" />
        </linearGradient>

        {NODES.map(node => (
          <filter key={`glow-${node.id}`} id={`glow-${node.id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}

        <filter id="spokeBlur">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>

      {/* Background */}
      <rect width={600} height={600} fill={COLORS.bg} />

      {/* Center glow */}
      <circle cx={cx} cy={cy} r={130} fill="url(#centerGlow)" />

      {/* Spinning spokes */}
      <g transform={`rotate(${rotation} ${cx} ${cy})`} opacity={0.25} filter="url(#spokeBlur)">
        {spokes.map((_, i) => {
          const a = (i / 8) * 2 * Math.PI;
          const x2 = cx + 190 * Math.cos(a);
          const y2 = cy + 190 * Math.sin(a);
          return (
            <line key={i} x1={cx} y1={cy} x2={x2} y2={y2}
              stroke="#6366f1" strokeWidth={2} />
          );
        })}
      </g>

      {/* Orbit ring */}
      <circle cx={cx} cy={cy} r={R}
        fill="none"
        stroke="url(#orbitGrad)"
        strokeWidth={2}
        strokeDasharray="8 6"
        opacity={0.5}
      />

      {/* Animated particles on orbit */}
      {particles.map((p, i) => (
        <circle key={i} cx={p.px} cy={p.py} r={3.5}
          fill={p.color} opacity={0.8}
        />
      ))}

      {/* Inner hub */}
      <circle cx={cx} cy={cy} r={58} fill={COLORS.card} stroke={COLORS.border} strokeWidth={2} />
      <text x={cx} y={cy - 10} textAnchor="middle" fill={COLORS.text} fontSize={13} fontWeight={700}>
        ASCENDII
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill={COLORS.muted} fontSize={10}>
        FLYWHEEL
      </text>
      <text x={cx} y={cy + 24} textAnchor="middle" fill={COLORS.community} fontSize={18}>
        ∞
      </text>

      {/* Connection arcs between nodes */}
      {nodePositions.map((src, i) => {
        const dst = nodePositions[(i + 1) % n];
        const mx  = cx + (R + 20) * Math.cos((src.angle + dst.angle) / 2);
        const my  = cy + (R + 20) * Math.sin((src.angle + dst.angle) / 2);
        return (
          <path key={`arc-${i}`}
            d={`M ${src.x} ${src.y} Q ${mx} ${my} ${dst.x} ${dst.y}`}
            fill="none"
            stroke={src.color}
            strokeWidth={1.5}
            strokeOpacity={0.4}
            markerEnd={`url(#arrow-${src.id})`}
          />
        );
      })}

      {/* Arrow markers */}
      <defs>
        {NODES.map(node => (
          <marker key={`marker-${node.id}`}
            id={`arrow-${node.id}`}
            markerWidth={6} markerHeight={6}
            refX={5} refY={3}
            orient="auto"
          >
            <path d="M0,0 L0,6 L6,3 z" fill={node.color} opacity={0.7} />
          </marker>
        ))}
      </defs>

      {/* Nodes */}
      {nodePositions.map(node => {
        const isActive = activeNode === node.id;
        const radius   = isActive ? 38 : 32;
        const lines    = node.label.split('\n');
        return (
          <g key={node.id}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => onNodeHover(node.id)}
            onMouseLeave={() => onNodeHover(null)}
            onClick={() => onNodeClick(node.id)}
            filter={isActive ? `url(#glow-${node.id})` : undefined}
          >
            {/* Outer ring */}
            <circle cx={node.x} cy={node.y} r={radius + 6}
              fill="none"
              stroke={node.color}
              strokeWidth={isActive ? 2 : 1}
              opacity={isActive ? 0.7 : 0.3}
            />
            {/* Node circle */}
            <circle cx={node.x} cy={node.y} r={radius}
              fill={COLORS.card}
              stroke={node.color}
              strokeWidth={isActive ? 2.5 : 1.5}
            />
            {/* Icon */}
            <text x={node.x} y={node.y - 6}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={isActive ? 18 : 15}
            >
              {node.icon}
            </text>
            {/* Label lines */}
            {lines.map((line, li) => (
              <text key={li}
                x={node.x}
                y={node.y + 10 + li * 12}
                textAnchor="middle"
                fill={isActive ? node.color : COLORS.text}
                fontSize={9}
                fontWeight={isActive ? 700 : 400}
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function FlywheelScene() {
  const [rotation,     setRotation]     = useState(0);
  const [spinning,     setSpinning]     = useState(true);
  const [speed,        setSpeed]        = useState(0.6);
  const [activeNode,   setActiveNode]   = useState(null);
  const [clickedNode,  setClickedNode]  = useState(null);
  const [stats,        setStats]        = useState(INITIAL_STATS);
  const [trinityTab,   setTrinityTab]   = useState('aqua');
  const [history,      setHistory]      = useState([INITIAL_STATS]);
  const rafRef                          = useRef(null);
  const lastTime                        = useRef(null);

  // Animation loop
  useEffect(() => {
    if (!spinning) return;
    const animate = (ts) => {
      if (lastTime.current !== null) {
        const delta = ts - lastTime.current;
        setRotation(r => (r + speed * delta * 0.06) % 360);
      }
      lastTime.current = ts;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTime.current = null;
    };
  }, [spinning, speed]);

  // Advance simulation round
  const runRound = useCallback(() => {
    setStats(prev => {
      const next = simulateRound(prev);
      setHistory(h => [...h.slice(-(MAX_HISTORY_LENGTH - 1)), next]);
      return next;
    });
  }, []);

  const displayNode = clickedNode
    ? NODES.find(n => n.id === clickedNode)
    : activeNode
    ? NODES.find(n => n.id === activeNode)
    : null;

  const activeTrinity = TRINITY.find(t => t.id === trinityTab);

  return (
    <div style={{
      minHeight:       '100vh',
      background:      COLORS.bg,
      color:           COLORS.text,
      fontFamily:      "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding:         24,
      boxSizing:       'border-box',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: 1 }}>
          ∞ Ascendii Economic Flywheel
        </h1>
        <p style={{ color: COLORS.muted, margin: '6px 0 0', fontSize: 14 }}>
          The self-reinforcing value cycle of the Interlink Crafting Protocol
        </p>
      </div>

      {/* Layout: flywheel + sidebar */}
      <div style={{
        display:       'flex',
        flexWrap:      'wrap',
        gap:           28,
        justifyContent:'center',
        alignItems:    'flex-start',
        maxWidth:      1100,
        margin:        '0 auto',
      }}>

        {/* Left: SVG flywheel + controls */}
        <div style={{ flex: '0 0 auto' }}>
          <FlywheelSVG
            rotation={rotation}
            activeNode={activeNode || clickedNode}
            onNodeHover={setActiveNode}
            onNodeClick={id => setClickedNode(prev => prev === id ? null : id)}
          />

          {/* Controls */}
          <div style={{
            display:        'flex',
            gap:            10,
            justifyContent: 'center',
            marginTop:      12,
            flexWrap:       'wrap',
          }}>
            <button
              onClick={() => setSpinning(s => !s)}
              style={{
                background: spinning ? COLORS.community : COLORS.card,
                border:     `1px solid ${COLORS.community}`,
                color:      COLORS.text,
                borderRadius: 8,
                padding:    '7px 20px',
                cursor:     'pointer',
                fontSize:   13,
                fontWeight: 600,
              }}
            >
              {spinning ? '⏸ Pause' : '▶ Spin'}
            </button>

            <button
              onClick={runRound}
              style={{
                background: COLORS.card,
                border:     `1px solid ${COLORS.dao}`,
                color:      COLORS.text,
                borderRadius: 8,
                padding:    '7px 20px',
                cursor:     'pointer',
                fontSize:   13,
                fontWeight: 600,
              }}
            >
              ⚙️ Run Round #{stats.round + 1}
            </button>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: COLORS.muted }}>
              Speed
              <input type="range" min={0.1} max={3} step={0.1}
                value={speed}
                onChange={e => setSpeed(+e.target.value)}
                style={{ width: 80 }}
              />
            </label>
          </div>

          {/* Node detail card */}
          {displayNode && (
            <div style={{
              marginTop:    16,
              background:   `${displayNode.color}18`,
              border:       `1.5px solid ${displayNode.color}`,
              borderRadius: 12,
              padding:      14,
              maxWidth:     580,
              animation:    'fadeIn 0.2s ease',
            }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: displayNode.color }}>
                {displayNode.icon} {displayNode.label.replace(/\n/g, ' ')}
              </div>
              <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.6, color: COLORS.text }}>
                {displayNode.detail}
              </div>
            </div>
          )}
        </div>

        {/* Right: stats + trinity */}
        <div style={{ flex: '1 1 280px', minWidth: 260, maxWidth: 420 }}>

          {/* Live stats */}
          <div style={{
            background:   COLORS.card,
            border:       `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding:      18,
            marginBottom: 20,
          }}>
            <h2 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
              📊 Live Simulation — Round {stats.round}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <StatCard label="NFT Supply"  value={stats.nftSupply.toLocaleString()} color={COLORS.nfts}       icon="💎" />
              <StatCard label="Pool (ETH)"  value={stats.poolEth.toLocaleString()}   color={COLORS.components} icon="🏦" />
              <StatCard label="Legendaries" value={stats.legendary}                  color={COLORS.crafting}   icon="🔥" />
              <StatCard label="Burns"       value={stats.burnTotal}                  color={COLORS.burns}      icon="♻️" />
              <StatCard label="XP Events"   value={stats.xpEvents.toLocaleString()}  color={COLORS.effort}     icon="⚡" />
              <StatCard label="Architects"  value={stats.architects}                 color={COLORS.dao}        icon="🏛️" />
            </div>

            {/* Round history sparkline */}
            {history.length > 2 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>NFT Supply history</div>
                <svg width="100%" height={48} viewBox={`0 0 ${history.length - 1} 48`} preserveAspectRatio="none"
                  style={{ display: 'block' }}>
                  {history.slice(1).map((h, i) => {
                    const minS = Math.min(...history.map(x => x.nftSupply));
                    const maxS = Math.max(...history.map(x => x.nftSupply));
                    const range = maxS - minS || 1;
                    const x1 = i;
                    const y1 = 48 - ((history[i].nftSupply - minS) / range) * 40 - 4;
                    const x2 = i + 1;
                    const y2 = 48 - ((h.nftSupply - minS) / range) * 40 - 4;
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={COLORS.nfts} strokeWidth={1.5} />;
                  })}
                </svg>
              </div>
            )}
          </div>

          {/* Trinity tabs */}
          <div style={{
            background:   COLORS.card,
            border:       `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding:      18,
          }}>
            <h2 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
              ✨ The Ascendii Trinity
            </h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {TRINITY.map(stage => (
                <TrinityCard
                  key={stage.id}
                  stage={stage}
                  active={trinityTab === stage.id}
                  onClick={() => setTrinityTab(stage.id)}
                />
              ))}
            </div>
            <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6, borderTop: `1px solid ${COLORS.border}`, paddingTop: 12 }}>
              Complete all three quests to become an{' '}
              <span style={{ color: '#facc15', fontWeight: 700 }}>Architect of Ascension</span>
              {' '}— lifetime treasury voting, 3× perpetual yield, and{' '}
              <span style={{ color: '#4ade80' }}>$650+ in real-world impact</span>.
            </div>
          </div>

          {/* Flywheel cycle legend */}
          <div style={{
            marginTop:    20,
            background:   COLORS.card,
            border:       `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding:      18,
          }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
              🔄 Cycle Legend
            </h2>
            {NODES.map((node, i) => (
              <div key={node.id}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          10,
                  padding:      '5px 0',
                  borderBottom: i < NODES.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                  cursor:       'pointer',
                  borderRadius: 6,
                }}
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
                onClick={() => setClickedNode(prev => prev === node.id ? null : node.id)}
              >
                <span style={{
                  display:     'inline-flex',
                  alignItems:  'center',
                  justifyContent:'center',
                  width:        26,
                  height:       26,
                  borderRadius: '50%',
                  background:  `${node.color}22`,
                  border:      `1px solid ${node.color}`,
                  fontSize:    13,
                }}>
                  {node.icon}
                </span>
                <span style={{ fontSize: 13, color: (activeNode === node.id || clickedNode === node.id) ? node.color : COLORS.text }}>
                  {node.label.replace(/\n/g, ' ')}
                </span>
                {i < NODES.length - 1 && (
                  <span style={{ marginLeft: 'auto', color: node.color, opacity: 0.5 }}>→</span>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 40, color: COLORS.muted, fontSize: 12 }}>
        Ascendii Universe · Interlink Crafting Protocol ·{' '}
        <span style={{ color: COLORS.community }}>Systems that serve souls</span>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
}
