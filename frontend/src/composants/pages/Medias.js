import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Navigation from '../../layout/Navigation';  
import Slider from '../../layout/Slider';
import Footer from './../../layout/Footer';

const Container = styled.div`
  max-width: 1000px;
  margin: 1rem auto 2rem;
  padding: 0 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const DetailSection = styled.section`
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin: 1.5rem auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  border: 1px solid #f0f0f0;
  width: 100%;
  max-width: 800px;
`;

const DetailImageWrapper = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  max-width: 500px;
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #edf2f7;
`;

const DetailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ContentWrapper = styled.div`
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  color: #1a202c;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const SubTitle = styled.h2`
  color: #4a5568;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
`;

const MetaContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const MetaTag = styled.span`
  background: #f0f4f8;
  color: #4a5568;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
`;

const Description = styled.div`
  font-size: 0.95rem;
  line-height: 1.6;
  color: #4a5568;
  text-align: left;
  max-width: 700px;
  margin: 0 auto;
`;

const MediaListWrapper = styled.div`
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 10px;
  margin: 2rem 0;
  border: 1px solid #edf2f7;
`;

const SectionTitle = styled.h2`
  color: #1a202c;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 1.2rem 0;
  text-align: center;
`;

const MediaList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
`;

const MediaCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
`;

const MediaImageWrapper = styled.div`
  width: 100%;
  height: 140px;
  overflow: hidden;
`;

const MediaImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${MediaCard}:hover & {
    transform: scale(1.03);
  }
`;

const MediaInfo = styled.div`
  padding: 0.8rem;

  h3 {
    color: #1a202c;
    margin: 0 0 0.3rem 0;
    font-size: 0.95rem;
    font-weight: 600;
  }

  p {
    color: #4a5568;
    font-size: 0.85rem;
    line-height: 1.4;
    margin: 0 0 0.5rem 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const MediaDate = styled.div`
  color: #718096;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  gap: 0.5rem;
`;

const PaginationButton = styled.button`
  background-color: #ffffff;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #f7fafc;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageIndicator = styled.span`
  color: #4a5568;
  font-size: 0.8rem;
  margin: 0 0.5rem;
`;

const Medias = () => {
  const [medias, setMedias] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    const fetchMedias = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/medias');
        setMedias(response.data);
        if (response.data.length > 0) setSelectedMedia(response.data[0]);
      } catch (error) {
        console.error('Erreur lors du chargement des médias:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedias();
  }, []);

  const pageCount = Math.ceil(medias.length / ITEMS_PER_PAGE);
  const mediasToShow = medias.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e2e8f0',
          borderTopColor: '#4299e1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <>
      <Navigation transparent={true} />
      <Slider />

      <Container>
        {selectedMedia && (
          <DetailSection>
            <DetailImageWrapper>
              <DetailImage 
                src={`http://localhost:8000/images/${selectedMedia.image}`} 
                alt={selectedMedia.titre} 
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/800x450?text=Media";
                }}
              />
            </DetailImageWrapper>

            <ContentWrapper>
              <Title>{selectedMedia.titre}</Title>
              
              <MetaContainer>
                {selectedMedia.date && (
                  <MetaTag>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {selectedMedia.date}
                  </MetaTag>
                )}
                {selectedMedia.categorie && (
                  <MetaTag>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                      <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                    {selectedMedia.categorie}
                  </MetaTag>
                )}
              </MetaContainer>

              {selectedMedia.sousTitre && <SubTitle>{selectedMedia.sousTitre}</SubTitle>}
              
              <Description>
                {selectedMedia.description.split('\n').map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </Description>
            </ContentWrapper>
          </DetailSection>
        )}

        <MediaListWrapper>
          <SectionTitle>Tous les médias</SectionTitle>
          
          <MediaList>
            {mediasToShow.map(media => (
              <MediaCard 
                key={media.id} 
                onClick={() => setSelectedMedia(media)}
              >
                <MediaImageWrapper>
                  <MediaImage 
                    src={`http://localhost:8000/images/${media.image}`} 
                    alt={media.titre} 
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x225?text=Media";
                    }}
                  />
                </MediaImageWrapper>
                <MediaInfo>
                  <h3>{media.titre}</h3>
                  <p>{media.description}</p>
                  {media.date && (
                    <MediaDate>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {media.date}
                    </MediaDate>
                  )}
                </MediaInfo>
              </MediaCard>
            ))}
          </MediaList>
        </MediaListWrapper>

        {pageCount > 1 && (
          <PaginationContainer>
            <PaginationButton 
              onClick={() => setPage(0)}
              disabled={page === 0}
            >
              Première
            </PaginationButton>
            
            <PaginationButton 
              onClick={() => setPage(p => Math.max(p - 1, 0))}
              disabled={page === 0}
            >
              Précédent
            </PaginationButton>
            
            <PageIndicator>{page + 1} / {pageCount}</PageIndicator>
            
            <PaginationButton 
              onClick={() => setPage(p => Math.min(p + 1, pageCount - 1))}
              disabled={page >= pageCount - 1}
            >
              Suivant
            </PaginationButton>
            
            <PaginationButton 
              onClick={() => setPage(pageCount - 1)}
              disabled={page >= pageCount - 1}
            >
              Dernière
            </PaginationButton>
          </PaginationContainer>
        )}
      </Container>
      <Footer/> 
    </>
  );
};

export default Medias;