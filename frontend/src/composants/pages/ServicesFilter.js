import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServicesFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    type: ''
  });
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/services');
        // Extraire les types uniques des services
        const types = [...new Set(response.data.map(service => service.type).filter(Boolean))];
        
        setServiceTypes([
          { value: '', label: 'Tous les types' },
          ...types.map(type => ({
            value: type,
            label: type
          }))
        ]);
      } catch (err) {
        console.error('Error fetching service types:', err);
        setServiceTypes([{ value: '', label: 'Tous les types' }]);
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchServiceTypes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  return (
    <div className="row mb-5">
      <div className="col-md-8 mx-auto">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher un service..."
              name="search"
              value={filters.search}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <select 
              className="form-select"
              name="type"
              value={filters.type}
              onChange={handleInputChange}
              disabled={loadingTypes}
            >
              {serviceTypes.map((type, index) => (
                <option key={index} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-danger w-100">
              <i className="bi bi-funnel-fill me-2"></i>Filtrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicesFilter;