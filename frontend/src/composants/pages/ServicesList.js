import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ServicesFilter from './ServicesFilter';
import { Modal, Button, Badge } from 'react-bootstrap';

const ServicesList = () => {
  // State management
  const [allServices, setAllServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    type: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  const navigate = useNavigate();
  const itemsPerPage = 8;

  // Data fetching
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:8000/api/services');
        setAllServices(data);
        setFilteredServices(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filtering logic
  useEffect(() => {
    if (allServices.length === 0) return;

    const filtered = allServices.filter(service => {
      const matchesSearch = filters.search 
        ? service.nom.toLowerCase().includes(filters.search.toLowerCase()) || 
          service.description.toLowerCase().includes(filters.search.toLowerCase())
        : true;
      
      const matchesType = filters.type 
        ? service.type === filters.type
        : true;

      return matchesSearch && matchesType;
    });

    setFilteredServices(filtered);
    setCurrentPage(1);
  }, [filters, allServices]);

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleCardClick = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseModal = () => setShowModal(false);

  // Loading and error states
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5 text-danger">
        Erreur lors du chargement des services: {error}
      </div>
    );
  }

  // Main render
  return (
    <div className="services-container">
      <div className="services-header">
        <h1 className="services-title">Nos Services Professionnels</h1>
        <p className="services-subtitle">Découvrez notre gamme complète de services adaptés à vos besoins</p>
      </div>
      
      <ServicesFilter onFilterChange={setFilters} />
      
      <div className="services-grid">
        {paginatedServices.length > 0 ? (
          paginatedServices.map((service) => (
            <div 
              key={service.id} 
              className="service-card"
              onClick={() => handleCardClick(service)}
            >
              <div className="service-card-inner">
                <div className="service-icon">
                  <img 
                    src={service.image_url || '/default-service.png'} 
                    alt={service.nom}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-service.png';
                    }}
                  />
                </div>
                <h3 className="service-name">{service.nom}</h3>
                <div className="service-description">
                  {service.description?.split('\n')[0] || "Description non disponible"}
                </div>
                <div className="service-footer">
                  <Badge bg="info" className="service-type">{service.type}</Badge>
                  <span className="learn-more">
                    En savoir plus <i className="bi bi-arrow-right"></i>
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>Aucun service ne correspond à votre recherche</p>
            <Button variant="outline-primary" onClick={() => setFilters({ search: '', type: '' })}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <Button 
            variant="outline-secondary"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <i className="bi bi-chevron-double-left"></i>
          </Button>
          
          <Button 
            variant="outline-secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="bi bi-chevron-left"></i>
          </Button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "primary" : "outline-secondary"}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
          
          <Button 
            variant="outline-secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="bi bi-chevron-right"></i>
          </Button>
          
          <Button 
            variant="outline-secondary"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <i className="bi bi-chevron-double-right"></i>
          </Button>
        </div>
      )}

      {/* Modal pour les détails du service */}
      {selectedService && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header closeButton className="modal-header-custom">
            <Modal.Title>{selectedService.nom}</Modal.Title>
            
          </Modal.Header>
          <Modal.Body className="modal-body-custom">
            <div className="row">
              <div className="col-md-5 text-center">
                <img 
                  src={selectedService.image_url || '/default-service.png'} 
                  alt={selectedService.nom}
                  className="img-fluid rounded mb-3 modal-service-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-service.png';
                  }}
                />
              </div>
              <div className="col-md-7">
                <h4 className="section-title">Description détaillée</h4>
                <div className="service-description-content">
                  {selectedService.description || "Aucune description disponible"}
                  <Badge bg="info">{selectedService.type}</Badge>
                </div>
              </div>
              
            </div>
          </Modal.Body>
          <Modal.Footer className="modal-footer-custom">
            <Button variant="danger" onClick={handleCloseModal}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* CSS */}
      <style jsx>{`
        .services-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .services-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .services-title {
          color: #2c3e50;
          font-weight: 700;
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
        }
        
        .services-subtitle {
          color: #7f8c8d;
          font-size: 1.1rem;
          max-width: 700px;
          margin: 0 auto;
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin: 2rem 0;
        }
        
        .service-card {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 3px 10px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          cursor: pointer;
          border: 1px solid #eaeaea;
        }
        
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
          border-color: #d1d1d1;
        }
        
        .service-card-inner {
          padding: 1.5rem;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .service-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          padding: 1rem;
          border: 2px solid #e9ecef;
        }
        
        .service-icon img {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }
        
        .service-name {
          color: #2c3e50;
          font-size: 1.1rem;
          font-weight: 600;
          text-align: center;
          margin-bottom: 1rem;
          min-height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .service-description {
          color: #7f8c8d;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-align: center;
          min-height: 2.8rem;
        }
        
        .service-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }
        
        .learn-more {
          color: #B81F22;
          font-weight: 500;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
        }
        
        .learn-more i {
          margin-left: 0.3rem;
          transition: transform 0.3s ease;
        }
        
        .service-card:hover .learn-more i {
          transform: translateX(3px);
        }
        
        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 2rem;
        }
        
        .no-results p {
          color: #7f8c8d;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }
        
        .pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 2rem;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        /* Modal styles */
        .modal-header-custom {
          border-bottom: 1px solid #eaeaea;
          padding-bottom: 1rem;
        }
        
        .modal-body-custom {
          padding: 1.5rem;
        }
        
        .modal-footer-custom {
          border-top: 1px solid #eaeaea;
          padding-top: 1rem;
        }
        
        .modal-service-image {
          max-height: 150px;
          object-fit: contain;
        }
        
        .section-title {
          color: #2c3e50;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #f0f0f0;
        }
        
        .service-description-content {
          line-height: 1.6;
          color: #555;
          white-space: pre-line;
        }
        
        @media (max-width: 1200px) {
          .services-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (max-width: 992px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .services-title {
            font-size: 1.8rem;
          }
          
          .services-subtitle {
            font-size: 1rem;
          }
          
          .modal-body-custom .row {
            flex-direction: column;
          }
          
          .modal-body-custom .col-md-5 {
            margin-bottom: 1.5rem;
          }
        }
        
        @media (max-width: 576px) {
          .services-container {
            padding: 1.5rem 0.5rem;
          }
          
          .services-grid {
            grid-template-columns: 1fr;
          }
          
          .service-card-inner {
            padding: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ServicesList;