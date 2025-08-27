import React, { useEffect, useRef, useState } from "react";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export default function Settings() {
  // user + loading
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // upload refs & flags
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // loading flags
  const [savingAccount, setSavingAccount] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  // small helper
  const apiFetch = async (path, opts = {}) => {
    const res = await fetch(`${BASE_API_URL}${path}`, {
      credentials: "include",
      ...opts,
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, json };
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { ok, json } = await apiFetch("/users/current-user", { method: "GET" });
        if (!ok || !json?.success) throw new Error(json?.message || "Failed to fetch current user");
        setUser(json.data);
        setFullName(json.data.fullName || "");
        setEmail(json.data.email || "");
      } catch (e) {
        setErr(e.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Avatar upload
  const handleAvatarChange = async (file) => {
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const { ok, json } = await apiFetch("/users/avatar", { method: "PATCH", body: fd });
      if (!ok || !json?.success) throw new Error(json?.message || "Avatar upload failed");
      const newAvatar = json?.data?.avatar || user?.avatar;
      setUser((u) => ({ ...u, avatar: newAvatar }));
      alert("Avatar updated ✅");
    } catch (e) {
      console.error(e);
      alert("Avatar update failed: " + e.message);
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  // Cover upload
  const handleCoverChange = async (file) => {
    if (!file) return;
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("coverImage", file);
      const { ok, json } = await apiFetch("/users/cover-image", { method: "PATCH", body: fd });
      if (!ok || !json?.success) throw new Error(json?.message || "Cover upload failed");
      const newCover = json?.data?.coverImage || user?.coverImage;
      setUser((u) => ({ ...u, coverImage: newCover }));
      alert("Cover updated ✅");
    } catch (e) {
      console.error(e);
      alert("Cover update failed: " + e.message);
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  // Update account
  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      alert("Name and email required");
      return;
    }
    setSavingAccount(true);
    try {
      const { ok, json } = await apiFetch("/users/update-account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email }),
      });
      if (!ok || !json?.success) throw new Error(json?.message || "Update failed");
      setUser((u) => ({ ...u, fullName, email }));
      alert("Account updated ✅");
    } catch (e) {
      console.error(e);
      alert("Update failed: " + e.message);
    } finally {
      setSavingAccount(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setChangingPass(true);
    try {
      const { ok, json } = await apiFetch("/users/change-password", {
        method: "POST", // ✅ matches Postman
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }), // ✅ confirmPassword not sent
      });

      if (!ok || !json?.success) throw new Error(json?.message || "Password change failed");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password changed ✅");
    } catch (e) {
      console.error(e);
      alert("Password change failed: " + e.message);
    } finally {
      setChangingPass(false);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading settings…</div>;
  if (err) return <div className="text-center mt-20 text-red-500">Error: {err}</div>;
  if (!user) return <div className="text-center mt-20">No user data found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Cover */}
      <div className="relative w-full h-48 md:h-60 overflow-hidden rounded-lg shadow-md">
        <img src={user.coverImage} alt="cover" className="w-full h-full object-cover" />
        <button
          className="absolute bottom-3 right-3 bg-white px-3 py-1 rounded shadow text-sm hover:bg-gray-100 disabled:opacity-60"
          onClick={() => coverInputRef.current?.click()}
          disabled={uploadingCover}
        >
          {uploadingCover ? "Uploading…" : "Change Cover"}
        </button>
        <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => handleCoverChange(e.target.files?.[0])} />
      </div>

      {/* avatar + info */}
      <div className="flex items-center gap-4 mt-4">
        <div className="relative">
          <img src={user.avatar} alt={user.fullName} className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover" />
          <button
            className="absolute bottom-1 right-1 bg-white px-2 py-1 rounded-full shadow text-xs hover:bg-gray-100 disabled:opacity-60"
            onClick={() => avatarInputRef.current?.click()}
            disabled={uploadingAvatar}
          >
            {uploadingAvatar ? "…" : "Edit"}
          </button>
          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => handleAvatarChange(e.target.files?.[0])} />
        </div>

        <div>
          <h2 className="text-2xl font-bold">{user.fullName}</h2>
          <p className="text-gray-500">@{user.userName}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* forms */}
      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Update Account</h3>
          <form className="flex flex-col gap-3" onSubmit={handleUpdateAccount}>
            <input className="border rounded px-3 py-2" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <input className="border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60" disabled={savingAccount} type="submit">
              {savingAccount ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <form className="flex flex-col gap-3" onSubmit={handleChangePassword}>
            <input type="password" placeholder="Current password" className="border rounded px-3 py-2" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            <input type="password" placeholder="New password" className="border rounded px-3 py-2" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <input type="password" placeholder="Confirm password" className="border rounded px-3 py-2" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-60" disabled={changingPass} type="submit">
              {changingPass ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
