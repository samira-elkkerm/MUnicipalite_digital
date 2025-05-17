import React, { useState, useEffect } from 'react';
import MunicipaliteSidebar from '../../../layout/MunicipaliteSidebar';
import { Table, Button, Form, Modal, Alert, Pagination, Badge, InputGroup, Image } from 'react-bootstrap';
import { BiTrash, BiEdit, BiPlus, BiSearch, BiShow, BiFilterAlt, BiX } from 'react-icons/bi';
import AjoutBonPlan from './AjoutBonPlan';
import ModifierBonPlan from './ModifierBonPlan';
import DetailsBonPlan from './DetailsBonPlan';

const GestionBonsPlans = () => {
  const [bonsPlans, setBonsPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedBonPlan, setSelectedBonPlan] = useState(null);
  const [bonPlanToDelete, setBonPlanToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-place.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000/images/${imagePath}`;
  };

  useEffect(() => {
    const fetchBonsPlans = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/bons-plans');
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        const data = await response.json();
        setBonsPlans(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        setError(err.message);
        setBonsPlans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBonsPlans();
  }, []);

  const filteredBonsPlans = bonsPlans.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      (item.lieu || '').toLowerCase().includes(term) ||
      (item.depart || '').toLowerCase().includes(term) ||
      (item.description || '').toLowerCase().includes(term) ||
      (item.id || '').toString().includes(term)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBonsPlans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBonsPlans.length / itemsPerPage);

  const handleEditClick = (bonPlan) => {
    setSelectedBonPlan(bonPlan);
    setShowEditModal(true);
  };

  const handleDetailsClick = (bonPlan) => {
    setSelectedBonPlan(bonPlan);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (bonPlan) => {
    setBonPlanToDelete(bonPlan);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/bons-plans/${bonPlanToDelete.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Échec de la suppression');
      setBonsPlans(bonsPlans.filter(i => i.id !== bonPlanToDelete.id));
      showSuccess('Bon plan supprimé avec succès');
    } catch (err) {
      setError(err.message);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleBonPlanAdded = (newBonPlan) => {
    setBonsPlans([...bonsPlans, newBonPlan]);
    setShowAddModal(false);
    showSuccess('Bon plan ajouté avec succès');
  };

  const handleBonPlanUpdated = (updatedBonPlan) => {
    setBonsPlans(bonsPlans.map(i => i.id === updatedBonPlan.id ? updatedBonPlan : i));
    setShowEditModal(false);
    showSuccess('Bon plan mis à jour avec succès');
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
                placeholder="Rechercher des bons plans..."
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
                      <th>Lieu</th>
                      <th>Départ</th>
                      <th>Durée</th>
                      <th>Distance</th>
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
                            alt={item.lieu} 
                            rounded 
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = '/default-place.jpg';
                              e.target.style.objectFit = 'contain';
                            }}
                          />
                        </td>
                        <td>{item.lieu || 'N/A'}</td>
                        <td>{item.depart || 'N/A'}</td>
                        <td>
                          <Badge bg="info">{item.duree || 'N/A'}</Badge>
                        </td>
                        <td>{item.distance || 'N/A'}</td>
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

                {filteredBonsPlans.length === 0 && !loading && (
                  <div className="text-center py-4 text-muted">
                    {bonsPlans.length === 0 ? 'Aucun bon plan disponible' : 'Aucun résultat trouvé'}
                  </div>
                )}

                {filteredBonsPlans.length > itemsPerPage && (
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

      <AjoutBonPlan 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)} 
        onBonPlanAdded={handleBonPlanAdded} 
      />
      
      {selectedBonPlan && (
        <>
          <ModifierBonPlan 
            show={showEditModal} 
            onHide={() => setShowEditModal(false)} 
            bonPlan={selectedBonPlan} 
            onBonPlanUpdated={handleBonPlanUpdated} 
          />
          <DetailsBonPlan 
            show={showDetailsModal} 
            onHide={() => setShowDetailsModal(false)} 
            bonPlan={selectedBonPlan} 
          />
        </>
      )}

      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer le bon plan "{bonPlanToDelete?.lieu}" ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Annuler</Button>
          <Button variant="danger" onClick={confirmDelete}>Supprimer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Les styles restent identiques
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
    boxShadow: 'none'
  },
  clearSearchButton: {
    position: 'absolute',
    right: '0.75rem',
    color: '#64748b',
    fontSize: '1.25rem',
    padding: '0',
    background: 'transparent',
    border: 'none'
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
    border: 'none'
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

export default GestionBonsPlans;