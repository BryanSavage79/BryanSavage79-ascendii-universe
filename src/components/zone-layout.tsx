import React from 'react';

export type ZoneStatus = 'active' | 'sealed' | 'contested';

export interface Faction {
  id: string;
  name: string;
  archetype: string;
  ritualSignature: string;
}

export interface ZoneActivity {
  id: string;
  label: string;
  description?: string;
}

export interface Zone {
  id: string;
  name: string;
  description: string;
  faction?: Faction;
  activities?: ZoneActivity[];
  status?: ZoneStatus;
}

export interface ZoneLayoutProps {
  zone: Zone;
  children?: React.ReactNode;
  onActivitySelect?: (activity: ZoneActivity) => void;
}

const STATUS_LABELS: Record<ZoneStatus, string> = {
  active: '⚡ Active',
  sealed: '🔒 Sealed',
  contested: '⚔️ Contested',
};

const STATUS_COLORS: Record<ZoneStatus, string> = {
  active: '#00ff88',
  sealed: '#888888',
  contested: '#ff6600',
};

const styles: Record<string, React.CSSProperties> = {
  root: {
    background: '#0a0a0a',
    color: '#00ff88',
    fontFamily: "'Courier New', monospace",
    minHeight: '100vh',
    padding: '0',
  },
  header: {
    borderBottom: '1px solid #00ff88',
    padding: '24px 32px 20px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: '12px',
  },
  headerLeft: {
    flex: '1 1 auto',
  },
  zoneName: {
    margin: '0 0 6px',
    fontSize: '2em',
    textShadow: '0 0 12px #00ff88',
    letterSpacing: '0.05em',
  },
  zoneDescription: {
    margin: '0',
    opacity: 0.75,
    fontSize: '0.95em',
    maxWidth: '600px',
    lineHeight: 1.5,
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 14px',
    borderRadius: '20px',
    border: '1px solid currentColor',
    fontSize: '0.8em',
    fontWeight: 'bold',
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap' as const,
    alignSelf: 'flex-start',
  },
  body: {
    padding: '28px 32px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
  },
  section: {
    borderLeft: '2px solid #00ff88',
    paddingLeft: '16px',
  },
  sectionTitle: {
    margin: '0 0 12px',
    fontSize: '0.75em',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.15em',
    opacity: 0.6,
  },
  factionCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  factionName: {
    fontSize: '1.1em',
    fontWeight: 'bold',
  },
  factionMeta: {
    opacity: 0.7,
    fontSize: '0.85em',
  },
  factionSig: {
    marginTop: '6px',
    fontSize: '0.8em',
    opacity: 0.55,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  },
  activityList: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  activityItem: {
    padding: '10px 14px',
    border: '1px solid rgba(0, 255, 136, 0.25)',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s',
    background: 'transparent',
    color: '#00ff88',
    fontFamily: "'Courier New', monospace",
    textAlign: 'left' as const,
    width: '100%',
  },
  activityLabel: {
    fontWeight: 'bold',
    fontSize: '0.9em',
  },
  activityDesc: {
    marginTop: '2px',
    opacity: 0.65,
    fontSize: '0.8em',
  },
  children: {
    marginTop: '4px',
  },
};

const ZoneLayout: React.FC<ZoneLayoutProps> = ({ zone, children, onActivitySelect }) => {
  const status = zone.status ?? 'active';
  const statusColor = STATUS_COLORS[status];

  return (
    <div style={styles.root}>
      <style>{`
        .ascendii-activity-btn:hover {
          border-color: #00ff88 !important;
          background: rgba(0, 255, 136, 0.06) !important;
        }
      `}</style>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.zoneName}>{zone.name}</h1>
          <p style={styles.zoneDescription}>{zone.description}</p>
        </div>
        <span
          style={{ ...styles.statusBadge, color: statusColor, borderColor: statusColor }}
          aria-label={`Zone status: ${status}`}
        >
          {STATUS_LABELS[status]}
        </span>
      </header>

      <div style={styles.body}>
        {zone.faction && (
          <section style={styles.section} aria-label="Faction">
            <h2 style={styles.sectionTitle}>Faction</h2>
            <div style={styles.factionCard}>
              <span style={styles.factionName}>{zone.faction.name}</span>
              <span style={styles.factionMeta}>{zone.faction.archetype}</span>
              <span style={styles.factionSig}>
                Ritual Signature: {zone.faction.ritualSignature}
              </span>
            </div>
          </section>
        )}

        {zone.activities && zone.activities.length > 0 && (
          <section style={styles.section} aria-label="Zone Activities">
            <h2 style={styles.sectionTitle}>Activities</h2>
            <ul style={styles.activityList}>
              {zone.activities.map((activity) => (
                <li key={activity.id}>
                  <button
                    className="ascendii-activity-btn"
                    style={styles.activityItem}
                    onClick={() => onActivitySelect?.(activity)}
                    aria-label={activity.label}
                  >
                    <div style={styles.activityLabel}>{activity.label}</div>
                    {activity.description && (
                      <div style={styles.activityDesc}>{activity.description}</div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {children && (
          <section style={styles.section} aria-label="Zone Content">
            <div style={styles.children}>{children}</div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ZoneLayout;
