import React from "react";
import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowDownUp,
  MapPin,
  CalendarDays,
  ExternalLink,
  Pencil,
  Trash2,
  Plus,
  X,
  ChevronDown
} from "lucide-react";

function Applications({ applications, onAdd, onEdit, onDelete }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [sort, setSort] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const result = applications.filter((app) => {
      const text = `${app.company} ${app.role} ${app.location}`.toLowerCase();
      const matchesQuery = text.includes(query.toLowerCase());
      const matchesStatus = status === "All" || app.status === status;
      const matchesPriority = priority === "All" || app.priority === priority;
      return matchesQuery && matchesStatus && matchesPriority;
    });

    return result.sort((a, b) => {
      if (sort === "oldest") return new Date(a.date) - new Date(b.date);
      if (sort === "company") return a.company.localeCompare(b.company);
      if (sort === "priority") {
        const rank = { High: 0, Medium: 1, Low: 2 };
        return rank[a.priority] - rank[b.priority];
      }
      return new Date(b.date) - new Date(a.date);
    });
  }, [applications, query, status, priority, sort]);

  const clearFilters = () => {
    setQuery("");
    setStatus("All");
    setPriority("All");
    setSort("newest");
  };

  return (
    <main className="page applications-page">
      <section className="page-heading">
        <div>
          <div className="eyebrow"><span /> APPLICATION MANAGEMENT</div>
          <h1>Your applications</h1>
          <p>Search, filter, update and organize every opportunity.</p>
        </div>
        <button className="primary-button" onClick={onAdd}><Plus size={17} /> Add Application</button>
      </section>

      <section className="toolbar panel">
        <div className="search-control">
          <Search size={17} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search company, role or location..." />
          {query && <button onClick={() => setQuery("")}><X size={15} /></button>}
        </div>

        <button className={`filter-toggle ${filtersOpen ? "active" : ""}`} onClick={() => setFiltersOpen((v) => !v)}>
          <SlidersHorizontal size={16} /> Filters <ChevronDown size={15} />
        </button>

        <div className="sort-control">
          <ArrowDownUp size={15} />
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="company">Company A–Z</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {(query || status !== "All" || priority !== "All") && (
          <button className="clear-filter" onClick={clearFilters}>Clear</button>
        )}
      </section>

      {filtersOpen && (
        <section className="filter-panel panel">
          <Filter label="Status" value={status} onChange={setStatus} options={["All", "Applied", "Interview", "Offer", "Rejected", "Withdrawn"]} />
          <Filter label="Priority" value={priority} onChange={setPriority} options={["All", "High", "Medium", "Low"]} />
          <div className="filter-summary"><strong>{filtered.length}</strong> matching applications</div>
        </section>
      )}

      <section className="application-results">
        <div className="results-heading">
          <span>{filtered.length} {filtered.length === 1 ? "application" : "applications"}</span>
          <small>{applications.length ? `of ${applications.length} total` : "Start your job search"}</small>
        </div>

        {filtered.length ? (
          <div className="application-grid">
            {filtered.map((app) => (
              <ApplicationCard key={app.id} app={app} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        ) : (
          <div className="large-empty panel">
            <div className="empty-illustration"><Search size={26} /></div>
            <h2>No applications found</h2>
            <p>Try changing your search or filters, or add a new application.</p>
            <button className="primary-button" onClick={query || status !== "All" || priority !== "All" ? clearFilters : onAdd}>
              {query || status !== "All" || priority !== "All" ? "Clear filters" : "Add application"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function Filter({ label, value, onChange, options }) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((item) => <option key={item}>{item}</option>)}
      </select>
    </label>
  );
}

function ApplicationCard({ app, onEdit, onDelete }) {
  return (
    <article className="application-card-large panel">
      <div className="card-top">
        <div className="company-logo large">{app.company?.charAt(0)?.toUpperCase() || "J"}</div>
        <div className="card-title">
          <h3>{app.role}</h3>
          <strong>{app.company}</strong>
        </div>
        <span className={`priority-badge ${app.priority?.toLowerCase()}`}>{app.priority}</span>
      </div>

      <div className="card-tags">
        <span className={`status-badge ${app.status?.toLowerCase()}`}>{app.status}</span>
        <span><MapPin size={14} /> {app.location}</span>
        <span><CalendarDays size={14} /> {formatDate(app.date)}</span>
      </div>

      <div className="card-detail-row">
        <div><small>Salary</small><strong>{app.salary || "Not specified"}</strong></div>
        <div><small>Follow-up</small><strong>{app.followUpDate ? formatDate(app.followUpDate) : "Not set"}</strong></div>
      </div>

      {app.notes && <p className="card-notes">{app.notes}</p>}

      {app.interviewDate && (
        <div className="interview-strip">
          <CalendarDays size={15} />
          <span>Interview: <strong>{formatDate(app.interviewDate)}</strong>{app.interviewTime ? ` at ${app.interviewTime}` : ""}</span>
        </div>
      )}

      <div className="card-actions">
        {app.jobUrl ? <a href={app.jobUrl} target="_blank" rel="noreferrer" className="secondary-button"><ExternalLink size={15} /> Open job</a> : <span />}
        <div>
          <button className="icon-button" onClick={() => onEdit(app)} title="Edit"><Pencil size={16} /></button>
          <button className="icon-button danger" onClick={() => onDelete(app.id)} title="Delete"><Trash2 size={16} /></button>
        </div>
      </div>
    </article>
  );
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default Applications;