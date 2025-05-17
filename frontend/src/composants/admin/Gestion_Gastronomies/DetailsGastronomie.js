import React from 'react';
import { Modal, Button, Image, Badge } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';

const DetailsGastronomie = ({ gastronomie, show, onHide }) => {
  if (!gastronomie) return null;

  // Fonction pour obtenir l'URL complète de l'image
  const getImageUrl = () => {
    if (!gastronomie.image) return '/default-food.jpg';
    if (gastronomie.image.startsWith('http')) return gastronomie.image;
    return `http://localhost:8000/images/${gastronomie.image}`;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 px-4 py-3">
        <Modal.Title className="d-flex align-items-center">
          <Button 
            variant="light" 
            onClick={onHide} 
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ 
              width: '40px',
              height: '40px',
              marginRight: '10px'
            }}
          >
            <BiArrowBack size={20} />
          </Button>
          <span className="fs-3 fw-bold">Détails du plat gastronomique</span>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        <div className="d-flex gap-4 flex-lg-row flex-column">
          {/* Image Section */}
          <div className="d-flex flex-column align-items-center bg-white p-3 rounded-3"
               style={{ width: '100%', maxWidth: '350px' }}>
            <Image 
              src={getImageUrl()}
              style={{
                width: '100%',
                height: '250px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
              onError={(e) => {
                e.target.src = '/default-food.jpg';
                e.target.style.objectFit = 'contain';
              }}
            />
          </div>
          
          {/* Details Section */}
          <div className="flex-grow-1 bg-white p-4 rounded-3">
            <div className="d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-start">
                <h2 className="fw-bold mb-2" style={{ fontSize: '1.5rem' }}>
                  {gastronomie.plats}
                </h2>
                <Badge bg="info" className="fs-6">
                  {gastronomie.cuisine}
                </Badge>
              </div>
              
              <div className="d-flex flex-column gap-2">
                <div>
                  <span className="fw-bold">Date d'ajout :</span>
                  <span className="ms-2">
                    {gastronomie.created_at ? new Date(gastronomie.created_at).toLocaleDateString('fr-FR') : 'Non disponible'}
                  </span>
                </div>

                <div>
                  <span className="fw-bold">Dernière modification :</span>
                  <span className="ms-2">
                    {gastronomie.updated_at ? new Date(gastronomie.updated_at).toLocaleDateString('fr-FR') : 'Non disponible'}
                  </span>
                </div>
              </div>
              
              <div className="mt-2">
                <h5 className="fw-bold mb-2">Description</h5>
                <p className="text-muted" style={{ textAlign: 'justify' }}>
                  {gastronomie.description || "Aucune description disponible"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DetailsGastronomie;