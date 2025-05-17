import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { BiImageAdd } from 'react-icons/bi';

const AjoutService = ({ show, onHide, onServiceAdded }) => {
  const [formData, setFormData] = useState({
    nom: '',
    image: null,
    type: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const serviceTypes = [
    'SERVICES ADMINISTRATIFS',
    'ENVIRONNEMENT & PROPRETÉ',
    'INFRASTRUCTURES & VOIRIE',
    'SERVICES SOCIAUX',
    'SÉCURITÉ & URGENCES',
    'TRANSPORT & MOBILITÉ',
    'COMMERCE & MARCHÉS',
    'CULTURE & PATRIMOINE',
    'TOURISME & ACCUEIL'
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.image) newErrors.image = "Une image est requise";
    if (!formData.type) newErrors.type = "Le type est requis";
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
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) { // 2MB limit
      setErrors(prev => ({ ...prev, image: "L'image ne doit pas dépasser 2MB" }));
      return;
    }
    
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
    setSuccessMessage('');

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('image', formData.image);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('description', formData.description);

      // Debug: Afficher le contenu du FormData
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const response = await fetch('http://localhost:8000/api/services', {
        method: 'POST',
        body: formDataToSend,
        // Pas besoin de headers pour FormData, le navigateur les ajoute automatiquement
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        throw new Error(data.message || "Erreur lors de l'ajout du service");
      }

      setSuccessMessage("Service ajouté avec succès !");
      onServiceAdded(data);

      // Réinitialiser le formulaire après 2 secondes
      setTimeout(() => {
        setFormData({
          nom: '',
          image: null,
          type: '',
          description: ''
        });
        onHide();
        setSuccessMessage('');
      }, 2000);

    } catch (err) {
      setApiError(err.message);
      console.error("Erreur lors de l'ajout du service:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center fw-bold fs-4">
          Ajouter un nouveau service
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4 py-3">
        {apiError && <Alert variant="danger" className="mb-3">{apiError}</Alert>}
        {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <div className="row mb-3 g-3">
            <div className="col-md-6">
              <Form.Group controlId="formNom">
                <Form.Label className="fw-semibold">Nom du service <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  isInvalid={!!errors.nom}
                  placeholder="Nom du service"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nom}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            
            <div className="col-md-6">
              <Form.Group controlId="formType">
                <Form.Label className="fw-semibold">Type de service <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  isInvalid={!!errors.type}
                >
                  <option value="">Sélectionnez un type</option>
                  {serviceTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.type}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          <div className="mb-3">
            <Form.Group controlId="formImage">
              <Form.Label className="fw-semibold">Image du service <span className="text-danger">*</span></Form.Label>
              <div className="d-flex align-items-center gap-3">
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="flex-grow-1"
                  isInvalid={!!errors.image}
                />
                {formData.image && (
                  <div className="text-success">
                    <BiImageAdd size={24} />
                    <small className="ms-1">{formData.image.name}</small>
                  </div>
                )}
              </div>
              <Form.Control.Feedback type="invalid">
                {errors.image}
              </Form.Control.Feedback>
              <Form.Text muted>
                Formats acceptés: JPEG, PNG, JPG, GIF (max 2MB)
              </Form.Text>
            </Form.Group>
          </div>

          <div className="mb-4">
            <Form.Group controlId="formDescription">
              <Form.Label className="fw-semibold">Description <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="description"
                value={formData.description}
                onChange={handleChange}
                isInvalid={!!errors.description}
                placeholder="Description détaillée du service..."
                style={{ resize: 'none' }}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="d-flex justify-content-end gap-3">
            <Button 
              variant="outline-secondary" 
              onClick={onHide}
              className="px-4 py-2"
              disabled={isSubmitting}
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
                  Enregistrement...
                </>
              ) : (
                "Enregistrer le service"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AjoutService;