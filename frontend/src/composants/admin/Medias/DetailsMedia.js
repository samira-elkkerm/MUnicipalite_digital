import React from 'react';
import { Modal, Button, Image, Badge } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';

const DetailsMedia = ({ media, show, onHide }) => {
  if (!media) return null;

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
          <span className="fs-3 fw-bold">Détails du média</span>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        <div className="d-flex gap-4 flex-lg-row flex-column">
          {/* Image Section - Taille réduite pour s'adapter à lg */}
          <div className="d-flex flex-column align-items-center bg-white p-3 rounded-3"
               style={{ width: '100%', maxWidth: '350px' }}>
            <Image 
              src={`http://localhost:8000/images/${media.image}`}
              style={{
                width: '100%',
                height: '250px',
                objectFit: 'contain'
              }}
              rounded
            />
          </div>
          
          {/* Details Section - Adapté pour lg */}
          <div className="flex-grow-1 bg-white p-4 rounded-3">
            <div className="d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-start">
                <h2 className="fw-bold mb-2" style={{ fontSize: '1.5rem' }}>{media.titre}</h2>
                <Badge bg="info" className="fs-6">
                  Média
                </Badge>
              </div>
              
              <div className="d-flex flex-column gap-2">
                <div>
                  <span className="fw-bold">Objectif :</span>
                  <p className="mb-2">{media.objectif}</p>
                </div>
                
                <div>
                  <span className="fw-bold">Date :</span>
                  <span className="ms-2">
                    {new Date(media.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="mt-2">
                <h5 className="fw-bold mb-2">Description</h5>
                <p className="text-muted" style={{ textAlign: 'justify' }}>
                  {media.description || "Aucune description disponible"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DetailsMedia;