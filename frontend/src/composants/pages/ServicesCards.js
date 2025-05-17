import React from 'react';
import { useNavigate } from 'react-router-dom';

// Importez vos images locales ici
import iconeservice from './../../Images/iconeservice.png';

const staticServices = [
  {
    id: 1,
    title: 'Rokhas',
    description: 'Guichet unique national pour toutes les autorisations territoriales',
    image: iconeservice,
    url: 'https://rokhas.ma/',
  },
  {
    id: 2,
    title: 'Watiqa',
    description: 'Guichet électronique de commande de documents administratifs',
    image: iconeservice,
    url: 'https://www.watiqa.ma/',
  },
  {
    id: 3,
    title: 'Chafafiya',
    description: "Guichet d'obtention des informations",
    image: iconeservice,
    url: 'http://www.chafafiya.ma/',
  },
  {
    id: 4,
    title: 'Portail marchés publics',
    description: "Plate-forme commune d'échange entre les acheteurs publics et les fournisseurs.",
    image: iconeservice,
    url: 'https://www.marchespublics.gov.ma/pmmp/',
  },
];

const ServicesCards = () => {
  const navigate = useNavigate();

  const handleCardClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-center" style={{ gap: '20px' }}>
        {staticServices.map((service) => (
          <div
            key={service.id}
            style={{ 
              width: '220px', // Largeur réduite pour 5 cartes
              flex: '0 0 auto' // Empêche le flex-grow/shrink
            }}
          >
            <div
              className="card border-0 h-100"
              style={{
                height: '320px', // Hauteur fixe
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderLeft: '4px solid #B81F22',
                boxShadow: '0 6px 15px rgba(184, 31, 34, 0.1)',
                overflow: 'hidden',
              }}
              onClick={() => handleCardClick(service.url)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 20px rgba(184, 31, 34, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(184, 31, 34, 0.1)';
              }}
            >
              <div className="card-body p-3 d-flex flex-column">
                <div
                  className="mx-auto mb-3 p-2 bg-light rounded-circle d-flex justify-content-center align-items-center"
                  style={{
                    width: '70px',
                    height: '70px',
                    background: 'linear-gradient(135deg, rgba(184,31,34,0.1) 0%, rgba(255,255,255,1) 100%)'
                  }}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="img-fluid"
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'contain',
                      filter: 'hue-rotate(0deg) brightness(0.9)'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                    }}
                  />
                </div>
                <h5 className="text-center fw-bold mb-2" style={{ 
                  color: '#B81F22',
                  fontSize: '1rem',
                  minHeight: '2.5rem'
                }}>
                  {service.title}
                </h5>
                <p className="text-center text-muted mb-2" style={{ 
                  fontSize: '0.8rem',
                  minHeight: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {service.description.length > 70
                    ? `${service.description.substring(0, 70)}...`
                    : service.description}
                </p>
                <div className="text-center mt-auto pt-1 fw-medium" style={{ 
                  color: '#B81F22',
                  transition: 'all 0.2s',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  margin: '0 auto',
                  width: 'fit-content',
                  fontSize: '0.9rem'
                }}>
                  En savoir plus <i className="bi bi-arrow-right ms-1"></i>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carte "Voir plus" */}
        <div style={{ 
          width: '220px', // Même largeur que les autres
          flex: '0 0 auto'
        }}>
          <div
            className="card border-0 h-100"
            style={{
              height: '320px', // Même hauteur que les autres
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: 'linear-gradient(135deg, #B81F22 0%, #8E1518 100%)',
              color: 'white',
              boxShadow: '0 6px 15px rgba(184, 31, 34, 0.3)',
              overflow: 'hidden'
            }}
            onClick={() => navigate('/pages/services')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 20px rgba(184, 31, 34, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 15px rgba(184, 31, 34, 0.3)';
            }}
          >
            <div className="card-body p-3 d-flex flex-column justify-content-center align-items-center">
              <div 
                className="mb-3 p-2 rounded-circle d-flex justify-content-center align-items-center"
                style={{
                  width: '70px',
                  height: '70px',
                  background: 'rgba(255,255,255,0.2)'
                }}
              >
                <i className="bi bi-grid-3x3-gap-fill" style={{ fontSize: '1.8rem', color: 'white' }}></i>
              </div>
              <h5 className="text-center fw-bold mb-2" style={{ 
                fontSize: '1rem',
                minHeight: '2.5rem'
              }}>
                Tous nos services
              </h5>
              <p className="text-center text-white-50 mb-2" style={{ 
                fontSize: '0.8rem',
                minHeight: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                Découvrez toutes nos solutions
              </p>
              <div className="text-center mt-auto pt-1 fw-medium" style={{ 
                transition: 'all 0.2s',
                borderRadius: '4px',
                padding: '4px 8px',
                background: 'rgba(255,255,255,0.2)',
                width: 'fit-content',
                fontSize: '0.9rem'
              }}>
                Explorer <i className="bi bi-arrow-right ms-1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesCards;