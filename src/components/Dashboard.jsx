import React from "react";
import {
  BriefcaseBusiness,
  Send,
  CalendarCheck,
  Trophy,
  TrendingUp,
  ArrowUpRight,
  Clock3,
  MapPin,
  ExternalLink,
  Pencil,
  CheckCircle2,
  Target,
  Sparkles
} from "lucide-react";

function Dashboard({ applications, stats, onAdd, onEdit, onNavigate }) {
  const upcoming = applications
    .filter((a) => a.interviewDate && new Date(`${a.interviewDate}T${a.interviewTime || "23:59"}`) >= new Date())
    .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
    .slice(0, 3);

  const recent = [...applications]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const interviewRate = stats.total ? Math.round(((stats.interview + stats.offer) / stats.total) * 100) : 0;
  const offerRate = stats.total ? Math.round((stats.offer / stats.total) * 100) : 0;

  return (
    <main className="dashboard page">
      <section className="hero-section">
        <div>
          <div className="eyebrow"><span /> CAREER OVERVIEW</div>
          <h1>Hi, Sowmiya <span className="wave">👋</span></h1>
          <p>Turn your job search into a clear, organized process.</p>
        </div>
        <button className="primary-button" onClick={onAdd}>
          <BriefcaseBusiness size={17} /> Add Application
        </button>
      </section>

      <section className="stats-grid">
        <Stat icon={BriefcaseBusiness} label="Total Applications" value={stats.total} hint="All opportunities" />
        <Stat icon={Send} label="Active Applications" value={stats.applied} hint="Currently in process" />
        <Stat icon={CalendarCheck} label="Interviews" value={stats.interview} hint="Scheduled rounds" />
        <Stat icon={Trophy} label="Offers" value={stats.offer} hint="Successful outcomes" />
      </section>

      <section className="dashboard-grid">
        <div className="panel recent-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent applications</h2>
              <p>Your latest job-search activity</p>
            </div>
            <button className="text-button" onClick={() => onNavigate("Applications")}>View all <ArrowUpRight size={15} /></button>
          </div>

          {recent.length ? (
            <div className="mini-list">
              {recent.map((app) => (
                <div className="mini-application" key={app.id}>
                  <div className="company-logo">{app.company?.charAt(0)?.toUpperCase() || "J"}</div>
                  <div className="mini-main">
                    <strong>{app.role}</strong>
                    <span>{app.company} · {app.location}</span>
                  </div>
                  <StatusBadge status={app.status} />
                  <button className="icon-button" onClick={() => onEdit(app)} title="Edit"><Pencil size={15} /></button>
                </div>
              ))}
            </div>
          ) : (
            <Empty onAdd={onAdd} />
          )}
        </div>

        <div className="panel insight-panel">
          <div className="panel-heading">
            <div>
              <h2>Search momentum</h2>
              <p>A quick look at your progress</p>
            </div>
            <div className="sparkle"><Sparkles size={17} /></div>
          </div>

          <div className="momentum-score">
            <div className="score-ring" style={{ "--progress": `${Math.min(interviewRate, 100)}%` }}>
              <div><strong>{interviewRate}%</strong><span>progress</span></div>
            </div>
            <div className="momentum-copy">
              <strong>{interviewRate >= 30 ? "Great momentum!" : "Keep applying!"}</strong>
              <p>Your interview/offer conversion is currently {interviewRate}%.</p>
            </div>
          </div>

          <div className="metric-row"><span><Target size={15} /> Interview conversion</span><strong>{interviewRate}%</strong></div>
          <div className="metric-row"><span><Trophy size={15} /> Offer conversion</span><strong>{offerRate}%</strong></div>
          <div className="metric-row"><span><CheckCircle2 size={15} /> Rejections</span><strong>{stats.rejected}</strong></div>
        </div>
      </section>

      <section className="dashboard-grid bottom-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h2>Upcoming interviews</h2>
              <p>Never miss your next round</p>
            </div>
            <button className="text-button" onClick={() => onNavigate("Interviews")}>Open tracker <ArrowUpRight size={15} /></button>
          </div>

          {upcoming.length ? (
            <div className="upcoming-list">
              {upcoming.map((app) => (
                <div className="upcoming-item" key={app.id}>
                  <div className="date-tile">
                    <span>{new Date(`${app.interviewDate}T00:00:00`).toLocaleDateString("en-US", { month: "short" })}</span>
                    <strong>{new Date(`${app.interviewDate}T00:00:00`).getDate()}</strong>
                  </div>
                  <div className="upcoming-copy">
                    <strong>{app.role}</strong>
                    <span>{app.company} · {app.interviewType || "Interview"}</span>
                  </div>
                  <div className="upcoming-time"><Clock3 size={14} /> {app.interviewTime || "Time TBD"}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="compact-empty"><CalendarCheck size={22} /><span>No upcoming interviews yet.</span></div>
          )}
        </div>

        <div className="panel checklist-panel">
          <div className="panel-heading">
            <div><h2>Job-search checklist</h2><p>Small actions, consistent progress</p></div>
          </div>
          <Checklist done={stats.total > 0} text="Start tracking applications" />
          <Checklist done={stats.interview > 0} text="Prepare for an interview" />
          <Checklist done={stats.offer > 0} text="Reach an offer stage" />
          <Checklist done={applications.some((a) => a.followUpDate)} text="Schedule a follow-up" />
        </div>
      </section>
    </main>
  );
}

function Stat({ icon: Icon, label, value, hint }) {
  return (
    <div className="stat-card polished">
      <div className="stat-top"><div className="stat-icon"><Icon size={19} /></div><ArrowUpRight size={16} className="muted-icon" /></div>
      <strong className="stat-value">{value}</strong>
      <span className="stat-label">{label}</span>
      <small>{hint}</small>
    </div>
  );
}

function StatusBadge({ status }) {
  return <span className={`status-badge ${status?.toLowerCase()}`}>{status}</span>;
}

function Checklist({ done, text }) {
  return <div className={`check-row ${done ? "done" : ""}`}><CheckCircle2 size={18} /><span>{text}</span>{done && <small>Done</small>}</div>;
}

function Empty({ onAdd }) {
  return <div className="compact-empty"><BriefcaseBusiness size={22} /><span>No applications yet.</span><button className="text-button" onClick={onAdd}>Add one</button></div>;
}

export default Dashboard;