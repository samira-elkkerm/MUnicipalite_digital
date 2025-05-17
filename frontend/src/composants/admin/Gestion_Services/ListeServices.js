import React, { useState } from 'react';
import { Table, Button, Form, Alert, Badge } from 'react-bootstrap';
import { BiTrash, BiShow, BiEdit, BiSearch, BiPlus } from 'react-icons/bi';

const ListeServices = ({ 
  services = [], 
  onViewDetails, 
  onAddService, 
  onEditService, 
  onDeleteService,
  loading,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = services.filter(service => {
    const searchText = searchTerm.toLowerCase();
    return (
      (service.name || '').toLowerCase().includes(searchText) ||
      (service.type || '').toLowerCase().includes(searchText) ||
      (service.description || '').toLowerCase().includes(searchText) ||
      (service.id || '').toString().includes(searchText)
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
        Erreur lors du chargement des services: {error}
      </Alert>
    );
  }

  return (
    <div className="services-list-container p-3">
      <h2 className="mb-4">Gestion des Services</h2>
      
      <div className="d-flex justify-content-between mb-3">
        <div className="position-relative w-50">
          <BiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3" />
          <Form.Control
            type="text"
            placeholder="Rechercher par nom, type, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ps-5"
          />
        </div>
        <Button variant="primary" onClick={onAddService}>
          <BiPlus /> Ajouter un service
        </Button>
      </div>

      {filteredServices.length === 0 ? (
        <Alert variant="info" className="mt-3">
          Aucun service trouvé
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Type</th>
              <th>Description</th>
              <th>Date de création</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map(service => (
              <tr key={service.id}>
                <td>{service.id}</td>
                <td>{service.name}</td>
                <td>
                  <Badge bg="info">{service.type}</Badge>
                </td>
                <td>{service.description.substring(0, 50)}...</td>
                <td>{new Date(service.created_at).toLocaleDateString()}</td>
                <td>
                  <Badge bg={service.status === 'active' ? 'success' : 'danger'}>
                    {service.status || 'active'}
                  </Badge>
                </td>
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    onClick={() => onViewDetails(service)}
                    className="me-1"
                  >
                    <BiShow />
                  </Button>
                  <Button 
                    variant="warning" 
                    size="sm" 
                    onClick={() => onEditService(service)}
                    className="me-1"
                  >
                    <BiEdit />
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => onDeleteService(service.id)}
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

export default ListeServices;