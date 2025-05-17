import React, { useState } from 'react';
import { Table, Button, Form, Alert, Badge, Modal } from 'react-bootstrap';
import { BiTrash, BiShow, BiEdit, BiSearch, BiPlus, BiFilterAlt, BiX } from 'react-icons/bi';

const ListeMedias = ({ 
  medias = [], 
  onViewDetails, 
  onAddMedia, 
  onEditMedia, 
  onDeleteMedia,
  loading,
  error
}) => {
  // États pour la recherche et la confirmation de suppression
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);

  /**
   * Filtre les médias selon le terme de recherche
   * Recherche dans le titre, l'objectif et l'ID
   */
  const filteredMedias = medias.filter(media => {
    const searchText = searchTerm.toLowerCase();
    return (
      (media.titre || '').toLowerCase().includes(searchText) ||
      (media.objectif || '').toLowerCase().includes(searchText) ||
      (media.id || '').toString().includes(searchText)
    );
  });

  // Gestion de la demande de suppression
  const handleDeleteClick = (media) => {
    setMediaToDelete(media);
    setShowDeleteConfirm(true);
  };

  // Confirmation de suppression
  const confirmDelete = () => {
    onDeleteMedia(mediaToDelete.id);
    setShowDeleteConfirm(false);
  };

  // Affichage du chargement
  if (loading) {
    return <div className="text-center my-5">...</div>;
  }

  // Affichage des erreurs
  if (error) {
    return <Alert variant="danger">...</Alert>;
  }

  return (
    <div className="medias-list-container p-3">
      {/* En-tête avec titre et bouton d'ajout */}
      <h2 className="mb-4">Gestion des Médias</h2>
      
      {/* Barre de recherche et bouton d'ajout */}
      <div className="d-flex justify-content-between mb-3">
        <div className="position-relative w-50">
          <BiSearch className="search-icon" />
          <Form.Control
            type="text"
            placeholder="Rechercher par titre, objectif..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ps-5"
          />
        </div>
        <Button variant="primary" onClick={onAddMedia}>
          <BiPlus /> Ajouter un média
        </Button>
      </div>

      {/* Liste des médias ou message vide */}
      {filteredMedias.length === 0 ? (
        <Alert variant="info">Aucun média trouvé</Alert>
      ) : (
        <Table striped bordered hover responsive>
          {/* En-têtes du tableau */}
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Image</th>
              <th>Objectif</th>
              <th>Actions</th>
            </tr>
          </thead>
          
          {/* Corps du tableau */}
          <tbody>
            {filteredMedias.map(media => (
              <tr key={media.id}>
                <td>{media.id}</td>
                <td>{media.titre}</td>
                <td>
                  {media.image && (
                    <img 
                      src={`/storage/${media.image}`} 
                      alt={media.titre} 
                      style={{ width: '50px', height: 'auto' }}
                    />
                  )}
                </td>
                <td>{media.objectif}</td>
                <td>
                  {/* Boutons d'action */}
                  <Button variant="info" size="sm" onClick={() => onViewDetails(media)}>
                    <BiShow />
                  </Button>
                  <Button variant="warning" size="sm" onClick={() => onEditMedia(media)}>
                    <BiEdit />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteClick(media)}>
                    <BiTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal de confirmation de suppression */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer "{mediaToDelete?.titre}" ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListeMedias;