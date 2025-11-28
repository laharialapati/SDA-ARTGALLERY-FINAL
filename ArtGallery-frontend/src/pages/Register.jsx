import React, { useState } from "react";
import axios from "axios";
import { FaGoogle, FaTwitter, FaFacebookF } from "react-icons/fa";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/register`,
        form
      );
      setMessage(res.data); // backend returns plain string
    } catch (err) {
      setMessage(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <h2>Create Your Account</h2>

      <form onSubmit={handleSubmit} className="register-form">
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="full-width"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="full-width"
        >
          <option value="customer">Customer</option>
          <option value="artist">Artist</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="full-width">Register</button>
      </form>

      {message && <p className="message">{message}</p>}

      {/* Social login */}
      <div className="social-login">
        <p>Or sign up with</p>
        <div className="social-icons">
          <button type="button" className="google"><FaGoogle /></button>
          <button type="button" className="twitter"><FaTwitter /></button>
          <button type="button" className="facebook"><FaFacebookF /></button>
        </div>
      </div>

      <p className="login-link">
        Already registered? <a href="/login">Login</a>
      </p>
    </div>
  );
}
