import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const IMAGE_HEIGHT = 420; // Hauteur fixée à 420px

const TourismeCultureAcc = () => {
  const [incontournables, setIncontournables] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/incontournables');
        const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
        setIncontournables(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (incontournables.length > 0) {
      const interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % incontournables.length);
          setFade(true);
        }, 500);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [incontournables]);

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="text-center py-5 text-danger">
      Erreur: {error}
    </div>
  );

  if (incontournables.length === 0) return (
    <div className="text-center py-5">
      Aucune donnée disponible
    </div>
  );

  const currentItem = incontournables[currentIndex] || {};

  return (
    <div style={{ 
      background: '#f8f9fa',
      padding: '40px 0',
      position: 'relative'
    }}>
      <div className="container">
        <div className="mb-4 text-center">
          <h2 className="fw-bold mb-3" style={{ 
            color: "#212529",
            fontSize: "1.8rem",
            position: 'relative',
            display: 'inline-block'
          }}>
            <span style={{
              position: 'absolute',
              bottom: '-8px',
              left: '0',
              width: '100%',
              height: '3px',
              background: '#b81f22',
              borderRadius: '2px'
            }}></span>
            TOURISME & CULTURE
          </h2>
        </div>

        <div
          className="position-relative mx-auto rounded-3 overflow-hidden"
          style={{
            background: '#eaeaea',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            maxWidth: '1200px',
            width: '100%',
            height: IMAGE_HEIGHT,
            minHeight: IMAGE_HEIGHT
          }}
        >
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden'
          }}>
            <img
              src={currentItem.image ? `http://localhost:8000/images/${currentItem.image}` : 'https://images.unsplash.com/photo-1518544866330-95a2ab6f360a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
              alt={currentItem.attraction || "Attraction touristique"}
              className="w-100 h-100"
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                transition: 'opacity 0.5s ease-in-out',
                opacity: fade ? 1 : 0,
                position: 'absolute',
                top: 0,
                left: 0,
                filter: 'brightness(0.92)'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1518544866330-95a2ab6f360a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
              }}
            />

            {/* Overlay texte et bouton */}
            <div
              className="position-absolute d-flex flex-column justify-content-end p-4"
              style={{
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                color: 'white',
                zIndex: 2,
                height: '50%'
              }}
            >
              <div style={{
                maxWidth: '600px',
                marginLeft: 'auto'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: '0.8rem',
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                }}>
                  {currentItem.attraction || "Site Incontournable"}
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  marginBottom: '1.5rem',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                }}>
                  {currentItem.description || "Découvrez ce lieu exceptionnel chargé d'histoire et de culture."}
                </p>
                <button
                  className="btn align-self-start"
                  onClick={() => navigate('/tourisme-culture')}
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    color: '#b81f22',
                    borderRadius: '24px',
                    fontWeight: '500',
                    border: 'none',
                    padding: '8px 24px',
                    fontSize: '0.9rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = '#b81f22';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = 'rgba(255,255,255,0.9)';
                    e.target.style.color = '#b81f22';
                  }}
                >
                  Découvrir &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourismeCultureAcc;