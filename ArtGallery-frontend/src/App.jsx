import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Gallery from "./pages/Gallery";

 import ArtistDashboard from "./pages/ArtistDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import CartPage from "./pages/CartPage";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Gallery />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/artistdashboard" element={<ArtistDashboard />} />
      <Route path="/customerdashboard" element={<CustomerDashboard/>} />
      <Route path="/cart" element={<CartPage/>} />
      <Route path="/admindashboard" element={<AdminDashboard/>} />

    </Routes>
  );
}

export default App;
