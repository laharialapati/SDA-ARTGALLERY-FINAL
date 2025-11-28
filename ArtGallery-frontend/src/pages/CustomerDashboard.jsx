import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // Axios instance
import Profile from "./profile";
import "./CustomerDashboard.css";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [artworks, setArtworks] = useState([]);
  const [cart, setCart] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (!username) navigate("/login");
    else {
      fetchArtworks();
      fetchCart();
    }
  }, [username, navigate]);

  // Fetch all artworks
  const fetchArtworks = async () => {
    try {
      const res = await api.get("/artworks");
      setArtworks(res.data);
    } catch (err) {
      console.error("Error fetching artworks:", err);
      alert("Failed to fetch artworks.");
    }
  };

  // Fetch user cart
  const fetchCart = async () => {
    try {
      const res = await api.get(`/shop/cart`, { params: { username } });
      setCart(res.data || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      alert("Failed to fetch cart.");
    }
  };

  // Add item to cart
  const addToCart = async (art) => {
    try {
      await api.post("/shop/cart/add", { username, artworkId: art.id });
      fetchCart();
      alert(`Added "${art.title}" to cart!`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart.");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="customer-dashboard">
      <nav className="navbar2">
        <Link to="/" className="logo">ArtGallery</Link>
        <div className="nav-links">
          {/* <Link to="/" className="nav-btn">Dashboard</Link> */}
          <Link to="/cart" className="nav-btn">Cart ({cart.length})</Link>
          <button onClick={() => setShowProfile(true)} className="nav-btn">👤 Profile</button>
          <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
        </div>
      </nav>

      {showProfile && <Profile username={username} onClose={() => setShowProfile(false)} />}

      <section className="art-gallery">
        <h2>Artworks</h2>
        <div className="art-grid">
          {artworks.map((art) => (
            <div key={art.id} className="art-card">
              {art.imageUrl && <img src={`${api.defaults.baseURL}${art.imageUrl}`} alt={art.title} />}
              <h3>{art.title}</h3>
              <p>{art.description}</p>
              <p><strong>Type:</strong> {art.type}</p>
              <p><strong>Price:</strong> ${art.price}</p>
              <p><em>By: {art.artist?.username || "Unknown"}</em></p>
              <button onClick={() => addToCart(art)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
