import React, { useState } from 'react';
import { Table, Button, Form, Alert, Badge, Image } from 'react-bootstrap';
import { BiTrash, BiShow, BiEdit, BiSearch, BiPlus } from 'react-icons/bi';

const ListeBonsPlans = ({ 
  bonsPlans = [], 
  onViewDetails, 
  onAddBonPlan, 
  onEditBonPlan, 
  onDeleteBonPlan,
  loading,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBonsPlans = bonsPlans.filter(item => {
    const searchText = searchTerm.toLowerCase();
    return (
      (item.lieu || '').toLowerCase().includes(searchText) ||
      (item.depart || '').toLowerCase().includes(searchText) ||
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
        Erreur lors du chargement des bons plans: {error}
      </Alert>
    );
  }

  return (
    <div className="bons-plans-list-container p-3">
      <h2 className="mb-4">Gestion des Bons Plans</h2>
      
      <div className="d-flex justify-content-between mb-3">
        <div className="position-relative w-50">
          <BiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3" />
          <Form.Control
            type="text"
            placeholder="Rechercher par lieu, départ ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ps-5"
          />
        </div>
        <Button variant="primary" onClick={onAddBonPlan}>
          <BiPlus /> Ajouter un bon plan
        </Button>
      </div>

      {filteredBonsPlans.length === 0 ? (
        <Alert variant="info" className="mt-3">
          Aucun bon plan trouvé
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Lieu</th>
              <th>Départ</th>
              <th>Durée</th>
              <th>Distance</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBonsPlans.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <Image 
                    src={item.image} 
                    thumbnail 
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                    onError={(e) => {
                      e.target.src = '/default-place.jpg';
                      e.target.style.objectFit = 'contain';
                    }}
                  />
                </td>
                <td>{item.lieu}</td>
                <td>{item.depart}</td>
                <td>
                  <Badge bg="info">{item.duree}</Badge>
                </td>
                <td>{item.distance}</td>
                <td className="text-truncate" style={{ maxWidth: '200px' }}>
                  {item.description || "Aucune description"}
                </td>
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
                    onClick={() => onEditBonPlan(item)}
                    className="me-1"
                  >
                    <BiEdit />
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => onDeleteBonPlan(item.id)}
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

export default ListeBonsPlans;