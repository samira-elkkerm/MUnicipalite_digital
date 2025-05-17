import React, { useState, useRef } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

const stats = [
  { value: "1200", label: "Nombre d'hôtels" },
  { value: "+40 K", label: "Chambres d'hôtel" },
  { value: "+500", label: "Riads & Maisons d'Hôtes" },
  { value: "+3 M", label: "Visiteurs annuels" },
  { value: "+600 H", label: "Espaces verts" },
  { value: "+70 classés", label: "Sites historiques" }
];

const SLIDES_TO_SHOW = 4;

const StatistiquesSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const sliderRef = useRef(null);

  React.useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
    // eslint-disable-next-line
  }, [currentIndex]);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      slideRight();
    }, 4000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const slideLeft = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? stats.length - SLIDES_TO_SHOW : prev - 1
    );
  };

  const slideRight = () => {
    setCurrentIndex((prev) =>
      prev >= stats.length - SLIDES_TO_SHOW ? 0 : prev + 1
    );
  };

  const handleMouseEnter = () => stopAutoSlide();
  const handleMouseLeave = () => startAutoSlide();

  const handleKeyDown = (e, direction) => {
    if (e.key === 'Enter' || e.key === ' ') {
      direction === 'left' ? slideLeft() : slideRight();
    }
  };

  const visibleStats = stats.slice(currentIndex, currentIndex + SLIDES_TO_SHOW)
    .concat(
      currentIndex + SLIDES_TO_SHOW > stats.length
        ? stats.slice(0, currentIndex + SLIDES_TO_SHOW - stats.length)
        : []
    );

  return (
    <div
      style={{
        background: '#f8f9fa',  // Fond clair comme TourismeCultureAcc
        padding: '38px 0 18px 0',
        borderRadius: '0 0 10px 10px'
      }}
    >
      <div className="container" style={{ maxWidth: 1200 }}>
        {/* Titre centré avec soulignement rouge */}
        <div className="d-flex justify-content-center mb-4">
          <span
            style={{
              fontWeight: 'bold',
              fontSize: '1.5rem',
              color: '#212529',
              display: 'inline-block',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              userSelect: 'none',
              maxWidth: 700,
              width: '100%',
              textAlign: 'center',
            }}
          >
            Statistiques Clés de la Municipalité
          </span>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="d-flex align-items-center"
          style={{ position: 'relative', userSelect: 'none' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Bouton gauche */}
          <button
            aria-label="Précédent"
            onClick={slideLeft}
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, 'left')}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              fontSize: 36,
              color: '#b81f22',
              marginRight: 10,
              transition: 'color 0.2s'
            }}
          >
            <BiChevronLeft />
          </button>

          {/* Les stats */}
          <div
            className="d-flex justify-content-between flex-grow-1"
            style={{ gap: 0, width: '100%' }}
          >
            {visibleStats.map((stat, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  color: '#b81f22',
                  minWidth: 170,
                  maxWidth: 200,
                  padding: '0 8px'
                }}
              >
                <div style={{
                  fontWeight: 'bold',
                  fontSize: '1.7rem',
                  letterSpacing: 1,
                  marginBottom: 2
                }}>
                  {stat.value}
                </div>
                <div style={{
                  color: '#b81f22',
                  fontSize: '1.06rem',
                  fontWeight: 400,
                  marginBottom: 0,
                  opacity: 0.8
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Bouton droit */}
          <button
            aria-label="Suivant"
            onClick={slideRight}
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, 'right')}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              fontSize: 36,
              color: '#b81f22',
              marginLeft: 10,
              transition: 'color 0.2s'
            }}
          >
            <BiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatistiquesSlider;
