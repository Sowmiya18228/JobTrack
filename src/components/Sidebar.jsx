import React from "react";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  X
} from "lucide-react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Applications", icon: BriefcaseBusiness },
  { label: "Interviews", icon: CalendarDays },
  { label: "Analytics", icon: ChartNoAxesCombined },
  { label: "Settings", icon: Settings }
];

function Sidebar({
  activePage,
  setActivePage,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) {
  return (
    <>
      {mobileOpen && (
        <button className="mobile-backdrop" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
      )}

      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark">
            <Sparkles size={19} />
          </div>
          {!collapsed && (
            <div className="brand-text">
              <strong>JobTrack</strong>
              <span>Career OS</span>
            </div>
          )}
          <button className="mobile-close" onClick={() => setMobileOpen(false)}>
            <X size={19} />
          </button>
        </div>

        {!collapsed && <div className="nav-label">WORKSPACE</div>}

        <nav className="sidebar-nav">
          {items.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${activePage === label ? "active" : ""}`}
              onClick={() => setActivePage(label)}
              title={collapsed ? label : undefined}
            >
              <Icon size={19} />
              {!collapsed && <span>{label}</span>}
              {label === "Interviews" && !collapsed && (
                <span className="nav-dot">•</span>
              )}
            </button>
          ))}
        </nav>

        {!collapsed && (
          <div className="sidebar-tip">
            <div className="tip-icon"><Sparkles size={17} /></div>
            <strong>Stay consistent</strong>
            <p>Track every application and follow-up in one place.</p>
          </div>
        )}

        <div className="sidebar-bottom">
          <button
            className="collapse-button"
            onClick={() => setCollapsed((value) => !value)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            {!collapsed && <span>Collapse sidebar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;