import React, { useState } from 'react';
import { Table, Button, Form, Alert, Badge } from 'react-bootstrap';
import { BiTrash, BiShow, BiEdit, BiSearch, BiPlus } from 'react-icons/bi';

const ListeUtilisateurs = ({ 
  users = [], 
  onViewDetails, 
  onAddUser, 
  onEditUser, 
  onDeleteUser,
  loading,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => {
    const searchText = searchTerm.toLowerCase();
    return (
      (user.nom || '').toLowerCase().includes(searchText) ||
      (user.prenom || '').toLowerCase().includes(searchText) ||
      (user.email || '').toLowerCase().includes(searchText) ||
      (user.Role || '').toLowerCase().includes(searchText) ||
      (user.id || '').toString().includes(searchText)
    );
  });

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-3">
        Erreur lors du chargement des utilisateurs: {error}
      </Alert>
    );
  }

  return (
    <div className="users-list-container p-3">
      <h2 className="mb-4">Gestion des Utilisateurs</h2>
      
      <div className="d-flex justify-content-between mb-3">
        <div className="position-relative w-50">
          <BiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3" />
          <Form.Control
            type="text"
            placeholder="Rechercher par nom, email, rôle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ps-5"
          />
        </div>
        <Button variant="primary" onClick={onAddUser}>
          <BiPlus /> Ajouter un utilisateur
        </Button>
      </div>

      {filteredUsers.length === 0 ? (
        <Alert variant="info" className="mt-3">
          Aucun utilisateur trouvé
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.prenom} {user.nom}</td>
                <td>{user.email}</td>
                <td>{user.Role}</td>
                <td>{new Date(user.Date).toLocaleDateString()}</td>
                <td>
                  <Badge bg={user.Statut === 'actif' ? 'success' : 'danger'}>
                    {user.Statut}
                  </Badge>
                </td>
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    onClick={() => onViewDetails(user)}
                    className="me-1"
                  >
                    <BiShow />
                  </Button>
                  <Button 
                    variant="warning" 
                    size="sm" 
                    onClick={() => onEditUser(user)}
                    className="me-1"
                  >
                    <BiEdit />
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => onDeleteUser(user.id)}
                  >
                    <BiTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ListeUtilisateurs;