import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [editStatus, setEditStatus] = useState({}); // Track status dropdowns

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!username || role !== "admin") {
      navigate("/login");
    } else {
      fetchUsers();
      fetchArtworks();
    }
  }, [username, role, navigate]);

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // ✅ Fetch all artworks
  const fetchArtworks = async () => {
    try {
      const res = await api.get("/admin/artworks");
      setArtworks(res.data);
    } catch (err) {
      console.error("Error fetching artworks:", err);
    }
  };

  // ✅ Delete user (only for artists)
  const deleteUser = async (usernameToDelete) => {
    if (!window.confirm(`Delete artist "${usernameToDelete}"?`)) return;
    try {
      await api.delete(`/admin/users/${usernameToDelete}`);
      setUsers(users.filter((u) => u.username !== usernameToDelete));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // ✅ Approve / Reject artwork
  const updateArtworkStatus = async (id, status) => {
    try {
      await api.put(`/admin/artworks/${id}/status`, { status });
      fetchArtworks();
    } catch (err) {
      console.error("Error updating artwork status:", err);
    }
  };

  // ✅ Edit artwork status anytime
  const editArtworkStatus = async (id) => {
    const newStatus = editStatus[id];
    if (!newStatus) return;
    try {
      await api.patch(`/admin/artworks/${id}/edit-status`, newStatus, {
        headers: { "Content-Type": "text/plain" },
      });
      fetchArtworks();
      setEditStatus((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("Error editing artwork status:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      {/* Navbar */}
      <nav className="navbar-admin">
        <Link to="/" className="logo">
          ArtGallery Admin
        </Link>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className="dashboard-container">
        {/* USERS SECTION */}
        <section className="users-section">
          <h2>All Users</h2>
          {users.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((user) => user.username !== username)
                  .map((user) => (
                    <tr key={user.username}>
                      <td>{user.username}</td>
                      <td>{user.role}</td>
                      <td>
                        {user.role === "artist" ? (
                          <button
                            className="delete-btn"
                            onClick={() => deleteUser(user.username)}
                          >
                            Delete
                          </button>
                        ) : (
                          <span style={{ color: "#6b7280" }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>No users found.</p>
          )}
        </section>

        {/* ARTWORKS SECTION */}
        <section className="artworks-section">
          <h2>All Artworks</h2>
          {artworks.length > 0 ? (
            <div className="art-grid">
              {artworks.map((art) => (
                <div key={art.id} className="art-card">
                  {art.imageUrl && (
                    <img
                      src={`${api.defaults.baseURL}${art.imageUrl}`}
                      alt={art.title}
                    />
                  )}
                  <div className="art-card-content">
                    <div>
                      <h3>{art.title}</h3>
                      <p>{art.description}</p>
                      <p>
                        <strong>Type:</strong> {art.type}
                      </p>
                      <p>
                        <strong>Price:</strong> ${art.price}
                      </p>
                      <p>
                        <em>By: {art.artist?.username || "Unknown"}</em>
                      </p>
                      <p className={`status ${art.status}`}>
                        {art.status.toUpperCase()}
                      </p>
                    </div>

                    <div className="btn-group">
                      {art.status === "PENDING" ? (
                        <>
                          <button
                            className="approve-btn"
                            onClick={() =>
                              updateArtworkStatus(art.id, "APPROVED")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() =>
                              updateArtworkStatus(art.id, "REJECTED")
                            }
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <div className="edit-status-group">
                          <select
                            value={editStatus[art.id] || ""}
                            onChange={(e) =>
                              setEditStatus((prev) => ({
                                ...prev,
                                [art.id]: e.target.value,
                              }))
                            }
                          >
                            <option value="">Change Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                          </select>
                          <button
                            className="save-btn"
                            onClick={() => editArtworkStatus(art.id)}
                          >
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No artworks found.</p>
          )}
        </section>
      </div>
    </div>
  );
}
