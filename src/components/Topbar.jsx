
import React, { useEffect, useState } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  CheckCircle2,
  CalendarDays,
  BriefcaseBusiness,
  X,
  User,
  Settings,
  HelpCircle,
  Save,
  ChevronRight,
  Menu,
} from "lucide-react";

const PROFILE_KEY = "jobtrack_profile_v1";
const SETTINGS_KEY = "jobtrack_settings_v1";

const defaultProfile = {
  name: "Job Seeker",
  email: "",
  role: "Job Seeker",
  careerGoal: "Career Growth",
};

const defaultSettings = {
  notifications: true,
};

const faqs = [
  {
    question: "How do I add a job application?",
    answer:
      "Open the Applications page and use the Add Application button to enter the company, role, application date and status.",
  },
  {
    question: "Where are my job applications stored?",
    answer:
      "Job applications are managed by your configured backend API. Profile and notification preferences are saved in this browser for now.",
  },
  {
    question: "Will my profile appear on another device?",
    answer:
      "Not yet. Profile settings use this browser's LocalStorage. After login is implemented, profiles can be stored per user in the database.",
  },
  {
    question: "How do I change the theme?",
    answer:
      "Open Account Settings and use the theme button in the top bar to switch between light and dark mode.",
  },
];

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
  } catch {
    return fallback;
  }
}

export default function Topbar({
  darkMode,
  setDarkMode,
  onMenu,
  onAdd,
  onSearch,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeModal, setActiveModal] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(0);
  const [savedMessage, setSavedMessage] = useState("");
  const [searchText, setSearchText] = useState("");

  const [profile, setProfile] = useState(() =>
    readStorage(PROFILE_KEY, defaultProfile)
  );

  const [draftProfile, setDraftProfile] = useState(profile);

  const [settings, setSettings] = useState(() =>
    readStorage(SETTINGS_KEY, defaultSettings)
  );

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // Storage may be unavailable in private browsing.
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Keep the app usable even if storage is unavailable.
    }
  }, [settings]);

  const openModal = (name) => {
    setShowProfile(false);
    setShowNotifications(false);
    setSavedMessage("");

    if (name === "profile") {
      setDraftProfile({ ...profile });
    }

    setActiveModal(name);
  };

  const closeModal = () => {
    setActiveModal("");
    setSavedMessage("");
  };

  const saveProfile = (event) => {
    event.preventDefault();

    const cleanedProfile = {
      name: draftProfile.name.trim(),
      email: draftProfile.email.trim(),
      role: draftProfile.role.trim(),
      careerGoal: draftProfile.careerGoal.trim(),
    };

    if (!cleanedProfile.name) {
      setSavedMessage("Please enter your name.");
      return;
    }

    setProfile(cleanedProfile);
    setSavedMessage("Profile saved successfully!");
  };

  const updateDraft = (field, value) => {
    setDraftProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const toggleNotifications = () => {
    setSettings((previous) => ({
      ...previous,
      notifications: !previous.notifications,
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchText.trim();

    if (query && onSearch) {
      onSearch(query);
    }
  };

  const displayName = profile.name || "Job Seeker";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const notifications = [
    {
      id: 1,
      icon: CheckCircle2,
      title: "Keep your profile updated",
      description: "Add your career goal and contact email.",
      time: "Profile",
    },
    {
      id: 2,
      icon: BriefcaseBusiness,
      title: "Track your applications",
      description: "Update application statuses as you progress.",
      time: "Applications",
    },
    {
      id: 3,
      icon: CalendarDays,
      title: "Stay interview-ready",
      description: "Keep upcoming interview details organized.",
      time: "Interviews",
    },
  ];

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          {onMenu && (
            <button
              type="button"
              className="topbar-icon-btn"
              onClick={onMenu}
              aria-label="Toggle navigation"
            >
              <Menu size={20} />
            </button>
          )}

          <form className="topbar-search" onSubmit={handleSearch}>
            <Search size={18} />
            <input
              type="search"
              placeholder="Search..."
              aria-label="Search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            {searchText && (
              <button
                type="button"
                className="topbar-clear-btn"
                onClick={() => setSearchText("")}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </form>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className="topbar-icon-btn"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={
              darkMode ? "Switch to light theme" : "Switch to dark theme"
            }
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          <div className="topbar-menu-wrap">
            <button
              type="button"
              className="topbar-icon-btn notification-trigger"
              onClick={() => {
                setShowNotifications((previous) => !previous);
                setShowProfile(false);
              }}
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <Bell size={19} />
              {settings.notifications && (
                <span className="notification-dot" />
              )}
            </button>

            {showNotifications && (
              <div className="topbar-popover notifications-popover">
                <div className="popover-heading">
                  <div>
                    <h3>Notifications</h3>
                    <p>Your JobTrack reminders</p>
                  </div>
                  <button
                    type="button"
                    className="topbar-icon-btn"
                    onClick={() => setShowNotifications(false)}
                    aria-label="Close notifications"
                  >
                    <X size={17} />
                  </button>
                </div>

                {!settings.notifications ? (
                  <p className="topbar-empty">
                    Notifications are turned off. Enable them in Account
                    Settings to see reminders.
                  </p>
                ) : (
                  notifications.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div className="notification-item" key={item.id}>
                        <span className="notification-item-icon">
                          <Icon size={18} />
                        </span>
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.description}</p>
                          <small>{item.time}</small>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <div className="topbar-menu-wrap">
            <button
              type="button"
              className="topbar-profile-trigger"
              onClick={() => {
                setShowProfile((previous) => !previous);
                setShowNotifications(false);
              }}
              aria-expanded={showProfile}
            >
              <span className="topbar-avatar">{initials || "U"}</span>
              <span className="topbar-profile-name">{displayName}</span>
              <ChevronDown size={16} />
            </button>

            {showProfile && (
              <div className="topbar-popover profile-popover">
                <div className="profile-popover-header">
                  <span className="topbar-avatar large">
                    {initials || "U"}
                  </span>
                  <div>
                    <strong>{displayName}</strong>
                    <p>{profile.role || "Job Seeker"}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="profile-menu-item"
                  onClick={() => openModal("profile")}
                >
                  <User size={18} />
                  <span>My Profile</span>
                  <ChevronRight size={16} />
                </button>

                <button
                  type="button"
                  className="profile-menu-item"
                  onClick={() => openModal("settings")}
                >
                  <Settings size={18} />
                  <span>Account Settings</span>
                  <ChevronRight size={16} />
                </button>

                <button
                  type="button"
                  className="profile-menu-item"
                  onClick={() => openModal("help")}
                >
                  <HelpCircle size={18} />
                  <span>Help &amp; Support</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {activeModal && (
        <div
          className="topbar-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className="topbar-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="topbar-modal-title"
          >
            <div className="topbar-modal-header">
              <div>
                <h2 id="topbar-modal-title">
                  {activeModal === "profile" && "My Profile"}
                  {activeModal === "settings" && "Account Settings"}
                  {activeModal === "help" && "Help & Support"}
                </h2>
                <p>
                  {activeModal === "profile" &&
                    "Edit your personal and career details."}
                  {activeModal === "settings" &&
                    "Customize your JobTrack experience."}
                  {activeModal === "help" &&
                    "Find answers to common questions."}
                </p>
              </div>

              <button
                type="button"
                className="topbar-icon-btn"
                onClick={closeModal}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            {activeModal === "profile" && (
              <form className="topbar-modal-body" onSubmit={saveProfile}>
                <label className="topbar-field">
                  Full name
                  <input
                    value={draftProfile.name}
                    onChange={(event) =>
                      updateDraft("name", event.target.value)
                    }
                    placeholder="Enter your name"
                    required
                    maxLength={80}
                  />
                </label>

                <label className="topbar-field">
                  Email address
                  <input
                    type="email"
                    value={draftProfile.email}
                    onChange={(event) =>
                      updateDraft("email", event.target.value)
                    }
                    placeholder="you@example.com"
                    maxLength={150}
                  />
                </label>

                <label className="topbar-field">
                  Current role
                  <input
                    value={draftProfile.role}
                    onChange={(event) =>
                      updateDraft("role", event.target.value)
                    }
                    placeholder="e.g. Student, Job Seeker"
                    maxLength={80}
                  />
                </label>

                <label className="topbar-field">
                  Career goal
                  <input
                    value={draftProfile.careerGoal}
                    onChange={(event) =>
                      updateDraft("careerGoal", event.target.value)
                    }
                    placeholder="e.g. Software Engineer"
                    maxLength={120}
                  />
                </label>

                {savedMessage && (
                  <p
                    className="topbar-feedback"
                    role="status"
                    aria-live="polite"
                  >
                    {savedMessage}
                  </p>
                )}

                <div className="topbar-modal-footer">
                  <button
                    type="button"
                    className="topbar-secondary-btn"
                    onClick={() => {
                      setDraftProfile({ ...profile });
                      closeModal();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="topbar-primary-btn">
                    <Save size={16} />
                    Save Profile
                  </button>
                </div>
              </form>
            )}

            {activeModal === "settings" && (
              <div className="topbar-modal-body">
                <div className="settings-row">
                  <div className="settings-row-icon">
                    {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <div className="settings-row-content">
                    <strong>Appearance</strong>
                    <p>Choose a theme that works for you.</p>
                  </div>
                  <button
                    type="button"
                    className="topbar-secondary-btn"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    {darkMode ? "Dark mode" : "Light mode"}
                  </button>
                </div>

                <div className="settings-row">
                  <div className="settings-row-icon">
                    <Bell size={20} />
                  </div>
                  <div className="settings-row-content">
                    <strong>Notifications</strong>
                    <p>Show job tracking reminders in this app.</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.notifications}
                    className={`topbar-switch ${
                      settings.notifications ? "is-on" : ""
                    }`}
                    onClick={toggleNotifications}
                    aria-label="Toggle notifications"
                  >
                    <span />
                  </button>
                </div>

                <p className="topbar-settings-note">
                  Your theme and notification preferences are saved in this
                  browser. Job application data continues to use your configured
                  backend.
                </p>
              </div>
            )}

            {activeModal === "help" && (
              <div className="topbar-modal-body">
                <div className="help-intro">
                  <HelpCircle size={24} />
                  <div>
                    <strong>How can we help?</strong>
                    <p>Select a question to view its answer.</p>
                  </div>
                </div>

                <div className="faq-list">
                  {faqs.map((faq, index) => (
                    <div className="faq-item" key={faq.question}>
                      <button
                        type="button"
                        className="faq-question"
                        onClick={() =>
                          setExpandedFaq((previous) =>
                            previous === index ? -1 : index
                          )
                        }
                        aria-expanded={expandedFaq === index}
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          size={18}
                          className={
                            expandedFaq === index ? "faq-chevron open" : ""
                          }
                        />
                      </button>

                      {expandedFaq === index && (
                        <p className="faq-answer">{faq.answer}</p>
                      )}
                    </div>
                  ))}
                </div>

                <p className="topbar-settings-note">
                  These are in-app help topics; external support messaging is
                  not configured yet.
                </p>
              </div>
            )}
          </section>
        </div>
      )}

      <style>{`
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          width: 100%;
          min-width: 0;
        }
        .topbar-left, .topbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .topbar-search {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 180px;
          padding: 10px 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 10px;
          color: var(--text-muted, #737b8c);
        }
        .topbar-search input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: none;
          background: transparent;
          color: var(--text-primary, inherit);
          font: inherit;
        }
        .topbar-icon-btn, .topbar-clear-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 10px;
          background: var(--card-bg, transparent);
          color: var(--text-primary, inherit);
          cursor: pointer;
        }
        .topbar-clear-btn {
          width: 25px;
          height: 25px;
          border: 0;
        }
        .notification-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ef4444;
        }
        .topbar-menu-wrap { position: relative; }
        .topbar-profile-trigger {
          display: flex;
          align-items: center;
          gap: 9px;
          max-width: 240px;
          padding: 4px 7px;
          border: 0;
          border-radius: 10px;
          background: transparent;
          color: var(--text-primary, inherit);
          cursor: pointer;
        }
        .topbar-avatar {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #dbeafe;
          color: #1d4ed8;
          font-weight: 700;
        }
        .topbar-avatar.large { width: 44px; height: 44px; }
        .topbar-profile-name {
          max-width: 135px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 600;
        }
        .topbar-popover {
          position: absolute;
          z-index: 1000;
          top: calc(100% + 10px);
          right: 0;
          width: min(350px, calc(100vw - 28px));
          padding: 12px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 14px;
          background: var(--card-bg, #fff);
          color: var(--text-primary, #111827);
          box-shadow: 0 12px 40px rgba(0,0,0,.14);
        }
        .popover-heading, .profile-popover-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 7px 5px 13px;
        }
        .popover-heading { justify-content: space-between; }
        .popover-heading h3 { margin: 0 0 4px; font-size: 16px; }
        .popover-heading p, .profile-popover-header p {
          margin: 0;
          font-size: 12px;
          color: var(--text-muted, #737b8c);
        }
        .profile-popover-header { border-bottom: 1px solid var(--border-color, #e5e7eb); }
        .profile-popover-header strong { display: block; margin-bottom: 4px; }
        .profile-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 8px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
        }
        .profile-menu-item:hover, .faq-question:hover {
          background: var(--hover-bg, rgba(127,127,127,.09));
        }
        .profile-menu-item span { flex: 1; }
        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 5px;
          border-top: 1px solid var(--border-color, #e5e7eb);
        }
        .notification-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          border-radius: 9px;
          background: var(--hover-bg, #f3f4f6);
        }
        .notification-item strong { font-size: 13px; }
        .notification-item p, .notification-item small {
          display: block;
          margin: 5px 0 0;
          color: var(--text-muted, #737b8c);
          font-size: 12px;
          line-height: 1.5;
        }
        .topbar-empty {
          padding: 12px 4px;
          color: var(--text-muted, #737b8c);
          font-size: 13px;
          line-height: 1.6;
        }
        .topbar-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          padding: 18px;
          background: rgba(15, 23, 42, .58);
        }
        .topbar-modal {
          width: min(520px, 100%);
          max-height: calc(100% - 20px);
          overflow-y: auto;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 16px;
          background: var(--card-bg, #fff);
          color: var(--text-primary, #111827);
          box-shadow: 0 20px 60px rgba(0,0,0,.2);
        }
        .topbar-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 22px 22px 16px;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
        }
        .topbar-modal-header h2 { margin: 0 0 6px; font-size: 20px; }
        .topbar-modal-header p {
          margin: 0;
          color: var(--text-muted, #737b8c);
          font-size: 13px;
          line-height: 1.5;
        }
        .topbar-modal-body { display: flex; flex-direction: column; gap: 16px; padding: 22px; }
        .topbar-field { display: flex; flex-direction: column; gap: 7px; font-size: 13px; font-weight: 600; }
        .topbar-field input {
          width: 100%;
          min-height: 42px;
          padding: 10px 12px;
          border: 1px solid var(--border-color, #d1d5db);
          border-radius: 9px;
          outline: none;
          background: var(--input-bg, var(--card-bg, #fff));
          color: var(--text-primary, #111827);
          font: inherit;
          font-weight: 400;
        }
        .topbar-field input:focus {
          border-color: var(--accent-color, #6366f1);
          box-shadow: 0 0 0 3px rgba(99,102,241,.12);
        }
        .topbar-modal-footer { display: flex; justify-content: flex-end; gap: 10px; flex-wrap: wrap; }
        .topbar-primary-btn, .topbar-secondary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 40px;
          padding: 9px 13px;
          border: 1px solid var(--border-color, #d1d5db);
          border-radius: 9px;
          background: var(--card-bg, #fff);
          color: var(--text-primary, #111827);
          font: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .topbar-primary-btn {
          border-color: #4f46e5;
          background: #4f46e5;
          color: #fff;
        }
        .topbar-feedback { margin: 0; color: #15803d; font-size: 13px; }
        .settings-row { display: flex; align-items: center; gap: 12px; }
        .settings-row-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 10px;
          background: var(--hover-bg, #f3f4f6);
        }
        .settings-row-content { flex: 1; min-width: 0; }
        .settings-row-content strong { font-size: 14px; }
        .settings-row-content p {
          margin: 4px 0 0;
          color: var(--text-muted, #737b8c);
          font-size: 12px;
          line-height: 1.5;
        }
        .topbar-switch {
          display: flex;
          align-items: center;
          width: 44px;
          height: 25px;
          padding: 3px;
          border: 0;
          border-radius: 99px;
          background: #9ca3af;
          cursor: pointer;
        }
        .topbar-switch span {
          width: 19px;
          height: 19px;
          border-radius: 50%;
          background: #fff;
          transition: transform .18s ease;
        }
        .topbar-switch.is-on { background: #4f46e5; }
        .topbar-switch.is-on span { transform: translateX(19px); }
        .topbar-settings-note {
          margin: 2px 0 0;
          color: var(--text-muted, #737b8c);
          font-size: 12px;
          line-height: 1.6;
        }
        .help-intro { display: flex; align-items: center; gap: 12px; }
        .help-intro strong { font-size: 14px; }
        .help-intro p { margin: 4px 0 0; color: var(--text-muted, #737b8c); font-size: 12px; }
        .faq-list { border-top: 1px solid var(--border-color, #e5e7eb); }
        .faq-item { border-bottom: 1px solid var(--border-color, #e5e7eb); }
        .faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          width: 100%;
          padding: 14px 8px;
          border: 0;
          border-radius: 7px;
          background: transparent;
          color: inherit;
          text-align: left;
          font: inherit;
          font-size: 13px;
          cursor: pointer;
        }
        .faq-chevron { flex-shrink: 0; transition: transform .15s ease; }
        .faq-chevron.open { transform: rotate(180deg); }
        .faq-answer {
          margin: 0;
          padding: 0 8px 15px;
          color: var(--text-muted, #737b8c);
          font-size: 13px;
          line-height: 1.65;
        }
        @media (max-width: 600px) {
          .topbar { flex-wrap: wrap; }
          .topbar-left { flex: 1; }
          .topbar-search { flex: 1; min-width: 0; }
          .topbar-actions { gap: 6px; }
          .topbar-profile-name { display: none; }
          .topbar-profile-trigger { gap: 5px; padding: 2px; }
          .topbar-modal-header, .topbar-modal-body { padding: 17px; }
          .settings-row { flex-wrap: wrap; }
          .settings-row-content { flex-basis: calc(100% - 60px); }
          .settings-row > .topbar-secondary-btn,
          .settings-row > .topbar-switch { margin-left: 52px; }
        }
      `}</style>
    </>
  );
}
