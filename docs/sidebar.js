/**
 * sidebar.js — Ascendii Universe Docs Navigation Sidebar
 *
 * Injects a collapsible sidebar into any page that includes this script.
 * Usage: <script src="sidebar.js"></script>
 * The sidebar mounts itself into a <div id="sidebar-root"> if present,
 * or prepends one to <body> automatically.
 */

(function () {
  'use strict';

  const NAV = [
    {
      label: '🏠 Home',
      href: 'Index.html',
    },
    {
      label: '📖 Core Docs',
      children: [
        { label: 'Interlink Exchange',        href: 'Interlink.md' },
        { label: 'Economic Framework',        href: 'Economic & engagement framework.md' },
        { label: 'Codex of Interop Safety',   href: 'Codex_of_Interoperable_Safety.md' },
        { label: 'Justice & Accountability', href: 'Justice_and_Accountablity.md' },
        { label: 'Contributing Guide',       href: 'ContributingGuied.md' },
        { label: 'Partner Outreach Template', href: 'PartnerOutreach-template.md' },
        { label: 'Contributed Rituals',       href: 'Contributed-Rituals.md' },
      ],
    },
    {
      label: '⚗️ Trinity System',
      children: [
        { label: 'Ascendii Trinity',  href: 'trinity/ASCENDII-TRINITY.md' },
        { label: 'Progression',       href: 'trinity/progression.md' },
      ],
    },
    {
      label: '🎮 Workflows',
      children: [
        { label: 'Initiation Quest',      href: '../Workflows/Onboarding/Initiation quest.js' },
        { label: 'Faction Roles',         href: '../Workflows/Onboarding/Faction_Roles.json' },
        { label: 'Lifestyle Rewards',     href: '../Workflows/Onboarding/Lifestyle_Rewards.json' },
        { label: 'Circle of Judgement',   href: '../Workflows/Gameplay/Circle_of_Judgement.json' },
        { label: 'Faction Balance',       href: '../Workflows/Gameplay/Faction_Balance.json' },
        { label: 'Friendly Fire Logic',   href: '../Workflows/Gameplay/Friendly_fire_logic.json' },
      ],
    },
  ];

  const STYLES = `
    #ascendii-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 260px;
      background: #0d0d0d;
      border-right: 1px solid #00ff8833;
      color: #00ff88;
      font-family: 'Courier New', monospace;
      font-size: 0.85em;
      overflow-y: auto;
      z-index: 1000;
      transition: transform 0.3s ease;
      box-sizing: border-box;
      padding: 0 0 40px 0;
    }
    #ascendii-sidebar.collapsed {
      transform: translateX(-260px);
    }
    #ascendii-sidebar-toggle {
      position: fixed;
      top: 12px;
      left: 12px;
      z-index: 1001;
      background: #0d0d0d;
      border: 1px solid #00ff88;
      color: #00ff88;
      font-family: 'Courier New', monospace;
      font-size: 1.1em;
      padding: 4px 10px;
      cursor: pointer;
      border-radius: 6px;
      transition: left 0.3s ease;
    }
    #ascendii-sidebar-toggle.open {
      left: 272px;
    }
    #ascendii-sidebar .sb-header {
      padding: 20px 16px 12px;
      font-size: 1em;
      font-weight: bold;
      letter-spacing: 0.08em;
      border-bottom: 1px solid #00ff8822;
      text-shadow: 0 0 8px #00ff88;
    }
    #ascendii-sidebar ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    #ascendii-sidebar li {
      border-bottom: 1px solid #00ff8811;
    }
    #ascendii-sidebar a {
      display: block;
      padding: 8px 20px;
      color: #00ff88;
      text-decoration: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: background 0.15s;
    }
    #ascendii-sidebar a:hover,
    #ascendii-sidebar a.active {
      background: #00ff8818;
      text-shadow: 0 0 6px #00ff88;
    }
    #ascendii-sidebar .sb-group-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      cursor: pointer;
      font-weight: bold;
      letter-spacing: 0.05em;
      user-select: none;
    }
    #ascendii-sidebar .sb-group-toggle:hover {
      background: #00ff8810;
    }
    #ascendii-sidebar .sb-group-toggle .sb-arrow {
      transition: transform 0.2s;
      font-style: normal;
    }
    #ascendii-sidebar .sb-group-toggle.open .sb-arrow {
      transform: rotate(90deg);
    }
    #ascendii-sidebar .sb-group-items {
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.25s ease;
    }
    #ascendii-sidebar .sb-group-items.open {
      max-height: 600px;
    }
    #ascendii-sidebar .sb-group-items a {
      padding-left: 32px;
      font-size: 0.9em;
      opacity: 0.9;
    }
    body.sb-open {
      margin-left: 260px;
      transition: margin-left 0.3s ease;
    }
    body.sb-closed {
      margin-left: 0;
      transition: margin-left 0.3s ease;
    }
    @media (max-width: 640px) {
      #ascendii-sidebar {
        width: 220px;
      }
      body.sb-open {
        margin-left: 0;
      }
    }
  `;

  function currentPage() {
    return window.location.pathname.split('/').pop() || 'Index.html';
  }

  function buildSidebar() {
    const nav = document.createElement('nav');
    nav.id = 'ascendii-sidebar';

    const header = document.createElement('div');
    header.className = 'sb-header';
    header.textContent = '∞ ASCENDII UNIVERSE';
    nav.appendChild(header);

    const ul = document.createElement('ul');

    NAV.forEach(function (item) {
      const li = document.createElement('li');

      if (!item.children) {
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.label;
        if (item.href === currentPage()) a.classList.add('active');
        li.appendChild(a);
      } else {
        const toggle = document.createElement('div');
        toggle.className = 'sb-group-toggle';
        const hasActive = item.children.some(function (c) {
          return c.href === currentPage();
        });
        if (hasActive) toggle.classList.add('open');

        const labelSpan = document.createElement('span');
        labelSpan.textContent = item.label;
        toggle.appendChild(labelSpan);

        const arrow = document.createElement('em');
        arrow.className = 'sb-arrow';
        arrow.textContent = '▶';
        toggle.appendChild(arrow);

        const groupItems = document.createElement('div');
        groupItems.className = 'sb-group-items' + (hasActive ? ' open' : '');
        const groupUl = document.createElement('ul');

        item.children.forEach(function (child) {
          const childLi = document.createElement('li');
          const a = document.createElement('a');
          a.href = child.href;
          a.textContent = child.label;
          if (child.href === currentPage()) a.classList.add('active');
          childLi.appendChild(a);
          groupUl.appendChild(childLi);
        });

        groupItems.appendChild(groupUl);

        toggle.addEventListener('click', function () {
          toggle.classList.toggle('open');
          groupItems.classList.toggle('open');
        });

        li.appendChild(toggle);
        li.appendChild(groupItems);
      }

      ul.appendChild(li);
    });

    nav.appendChild(ul);
    return nav;
  }

  function buildToggleButton() {
    const btn = document.createElement('button');
    btn.id = 'ascendii-sidebar-toggle';
    btn.setAttribute('aria-label', 'Toggle navigation sidebar');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-controls', 'ascendii-sidebar');
    btn.textContent = '☰';
    return btn;
  }

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  function init() {
    injectStyles();

    const sidebar = buildSidebar();
    const toggle = buildToggleButton();

    let root = document.getElementById('sidebar-root');
    if (root) {
      root.appendChild(sidebar);
    } else {
      document.body.insertBefore(sidebar, document.body.firstChild);
    }
    document.body.insertBefore(toggle, document.body.firstChild);

    let open = true;
    document.body.classList.add('sb-open');
    toggle.classList.add('open');

    toggle.addEventListener('click', function () {
      open = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) {
        sidebar.classList.remove('collapsed');
        document.body.classList.replace('sb-closed', 'sb-open');
        toggle.classList.add('open');
      } else {
        sidebar.classList.add('collapsed');
        document.body.classList.replace('sb-open', 'sb-closed');
        toggle.classList.remove('open');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
