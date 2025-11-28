import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./ArtistDashboard.css";
import Profile from "./profile";

export default function ArtistDashboard() {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [newArt, setNewArt] = useState({ title: "", description: "", type: "", price: "" });
  const [imageFile, setImageFile] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", type: "", price: "" });

  const [showProfile, setShowProfile] = useState(false);

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!username || role !== "artist") {
      navigate("/login");
    } else {
      fetchArtworks(username);
    }
  }, [username, role, navigate]);

  const fetchArtworks = async (username) => {
    if (!username) return;
    try {
      const res = await api.get("/artworks/myartworks", { params: { username } });
      setArtworks(res.data);
    } catch (err) {
      console.error("Error fetching artworks:", err);
    }
  };

  const handleChange = (e) => setNewArt({ ...newArt, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const addArtwork = async (e) => {
    e.preventDefault();
    if (!username) return;
    try {
      const uploadData = new FormData();
      uploadData.append("username", username);
      uploadData.append("title", newArt.title);
      uploadData.append("description", newArt.description);
      uploadData.append("type", newArt.type);
      uploadData.append("price", newArt.price);
      if (imageFile) uploadData.append("image", imageFile);

      await api.post("/artworks/add", uploadData, { headers: { "Content-Type": "multipart/form-data" } });

      fetchArtworks(username);
      setNewArt({ title: "", description: "", type: "", price: "" });
      setImageFile(null);
    } catch (err) {
      console.error("Error adding artwork:", err);
    }
  };

  const deleteArtwork = async (id) => {
    if (!username) return;
    try {
      await api.delete(`/artworks/${id}`, { params: { username } });
      setArtworks((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error deleting artwork:", err);
    }
  };

  const startEdit = (art) => {
    setEditingId(art.id);
    setEditForm({ title: art.title, description: art.description, type: art.type, price: art.price });
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const saveEdit = async (id) => {
    try {
      await api.put(`/artworks/${id}`, null, { params: { username, ...editForm } });
      fetchArtworks(username);
      setEditingId(null);
    } catch (err) {
      console.error("Error updating artwork:", err);
    }
  };

  const cancelEdit = () => setEditingId(null);
  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  return (
    <div className="artist-dashboard">
      {/* Navbar */}
      <div className="navbar1">
        <Link to="/" className="logo">ArtGallery</Link>
        <div className="nav-links">
          <Link to="/" className="nav-btn">Dashboard</Link>
          <button onClick={() => setShowProfile(true)} className="nav-btn">👤 Profile</button>
          <button className="nav-btn logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <Profile
          username={username}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* Main Container */}
      <div className="dashboard-container">
        {/* Add Artwork Form */}
        <section className="add-art">
          <h3>Add New Artwork</h3>
          <form onSubmit={addArtwork}>
            <input type="text" name="title" placeholder="Title" value={newArt.title} onChange={handleChange} required />
            <textarea name="description" placeholder="Description" value={newArt.description} onChange={handleChange} />
            <input type="text" name="type" placeholder="Type" value={newArt.type} onChange={handleChange} />
            <input type="number" name="price" placeholder="Price" value={newArt.price} onChange={handleChange} required />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button type="submit">Add Artwork</button>
          </form>
        </section>

        {/* Artworks List */}
        <section className="art-list">
          <h3>My Artworks</h3>
          {artworks.length > 0 ? (
            <ul>
              {artworks.map((art) => (
                <li key={art.id} className={`art-item ${art.status?.toLowerCase()}`}>
                  {art.imageUrl && (
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${art.imageUrl}`}
                      alt={art.title}
                    />
                  )}

                  {editingId === art.id ? (
                    <div>
                      <input type="text" name="title" value={editForm.title} onChange={handleEditChange} />
                      <textarea name="description" value={editForm.description} onChange={handleEditChange} />
                      <input type="text" name="type" value={editForm.type} onChange={handleEditChange} />
                      <input type="number" name="price" value={editForm.price} onChange={handleEditChange} />
                      <button onClick={() => saveEdit(art.id)}>Save</button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <strong>{art.title}</strong> ({art.type}) - ${art.price}
                      <p>{art.description}</p>
                      <small>Uploaded: {new Date(art.createdAt).toLocaleString()}</small>
                      <p className={`status ${art.status?.toLowerCase()}`}>{art.status}</p>
                      <br />
                      <button onClick={() => startEdit(art)}>Edit</button>
                      <button onClick={() => deleteArtwork(art.id)}>Delete</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No artworks yet. Add your first one!</p>
          )}
        </section>
      </div>
    </div>
  );
}
