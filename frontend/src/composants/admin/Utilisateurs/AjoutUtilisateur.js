import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const AjoutUtilisateur = ({ show, onHide, onUserAdded }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    Role: 'municipalite', // Valeur par défaut modifiée
    Date: new Date().toISOString().split('T')[0],
    Statut: 'actif'
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validationRules = {
    nom: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ÿ\s\-']+$/,
      message: "Le nom doit contenir uniquement des lettres (2-50 caractères)"
    },
    prenom: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ÿ\s\-']+$/,
      message: "Le prénom doit contenir uniquement des lettres (2-50 caractères)"
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Veuillez entrer une adresse email valide"
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      message: "Le mot de passe doit contenir : 8 caractères, majuscule, minuscule et chiffre"
    },
    confirmPassword: {
      required: true,
      match: 'password',
      message: "Les mots de passe ne correspondent pas"
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      validateField(name, value);
    }
  };

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return true;

    let error = "";

    if (rules.required && !value.trim()) {
      error = "Ce champ est obligatoire";
    } else if (rules.minLength && value.length < rules.minLength) {
      error = `Doit contenir au moins ${rules.minLength} caractères`;
    } else if (rules.maxLength && value.length > rules.maxLength) {
      error = `Doit contenir au maximum ${rules.maxLength} caractères`;
    } else if (rules.pattern && !rules.pattern.test(value)) {
      error = rules.message;
    } else if (name === 'confirmPassword' && value !== formData.password) {
      error = validationRules.confirmPassword.message;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    Object.keys(validationRules).forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
        newErrors[field] = errors[field] || validationRules[field].message;
      }
    });

    setErrors(newErrors);
    return isValid;
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
      const userData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        Role: formData.Role,
        Date: formData.Date,
        Statut: formData.Statut
      };

      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.errors) {
          const backendErrors = {};
          Object.keys(data.errors).forEach(key => {
            backendErrors[key] = data.errors[key][0];
          });
          setErrors(backendErrors);
        }
        throw new Error(data.message || 'Erreur lors de la création');
      }
      
      setSuccessMessage("Utilisateur créé avec succès !");
      onUserAdded(data.user);
      
      setTimeout(() => {
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          password: '',
          confirmPassword: '',
          Role: 'municipalite', // Réinitialisation avec la valeur par défaut
          Date: new Date().toISOString().split('T')[0],
          Statut: 'actif'
        });
        setErrors({});
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
      size="lg"
      backdrop="static"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center fw-bold fs-4">
          Ajouter un nouvel utilisateur
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4 py-3">
        {apiError && <Alert variant="danger" className="mb-3">{apiError}</Alert>}
        {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
        
        <Form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
          <div className="d-flex justify-content-between w-100 mb-3 gap-3">
            <Form.Group style={{ width: '45%' }} controlId="formNom">
              <Form.Label className="fw-semibold">
                Nom <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                onBlur={(e) => validateField('nom', e.target.value)}
                isInvalid={!!errors.nom}
                placeholder="Votre Nom"
                className={errors.nom ? "is-invalid" : "border-success"}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nom}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group style={{ width: '45%' }} controlId="formPrenom">
              <Form.Label className="fw-semibold">
                Prénom <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                onBlur={(e) => validateField('prenom', e.target.value)}
                isInvalid={!!errors.prenom}
                placeholder="Votre Prénom"
                className={errors.prenom ? "is-invalid" : "border-success"}
              />
              <Form.Control.Feedback type="invalid">
                {errors.prenom}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="d-flex justify-content-between w-100 mb-3 gap-3">
            <Form.Group style={{ width: '45%' }} controlId="formEmail">
              <Form.Label className="fw-semibold">
                Email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={(e) => validateField('email', e.target.value)}
                isInvalid={!!errors.email}
                placeholder="exemple@domaine.com"
                className={errors.email ? "is-invalid" : "border-success"}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group style={{ width: '45%' }} controlId="formPassword">
              <Form.Label className="fw-semibold">
                Mot de passe <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={(e) => validateField('password', e.target.value)}
                isInvalid={!!errors.password}
                placeholder="8+ caractères"
                className={errors.password ? "is-invalid" : "border-success"}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="d-flex justify-content-between w-100 mb-3 gap-3">
            <Form.Group style={{ width: '45%' }} controlId="formConfirmPassword">
              <Form.Label className="fw-semibold">
                Confirmer mot de passe <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={(e) => validateField('confirmPassword', e.target.value)}
                isInvalid={!!errors.confirmPassword}
                placeholder="Retapez votre mot de passe"
                className={errors.confirmPassword ? "is-invalid" : "border-success"}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group style={{ width: '45%' }} controlId="formDate">
              <Form.Label className="fw-semibold">
                Date
              </Form.Label>
              <Form.Control
                type="date"
                name="Date"
                value={formData.Date}
                onChange={handleChange}
                className="border-success"
              />
            </Form.Group>
          </div>

          <div className="d-flex justify-content-between w-100 mb-4 gap-3">
            <Form.Group style={{ width: '45%' }} controlId="formRole">
              <Form.Label className="fw-semibold">
                Rôle <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="Role"
                value={formData.Role}
                onChange={handleChange}
                className="border-success"
              >
                <option value="municipalite">Municipalité</option>
                <option value="admin">Administrateur</option>
                <option value="manager">Manager</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group style={{ width: '45%' }} controlId="formStatut">
              <Form.Label className="fw-semibold">Statut</Form.Label>
              <Form.Select
                name="Statut"
                value={formData.Statut}
                onChange={handleChange}
                className="border-success"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </Form.Select>
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

export default AjoutUtilisateur;