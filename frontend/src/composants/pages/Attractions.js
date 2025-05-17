import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const baseURL = 'http://localhost:8000';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '1200px',
  margin: '40px auto',
  fontFamily: 'Roboto, Arial, sans-serif',
  padding: '0 20px',
};

const titleStyle = {
  fontSize: '2.5rem',
  fontWeight: '700',
  color: '#d32f2f',
  marginBottom: '24px',
  textAlign: 'center',
  position: 'relative',
  paddingBottom: '12px',
};

const titleDecorationStyle = {
  content: '""',
  position: 'absolute',
  bottom: '0',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '80px',
  height: '4px',
  backgroundColor: '#d32f2f',
  borderRadius: '2px',
};

const rowStyle = {
  display: 'flex',
  width: '100%',
  gap: '24px',
};

const leftColumnStyle = {
  flex: '1 1 55%',
  minWidth: '320px',
};

const rightColumnContainerStyle = {
  flex: '1 1 45%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  height: '408px', // Exactement la même hauteur que la boîte de détail
};

const rightColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  overflowY: 'auto',
  width: '100%',
  padding: '0',
  scrollBehavior: 'smooth',
  height: '100%',
};

const cardStyle = {
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  border: '1.5px solid #e0e0e0',
  padding: '0',
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  height: '198px', // (408px total - 12px gap) / 2 = 198px
};

const imageStyle = {
  width: '180px',
  height: '100%',
  objectFit: 'cover',
  borderTopLeftRadius: '16px',
  borderBottomLeftRadius: '16px',
};

const cardContentStyle = {
  padding: '16px',
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const plusLinkStyle = {
  color: '#d32f2f',
  textDecoration: 'underline',
  fontWeight: 'bold',
  marginTop: '4px',
  alignSelf: 'flex-start',
  cursor: 'pointer',
  fontSize: '0.85rem',
};

const detailBoxStyle = {
  border: '1.5px solid #e0e0e0',
  borderRadius: '16px',
  background: '#f7f7f7',
  padding: '24px',
  marginBottom: '24px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '32px',
  width: '100%',
  height: '408px', // Hauteur fixe égale au slider
  boxSizing: 'border-box',
};

const detailImgStyle = {
  width: '320px',
  height: '360px', // Ajusté pour correspondre à la hauteur totale moins le padding
  objectFit: 'cover',
  borderRadius: '12px',
  flexShrink: '0',
};

const Attractions = () => {
  const [attractions, setAttractions] = useState([]);
  const [selected, setSelected] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/incontournables`)
      .then((response) => {
        const formattedData = response.data.data
          ? response.data.data.map((item) => ({
              id: item.id,
              nom: item.attraction || item.nom,
              image_url: item.image || item.image_url,
              description: item.description,
              localisation: item.localisation || item.location || '',
            }))
          : [];

        setAttractions(formattedData);
        if (formattedData.length > 0) {
          setSelected(formattedData[0]);
        }
      })
      .catch((error) => console.error('Erreur API:', error));
  }, []);

  const handleClick = (attraction) => {
    setSelected(attraction);
    const cardElement = document.getElementById(`card-${attraction.id}`);
    if (cardElement && sliderRef.current) {
      const cardPosition = cardElement.offsetTop - sliderRef.current.offsetTop;
      const containerHeight = sliderRef.current.clientHeight;
      const cardHeight = cardElement.clientHeight;
      
      sliderRef.current.scrollTo({
        top: cardPosition - (containerHeight / 2) + (cardHeight / 2),
        behavior: 'smooth'
      });
    }
  };

  if (attractions.length === 0) return <p>Chargement des attractions...</p>;

  return (
    <div style={containerStyle}>
      {/* Titre principal */}
      <h1 style={titleStyle}>
        Attractions de Marrakech
        <span style={titleDecorationStyle}></span>
      </h1>

      <div style={rowStyle}>
        {/* Colonne gauche - détail */}
        <div style={leftColumnStyle}>
          {selected && (
            <div style={detailBoxStyle}>
              <img
                src={
                  selected.image_url.startsWith('http')
                    ? selected.image_url
                    : `${baseURL}/images/${selected.image_url}`
                }
                alt={selected.nom}
                style={detailImgStyle}
              />
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0 }}>{selected.nom}</h2>
                <p style={{ marginTop: 12, marginBottom: 8 }}>
                  {selected.description}
                </p>
                {selected.localisation && (
                  <p
                    style={{
                      fontWeight: 'bold',
                      color: '#555',
                      fontSize: '0.95rem',
                      marginTop: 0,
                    }}
                  >
                    📍 {selected.localisation}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Colonne droite - slider vertical */}
        <div style={rightColumnContainerStyle}>
          <div style={rightColumnStyle} ref={sliderRef}>
            {attractions.map((attraction) => (
              <div
                key={attraction.id}
                id={`card-${attraction.id}`}
                onClick={() => handleClick(attraction)}
                style={{
                  ...cardStyle,
                  borderColor:
                    selected?.id === attraction.id ? '#d32f2f' : '#e0e0e0',
                  boxShadow:
                    selected?.id === attraction.id
                      ? '0 4px 12px rgba(211,47,47,0.4)'
                      : '0 2px 8px rgba(0,0,0,0.07)',
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleClick(attraction);
                }}
                role="button"
                aria-pressed={selected?.id === attraction.id}
              >
                <img
                  src={
                    attraction.image_url.startsWith('http')
                      ? attraction.image_url
                      : `${baseURL}/images/${attraction.image_url}`
                  }
                  alt={attraction.nom}
                  style={imageStyle}
                />
                <div style={cardContentStyle}>
                  <h3
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                    }}
                  >
                    {attraction.nom}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: '#444',
                      margin: 0,
                      flexGrow: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {attraction.description}
                  </p>
                  <span style={plusLinkStyle}>Plus +</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attractions;