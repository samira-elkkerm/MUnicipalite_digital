import React, { useState } from 'react';
import { Table, Button, Form, Alert, Badge, Image } from 'react-bootstrap';
import { BiTrash, BiShow, BiEdit, BiSearch, BiPlus } from 'react-icons/bi';

const ListeIncontournables = ({ 
  incontournables = [], 
  onViewDetails, 
  onAddIncontournable, 
  onEditIncontournable, 
  onDeleteIncontournable,
  loading,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIncontournables = incontournables.filter(item => {
    const searchText = searchTerm.toLowerCase();
    return (
      (item.attraction || '').toLowerCase().includes(searchText) ||
      (item.localisation || '').toLowerCase().includes(searchText) ||
      (item.description || '').toLowerCase().includes(searchText) ||
      (item.id || '').toString().includes(searchText)
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
        Erreur lors du chargement des incontournables: {error}
      </Alert>
    );
  }

  return (
    <div className="incontournables-list-container p-3">
      <h2 className="mb-4">Gestion des Incontournables</h2>
      
      <div className="d-flex justify-content-between mb-3">
        <div className="position-relative w-50">
          <BiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3" />
          <Form.Control
            type="text"
            placeholder="Rechercher par attraction, localisation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ps-5"
          />
        </div>
        <Button variant="primary" onClick={onAddIncontournable}>
          <BiPlus /> Ajouter un incontournable
        </Button>
      </div>

      {filteredIncontournables.length === 0 ? (
        <Alert variant="info" className="mt-3">
          Aucun élément trouvé
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Attraction</th>
              <th>Localisation</th>
              <th>Description</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncontournables.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <Image 
                    src={item.image} 
                    thumbnail 
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                  />
                </td>
                <td>{item.attraction}</td>
                <td>{item.localisation}</td>
                <td>{item.description.substring(0, 50)}...</td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    onClick={() => onViewDetails(item)}
                    className="me-1"
                  >
                    <BiShow />
                  </Button>
                  <Button 
                    variant="warning" 
                    size="sm" 
                    onClick={() => onEditIncontournable(item)}
                    className="me-1"
                  >
                    <BiEdit />
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => onDeleteIncontournable(item.id)}
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

export default ListeIncontournables;