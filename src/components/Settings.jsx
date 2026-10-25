
import React from "react";
import {
  Moon,
  Sun,
  Trash2,
  RotateCcw,
  Database,
  ShieldCheck,
  Palette,
} from "lucide-react";

function Settings({ darkMode, setDarkMode, onClear, onReset }) {
  return (
    <main className="page">
      <section className="page-heading">
        <div>
          <div className="eyebrow">
            <span /> PREFERENCES
          </div>
          <h1>Settings</h1>
          <p>Personalize JobTrack and manage your application data.</p>
        </div>
      </section>

      <div className="settings-grid">
        <section className="panel settings-card">
          <div className="settings-title">
            <div className="round-icon">
              <Palette size={18} />
            </div>
            <div>
              <h2>Appearance</h2>
              <p>Choose how JobTrack looks on your device.</p>
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-copy">
              <strong>Theme</strong>
              <span>
                {darkMode
                  ? "Dark mode is enabled."
                  : "Light mode is enabled."}
              </span>
            </div>

            <button
              className="theme-choice"
              onClick={() => setDarkMode((v) => !v)}
            >
              <span>
                {darkMode ? <Moon size={15} /> : <Sun size={15} />}
                {darkMode ? "Dark" : "Light"}
              </span>
            </button>
          </div>
        </section>

        <section className="panel settings-card">
          <div className="settings-title">
            <div className="round-icon">
              <Database size={18} />
            </div>
            <div>
              <h2>Database & Data Management</h2>
              <p>
                Manage job applications stored through the
                JobTrack API and MongoDB.
              </p>
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-copy">
              <strong>Restore demo data</strong>
              <span>
                Add sample applications for testing the dashboard
                and interview features.
              </span>
            </div>
            <button className="secondary-button" onClick={onReset}>
              <RotateCcw size={15} /> Restore
            </button>
          </div>

          <div className="setting-row danger-row">
            <div className="setting-copy">
              <strong>Clear all applications</strong>
              <span>
                Remove application records from the database.
              </span>
            </div>
            <button className="danger-button" onClick={onClear}>
              <Trash2 size={15} /> Clear data
            </button>
          </div>
        </section>

        <section className="panel settings-card">
          <div className="settings-title">
            <div className="round-icon">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2>Privacy</h2>
              <p>About your application data.</p>
            </div>
          </div>

          <div className="privacy-note">
            <ShieldCheck size={18} />
            <span>
              JobTrack uses a backend API and MongoDB database.
              Keep your database credentials private.
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Settings;
