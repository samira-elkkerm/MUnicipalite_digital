import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const AjoutMedia = ({ show, onHide, onMediaAdded }) => {
  const [formData, setFormData] = useState({
    titre: '',
    image: null,
    objectif: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titre.trim()) newErrors.titre = "Le titre est requis";
    if (!formData.image) newErrors.image = "Une image est requise";
    if (!formData.objectif.trim()) newErrors.objectif = "L'objectif est requis";
    if (!formData.description.trim()) newErrors.description = "La description est requise";
    
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
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
    
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setApiError("");

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titre', formData.titre);
      formDataToSend.append('image', formData.image);
      formDataToSend.append('objectif', formData.objectif);
      formDataToSend.append('description', formData.description);

      const response = await fetch('http://localhost:8000/api/medias', {
        method: 'POST',
        body: formDataToSend
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        throw new Error(data.message || 'Erreur lors de la création');
      }
      
      setSuccessMessage("Média créé avec succès !");
      onMediaAdded(data);
      
      setTimeout(() => {
        setFormData({
          titre: '',
          image: null,
          objectif: '',
          description: ''
        });
        onHide();
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered
      size="xl" // Changé de "lg" à "xl" pour plus d'espace
      backdrop="static"
      dialogClassName="mw-100 mx-4" // Ajout pour une meilleure adaptation à l'écran
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center fw-bold fs-4">
          Ajouter un nouveau média
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4 py-3" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        {apiError && <Alert variant="danger" className="mb-3">{apiError}</Alert>}
        {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
        
        <Form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
          <div className="row w-100 mb-3 g-3">
            <div className="col-md-6">
              <Form.Group controlId="formTitre">
                <Form.Label className="fw-semibold">
                  Titre <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  isInvalid={!!errors.titre}
                  placeholder="Titre du média"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.titre}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            
            <div className="col-md-6">
              <Form.Group controlId="formImage">
                <Form.Label className="fw-semibold">
                  Image <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  isInvalid={!!errors.image}
                  accept="image/*"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.image}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          <div className="w-100 mb-3">
            <Form.Group controlId="formObjectif">
              <Form.Label className="fw-semibold">
                Objectif <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="objectif"
                value={formData.objectif}
                onChange={handleChange}
                isInvalid={!!errors.objectif}
                placeholder="Objectif du média"
                style={{ resize: 'none' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.objectif}
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
                placeholder="Description détaillée du média"
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
              onClick={onHide}
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
                "Enregistrer"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AjoutMedia;