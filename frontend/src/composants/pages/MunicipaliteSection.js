import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import des images locales
import DurabiliteImg from '../../Images/Durabilité.jpg';
import QualiteImg from '../../Images/Qualité de vie.jpg';
import AttractiviteImg from '../../Images/Attractivité.jpg';
import InnovationImg from '../../Images/Innovation.jpeg';
import DefaultImg from '../../Images/Qualité de vie.jpg';
// Dimensions constantes pour toutes les images
const IMAGE_WIDTH = 709;
const IMAGE_HEIGHT = 360;

// Données des sections
const sections = [
  {
    defaultImage: DefaultImg,
    cards: [
      {
        id: 1,
        title: "Durabilité",
        description: "Œuvrer pour demain : Notre engagement pour un Marrakech durable",
        bgColor: "#fff",
        textColor: "#222",
        activeBgColor: "#b81f22",
        activeTextColor: "#fff",
        image: DurabiliteImg
      },
      {
        id: 2,
        title: "Qualité de vie",
        description: "Favoriser la croissance et dynamiser l'économie",
        bgColor: "#fff",
        textColor: "#222",
        activeBgColor: "#b81f22",
        activeTextColor: "#fff",
        image: QualiteImg
      },
      {
        id: 3,
        title: "Attractivité",
        description: "Concevoir des espaces inspirants pour enrichir votre vie",
        bgColor: "#fff",
        textColor: "#222",
        activeBgColor: "#b81f22",
        activeTextColor: "#fff",
        image: AttractiviteImg
      },
      {
        id: 4,
        title: "Innovation",
        description: "Dessiner les contours de demain, aujourd'hui : Le parcours de notre ville",
        bgColor: "#fff",
        textColor: "#222",
        activeBgColor: "#b81f22",
        activeTextColor: "#fff",
        image: InnovationImg
      }
    ]
  }
];

const MunicipaliteSection = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentImage, setCurrentImage] = useState(DefaultImg);

  const handleCardClick = (card) => {
    setSelectedCard(card.id);
    setCurrentImage(card.image);
  };

  return (
    <div style={{ background: "#f8f9fa", padding: "60px 0" }}>
      <div className="container">
        <h2 className="fw-bold text-center mb-5" style={{ 
          fontSize: "2rem",
          color: "#212529",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}>
          Municipalité de Marrakech
        </h2>

        <div className="row align-items-center">
          {/* Image à gauche */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <img
              src={currentImage}
              alt="Marrakech"
              className="img-fluid rounded shadow-lg"
              style={{
                width: `${IMAGE_WIDTH}px`,
                height: `${IMAGE_HEIGHT}px`,
                objectFit: "cover",
                transition: "all 0.3s ease"
              }}
            />
          </div>

          {/* Cartes à droite */}
          <div className="col-lg-6">
            <div className="row g-4">
              {sections[0].cards.map((card) => (
                <div className="col-md-6" key={card.id}>
                  <div
                    className={`p-4 rounded shadow-sm ${selectedCard === card.id ? 'border-danger' : ''}`}
                    style={{
                      backgroundColor: selectedCard === card.id ? card.activeBgColor : card.bgColor,
                      color: selectedCard === card.id ? card.activeTextColor : card.textColor,
                      borderRadius: "15px",
                      cursor: "pointer",
                      border: selectedCard === card.id ? "3px solid #b81f22" : "1px solid #dee2e6",
                      transition: "all 0.3s ease",
                      height: "100%"
                    }}
                    onClick={() => handleCardClick(card)}
                  >
                    <h3 className="fw-bold mb-3" style={{ fontSize: "1.5rem" }}>
                      {card.title}
                    </h3>
                    <p className="mb-0" style={{ fontSize: "1rem" }}>
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MunicipaliteSection;