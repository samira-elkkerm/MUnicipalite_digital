import React from "react";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const socialStyle = {
  background: "#8B2323",
  color: "#fff",
  borderRadius: "8px",
  width: 38,
  height: 38,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 22,
  marginLeft: 12,
  transition: "background 0.2s"
};

const Footer = () => (
  <footer style={{
    background: "#fff",
    border: "1px solid #e3e3e3",
    borderRadius: 6,
    padding: "30px 0 18px 0",
    width: "100%",
    boxSizing: "border-box"
  }}>
    <div className="container" style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between">
        {/* Menu et copyright */}
        <div style={{ flex: 1, minWidth: 250 }}>
          <nav style={{ marginBottom: 18 }}>
            <a href="/municipalite" style={{ color: "#181818", textDecoration: "none", fontWeight: 500, marginRight: 28 }}>Municipalité</a>
            <a href="/services" style={{ color: "#181818", textDecoration: "none", fontWeight: 500, marginRight: 28 }}>Services</a>
            <a href="/tourisme-culture" style={{ color: "#181818", textDecoration: "none", fontWeight: 500, marginRight: 28 }}>Tourisme & Culture</a>
            <a href="/medias" style={{ color: "#181818", textDecoration: "none", fontWeight: 500, marginRight: 28 }}>Médias</a>
            <a href="/contact" style={{ color: "#181818", textDecoration: "none", fontWeight: 500 }}>Contact</a>
          </nav>
          <div style={{ fontWeight: "bold", fontSize: "1.05rem", marginTop: 12 }}>
            Copyright © 2025.
          </div>
        </div>
        {/* Réseaux sociaux */}
        <div className="d-flex align-items-center" style={{ gap: 0 }}>
          <a
            href="https://web.facebook.com/people/Commune-de-Marrakech/61550645349272/"
            target="_blank"
            rel="noopener noreferrer"
            style={socialStyle}
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.instagram.com/commune_marrakech/#"
            target="_blank"
            rel="noopener noreferrer"
            style={socialStyle}
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://x.com/CommunMarrakech"
            target="_blank"
            rel="noopener noreferrer"
            style={socialStyle}
            aria-label="X"
          >
            <FaXTwitter />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
