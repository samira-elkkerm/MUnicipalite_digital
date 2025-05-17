import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FiMapPin, FiFrown, FiX } from 'react-icons/fi';
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
const Gastronomies = () => {
  const [gastronomies, setGastronomies] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalItem, setModalItem] = useState(null);

  // Sélectionne 4 éléments aléatoires distincts
  const pickRandom4 = useCallback((items) => {
    if (!items.length) return [];
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, []);

  useEffect(() => {
    const fetchGastronomies = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/gastronomies');
        const data = response.data?.data || response.data || [];
        const list = Array.isArray(data) ? data : [];
        setGastronomies(list);
        setDisplayed(pickRandom4(list));
      } catch (err) {
        setError(err.message);
        console.error('Erreur API:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGastronomies();
  }, [pickRandom4]);

  // Rafraîchir la sélection toutes les 60 secondes
  useEffect(() => {
    if (gastronomies.length === 0) return;
    const interval = setInterval(() => {
      setDisplayed(pickRandom4(gastronomies));
    }, 60000);
    return () => clearInterval(interval);
  }, [gastronomies, pickRandom4]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Chargement des spécialités...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>Erreur: {error}</p>
        <button 
          style={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (gastronomies.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <FiFrown size={48} style={styles.emptyIcon} />
        <p style={styles.emptyText}>Aucune spécialité disponible</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Gastronomie Marocaine
      <span style={titleDecorationStyle}></span>
      </h1>

      
      <div style={styles.grid}>
        {displayed.map((item) => {
          const imageUrl = item.image && item.image.startsWith('http')
            ? item.image
            : item.image
              ? `http://localhost:8000/images/${item.image}`
              : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';

          return (
            <div 
              key={item.id} 
              style={styles.card} 
              onClick={() => setModalItem(item)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => { if(e.key === 'Enter') setModalItem(item); }}
            >
              <div style={styles.imageContainer}>
                <img
                  src={imageUrl}
                  alt={item.plats || 'Plat marocain'}
                  style={styles.image}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
                  }}
                />
              </div>
              
              <div style={styles.content}>
                <h2 style={styles.title}>{item.plats || 'Nom non spécifié'}</h2>
                <p style={styles.description}>
                  {item.description 
                    ? (item.description.length > 100 
                        ? `${item.description.substring(0, 100)}...` 
                        : item.description)
                    : 'Aucune description disponible'}
                </p>
                <div style={styles.meta}>
                  <span style={styles.metaItem}>
                    <FiMapPin style={styles.icon} />
                    {item.cuisine || 'Cuisine non spécifiée'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalItem && (
        <div style={styles.modalOverlay} onClick={() => setModalItem(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button 
              style={styles.modalCloseButton} 
              onClick={() => setModalItem(null)}
              aria-label="Fermer la fenêtre"
            >
              <FiX size={24} />
            </button>
            <img
              src={modalItem.image && modalItem.image.startsWith('http')
                ? modalItem.image
                : modalItem.image
                  ? `http://localhost:8000/images/${modalItem.image}`
                  : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
              alt={modalItem.plats || 'Image de plat'}
              style={styles.modalImage}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
              }}
            />
            <h2 style={styles.modalTitle}>{modalItem.plats}</h2>
            <p style={styles.modalCuisine}><strong>Cuisine :</strong> {modalItem.cuisine || 'Non spécifiée'}</p>
            <p style={styles.modalDescription}>{modalItem.description || 'Aucune description disponible'}</p>
          </div>
        </div>
      )}
    </div>
  );
};


const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#d32f2f',
    marginBottom: '24px',
    textAlign: 'center',
    position: 'relative',
    paddingBottom: '12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', // 4 colonnes fixes
    gap: '1.8rem',
  },
  
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',   // prend toute la largeur de la colonne
    height: '400px', // hauteur fixe
  },
  imageContainer: {
    position: 'relative',
    height: '180px', // hauteur fixe de l’image
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  content: {
    padding: '1.5rem',
    flexGrow: 1,
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: '700',
    marginBottom: '0.75rem',
    color: '#333',
  },
  description: {
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '1.2rem',
    fontSize: '0.95rem',
  },
  meta: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#555',
  },
  icon: {
    color: '#d32f2f',
    fontSize: '1rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #d32f2f',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  loadingText: {
    color: '#555',
    fontSize: '1.1rem',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
    padding: '2rem',
    textAlign: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: '1.2rem',
    marginBottom: '1rem',
  },
  retryButton: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#d32f2f',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
  },
  emptyIcon: {
    color: '#d32f2f',
    marginBottom: '1rem',
  },
  emptyText: {
    color: '#777',
    fontSize: '1.2rem',
  },
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '1rem',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    padding: '1.5rem 2rem 2rem',
    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
  },
  modalCloseButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#d32f2f',
  },
  modalImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '1rem',
  },
  modalTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: '#d32f2f',
  },
  modalCuisine: {
    fontSize: '1rem',
    marginBottom: '1rem',
    color: '#555',
  },
  modalDescription: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#444',
  },
};

export default Gastronomies;
