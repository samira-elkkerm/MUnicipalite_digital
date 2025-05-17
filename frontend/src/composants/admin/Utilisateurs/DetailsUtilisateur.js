import React from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';

const DetailsUtilisateur = ({ show, onHide, user }) => {
  if (!user) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Détails de l'utilisateur</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <h5>{user.prenom} {user.nom}</h5>
        </div>
        
        <div className="mb-2">
          <strong>Email:</strong> {user.email}
        </div>
        
        <div className="mb-2">
          <strong>Rôle:</strong> {user.Role}
        </div>
        
        <div className="mb-2">
          <strong>Date de création:</strong> {new Date(user.Date).toLocaleDateString()}
        </div>
        
        <div className="mb-2">
          <strong>Statut:</strong> {' '}
          <Badge bg={user.Statut === 'actif' ? 'success' : 'danger'}>
            {user.Statut}
          </Badge>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DetailsUtilisateur;