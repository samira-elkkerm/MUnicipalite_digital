import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { BiImageAdd } from 'react-icons/bi';

const AjoutGastronomie = ({ show, onHide, onGastronomieAdded }) => {
  const [formData, setFormData] = useState({
    plats: '',
    image: null,
    cuisine: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.plats.trim()) newErrors.plats = "Ce champ est requis";
    if (!formData.image) newErrors.image = "Une image est requise";
    if (!formData.cuisine.trim()) newErrors.cuisine = "Ce champ est requis";
    if (!formData.description.trim()) newErrors.description = "Ce champ est requis";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file
    }));
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError('');
    setSuccessMessage("");

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('plats', formData.plats);
      formDataToSend.append('image', formData.image);
      formDataToSend.append('cuisine', formData.cuisine);
      formDataToSend.append('description', formData.description);

      const response = await fetch('http://localhost:8000/api/gastronomies', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        throw new Error(data.message || "Erreur lors de l'ajout");
      }

      setSuccessMessage("Plat gastronomique ajouté avec succès !");
      onGastronomieAdded(data);
      
      setTimeout(() => {
        resetForm();
        onHide();
        setSuccessMessage("");
      }, 2000);

    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      plats: '',
      image: null,
      cuisine: '',
      description: ''
    });
    setErrors({});
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered
      size="xl"
      backdrop="static"
      dialogClassName="mw-100 mx-4"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center fw-bold fs-4">
          Ajouter un Plat Gastronomique
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4 py-3" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        {apiError && <Alert variant="danger" className="mb-3">{apiError}</Alert>}
        {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
        
        <Form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
          <div className="row w-100 mb-3 g-3">
            <div className="col-md-6">
              <Form.Group controlId="formPlats">
                <Form.Label className="fw-semibold">
                  Nom du plat <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="plats"
                  value={formData.plats}
                  onChange={handleChange}
                  isInvalid={!!errors.plats}
                  placeholder="Nom du plat gastronomique"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.plats}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            
            <div className="col-md-6">
              <Form.Group controlId="formImage">
                <Form.Label className="fw-semibold">
                  Image <span className="text-danger">*</span>
                </Form.Label>
                <div className="d-flex align-items-center gap-2">
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                    isInvalid={!!errors.image}
                  />
                  {formData.image && (
                    <span className="text-success">
                      <BiImageAdd size={20} />
                    </span>
                  )}
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.image}
                </Form.Control.Feedback>
                <Form.Text muted>
                  Taille recommandée : 800x600px, formats : JPG, PNG
                </Form.Text>
              </Form.Group>
            </div>
          </div>

          <div className="w-100 mb-3">
            <Form.Group controlId="formCuisine">
              <Form.Label className="fw-semibold">
                Type de cuisine <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                isInvalid={!!errors.cuisine}
                placeholder="Type de cuisine (ex: Marocaine, Italienne...)"
              />
              <Form.Control.Feedback type="invalid">
                {errors.cuisine}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="w-100 mb-4">
            <Form.Group controlId="formDescription">
              <Form.Label className="fw-semibold">
                Description <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="description"
                value={formData.description}
                onChange={handleChange}
                isInvalid={!!errors.description}
                placeholder="Description détaillée du plat (ingrédients, préparation...)"
                style={{ resize: 'none' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="d-flex justify-content-end gap-3 w-100">
            <Button 
              variant="outline-secondary" 
              onClick={() => {
                resetForm();
                onHide();
              }}
              className="px-4 py-2"
            >
              Annuler
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              className="px-4 py-2"
              style={{ backgroundColor: '#B81F22', borderColor: '#B81F22' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                  En cours...
                </>
              ) : (
                "Ajouter le plat"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AjoutGastronomie;