import React, { useState, useEffect } from 'react';
import MunicipaliteSidebar from '../../../layout/MunicipaliteSidebar';
import { Table, Button, Form, Modal, Alert, Pagination, Badge, InputGroup, Image } from 'react-bootstrap';
import { BiTrash, BiEdit, BiPlus, BiSearch, BiShow, BiFilterAlt, BiX } from 'react-icons/bi';
import AjoutGastronomie from './AjoutGastronomie';
import ModifierGastronomie from './ModifierIncontournable';
import DetailsGastronomie from './DetailsGastronomie';

const Gestion_Gastronomies = () => {
  const [gastronomies, setGastronomies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedGastronomie, setSelectedGastronomie] = useState(null);
  const [gastronomieToDelete, setGastronomieToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-food.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000/images/${imagePath}`;
  };

  useEffect(() => {
    const fetchGastronomies = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/gastronomies');
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        const data = await response.json();
        setGastronomies(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        setError(err.message);
        setGastronomies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGastronomies();
  }, []);

  const filteredGastronomies = gastronomies.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      (item.plats || '').toLowerCase().includes(term) ||
      (item.cuisine || '').toLowerCase().includes(term) ||
      (item.description || '').toLowerCase().includes(term) ||
      (item.id || '').toString().includes(term)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGastronomies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGastronomies.length / itemsPerPage);

  const handleEditClick = (gastronomie) => {
    setSelectedGastronomie(gastronomie);
    setShowEditModal(true);
  };

  const handleDetailsClick = (gastronomie) => {
    setSelectedGastronomie(gastronomie);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (gastronomie) => {
    setGastronomieToDelete(gastronomie);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/gastronomies/${gastronomieToDelete.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Échec de la suppression');
      setGastronomies(gastronomies.filter(i => i.id !== gastronomieToDelete.id));
      showSuccess('Plat gastronomique supprimé avec succès');
    } catch (err) {
      setError(err.message);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleGastronomieAdded = (newGastronomie) => {
    setGastronomies([...gastronomies, newGastronomie]);
    setShowAddModal(false);
    showSuccess('Plat gastronomique ajouté avec succès');
  };

  const handleGastronomieUpdated = (updatedGastronomie) => {
    setGastronomies(gastronomies.map(i => i.id === updatedGastronomie.id ? updatedGastronomie : i));
    setShowEditModal(false);
    showSuccess('Plat gastronomique mis à jour avec succès');
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
          {successMessage && <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>{successMessage}</Alert>}
          {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

          <div style={styles.searchAddContainer}>
            <div style={styles.searchWrapper}>
              <BiSearch style={styles.searchIcon} />
              <Form.Control
                type="text"
                placeholder="Rechercher des plats gastronomiques..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
              {searchTerm && (
                <Button variant="link" onClick={() => setSearchTerm('')} style={styles.clearSearchButton}>
                  <BiX size={18} />
                </Button>
              )}
            </div>
            <Button variant="primary" onClick={() => setShowAddModal(true)} style={styles.addButton}>
              <BiPlus style={styles.addIcon} /> Ajouter
            </Button>
          </div>

          <div style={styles.tableContainer}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            ) : (
              <>
                <Table striped bordered hover responsive style={styles.table}>
                  <thead style={styles.tableHeader}>
                    <tr>
                      <th>ID</th>
                      <th>Image</th>
                      <th>Plat</th>
                      <th>Cuisine</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map(item => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>
                          <Image 
                            src={getImageUrl(item.image)} 
                            alt={item.plats} 
                            rounded 
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = '/default-food.jpg';
                              e.target.style.objectFit = 'contain';
                            }}
                          />
                        </td>
                        <td>{item.plats || 'N/A'}</td>
                        <td>
                          <Badge bg="info">{item.cuisine || 'N/A'}</Badge>
                        </td>
                        <td>{item.description?.substring(0, 50)}{item.description?.length > 50 ? '...' : ''}</td>
                        <td style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <Button variant="outline-info" size="sm" onClick={() => handleDetailsClick(item)}>
                            <BiShow />
                          </Button>
                          <Button variant="outline-primary" size="sm" onClick={() => handleEditClick(item)}>
                            <BiEdit />
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(item)}>
                            <BiTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {filteredGastronomies.length === 0 && !loading && (
                  <div className="text-center py-4 text-muted">
                    {gastronomies.length === 0 ? 'Aucun plat gastronomique disponible' : 'Aucun résultat trouvé'}
                  </div>
                )}

                {filteredGastronomies.length > itemsPerPage && (
                  <div className="d-flex justify-content-center mt-3">
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
              </>
            )}
          </div>
        </div>
      </div>

      <AjoutGastronomie 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)} 
        onGastronomieAdded={handleGastronomieAdded} 
      />
      
      {selectedGastronomie && (
        <>
          <ModifierGastronomie 
            show={showEditModal} 
            onHide={() => setShowEditModal(false)} 
            gastronomie={selectedGastronomie} 
            onGastronomieUpdated={handleGastronomieUpdated} 
          />
          <DetailsGastronomie 
            show={showDetailsModal} 
            onHide={() => setShowDetailsModal(false)} 
            gastronomie={selectedGastronomie} 
          />
        </>
      )}

      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer le plat "{gastronomieToDelete?.plats}" ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Annuler</Button>
          <Button variant="danger" onClick={confirmDelete}>Supprimer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Les styles restent identiques à ceux de GestionIncontournables
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
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
    border: '1px solid #B81F22',
    backgroundColor: 'white',
    ':hover': {
      backgroundColor: '#B81F22'
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
  }
};

export default Gestion_Gastronomies;