import React from "react";
import { useMemo } from "react";
import { BarChart3, BriefcaseBusiness, CalendarCheck, Trophy, TrendingUp, Target } from "lucide-react";

function Analytics({ applications }) {
  const statusData = useMemo(() => {
    const statuses = ["Applied", "Interview", "Offer", "Rejected", "Withdrawn"];
    return statuses.map((status) => ({
      status,
      count: applications.filter((a) => a.status === status).length
    }));
  }, [applications]);

  const priorityData = useMemo(() => {
    return ["High", "Medium", "Low"].map((priority) => ({
      priority,
      count: applications.filter((a) => a.priority === priority).length
    }));
  }, [applications]);

  const monthly = useMemo(() => {
    const now = new Date();
    const values = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      values.push({
        label: d.toLocaleDateString("en-US", { month: "short" }),
        count: applications.filter((a) => a.date?.slice(0, 7) === key).length
      });
    }
    return values;
  }, [applications]);

  const total = applications.length;
  const interviews = applications.filter((a) => a.status === "Interview" || a.status === "Offer").length;
  const offers = applications.filter((a) => a.status === "Offer").length;
  const rejected = applications.filter((a) => a.status === "Rejected").length;

  const interviewRate = total ? Math.round((interviews / total) * 100) : 0;
  const offerRate = total ? Math.round((offers / total) * 100) : 0;
  const rejectionRate = total ? Math.round((rejected / total) * 100) : 0;

  const maxMonth = Math.max(1, ...monthly.map((x) => x.count));

  return (
    <main className="page">
      <section className="page-heading">
        <div>
          <div className="eyebrow"><span /> SEARCH ANALYTICS</div>
          <h1>Career analytics</h1>
          <p>Understand your application pipeline and improve your strategy.</p>
        </div>
      </section>

      <section className="analytics-kpis">
        <Metric icon={BriefcaseBusiness} label="Applications" value={total} />
        <Metric icon={CalendarCheck} label="Interview rate" value={`${interviewRate}%`} />
        <Metric icon={Trophy} label="Offer rate" value={`${offerRate}%`} />
        <Metric icon={TrendingUp} label="Rejection rate" value={`${rejectionRate}%`} />
      </section>

      <section className="analytics-grid">
        <div className="panel chart-panel">
          <div className="panel-heading"><div><h2>Application activity</h2><p>Applications added over the last six months</p></div><BarChart3 size={19} /></div>
          <div className="bar-chart">
            {monthly.map((item) => (
              <div className="bar-column" key={item.label}>
                <span className="bar-value">{item.count}</span>
                <div className="bar-track"><div className="bar-fill" style={{ height: `${(item.count / maxMonth) * 100}%` }} /></div>
                <small>{item.label}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="panel chart-panel">
          <div className="panel-heading"><div><h2>Pipeline health</h2><p>Current status distribution</p></div><Target size={19} /></div>
          <div className="status-chart">
            {statusData.map((item) => {
              const percentage = total ? Math.round((item.count / total) * 100) : 0;
              return (
                <div className="status-line" key={item.status}>
                  <div><span className={`legend-dot ${item.status.toLowerCase()}`} /><strong>{item.status}</strong><small>{percentage}%</small></div>
                  <div className="line-track"><div className={`line-fill ${item.status.toLowerCase()}`} style={{ width: `${percentage}%` }} /></div>
                  <b>{item.count}</b>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel chart-panel">
          <div className="panel-heading"><div><h2>Priority mix</h2><p>How you are prioritizing opportunities</p></div></div>
          <div className="priority-bars">
            {priorityData.map((item) => (
              <div className="priority-row" key={item.priority}>
                <div><span>{item.priority}</span><strong>{item.count}</strong></div>
                <div className="priority-track"><div style={{ width: `${total ? (item.count / total) * 100 : 0}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel chart-panel conversion-panel">
          <div className="panel-heading"><div><h2>Conversion funnel</h2><p>From applications to offers</p></div></div>
          <Funnel label="Applied" value={total} width="100%" />
          <Funnel label="Interviews" value={interviews} width={`${total ? (interviews / total) * 100 : 0}%`} />
          <Funnel label="Offers" value={offers} width={`${total ? (offers / total) * 100 : 0}%`} />
        </div>
      </section>
    </main>
  );
}

function Metric({ icon: Icon, label, value }) {
  return <div className="analytics-metric panel"><div className="round-icon"><Icon size={18} /></div><div><strong>{value}</strong><span>{label}</span></div></div>;
}

function Funnel({ label, value, width }) {
  return <div className="funnel-row"><div><span>{label}</span><strong>{value}</strong></div><div className="funnel-track"><div style={{ width }} /></div></div>;
}

export default Analytics;