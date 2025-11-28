import React, { useState, useEffect } from "react";
import api from "../api";
import "./profile.css";

export default function Profile({ username, onClose }) {
  const [profile, setProfile] = useState({ email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/users/${username}`);
      // Only pick the fields you want to update
      setProfile({
        email: res.data.email || "",
        phone: res.data.phone || "",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setMessage("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Only send fields that can be updated
      const updateData = {
        email: profile.email,
        phone: profile.phone,
      };

      await api.put(`/users/${username}`, updateData, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage("Profile updated successfully!");
      onClose(); // close modal after success
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.response) {
        setMessage(`Update failed: ${err.response.data.message || err.response.status}`);
      } else {
        setMessage("Update failed: Server error");
      }
    }
  };

  if (!username) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        {loading ? (
          <p>Loading profile...</p>
        ) : (
          <form className="profile-form" onSubmit={handleUpdate}>
            <h2>👤 Profile</h2>
            <div>
              <label>Username:</label>
              <input type="text" value={username} disabled />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Update Profile</button>
            {message && <p className="message">{message}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
