import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Axios instance
import "./CartPage.css";

export default function CartPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [cart, setCart] = useState([]);

  // Fetch user's cart
  const fetchCart = async () => {
    try {
      const res = await api.get(`/shop/cart`, { params: { username } });
      setCart(res.data || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      alert("Failed to fetch cart. Check backend!");
    }
  };

  // Remove item from cart
  const removeFromCart = async (artworkId) => {
    try {
      await api.delete(`/shop/cart/remove/${artworkId}`, { params: { username } });
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove item.");
    }
  };

  // Buy all items in cart
  const buyCart = async () => {
    try {
      await api.post(`/shop/cart/buy`, { username });
      fetchCart();
      alert("Cart purchased successfully!");
    } catch (err) {
      console.error("Error buying cart:", err);
      alert("Failed to purchase cart.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div>
      <nav className="navbar3">
        <button onClick={() => navigate("/")}>🏠 Dashboard</button>
        <button onClick={() => navigate(-1)}>🔙 Back</button>
        <button onClick={() => navigate("/profile")}>👤 Profile</button>
      </nav>

      <div className="cart-section">
        <h2>🛒 My Cart</h2>
        {cart.length > 0 ? (
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                {item.imageUrl && (
                  <img src={`${api.defaults.baseURL}${item.imageUrl}`} alt={item.title} />
                )}
                <p><strong>{item.title}</strong></p>
                <p>${item.price}</p>
                <div className="btn-group">
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
            <button className="buy-btn" onClick={buyCart}>Buy All</button>
          </div>
        ) : (
          <p className="empty-msg">Your cart is empty 🛍</p>
        )}
      </div>
    </div>
  );
}