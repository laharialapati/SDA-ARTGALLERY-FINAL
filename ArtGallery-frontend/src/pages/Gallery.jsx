import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Gallery.css";

export default function Gallery() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const intervalRef = useRef(null);

  const slides = [
    { id: 1, src: "/assets/slide1.jpg", title: "Curated Originals", subtitle: "Discover art you love" },
    { id: 2, src: "/assets/img2.jpg", title: "Emerging Artists", subtitle: "Support new voices" },
    { id: 3, src: "/assets/slide4.jpg", title: "Museum Quality", subtitle: "Shop with confidence" },
  ];

  const artStyles = [
    "Abstract", "Landscape", "Portrait", "Minimalist", "Pop Art", "Cubism",
    "Impressionism", "Surrealism", "Street Art", "Figurative", "Expressionism",
    "Photography", "Sculpture", "Digital Art",
  ];

  const categoryCards = [
    { id: "abstract", title: "Abstract", desc: "Bold forms & colors", img: "/assets/slide6.jpg" },
    { id: "landscape", title: "Landscapes", desc: "Nature & vistas", img: "/assets/img5.jpg" },
    { id: "portrait", title: "Portraits", desc: "Faces & stories", img: "/assets/slide3.jpg" },
    { id: "modern", title: "Modern", desc: "Contemporary vision", img: "/assets/img1.jpg" },
    { id: "sculpture", title: "Sculpture", desc: "3D expressions", img: "/assets/img6.jpg" },
    { id: "photography", title: "Photography", desc: "Captured moments", img: "/assets/img4.jpg" },
    
  ];

  const total = slides.length;

  const next = useCallback(() => setSlideIndex((prev) => (prev + 1) % total), [total]);
  const prev = useCallback(() => setSlideIndex((prev) => (prev - 1 + total) % total), [total]);
  const goTo = useCallback((idx) => setSlideIndex(((idx % total) + total) % total), [total]);

  useEffect(() => {
    intervalRef.current = setInterval(next, 4000);
    return () => clearInterval(intervalRef.current);
  }, [next]);

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="logo">🎨 VirtuArt</Link>
        </div>
        <div className="nav-right">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <h1>Find your next favorite artwork</h1>
        <p>Original pieces from emerging and established artists worldwide</p>
      </header>

      {/* Carousel */}
      <section className="carousel">
        <div className="track" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
          {slides.map((s) => (
            <div className="slide" key={s.id}>
              <img src={s.src} alt={s.title} />
              <div className="caption">
                <h3>{s.title}</h3>
                <p>{s.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="control prev" onClick={prev}>‹</button>
        <button className="control next" onClick={next}>›</button>
        <div className="dots">
          {slides.map((_, i) => (
            <button
              key={`dot-${i}`}
              className={`dot ${i === slideIndex ? "active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </section>

      {/* Marquee */}
      <section className="marquee">
        <div className="marquee-track">
          {[...artStyles, ...artStyles].map((style, i) => (
            <span key={`style-${i}`} className="marquee-item">{style}</span>
          ))}
        </div>
      </section>

      {/* Category Cards */}
      <section className="cards">
        <div className="cards-grid">
          {categoryCards.map((c) => (
            <div
              key={c.id}
              className="card"
              onClick={() => setSelectedCard(c)}
            >
              <img src={c.img} alt={c.title} className="card-img" />
              <div className="card-body">
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedCard && (
        <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCard(null)}>×</button>
            <h2>{selectedCard.title}</h2>
            <img src={selectedCard.img} alt={selectedCard.title} />
            <p>{selectedCard.desc}</p>
          </div>
        </div>
      )}

     
      {/* Footer */}
<footer
  className="footer"
  style={{
    color: "#333333",       // blackish grey
    fontSize: "18px",       // bigger font
    fontWeight: "500",      // optional: make it a bit bolder
    padding: "25px 20px",   // slightly more padding
    textAlign: "center",
  }}
>
  <p>© {new Date().getFullYear()} Art Gallery. All rights reserved.</p>
</footer>
    </div>
  );
}
