import React, { useState, useEffect } from 'react';
import MunicipaliteSidebar from '../../../layout/MunicipaliteSidebar';
import { Table, Button, Form, Modal, Alert, Pagination, Badge, InputGroup } from 'react-bootstrap';
import { BiTrash, BiEdit, BiPlus, BiSearch, BiShow, BiFilterAlt, BiX } from 'react-icons/bi';
import AjoutUtilisateur from './AjoutUtilisateur';
import ModifierUtilisateur from './ModifierUtilisateur';
import DetailsUtilisateur from './DetailsUtilisateur';

const GestionUtilisateurs = () => {
  // États pour la gestion des utilisateurs
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour les modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // États pour la sélection
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // États pour les messages et pagination
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // États pour les filtres
  const [filterOptions, setFilterOptions] = useState({
    role: ''
  });

  // Chargement des utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/users');
        
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        
        const data = await response.json();
        setUsers(data.users || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user => {
    // Filtre de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!(
        user.nom.toLowerCase().includes(term) ||
        user.prenom.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.Role.toLowerCase().includes(term)
      ) ){
        return false;
      }
    }

    // Filtre par rôle
    if (filterOptions.role && user.Role.toLowerCase() !== filterOptions.role.toLowerCase()) {
      return false;
    }

    return true;
  });

  // Calcul de la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Gestion des actions
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDetailsClick = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${userToDelete.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Échec de la suppression');
      
      setUsers(users.filter(user => user.id !== userToDelete.id));
      showSuccess('Utilisateur supprimé avec succès');
    } catch (err) {
      setError(err.message);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleUserAdded = (newUser) => {
    setUsers([...users, newUser]);
    setShowAddModal(false);
    showSuccess('Utilisateur ajouté avec succès');
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setShowEditModal(false);
    showSuccess('Utilisateur mis à jour avec succès');
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Gestion des filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setShowFilterModal(false);
  };

  const resetFilters = () => {
    setFilterOptions({ role: '' });
    setCurrentPage(1);
  };

  // Styles conditionnels pour les badges
  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'actif': return <Badge bg="success">Actif</Badge>;
      case 'inactif': return <Badge bg="danger">Inactif</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin': return <Badge bg="primary">Admin</Badge>;
      case 'manager': return <Badge bg="warning" text="dark">Manager</Badge>;
      case 'municipalite': return <Badge bg="info">Municipalité</Badge>;
      default: return <Badge bg="secondary">{role}</Badge>;
    }
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

          <div style={styles.searchAddContainer}>
            <div style={styles.searchFilterContainer}>
              <div style={styles.searchWrapper}>
                <BiSearch style={styles.searchIcon} />
                <Form.Control
                  type="text"
                  placeholder="Rechercher des utilisateurs..."
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
                variant="outline-secondary" 
                onClick={() => setShowFilterModal(true)}
                style={styles.filterButton}
              >
                <BiFilterAlt style={styles.filterIcon} /> Filtres
              </Button>
            </div>
            
            <Button 
              variant="primary" 
              onClick={() => setShowAddModal(true)}
              style={styles.addButton}
            >
              <BiPlus style={styles.addIcon} /> Ajouter
            </Button>
          </div>

          <div style={styles.tableContainer}>
            <Table striped bordered hover responsive style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableCell}>ID</th>
                  <th style={styles.tableCell}>Utilisateur</th>
                  <th style={styles.tableCell}>Email</th>
                  <th style={styles.tableCell}>Rôle</th>
                  <th style={styles.tableCell}>Date</th>
                  <th style={styles.tableCell}>Statut</th>
                  <th style={styles.tableCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(user => (
                  <tr key={user.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{user.id}</td>
                    <td style={styles.tableCell}>{user.prenom} {user.nom}</td>
                    <td style={styles.tableCell}>{user.email}</td>
                    <td style={styles.tableCell}>{getRoleBadge(user.Role)}</td>
                    <td style={styles.tableCell}>{new Date(user.Date).toLocaleDateString('fr-FR')}</td>
                    <td style={styles.tableCell}>{getStatusBadge(user.Statut)}</td>
                    <td style={{ ...styles.tableCell, ...styles.actionsCell }}>
                      <Button variant="outline-info" size="sm" onClick={() => handleDetailsClick(user)} style={styles.actionButton}>
                        <BiShow />
                      </Button>
                      <Button variant="outline-primary" size="sm" onClick={() => handleEditClick(user)} style={styles.actionButton}>
                        <BiEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(user)} style={styles.actionButton}>
                        <BiTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {filteredUsers.length === 0 && (
              <div style={styles.noResults}>
                Aucun utilisateur trouvé
              </div>
            )}

            {filteredUsers.length > itemsPerPage && (
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
        </div>
      </div>

      {/* Modals */}
      <AjoutUtilisateur 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)} 
        onUserAdded={handleUserAdded}
      />

      {selectedUser && (
        <>
          <ModifierUtilisateur 
            show={showEditModal} 
            onHide={() => setShowEditModal(false)} 
            user={selectedUser}
            onUserUpdated={handleUserUpdated}
          />
          
          <DetailsUtilisateur
            show={showDetailsModal}
            onHide={() => setShowDetailsModal(false)}
            user={selectedUser}
          />
        </>
      )}

      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered style={styles.modal}>
        <Modal.Header closeButton style={styles.modalHeader}>
          <Modal.Title style={styles.modalTitle}>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          Êtes-vous sûr de vouloir supprimer {userToDelete?.prenom} {userToDelete?.nom} ?
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

      {/* Modal de filtrage */}
      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)} centered style={styles.modal}>
        <Modal.Header closeButton style={styles.modalHeader}>
          <Modal.Title style={styles.modalTitle}>Filtrer par rôle</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={styles.filterLabel}>Rôle</Form.Label>
              <Form.Select 
                name="role"
                value={filterOptions.role}
                onChange={handleFilterChange}
                style={styles.filterSelect}
              >
                <option value="">Tous les rôles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="municipalite">Municipalité</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={styles.modalFooter}>
          <Button variant="outline-secondary" onClick={resetFilters} style={styles.modalButton}>
            Réinitialiser
          </Button>
          <Button variant="danger" onClick={applyFilters} style={styles.modalButton}>
            Appliquer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Styles (inchangés)
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

export default GestionUtilisateurs;