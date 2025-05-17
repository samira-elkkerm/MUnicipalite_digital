import React, { useState, useEffect } from 'react';
import MunicipaliteSidebar from '../../../layout/MunicipaliteSidebar';
import { Table, Button, Form, Modal, Alert, Pagination, Badge, InputGroup, Image } from 'react-bootstrap';
import { BiTrash, BiEdit, BiPlus, BiSearch, BiShow, BiFilterAlt, BiX } from 'react-icons/bi';
import AjoutService from './AjoutService';
import ModifierService from './ModifierService';
import DetailsService from './DetailsService';

const GestionServices = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [filterOptions, setFilterOptions] = useState({ type: '' });

  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === 'services/iconeservice.png') {
      return '/default-service.png';
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `http://localhost:8000/images/${imagePath}`;
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/services');
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        const data = await response.json();
        setServices(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        setError(err.message);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter(service => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = searchTerm ? (
      (service.nom || '').toLowerCase().includes(term) ||
      (service.description || '').toLowerCase().includes(term) ||
      (service.type || '').toLowerCase().includes(term) ||
      (service.id || '').toString().includes(term)
    ) : true;

    const matchesFilter = filterOptions.type ? 
      (service.type || '').toLowerCase() === filterOptions.type.toLowerCase() : true;

    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const handleEditClick = (service) => {
    setSelectedService(service);
    setShowEditModal(true);
  };

  const handleDetailsClick = (service) => {
    setSelectedService(service);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/services/${serviceToDelete.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Échec de la suppression');
      setServices(services.filter(s => s.id !== serviceToDelete.id));
      showSuccess('Service supprimé avec succès');
    } catch (err) {
      setError(err.message);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleServiceAdded = (newService) => {
    setServices([...services, newService]);
    setShowAddModal(false);
    showSuccess('Service ajouté avec succès');
  };

  const handleServiceUpdated = (updatedService) => {
    setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
    setShowEditModal(false);
    showSuccess('Service mis à jour avec succès');
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setShowFilterModal(false);
  };

  const resetFilters = () => {
    setFilterOptions({ type: '' });
    setCurrentPage(1);
  };

  const getTypeBadge = (type) => {
    if (!type) return <Badge bg="secondary">Inconnu</Badge>;
    switch(type.toLowerCase()) {
      default: return <Badge bg="secondary">{type}</Badge>;
    }
  };

  const uniqueTypes = [...new Set(services.map(s => s.type).filter(Boolean))];

  return (
    <div style={styles.container}>
      <MunicipaliteSidebar />
      <div style={styles.mainContent}>
        <div style={styles.contentWrapper}>
          {successMessage && <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>{successMessage}</Alert>}
          {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

          <div style={styles.searchAddContainer}>
            <div style={styles.searchFilterContainer}>
              <div style={styles.searchWrapper}>
                <BiSearch style={styles.searchIcon} />
                <Form.Control
                  type="text"
                  placeholder="Rechercher des services..."
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
              <Button variant="outline-secondary" onClick={() => setShowFilterModal(true)} style={styles.filterButton}>
                <BiFilterAlt style={styles.filterIcon} /> Filtres
              </Button>
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
                      <th>Nom</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map(service => (
                      <tr key={service.id}>
                        <td>{service.id}</td>
                        <td>
                          <Image 
                            src={getImageUrl(service.image)} 
                            alt={service.nom} 
                            rounded 
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = '/default-service.png';
                              e.target.style.objectFit = 'contain';
                            }}
                          />
                        </td>
                        <td>{service.nom || 'N/A'}</td>
                        <td>{service.description?.substring(0, 50)}{service.description?.length > 50 ? '...' : ''}</td>
                        <td>{getTypeBadge(service.type)}</td>
                        <td style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <Button variant="outline-info" size="sm" onClick={() => handleDetailsClick(service)}>
                            <BiShow />
                          </Button>
                          <Button variant="outline-primary" size="sm" onClick={() => handleEditClick(service)}>
                            <BiEdit />
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(service)}>
                            <BiTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {filteredServices.length === 0 && !loading && (
                  <div className="text-center py-4 text-muted">
                    {services.length === 0 ? 'Aucun service disponible' : 'Aucun service ne correspond aux critères'}
                  </div>
                )}

                {filteredServices.length > itemsPerPage && (
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

      <AjoutService show={showAddModal} onHide={() => setShowAddModal(false)} onServiceAdded={handleServiceAdded} />
      {selectedService && (
        <>
          <ModifierService show={showEditModal} onHide={() => setShowEditModal(false)} service={selectedService} onServiceUpdated={handleServiceUpdated} />
          <DetailsService show={showDetailsModal} onHide={() => setShowDetailsModal(false)} service={selectedService} />
        </>
      )}

      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer le service "{serviceToDelete?.nom}" ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Annuler</Button>
          <Button variant="danger" onClick={confirmDelete}>Supprimer</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Filtrer les services</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Type de service</Form.Label>
              <Form.Select name="type" value={filterOptions.type} onChange={handleFilterChange}>
                <option value="">Tous les types</option>
                {uniqueTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={resetFilters}>Réinitialiser</Button>
          <Button variant="danger" onClick={applyFilters}>Appliquer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

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
  }
};

export default GestionServices;