import { useEffect, useState } from "react";
import marrakechBg from '../Images/marrakechBg.jpg'; // Remplacez par votre image

const sliderTexts = [
  {
    title: "La municipalité de Marrakech",
    subtitle: "Une ville rouge plus connectée, plus attractive.",
  },
  {
    title: "La municipalité de Marrakech",
    subtitle: "Le digital au service de l'économie et du bien-être.",
  },
  {
    title: "La municipalité de Marrakech",
    subtitle: "L'innovation digitale pour une ville rouge en mouvement.",
  }
];

const Slider = () => {
  const [slide, setSlide] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSlide((prev) => (prev + 1) % sliderTexts.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [slide]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "650px",
        backgroundImage: `url(${marrakechBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
      }}
    >
      {/* Overlay pour effet moderne */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)",
          zIndex: 1,
        }}
      />

      {/* Contenu principal */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: "#fff",
          width: "100%",
          maxWidth: "800px",
          padding: "0 20px",
          marginTop: "-5px" // Pour remonter légèrement le contenu
        }}
      >
        <h2 style={{ 
          color: "#B81F22", 
          fontWeight: "700", 
          marginBottom: "1.5rem", 
          fontSize: "2.5rem",
          textShadow: "1px 1px 3px rgba(0,0,0,0.3)"
        }}>
          {sliderTexts[slide].title}
        </h2>
        <h3 style={{ 
          color: "#fff", 
          fontWeight: "500", 
          marginBottom: "3rem", 
          fontSize: "1.8rem", 
          textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          lineHeight: "1.3"
        }}>
          {sliderTexts[slide].subtitle}
        </h3>
        
        {/* Barre de recherche améliorée */}
        <div
          style={{
            margin: "0 auto",
            background: "rgba(255,255,255,0.9)",
            borderRadius: "40px",
            display: "flex",
            alignItems: "center",
            maxWidth: "500px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            padding: "0.5rem 1.5rem",
            transition: "transform 0.3s ease",
            ":hover": {
              transform: "scale(1.02)"
            }
          }}
        >
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un service, une info..."
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: "1.1rem",
              color: "#333",
              padding: "0.8rem 0.5rem",
            }}
          />
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            style={{ marginLeft: "0.5rem", cursor: "pointer" }}
          >
            <circle cx="11" cy="11" r="8" stroke="#B81F22" strokeWidth="2"/>
            <path d="M17 17L21 21" stroke="#B81F22" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Points de navigation améliorés */}
      <div
        style={{
          position: "absolute",
          bottom: "50px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          display: "flex",
          gap: "15px"
        }}
      >
        {sliderTexts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setSlide(idx)}
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: slide === idx ? "#B81F22" : "transparent",
              border: `2px solid ${slide === idx ? "#B81F22" : "#fff"}`,
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
              outline: "none"
            }}
            aria-label={`Aller au slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;