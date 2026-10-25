import React from "react";
import { useEffect, useState } from "react";
import {
  X,
  BriefcaseBusiness,
  MapPin,
  CalendarDays,
  DollarSign,
  Link as LinkIcon,
  FileText,
  UserRound,
  Clock3,
  Video,
  Flag
} from "lucide-react";

const emptyForm = {
  company: "",
  role: "",
  location: "",
  status: "Applied",
  priority: "Medium",
  date: new Date().toISOString().slice(0, 10),
  salary: "",
  jobUrl: "",
  notes: "",
  interviewDate: "",
  interviewTime: "",
  interviewType: "Technical",
  interviewer: "",
  interviewNotes: "",
  followUpDate: ""
};

function AddApplicationModal({ editingApplication, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const editing = Boolean(editingApplication);

  useEffect(() => {
    setForm(editingApplication ? { ...emptyForm, ...editingApplication } : emptyForm);
  }, [editingApplication]);

  const change = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const submit = (event) => {
    event.preventDefault();

    if (!form.company.trim()) return setError("Company name is required.");
    if (!form.role.trim()) return setError("Job title is required.");
    if (!form.location.trim()) return setError("Location is required.");
    if (!form.date) return setError("Application date is required.");

    if (form.status === "Interview" && !form.interviewDate) {
      return setError("Add an interview date when the status is Interview.");
    }

    const data = {
      ...form,
      company: form.company.trim(),
      role: form.role.trim(),
      location: form.location.trim(),
      id: editing ? editingApplication.id : Date.now(),
      createdAt: editing ? editingApplication.createdAt : new Date().toISOString()
    };

    onSave(data);
  };

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="application-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <div className="modal-icon"><BriefcaseBusiness size={20} /></div>
            <div>
              <h2>{editing ? "Edit application" : "Add application"}</h2>
              <p>{editing ? "Update your opportunity details." : "Capture every important job-search detail."}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={submit}>
          <div className="modal-scroll">
            <div className="form-section">
              <div className="form-section-title">
                <span>01</span>
                <div><strong>Opportunity</strong><small>Core application information</small></div>
              </div>

              <div className="form-grid">
                <Field icon={BriefcaseBusiness} label="Company Name" required>
                  <input value={form.company} onChange={(e) => change("company", e.target.value)} placeholder="e.g. Google" />
                </Field>

                <Field icon={FileText} label="Job Title" required>
                  <input value={form.role} onChange={(e) => change("role", e.target.value)} placeholder="e.g. Frontend Developer" />
                </Field>

                <Field icon={MapPin} label="Location" required>
                  <input value={form.location} onChange={(e) => change("location", e.target.value)} placeholder="e.g. Chennai / Remote" />
                </Field>

                <Field icon={CalendarDays} label="Application Date" required>
                  <input type="date" value={form.date} onChange={(e) => change("date", e.target.value)} />
                </Field>

                <Field icon={Flag} label="Status">
                  <select value={form.status} onChange={(e) => change("status", e.target.value)}>
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                    <option>Withdrawn</option>
                  </select>
                </Field>

                <Field icon={Flag} label="Priority">
                  <select value={form.priority} onChange={(e) => change("priority", e.target.value)}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </Field>

                <Field icon={DollarSign} label="Expected Salary">
                  <input value={form.salary} onChange={(e) => change("salary", e.target.value)} placeholder="e.g. ₹6 LPA" />
                </Field>

                <Field icon={LinkIcon} label="Job URL">
                  <input type="url" value={form.jobUrl} onChange={(e) => change("jobUrl", e.target.value)} placeholder="https://..." />
                </Field>

                <Field label="Follow-up Date">
                  <input type="date" value={form.followUpDate} onChange={(e) => change("followUpDate", e.target.value)} />
                </Field>

                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea rows="3" value={form.notes} onChange={(e) => change("notes", e.target.value)} placeholder="Recruiter details, preparation notes, next steps..." />
                </div>
              </div>
            </div>

            {form.status === "Interview" && (
              <div className="form-section interview-form-section">
                <div className="form-section-title">
                  <span>02</span>
                  <div><strong>Interview details</strong><small>Keep your interview plan ready</small></div>
                </div>

                <div className="form-grid">
                  <Field icon={CalendarDays} label="Interview Date" required>
                    <input type="date" value={form.interviewDate} onChange={(e) => change("interviewDate", e.target.value)} />
                  </Field>

                  <Field icon={Clock3} label="Interview Time">
                    <input type="time" value={form.interviewTime} onChange={(e) => change("interviewTime", e.target.value)} />
                  </Field>

                  <Field icon={Video} label="Interview Type">
                    <select value={form.interviewType} onChange={(e) => change("interviewType", e.target.value)}>
                      <option>Technical</option>
                      <option>HR</option>
                      <option>Technical + HR</option>
                      <option>Online</option>
                      <option>Phone</option>
                      <option>On-site</option>
                    </select>
                  </Field>

                  <Field icon={UserRound} label="Interviewer">
                    <input value={form.interviewer} onChange={(e) => change("interviewer", e.target.value)} placeholder="e.g. Hiring Team" />
                  </Field>

                  <div className="form-group full-width">
                    <label>Interview Notes</label>
                    <textarea rows="3" value={form.interviewNotes} onChange={(e) => change("interviewNotes", e.target.value)} placeholder="Questions to revise, people to meet, documents to carry..." />
                  </div>
                </div>
              </div>
            )}

            {error && <div className="form-error">{error}</div>}
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-button">
              <BriefcaseBusiness size={17} />
              {editing ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, required, children }) {
  return (
    <div className="form-group">
      <label>{label} {required && <span>*</span>}</label>
      <div className="input-wrapper">
        {Icon && <Icon size={16} />}
        {children}
      </div>
    </div>
  );
}

export default AddApplicationModal;