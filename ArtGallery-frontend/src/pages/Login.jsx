import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/login`,
        form
      );

      const userData = res.data;

      // ✅ Store username and role in localStorage
      localStorage.setItem("username", userData.username);
      localStorage.setItem("role", userData.role);

      setMessage(`Login successful. Welcome ${userData.username}`);

      // ✅ Redirect based on role
      if (userData.role === "admin") navigate("/admindashboard");
      else if (userData.role === "artist") navigate("/artistdashboard");
      else navigate("/customerdashboard");
    } catch (err) {
      if (err.response?.status === 401)
        setMessage("Invalid username or password");
      else if (err.response?.status === 400)
        setMessage("Username and password are required");
      else setMessage("Server error. Please try again later");
    }
  };

  return (
    <div className="login-container">
      <h2>Art Gallery Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>

      <p>{message}</p>

      <p className="register-link">
        Don’t have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
