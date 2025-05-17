import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CARD_HEIGHT = 400;
const CARD_WIDTH = 350;

const MediasSectionAcc = () => {
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/medias')
      .then(res => {
        setMedias(Array.isArray(res.data) ? res.data.slice(0, 3) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleMediaClick = () => {
    navigate(`/pages/medias`);
  };

  return (
    <div style={{
      background: '#b81f22',
      minHeight: '100vh',
      padding: '60px 0',
      fontFamily: 'inherit',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        width: '100%',
        padding: '0 20px'
      }}>
        {/* Titre avec animation */}
        <div style={{ 
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h2 style={{
            color: "#fff",
            fontWeight: "700",
            fontSize: "2rem",
            position: 'relative',
            display: 'inline-block',
            paddingBottom: '10px',
            margin: 0
          }}>
            Médias
            <span style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              background: '#fff',
              borderRadius: '2px'
            }}></span>
          </h2>
        </div>

        {/* Cartes médias centrées */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '30px',
          marginBottom: '40px'
        }}>
          {loading ? (
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '300px'
            }}>
              <div className="spinner-border text-light" style={{ width: '3rem', height: '3rem' }} />
            </div>
          ) : (
            medias.map((media, idx) => (
              <div
                key={media.id || idx}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  padding: 0,
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  ':hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                  }
                }}
                onClick={() => handleMediaClick()}
              >
                {/* Image avec effet de zoom au survol */}
                <div style={{
                  width: "100%",
                  height: "200px",
                  overflow: "hidden"
                }}>
                  <img
                    src={`http://localhost:8000/images/${media.image}`}
                    alt={media.titre || ""}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: 'transform 0.5s ease'
                    }}
                    onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x200?text=Media"; }}
                  />
                </div>

                {/* Contenu */}
                <div style={{ 
                  padding: "25px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column"
                }}>
                  <h3 style={{
                    fontWeight: "700",
                    fontSize: "1.3rem",
                    marginBottom: "12px",
                    color: "#222",
                    lineHeight: 1.3
                  }}>
                    {media.titre || <span style={{ color: "#b81f22" }}>Titre non disponible</span>}
                  </h3>
                  <p style={{
                    color: "#555",
                    fontSize: "1rem",
                    marginBottom: "auto",
                    lineHeight: 1.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical"
                  }}>
                    {media.description || "Description non disponible"}
                  </p>
                  <div style={{ marginTop: "20px" }}>
                    <div
                      style={{
                        color: "#b81f22",
                        fontWeight: 600,
                        fontSize: "1rem",
                        textDecoration: "none",
                        display: 'inline-flex',
                        alignItems: 'center',
                        transition: 'color 0.3s ease',
                        ':hover': {
                          color: '#8e181a'
                        }
                      }}
                    >
                      En savoir plus
                      <span style={{ 
                        marginLeft: '8px',
                        transition: 'transform 0.3s ease'
                      }}>
                        &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bouton Plus centré */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px'
        }}>
          <button
            style={{
              background: "#fff",
              color: "#b81f22",
              border: "none",
              borderRadius: "30px",
              padding: "12px 40px",
              fontWeight: 600,
              fontSize: "1.1rem",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseEnter={e => {
              e.target.style.background = '#b81f22';
              e.target.style.color = '#fff';
              e.target.style.boxShadow = '0 6px 20px rgba(184, 31, 34, 0.4)';
            }}
            onMouseLeave={e => {
              e.target.style.background = '#fff';
              e.target.style.color = '#b81f22';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
            onClick={() => navigate('/pages/medias')}
          >
            Voir tous les médias
            <span style={{ 
              marginLeft: '10px',
              transition: 'transform 0.3s ease'
            }}>
              &rarr;
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediasSectionAcc;