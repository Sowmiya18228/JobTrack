import React from "react";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Video,
  UserRound,
  CheckCircle2,
  Circle,
  Pencil,
  ArrowRight,
  Sparkles
} from "lucide-react";

function Interviews({ applications, onEdit, onUpdate, onNavigate, onAdd }) {
  const [view, setView] = useState("upcoming");

  const interviews = useMemo(() => {
    return applications
      .filter((a) => a.interviewDate)
      .sort((a, b) => new Date(`${a.interviewDate}T${a.interviewTime || "23:59"}`) - new Date(`${b.interviewDate}T${b.interviewTime || "23:59"}`));
  }, [applications]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = interviews.filter((a) => new Date(`${a.interviewDate}T00:00:00`) >= today);
  const completed = interviews.filter((a) => new Date(`${a.interviewDate}T00:00:00`) < today);

  const visible = view === "upcoming" ? upcoming : completed;

  return (
    <main className="page">
      <section className="page-heading">
        <div>
          <div className="eyebrow"><span /> INTERVIEW CENTER</div>
          <h1>Interview tracker</h1>
          <p>Keep every round, time and preparation note in one place.</p>
        </div>
        <button className="secondary-button large" onClick={() => onNavigate("Applications")}><ArrowRight size={16} /> Manage applications</button>
      </section>

      <section className="interview-overview">
        <div className="interview-stat panel"><div className="round-icon"><CalendarDays size={19} /></div><div><strong>{upcoming.length}</strong><span>Upcoming</span></div></div>
        <div className="interview-stat panel"><div className="round-icon"><CheckCircle2 size={19} /></div><div><strong>{completed.length}</strong><span>Completed</span></div></div>
        <div className="interview-stat panel"><div className="round-icon"><Sparkles size={19} /></div><div><strong>{interviews.length}</strong><span>Total rounds</span></div></div>
      </section>

      <section className="panel interview-panel">
        <div className="tabs">
          <button className={view === "upcoming" ? "active" : ""} onClick={() => setView("upcoming")}>Upcoming <b>{upcoming.length}</b></button>
          <button className={view === "completed" ? "active" : ""} onClick={() => setView("completed")}>Completed <b>{completed.length}</b></button>
        </div>

        {visible.length ? (
          <div className="interview-list">
            {visible.map((app) => (
              <InterviewRow key={app.id} app={app} onEdit={onEdit} onUpdate={onUpdate} />
            ))}
          </div>
        ) : (
          <div className="large-empty compact">
            <div className="empty-illustration"><CalendarDays size={25} /></div>
            <h2>{view === "upcoming" ? "No upcoming interviews" : "No completed interviews"}</h2>
            <p>{view === "upcoming" ? "When an application reaches the interview stage, add its date and time to see it here." : "Completed interview rounds will appear here."}</p>
          </div>
        )}
      </section>
    </main>
  );
}

function InterviewRow({ app, onEdit, onUpdate }) {
  return (
    <div className="interview-row">
      <div className="date-tile large">
        <span>{new Date(`${app.interviewDate}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" })}</span>
        <strong>{new Date(`${app.interviewDate}T00:00:00`).getDate()}</strong>
        <small>{new Date(`${app.interviewDate}T00:00:00`).toLocaleDateString("en-US", { month: "short" })}</small>
      </div>

      <div className="interview-main">
        <div className="interview-title-row">
          <div><h3>{app.role}</h3><strong>{app.company}</strong></div>
          <span className={`status-badge ${app.status.toLowerCase()}`}>{app.status}</span>
        </div>

        <div className="interview-meta">
          <span><Clock3 size={14} /> {app.interviewTime || "Time TBD"}</span>
          <span><Video size={14} /> {app.interviewType || "Interview"}</span>
          <span><UserRound size={14} /> {app.interviewer || "Hiring team"}</span>
        </div>

        {app.interviewNotes && <p>{app.interviewNotes}</p>}
      </div>

      <div className="interview-actions">
        <button className="icon-button" onClick={() => onEdit(app)} title="Edit interview"><Pencil size={16} /></button>
        <button
          className="complete-button"
          onClick={() => onUpdate(app.id, { status: app.status === "Interview" ? "Applied" : "Interview" })}
        >
          {app.status === "Interview" ? <Circle size={15} /> : <CheckCircle2 size={15} />}
          {app.status === "Interview" ? "Mark reviewed" : "Interview"}
        </button>
      </div>
    </div>
  );
}

export default Interviews;