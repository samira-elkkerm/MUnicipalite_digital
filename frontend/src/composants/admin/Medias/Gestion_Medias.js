import React, { useState, useEffect } from 'react';
import MunicipaliteSidebar from '../../../layout/MunicipaliteSidebar';
import { Table, Button, Form, Modal, Alert, Pagination, Badge, InputGroup } from 'react-bootstrap';
import { BiTrash, BiEdit, BiPlus, BiSearch, BiShow, BiFilterAlt, BiX } from 'react-icons/bi';
import AjoutMedia from './AjoutMedia';
import ModifierMedia from './ModifierMedia';
import DetailsMedia from './DetailsMedia';

const GestionMedias = () => {
  // États pour la gestion des médias
  const [medias, setMedias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour les modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // États pour la sélection
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaToDelete, setMediaToDelete] = useState(null);
  
  // États pour les messages et pagination
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Fonction pour tronquer la description
  const truncateDescription = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Chargement des médias
  useEffect(() => {
    const fetchMedias = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/medias');
        
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        
        const data = await response.json();
        setMedias(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setMedias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedias();
  }, []);

  // Filtrage des médias
  const filteredMedias = medias.filter(media => {
    const term = searchTerm.toLowerCase();
    return (
      (media.titre || '').toLowerCase().includes(term) ||
      (media.objectif || '').toLowerCase().includes(term) ||
      (media.description || '').toLowerCase().includes(term) ||
      (media.id || '').toString().includes(term)
    );
  });

  // Calcul de la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMedias.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMedias.length / itemsPerPage);

  // Gestion des actions
  const handleEditMedia = (media) => {
    setSelectedMedia(media);
    setShowEditModal(true);
  };

  const handleViewDetails = (media) => {
    setSelectedMedia(media);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (media) => {
    setMediaToDelete(media);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/medias/${mediaToDelete.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Échec de la suppression');
      
      setMedias(medias.filter(media => media.id !== mediaToDelete.id));
      showSuccess('Média supprimé avec succès');
    } catch (err) {
      setError(err.message);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleMediaAdded = (newMedia) => {
    setMedias([...medias, newMedia]);
    setShowAddModal(false);
    showSuccess('Média ajouté avec succès');
  };

  const handleMediaUpdated = (updatedMedia) => {
    setMedias(medias.map(media => media.id === updatedMedia.id ? updatedMedia : media));
    setShowEditModal(false);
    showSuccess('Média mis à jour avec succès');
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div style={styles.container}>
      <MunicipaliteSidebar />

      <div style={styles.mainContent}>
        <div style={styles.contentWrapper}>         
          {successMessage && (
            <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible style={styles.alert}>
              {successMessage}
            </Alert>
          )}

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible style={styles.alert}>
              {error}
            </Alert>
          )}

          {loading ? (
            <div style={styles.loading}>Chargement en cours...</div>
          ) : (
            <>
              <div style={styles.searchAddContainer}>
                <div style={styles.searchWrapper}>
                  <BiSearch style={styles.searchIcon} />
                  <Form.Control
                    type="text"
                    placeholder="Rechercher des médias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                  />
                  {searchTerm && (
                    <Button 
                      variant="link" 
                      onClick={() => setSearchTerm('')}
                      style={styles.clearSearchButton}
                    >
                      <BiX size={18} />
                    </Button>
                  )}
                </div>
                
                <Button 
                  variant="primary" 
                  onClick={() => setShowAddModal(true)}
                  style={styles.addButton}
                >
                  <BiPlus style={styles.addIcon} /> Ajouter un média
                </Button>
              </div>

              <div style={styles.tableContainer}>
                <Table striped bordered hover responsive style={styles.table}>
                  <thead style={styles.tableHeader}>
                    <tr>
                      <th style={styles.tableCell}>ID</th>
                      <th style={styles.tableCell}>Titre</th>
                      <th style={styles.tableCell}>Image</th>
                      <th style={styles.tableCell}>Objectif</th>
                      <th style={styles.tableCell}>Description</th>
                      <th style={styles.tableCell}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map(media => (
                      <tr key={media.id} style={styles.tableRow}>
                        <td style={styles.tableCell}>{media.id}</td>
                        <td style={styles.tableCell}>{media.titre}</td>
                        <td style={styles.tableCell}>
                          {media.image && (
                            <img 
                              src={`http://localhost:8000/images/${media.image}`} 
                              alt={media.titre} 
                              style={{ width: '80px', height: 'auto', borderRadius: '4px' }}
                            />
                          )}
                        </td>
                        <td style={styles.tableCell}>{truncateDescription(media.objectif, 30)}</td>
                        <td style={styles.tableCell}>{truncateDescription(media.description)}</td>
                        <td style={{ ...styles.tableCell, ...styles.actionsCell }}>
                          <Button 
                            variant="outline-info" 
                            size="sm" 
                            onClick={() => handleViewDetails(media)} 
                            style={styles.actionButton}
                          >
                            <BiShow />
                          </Button>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={() => handleEditMedia(media)} 
                            style={styles.actionButton}
                          >
                            <BiEdit />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleDeleteClick(media)} 
                            style={styles.actionButton}
                          >
                            <BiTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {filteredMedias.length === 0 && !loading && (
                  <div style={styles.noResults}>
                    Aucun média trouvé
                  </div>
                )}

                {filteredMedias.length > itemsPerPage && (
                  <div style={styles.pagination}>
                    <Pagination>
                      <Pagination.Prev 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
                        disabled={currentPage === 1}
                      />
                      
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <Pagination.Item
                          key={index}
                          active={index + 1 === currentPage}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      ))}
                      
                      <Pagination.Next 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <AjoutMedia 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)} 
        onMediaAdded={handleMediaAdded}
      />

      {selectedMedia && (
        <>
          <ModifierMedia
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            media={selectedMedia}
            onMediaUpdated={handleMediaUpdated}
          />
          
          <DetailsMedia
            show={showDetailsModal}
            onHide={() => setShowDetailsModal(false)}
            media={selectedMedia}
          />
        </>
      )}

      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered style={styles.modal}>
        <Modal.Header closeButton style={styles.modalHeader}>
          <Modal.Title style={styles.modalTitle}>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          Êtes-vous sûr de vouloir supprimer "{mediaToDelete?.titre}" ?
        </Modal.Body>
        <Modal.Footer style={styles.modalFooter}>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} style={styles.modalButton}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDelete} style={styles.modalButton}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Styles (identique à votre exemple précédent)
const styles = {
  container: {
    display: 'flex',
    maxHeight: '100vh',
    backgroundColor: '#f8fafc'
  },
  mainContent: {
    flex: 1,
    marginLeft: '250px',
    padding: '2rem',
    overflow: 'auto',
    backgroundColor: '#f8fafc'
  },
  contentWrapper: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  title: {
    color: '#1e293b',
    marginBottom: '1.5rem',
    fontWeight: '600',
    fontSize: '1.5rem'
  },
  alert: {
    borderRadius: '8px',
    marginBottom: '1.5rem'
  },
  searchAddContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  searchFilterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flex: 1,
    minWidth: '300px',
    maxWidth: '800px'
  },
  searchWrapper: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    color: '#64748b',
    fontSize: '1.25rem'
  },
  searchInput: {
    paddingLeft: '3rem',
    borderRadius: '8px',
    height: '3rem',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    boxShadow: 'none',
    transition: 'all 0.2s',
    ':focus': {
      borderColor: '#B81F22',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
    }
  },
  clearSearchButton: {
    position: 'absolute',
    right: '0.75rem',
    color: '#64748b',
    fontSize: '1.25rem',
    padding: '0',
    background: 'transparent',
    border: 'none',
    ':hover': {
      color: '#ef4444'
    }
  },
  filterButton: {
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    height: '3rem',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    ':hover': {
      backgroundColor: '#f8fafc'
    }
  },
  filterIcon: {
    fontSize: '1.25rem'
  },
  addButton: {
    borderRadius: '8px',
    padding: '0.5rem 1.5rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    height: '3rem',
    backgroundColor: '#B81F22',
    border: 'none',
    ':hover': {
      backgroundColor: '#2563eb'
    }
  },
  addIcon: {
    fontSize: '1.25rem'
  },
  tableContainer: {
    marginTop: '1.5rem',
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  table: {
    marginBottom: '0',
    borderColor: '#e2e8f0'
  },
  tableHeader: {
    backgroundColor: '#f1f5f9'
  },
  tableRow: {
    ':hover': {
      backgroundColor: '#f8fafc'
    }
  },
  tableCell: {
    padding: '1rem',
    verticalAlign: 'middle',
    borderColor: '#e2e8f0'
  },
  actionsCell: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center'
  },
  actionButton: {
    borderRadius: '6px',
    padding: '0.25rem 0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noResults: {
    padding: '2rem',
    textAlign: 'center',
    color: '#B81F22',
    fontSize: '1rem'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1.5rem',
    padding: '1rem',
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '1rem'
  },
  dateRangeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  dateInput: {
    borderRadius: '8px',
    padding: '0.5rem',
    border: '1px solid #e2e8f0'
  },
  dateSeparator: {
    color: '#64748b',
    fontSize: '0.875rem'
  },
  // Styles pour les modals
  modal: {
    borderRadius: '12px'
  },
  modalHeader: {
    borderBottom: '1px solid #e2e8f0',
    padding: '1.5rem'
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b'
  },
  modalBody: {
    padding: '1.5rem'
  },
  modalFooter: {
    borderTop: '1px solid #e2e8f0',
    padding: '1rem 1.5rem'
  },
  modalButton: {
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    fontWeight: '500'
  },
  // Styles pour les filtres
  filterLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#1e293b'
  },
  filterSelect: {
    borderRadius: '8px',
    padding: '0.5rem',
    border: '1px solid #e2e8f0',
    ':focus': {
      borderColor: '#B81F22',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
    }
  }
};

export default GestionMedias;