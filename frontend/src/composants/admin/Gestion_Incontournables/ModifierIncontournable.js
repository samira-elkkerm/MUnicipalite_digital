import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Image } from 'react-bootstrap';
import { BiImageAdd, BiTrash } from 'react-icons/bi';

const ModifierIncontournable = ({ show, onHide, incontournable, onIncontournableUpdated }) => {
  const [formData, setFormData] = useState({
    attraction: '',
    image: null,
    localisation: '',
    description: '',
    currentImage: ''
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteImage, setShowDeleteImage] = useState(false);

  // Initialiser les données du formulaire avec l'incontournable à modifier
  useEffect(() => {
    if (incontournable) {
      setFormData({
        attraction: incontournable.attraction || '',
        image: null,
        localisation: incontournable.localisation || '',
        description: incontournable.description || '',
        currentImage: incontournable.image || ''
      });
      setShowDeleteImage(false);
      setErrors({});
      setApiError('');
      setSuccessMessage("");
    }
  }, [incontournable]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.attraction.trim()) newErrors.attraction = "Le nom de l'attraction est requis";
    if (!formData.localisation.trim()) newErrors.localisation = "La localisation est requise";
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
      image: e.target.files[0],
      currentImage: ''
    }));
    setShowDeleteImage(false);
    
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleDeleteImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      currentImage: ''
    }));
    setShowDeleteImage(true);
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
      formDataToSend.append('attraction', formData.attraction);
      formDataToSend.append('localisation', formData.localisation);
      formDataToSend.append('description', formData.description);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      if (showDeleteImage) {
        formDataToSend.append('delete_image', 'true');
      }

      const response = await fetch(`http://localhost:8000/api/incontournables/${incontournable.id}`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json',
          'X-HTTP-Method-Override': 'PUT'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        throw new Error(data.message || 'Erreur lors de la mise à jour de l\'incontournable');
      }
      
      setSuccessMessage("Incontournable mis à jour avec succès !");
      onIncontournableUpdated(data);
      
      setTimeout(() => {
        onHide();
        setSuccessMessage("");
      }, 1500);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageUrl = () => {
    if (formData.image) {
      return URL.createObjectURL(formData.image);
    }
    if (formData.currentImage) {
      return formData.currentImage.startsWith('http') 
        ? formData.currentImage 
        : `http://localhost:8000/images/${formData.currentImage}`;
    }
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered
      size="lg"
      backdrop="static"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center fw-bold fs-4">
          Modifier l'incontournable
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4 py-3">
        {apiError && <Alert variant="danger" className="mb-3">{apiError}</Alert>}
        {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <div className="row mb-3 g-3">
            <div className="col-md-12">
              <Form.Group controlId="formAttraction">
                <Form.Label className="fw-semibold">
                  Nom de l'attraction <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="attraction"
                  value={formData.attraction}
                  onChange={handleChange}
                  isInvalid={!!errors.attraction}
                  placeholder="Nom de l'attraction"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.attraction}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          <div className="mb-3">
            <Form.Group controlId="formImage">
              <Form.Label className="fw-semibold">
                Image de l'attraction
              </Form.Label>
              
              {imageUrl && (
                <div className="mb-3 position-relative" style={{ width: '150px' }}>
                  <Image 
                    src={imageUrl} 
                    alt="Prévisualisation" 
                    thumbnail 
                    className="img-fluid"
                    onError={(e) => {
                      e.target.src = '/default-attraction.png';
                    }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute top-0 end-0 m-1 rounded-circle"
                    style={{ width: '24px', height: '24px', padding: '0' }}
                    onClick={handleDeleteImage}
                    title="Supprimer l'image"
                  >
                    <BiTrash size={14} />
                  </Button>
                </div>
              )}
              
              <Form.Control
                type="file"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
                className="flex-grow-1"
              />
              <Form.Text muted>
                Laissez vide pour conserver l'image actuelle. Taille recommandée : 800x600px
              </Form.Text>
            </Form.Group>
          </div>

          <div className="mb-3">
            <Form.Group controlId="formLocalisation">
              <Form.Label className="fw-semibold">
                Localisation <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="localisation"
                value={formData.localisation}
                onChange={handleChange}
                isInvalid={!!errors.localisation}
                placeholder="Localisation de l'attraction"
              />
              <Form.Control.Feedback type="invalid">
                {errors.localisation}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="mb-4">
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
                placeholder="Description détaillée de l'attraction..."
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
                "Enregistrer les modifications"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModifierIncontournable;