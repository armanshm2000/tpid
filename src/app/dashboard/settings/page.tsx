"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/Header";

export default function SettingsPage() {
  const { data: session, update } = useSession();

  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  // Password state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");

  // Notification state
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [browserNotifs, setBrowserNotifs] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [savingNotifs, setSavingNotifs] = useState(false);
  const [notifMsg, setNotifMsg] = useState("");

  // Theme state
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [savingTheme, setSavingTheme] = useState(false);
  const [themeMsg, setThemeMsg] = useState("");

  useEffect(() => {
    if (session?.user) {
      const u = session.user as Record<string, unknown>;
      setName((u.name as string) || "");
      setEmail((u.email as string) || "");
      setRole((u.role as string) || "VIEWER");
    }
  }, [session]);

  // Load persisted settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tpid-settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.emailNotifs === "boolean") setEmailNotifs(parsed.emailNotifs);
        if (typeof parsed.browserNotifs === "boolean") setBrowserNotifs(parsed.browserNotifs);
        if (typeof parsed.weeklyDigest === "boolean") setWeeklyDigest(parsed.weeklyDigest);
        if (parsed.theme) setTheme(parsed.theme);
      }
    } catch {
      // ignore
    }
  }, []);

  function persistSettings(patch: Record<string, unknown>) {
    try {
      const existing = localStorage.getItem("tpid-settings");
      const current = existing ? JSON.parse(existing) : {};
      localStorage.setItem("tpid-settings", JSON.stringify({ ...current, ...patch }));
    } catch {
      // ignore
    }
  }

  // Profile
  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setProfileErr("Name cannot be empty.");
      return;
    }
    setSavingProfile(true);
    setProfileMsg("");
    setProfileErr("");
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        await update({ name: name.trim() });
        setProfileMsg("Profile updated successfully.");
      } else {
        setProfileErr(data.error || "Failed to update profile.");
      }
    } catch {
      setProfileErr("Failed to update profile.");
    }
    setSavingProfile(false);
  }

  // Password
  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg("");
    setPwErr("");

    if (!currentPw || !newPw) {
      setPwErr("All fields are required.");
      return;
    }
    if (newPw.length < 6) {
      setPwErr("New password must be at least 6 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwErr("New passwords do not match.");
      return;
    }

    setSavingPw(true);
    try {
      const res = await fetch("/api/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwMsg("Password updated successfully.");
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
      } else {
        setPwErr(data.error || "Failed to update password.");
      }
    } catch {
      setPwErr("Failed to update password.");
    }
    setSavingPw(false);
  }

  // Notifications
  function handleNotifsSave() {
    setSavingNotifs(true);
    setNotifMsg("");
    persistSettings({ emailNotifs, browserNotifs, weeklyDigest });
    setTimeout(() => {
      setNotifMsg("Notification preferences saved.");
      setSavingNotifs(false);
    }, 300);
  }

  // Theme
  function handleThemeSave(newTheme: "light" | "dark" | "system") {
    setTheme(newTheme);
    setSavingTheme(true);
    setThemeMsg("");
    persistSettings({ theme: newTheme });
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    setTimeout(() => {
      setThemeMsg("Theme preference saved.");
      setSavingTheme(false);
    }, 300);
  }

  return (
    <>
      <Header title="Settings" />
      <div className="p-8 space-y-8 max-w-3xl">
        {/* Profile Section */}
        <section className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Profile</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage your account information.</p>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" value={email} className="input bg-gray-50 dark:bg-gray-800 cursor-not-allowed" disabled />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <input type="text" value={role} className="input bg-gray-50 dark:bg-gray-800 cursor-not-allowed" disabled />
              <p className="text-xs text-gray-400 mt-1">Role is assigned by an administrator.</p>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={savingProfile} className="btn-primary">
                {savingProfile ? "Saving…" : "Save Profile"}
              </button>
              {profileMsg && <span className="text-sm text-green-600">{profileMsg}</span>}
              {profileErr && <span className="text-sm text-red-600">{profileErr}</span>}
            </div>
          </form>
        </section>

        {/* Password Section */}
        <section className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Change Password</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Update your account password.</p>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
              <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="input" placeholder="Enter current password" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="input" placeholder="At least 6 characters" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="input" placeholder="Repeat new password" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={savingPw} className="btn-primary">
                {savingPw ? "Updating…" : "Update Password"}
              </button>
              {pwMsg && <span className="text-sm text-green-600">{pwMsg}</span>}
              {pwErr && <span className="text-sm text-red-600">{pwErr}</span>}
            </div>
          </form>
        </section>

        {/* Notifications Section */}
        <section className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Notifications</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Choose how you want to be notified.</p>
          <div className="space-y-4">
            <ToggleRow label="Email notifications" description="Receive email alerts for project updates" checked={emailNotifs} onChange={setEmailNotifs} />
            <ToggleRow label="Browser notifications" description="Get push notifications in your browser" checked={browserNotifs} onChange={setBrowserNotifs} />
            <ToggleRow label="Weekly digest" description="Summary of project activity every Monday" checked={weeklyDigest} onChange={setWeeklyDigest} />
            <div className="flex items-center gap-3 pt-2">
              <button onClick={handleNotifsSave} disabled={savingNotifs} className="btn-primary">
                {savingNotifs ? "Saving…" : "Save Preferences"}
              </button>
              {notifMsg && <span className="text-sm text-green-600">{notifMsg}</span>}
            </div>
          </div>
        </section>

        {/* Theme Section */}
        <section className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Theme</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Select your preferred color scheme.</p>
          <div className="space-y-3">
            {(["light", "dark", "system"] as const).map((t) => (
              <label key={t} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="theme"
                  value={t}
                  checked={theme === t}
                  onChange={() => handleThemeSave(t)}
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{t}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t === "light" && "Bright and clean interface"}
                    {t === "dark" && "Easy on the eyes in low light"}
                    {t === "system" && "Match your operating system setting"}
                  </p>
                </div>
              </label>
            ))}
            {themeMsg && <span className="text-sm text-green-600">{themeMsg}</span>}
          </div>
        </section>
      </div>
    </>
  );
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${checked ? "bg-brand-600" : "bg-gray-200 dark:bg-gray-700"}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}
