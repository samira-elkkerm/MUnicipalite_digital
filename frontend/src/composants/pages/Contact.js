import React, { useState } from 'react';
import Navigation from "../../layout/Navigation";
import Footer from '../../layout/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Validation simple
  const validate = () => {
    const errs = {};
    if (!formData.nom.trim()) errs.nom = "Le nom est requis";
    if (!formData.email.trim()) errs.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Email invalide";
    if (!formData.message.trim()) errs.message = "Le message est requis";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Mise à jour des champs
  const handleChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value});
    if (errors[e.target.name]) setErrors({...errors, [e.target.name]: ''});
  };

  // Envoi du formulaire
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccess('');
    try {
      const response = await fetch('http://localhost:8000/api/contact', { // Remplacez par votre URL API
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Message envoyé avec succès !');
        setFormData({nom: '', email: '', message: ''});
      } else {
        setErrors({form: data.message || 'Erreur serveur'});
      }
    } catch {
      setErrors({form: 'Erreur de connexion au serveur'});
    }
    setLoading(false);
  };

  const styles = `
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
    }
    .container {
      max-width: 1000px;
      margin: 50px auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .title {
      color: #a20000;
      text-align: center;
      margin-bottom: 30px;
    }
    .title2 {
      color: black;
      text-align: center;
      margin-bottom: 30px;
    }
    .content-wrapper {
      display: flex;
      gap: 30px;
      flex-wrap: wrap;
    }
    .contact-info {
      flex: 1;
      min-width: 280px;
    }
    .contact-form {
      flex: 1;
      min-width: 280px;
    }
    .info-box {
      background-color: #a20000;
      color: white;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 5px;
    }
    .contact-form form {
      display: flex;
      flex-direction: column;
    }
    .contact-form input,
    .contact-form textarea {
      margin: 10px 0;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
      width: 100%;
      box-sizing: border-box;
    }
    .contact-form button {
      padding: 10px;
      background-color: #a20000;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 10px;
    }
    .contact-form button:hover {
      background-color: #900000;
    }
    .error {
      color: red;
      font-size: 0.9rem;
      margin-top: -8px;
      margin-bottom: 8px;
    }
    .success {
      color: green;
      text-align: center;
      margin-bottom: 15px;
    }
  `;

  return (
    <>
      <Navigation />
      <style>{styles}</style>
      <div className="container">
        <h1 className="title">Ville Marrakech</h1>
        <h2 className="title2">Contactez-nous</h2>
        <div className="content-wrapper">
          <div className="contact-info">
            <div className="info-box">
              <p>Hôtel de Ville, Avenue Mohammed V,</p>
              <p>Marrakech</p>
            </div>
            <div className="info-box">
              <p><strong>Email: </strong>info@ville-marrakech.ma</p>
            </div>
            <div className="info-box">
              <p><strong>Téléphone: </strong> 080 100 00 08</p>
            </div>
            <div className="info-box">
              <p>Lundi au vendredi : 8h30-16h30</p>
              <p>Samedi et Dimanche : Fermé</p>
            </div>
          </div>
          <div className="contact-form">
            {errors.form && <p className="error">{errors.form}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleSubmit} noValidate>
              <input
                type="text"
                name="nom"
                placeholder="NOM COMPLET"
                value={formData.nom}
                onChange={handleChange}
                required
              />
              {errors.nom && <p className="error">{errors.nom}</p>}
              <input
                type="email"
                name="email"
                placeholder="EMAIL"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="error">{errors.email}</p>}
              <textarea
                name="message"
                placeholder="MESSAGE"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              />
              {errors.message && <p className="error">{errors.message}</p>}
              <button type="submit" disabled={loading}>
                {loading ? 'Envoi...' : 'ENVOYER'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
