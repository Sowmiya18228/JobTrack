import React, { useState } from "react";
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
} from "lucide-react";

function Topbar({ darkMode, setDarkMode }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeProfileOption, setActiveProfileOption] = useState(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: <CheckCircle2 size={17} />,
      title: "Application tracking is active",
      text: "Your JobTrack data is saved locally.",
      unread: true,
    },
    {
      id: 2,
      icon: <CalendarDays size={17} />,
      title: "Stay prepared",
      text: "Keep your upcoming interviews updated.",
      unread: true,
    },
    {
      id: 3,
      icon: <BriefcaseBusiness size={17} />,
      title: "Track your opportunities",
      text: "Add your latest job applications.",
      unread: true,
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const openProfileOption = (option) => {
    setActiveProfileOption(option);
    setShowProfile(false);
    setShowNotifications(false);
  };

  return (
    <>
      <header className="topbar">
        {/* Search */}
        <div className="topbar-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search applications..."
            aria-label="Search applications"
          />

          <span className="search-shortcut"></span>
        </div>

        <div className="topbar-actions">
          {/* =========================
              NOTIFICATIONS
          ========================= */}
          <div className="notification-wrapper">
            <button
              className="icon-button notification-button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell size={19} />

              {unreadCount > 0 && (
                <span className="notification-dot"></span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <div>
                    <h3>Notifications</h3>

                    <p>
                      {unreadCount > 0
                        ? `${unreadCount} unread notification${
                            unreadCount > 1 ? "s" : ""
                          }`
                        : "You're all caught up"}
                    </p>
                  </div>

                  <button
                    className="notification-close"
                    onClick={() => setShowNotifications(false)}
                    aria-label="Close notifications"
                  >
                    <X size={17} />
                  </button>
                </div>

                <div className="notification-list">
                  {notifications.map((notification) => (
                    <div
                      className={`notification-item ${
                        notification.unread ? "unread" : ""
                      }`}
                      key={notification.id}
                    >
                      <div className="notification-icon">
                        {notification.icon}
                      </div>

                      <div className="notification-content">
                        <strong>{notification.title}</strong>
                        <p>{notification.text}</p>
                      </div>

                      {notification.unread && (
                        <span className="notification-unread-dot"></span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="notification-footer">
                  <button onClick={markAllAsRead}>
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* =========================
              DARK / LIGHT MODE
          ========================= */}
          <button
            className="icon-button theme-button"
            onClick={() => setDarkMode(!darkMode)}
            title={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* =========================
              PROFILE
          ========================= */}
          <div className="profile-wrapper">
            <button
              className="profile-button"
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
            >
              <div className="profile-avatar">S</div>

              <div className="profile-info">
                <strong>Sowmiya</strong>
                <span>Job Seeker</span>
              </div>

              <ChevronDown
                size={16}
                className={showProfile ? "rotate-icon" : ""}
              />
            </button>

            {showProfile && (
              <div className="profile-dropdown">
                {/* Profile Header */}
                <div className="profile-dropdown-header">
                  <div className="profile-avatar large">
                    S
                  </div>

                  <div>
                    <strong>Sowmiya</strong>
                    <span>Job Seeker</span>
                  </div>
                </div>

                <div className="profile-dropdown-divider"></div>

                {/* My Profile */}
                <button
                  onClick={() => openProfileOption("profile")}
                >
                  <User size={16} />
                  <span>My Profile</span>
                </button>

                {/* Account Settings */}
                <button
                  onClick={() => openProfileOption("settings")}
                >
                  <Settings size={16} />
                  <span>Account Settings</span>
                </button>

                {/* Help & Support */}
                <button
                  onClick={() => openProfileOption("help")}
                >
                  <HelpCircle size={16} />
                  <span>Help & Support</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =========================
          PROFILE MODAL
      ========================= */}
      {activeProfileOption && (
        <div
          className="profile-modal-overlay"
          onClick={() => setActiveProfileOption(null)}
        >
          <div
            className="profile-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="profile-modal-close"
              onClick={() => setActiveProfileOption(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* =========================
                MY PROFILE
            ========================= */}
            {activeProfileOption === "profile" && (
              <>
                <div className="profile-modal-icon">
                  <User size={24} />
                </div>

                <h2>My Profile</h2>

                <p className="profile-modal-subtitle">
                  Your JobTrack profile
                </p>

                <div className="profile-details">
                  <div>
                    <span>Name</span>
                    <strong>Sowmiya</strong>
                  </div>

                  <div>
                    <span>Role</span>
                    <strong>Job Seeker</strong>
                  </div>

                  <div>
                    <span>Platform</span>
                    <strong>JobTrack</strong>
                  </div>

                  <div>
                    <span>Goal</span>
                    <strong>Career Growth</strong>
                  </div>
                </div>
              </>
            )}

            {/* =========================
                ACCOUNT SETTINGS
            ========================= */}
            {activeProfileOption === "settings" && (
              <>
                <div className="profile-modal-icon">
                  <Settings size={24} />
                </div>

                <h2>Account Settings</h2>

                <p className="profile-modal-subtitle">
                  Manage your JobTrack preferences
                </p>

                <div className="settings-info">
                  <div className="settings-row">
                    <div>
                      <span>Theme</span>
                      <small>
                        Choose your preferred appearance
                      </small>
                    </div>

                    <strong>
                      {darkMode ? "Dark" : "Light"}
                    </strong>
                  </div>

                  <div className="settings-row">
                    <div>
                      <span>Notifications</span>
                      <small>
                        Job application notifications
                      </small>
                    </div>

                    <strong>Enabled</strong>
                  </div>

                  <div className="settings-row">
                    <div>
                      <span>Data Storage</span>
                      <small>
                        Where your application data is stored
                      </small>
                    </div>

                    <strong>Local</strong>
                  </div>
                </div>
              </>
            )}

            {/* =========================
                HELP & SUPPORT
            ========================= */}
            {activeProfileOption === "help" && (
              <>
                <div className="profile-modal-icon">
                  <HelpCircle size={24} />
                </div>

                <h2>Help & Support</h2>

                <p className="profile-modal-subtitle">
                  Learn how to use JobTrack
                </p>

                <div className="help-content">
                  <div className="help-item">
                    <strong>📋 Applications</strong>
                    <p>
                      Add and manage your job applications,
                      update their status, and track your progress.
                    </p>
                  </div>

                  <div className="help-item">
                    <strong>📅 Interviews</strong>
                    <p>
                      Keep track of upcoming interviews and
                      important interview details.
                    </p>
                  </div>

                  <div className="help-item">
                    <strong>📊 Analytics</strong>
                    <p>
                      View your application statistics and
                      understand your job search performance.
                    </p>
                  </div>

                  <div className="help-tip">
                    💡 <strong>Tip:</strong> Your application
                    data is stored locally in your browser.
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Topbar;