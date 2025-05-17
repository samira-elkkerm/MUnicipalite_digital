import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Image } from 'react-bootstrap';
import { BiImageAdd, BiTrash } from 'react-icons/bi';

const ModifierBonPlan = ({ show, onHide, bonPlan, onBonPlanUpdated }) => {
  const [formData, setFormData] = useState({
    lieu: '',
    image: null,
    depart: '',
    duree: '',
    distance: '',
    description: '',
    currentImage: ''
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteImage, setShowDeleteImage] = useState(false);

  // Initialiser les données du formulaire avec le bon plan à modifier
  useEffect(() => {
    if (bonPlan) {
      setFormData({
        lieu: bonPlan.lieu || '',
        image: null,
        depart: bonPlan.depart || '',
        duree: bonPlan.duree || '',
        distance: bonPlan.distance || '',
        description: bonPlan.description || '',
        currentImage: bonPlan.image || ''
      });
      setShowDeleteImage(false);
      setErrors({});
      setApiError('');
      setSuccessMessage("");
    }
  }, [bonPlan]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.lieu.trim()) newErrors.lieu = "Le lieu est requis";
    if (!formData.depart.trim()) newErrors.depart = "Le point de départ est requis";
    if (!formData.duree.trim()) newErrors.duree = "La durée est requise";
    if (!formData.distance.trim()) newErrors.distance = "La distance est requise";
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
      formDataToSend.append('lieu', formData.lieu);
      formDataToSend.append('depart', formData.depart);
      formDataToSend.append('duree', formData.duree);
      formDataToSend.append('distance', formData.distance);
      formDataToSend.append('description', formData.description);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      if (showDeleteImage) {
        formDataToSend.append('delete_image', 'true');
      }

      const response = await fetch(`http://localhost:8000/api/bons-plans/${bonPlan.id}`, {
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
        throw new Error(data.message || 'Erreur lors de la mise à jour du bon plan');
      }
      
      setSuccessMessage("Bon plan mis à jour avec succès !");
      onBonPlanUpdated(data);
      
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
          Modifier le bon plan
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4 py-3">
        {apiError && <Alert variant="danger" className="mb-3">{apiError}</Alert>}
        {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <div className="row mb-3 g-3">
            <div className="col-md-6">
              <Form.Group controlId="formLieu">
                <Form.Label className="fw-semibold">
                  Lieu <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="lieu"
                  value={formData.lieu}
                  onChange={handleChange}
                  isInvalid={!!errors.lieu}
                  placeholder="Nom du lieu"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lieu}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            
            <div className="col-md-6">
              <Form.Group controlId="formDepart">
                <Form.Label className="fw-semibold">
                  Point de départ <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="depart"
                  value={formData.depart}
                  onChange={handleChange}
                  isInvalid={!!errors.depart}
                  placeholder="Point de départ"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.depart}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          <div className="row mb-3 g-3">
            <div className="col-md-6">
              <Form.Group controlId="formDuree">
                <Form.Label className="fw-semibold">
                  Durée <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="duree"
                  value={formData.duree}
                  onChange={handleChange}
                  isInvalid={!!errors.duree}
                  placeholder="Durée (ex: 2 heures)"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.duree}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            
            <div className="col-md-6">
              <Form.Group controlId="formDistance">
                <Form.Label className="fw-semibold">
                  Distance <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  isInvalid={!!errors.distance}
                  placeholder="Distance (ex: 15 km)"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.distance}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          <div className="mb-3">
            <Form.Group controlId="formImage">
              <Form.Label className="fw-semibold">
                Image du lieu
              </Form.Label>
              
              {imageUrl && (
                <div className="mb-3 position-relative" style={{ width: '150px' }}>
                  <Image 
                    src={imageUrl} 
                    alt="Prévisualisation" 
                    thumbnail 
                    className="img-fluid"
                    onError={(e) => {
                      e.target.src = '/default-place.jpg';
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
                placeholder="Description détaillée du bon plan"
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

export default ModifierBonPlan;