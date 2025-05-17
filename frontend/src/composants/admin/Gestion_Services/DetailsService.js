import React from 'react';
import { Modal, Button, Image, Badge } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';

const DetailsService = ({ service, show, onHide }) => {
  if (!service) return null;

  // Fonction pour obtenir l'URL complète de l'image
  const getImageUrl = () => {
    if (!service.image) return '/default-service.png';
    if (service.image.startsWith('http')) return service.image;
    return `http://localhost:8000/images/${service.image}`;
  };

  // Fonction pour obtenir le badge de type
  const getTypeBadge = () => {
    if (!service.type) return <Badge bg="secondary">Inconnu</Badge>;
    
    switch(service.type.toLowerCase()) {
      case 'administratif': return <Badge bg="primary">Administratif</Badge>;
      case 'technique': return <Badge bg="warning" text="dark">Technique</Badge>;
      case 'social': return <Badge bg="success">Social</Badge>;
      case 'culturel': return <Badge bg="info">Culturel</Badge>;
      default: return <Badge bg="secondary">{service.type}</Badge>;
    }
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
          <span className="fs-3 fw-bold">Détails du service</span>
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
                objectFit: 'contain'
              }}
              rounded
              onError={(e) => {
                e.target.src = '/default-service.png';
              }}
            />
          </div>
          
          {/* Details Section */}
          <div className="flex-grow-1 bg-white p-4 rounded-3">
            <div className="d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-start">
                <h2 className="fw-bold mb-2" style={{ fontSize: '1.5rem' }}>{service.nom}</h2>
                {getTypeBadge()}
              </div>
              
              <div className="d-flex flex-column gap-2">
                <div>
                  <span className="fw-bold">Date de création :</span>
                  <span className="ms-2">
                    {service.created_at ? new Date(service.created_at).toLocaleDateString('fr-FR') : 'Non disponible'}
                  </span>
                </div>

                <div>
                  <span className="fw-bold">Dernière modification :</span>
                  <span className="ms-2">
                    {service.updated_at ? new Date(service.updated_at).toLocaleDateString('fr-FR') : 'Non disponible'}
                  </span>
                </div>
              </div>
              
              <div className="mt-2">
                <h5 className="fw-bold mb-2">Description</h5>
                <p className="text-muted" style={{ textAlign: 'justify' }}>
                  {service.description || "Aucune description disponible"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DetailsService;