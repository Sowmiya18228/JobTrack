
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./components/Dashboard";
import Applications from "./components/Applications";
import Interviews from "./components/Interviews";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";
import AddApplicationModal from "./components/AddApplicationModal";
import Toast from "./components/Toast";
import "./App.css";

// Local development uses localhost.
// For deployment, set VITE_API_URL to your deployed backend URL.
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const THEME_KEY = "jobtrack_theme_v2";

const demoApplications = [
  {
    company: "Arshith Group",
    role: "Web Developer",
    location: "Chennai / Hybrid",
    status: "Interview",
    priority: "High",
    date: "2026-10-04",
    salary: "₹5–7 LPA",
    jobUrl: "",
    notes: "Prepare React, JavaScript, responsive design and HR answers.",
    interviewDate: "2026-10-09",
    interviewTime: "10:30",
    interviewType: "Technical + HR",
    interviewer: "Hiring Team",
    interviewNotes: "Revise project explanation and JavaScript basics.",
    followUpDate: "2026-10-12",
  },
  {
    company: "TechNova Solutions",
    role: "Frontend Developer",
    location: "Bangalore",
    status: "Applied",
    priority: "Medium",
    date: "2026-10-02",
    salary: "₹6 LPA",
    jobUrl: "",
    notes: "React-focused role.",
    interviewDate: "",
    interviewTime: "",
    interviewType: "",
    interviewer: "",
    interviewNotes: "",
    followUpDate: "2026-10-10",
  },
  {
    company: "CloudPeak Digital",
    role: "Junior Software Developer",
    location: "Coimbatore / Remote",
    status: "Applied",
    priority: "Low",
    date: "2026-09-28",
    salary: "₹4.5 LPA",
    jobUrl: "",
    notes: "Check application status after one week.",
    interviewDate: "",
    interviewTime: "",
    interviewType: "",
    interviewer: "",
    interviewNotes: "",
    followUpDate: "2026-10-06",
  },
  {
    company: "DataBridge Labs",
    role: "Software Engineer Trainee",
    location: "Hyderabad",
    status: "Rejected",
    priority: "Medium",
    date: "2026-09-20",
    salary: "₹5 LPA",
    jobUrl: "",
    notes: "Use feedback to improve future applications.",
    interviewDate: "",
    interviewTime: "",
    interviewType: "",
    interviewer: "",
    interviewNotes: "",
    followUpDate: "",
  },
];

// Handle common API response formats.
function normalizeApplications(data) {
  const records = Array.isArray(data)
    ? data
    : data?.applications ?? data?.data;

  if (!Array.isArray(records)) {
    throw new Error("Unexpected applications API response.");
  }

  return records.map((item) => ({
    ...item,
    id: item.id ?? item._id,
  }));
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `API request failed (${response.status})`
    );
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return null;
}

function App() {
  const [applications, setApplications] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [toast, setToast] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) === "dark";
    } catch {
      return false;
    }
  });

  // Load job applications from MongoDB through the backend API.
  const loadFromServer = async () => {
    const data = await apiRequest("/api/applications");
    return normalizeApplications(data);
  };

  useEffect(() => {
    let cancelled = false;

    async function loadApplications() {
      try {
        const records = await loadFromServer();

        if (!cancelled) {
          setApplications(records);
          setApiError("");
        }
      } catch (error) {
        if (!cancelled) {
          setApiError(error.message);
        }
      } finally {
        if (!cancelled) {
          setDataLoading(false);
        }
      }
    }

    loadApplications();

    return () => {
      cancelled = true;
    };
  }, []);

  // Keep only the visual theme in LocalStorage.
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light");
    } catch {
      // Theme preference storage is optional.
    }
  }, [darkMode]);

  useEffect(() => {
    document.title = `JobTrack — ${activePage}`;
  }, [activePage]);

  const showToast = (message, type = "success") => {
    setToast({ id: Date.now(), message, type });
  };

  const openAddModal = () => {
    setEditingApplication(null);
    setShowModal(true);
  };

  const openEditModal = (application) => {
    setEditingApplication(application);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingApplication(null);
  };

  // Create a new record or update an existing MongoDB record.
  const saveApplication = async (application) => {
    try {
      setApiError("");

      const isEditing = Boolean(editingApplication?.id);
      const recordId = editingApplication?.id ?? application.id;

      const payload = { ...application };
      delete payload.id;
      delete payload._id;
      delete payload.__v;

      const result = await apiRequest(
        isEditing
          ? `/api/applications/${encodeURIComponent(recordId)}`
          : "/api/applications",
        {
          method: isEditing ? "PUT" : "POST",
          body: JSON.stringify(payload),
        }
      );

      // Refresh from the server to use the canonical database records.
      const records = await loadFromServer();
      setApplications(records);

      closeModal();
      showToast(
        isEditing
          ? "Application updated successfully."
          : "Application added successfully."
      );

      return result;
    } catch (error) {
      setApiError(error.message);
      showToast(`Could not save application: ${error.message}`, "error");
    }
  };

  const deleteApplication = async (id) => {
    const target = applications.find(
      (item) => String(item.id) === String(id)
    );

    if (!target) return;

    if (
      !window.confirm(
        `Delete the application for ${target.role} at ${target.company}?`
      )
    ) {
      return;
    }

    try {
      setApiError("");

      await apiRequest(
        `/api/applications/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      setApplications((current) =>
        current.filter((item) => String(item.id) !== String(id))
      );

      showToast("Application deleted.", "info");
    } catch (error) {
      setApiError(error.message);
      showToast(`Could not delete application: ${error.message}`, "error");
    }
  };

  // Update individual fields, for example an application status.
  const updateApplication = async (id, updates) => {
    const target = applications.find(
      (item) => String(item.id) === String(id)
    );

    if (!target) return;

    try {
      setApiError("");

      const payload = { ...target, ...updates };
      delete payload.id;
      delete payload._id;
      delete payload.__v;

      await apiRequest(
        `/api/applications/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      const records = await loadFromServer();
      setApplications(records);
    } catch (error) {
      setApiError(error.message);
      showToast(`Could not update application: ${error.message}`, "error");
    }
  };

  // Delete all existing records from MongoDB.
  const clearAllData = async () => {
    if (applications.length === 0) {
      showToast("There are no applications to clear.", "info");
      return;
    }

    if (
      !window.confirm(
        "This will permanently delete all your JobTrack applications. Continue?"
      )
    ) {
      return;
    }

    try {
      setApiError("");

      for (const application of applications) {
        await apiRequest(
          `/api/applications/${encodeURIComponent(application.id)}`,
          { method: "DELETE" }
        );
      }

      const records = await loadFromServer();
      setApplications(records);
      showToast("Application data cleared.", "info");
    } catch (error) {
      setApiError(error.message);
      showToast(
        `Some records may remain. Refresh the app and check: ${error.message}`,
        "error"
      );
    }
  };

  // Replace current records with demo records in MongoDB.
  const resetDemoData = async () => {
    if (
      !window.confirm(
        "Replace your current applications with demo data? This will delete the existing records."
      )
    ) {
      return;
    }

    try {
      setApiError("");

      for (const application of applications) {
        await apiRequest(
          `/api/applications/${encodeURIComponent(application.id)}`,
          { method: "DELETE" }
        );
      }

      for (const demo of demoApplications) {
        await apiRequest("/api/applications", {
          method: "POST",
          body: JSON.stringify(demo),
        });
      }

      const records = await loadFromServer();
      setApplications(records);
      showToast("Demo data restored.");
    } catch (error) {
      setApiError(error.message);
      showToast(
        `Could not fully restore demo data. Refresh and check the records: ${error.message}`,
        "error"
      );
    }
  };

  const stats = useMemo(() => {
    const total = applications.length;
    const applied = applications.filter(
      (a) => a.status === "Applied"
    ).length;
    const interview = applications.filter(
      (a) => a.status === "Interview"
    ).length;
    const offer = applications.filter(
      (a) => a.status === "Offer"
    ).length;
    const rejected = applications.filter(
      (a) => a.status === "Rejected"
    ).length;

    return { total, applied, interview, offer, rejected };
  }, [applications]);

  const renderPage = () => {
    const common = {
      applications,
      onAdd: openAddModal,
      onEdit: openEditModal,
      onDelete: deleteApplication,
      onUpdate: updateApplication,
      onNavigate: setActivePage,
    };

    switch (activePage) {
      case "Applications":
        return <Applications {...common} />;
      case "Interviews":
        return <Interviews {...common} />;
      case "Analytics":
        return <Analytics {...common} />;
      case "Settings":
        return (
          <Settings
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onClear={clearAllData}
            onReset={resetDemoData}
          />
        );
      default:
        return <Dashboard {...common} stats={stats} />;
    }
  };

  return (
    <div className={`app-shell ${darkMode ? "dark" : ""}`}>
      <Sidebar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          setMobileSidebar(false);
        }}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebar}
        setMobileOpen={setMobileSidebar}
      />

      <div className="main-shell">
        <Topbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onMenu={() => setMobileSidebar((v) => !v)}
          onAdd={openAddModal}
        />

        <div className="page-transition" key={activePage}>
          {dataLoading && (
            <div className="panel" role="status">
              Loading applications from MongoDB...
            </div>
          )}

          {!dataLoading && apiError && (
            <div className="panel" role="alert">
              <strong>Unable to sync with the server.</strong>
              <p>{apiError}</p>
              <button
                className="secondary-button"
                onClick={async () => {
                  setDataLoading(true);
                  try {
                    const records = await loadFromServer();
                    setApplications(records);
                    setApiError("");
                  } catch (error) {
                    setApiError(error.message);
                  } finally {
                    setDataLoading(false);
                  }
                }}
              >
                Retry connection
              </button>
            </div>
          )}

          {!dataLoading && renderPage()}
        </div>
      </div>

      {showModal && (
        <AddApplicationModal
          editingApplication={editingApplication}
          onClose={closeModal}
          onSave={saveApplication}
        />
      )}

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
