import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import bg from "../Images/bg.jpg";

const Connecter = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const backgroundStyle = {
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "L'email est requis.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide.";
    }
    if (!formData.password) newErrors.password = "Le mot de passe est requis.";
    if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || data.message || "Erreur de connexion");
      }
  
      if (data.token) {
        localStorage.setItem("user",data.user.id);
        window.location.href = data.redirect;
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setErrors({ message: error.message || "Une erreur de connexion est survenue" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container
      fluid
      className="min-vh-100 d-flex justify-content-center align-items-center p-0"
      style={backgroundStyle}
    >
      <Row className="justify-content-center w-100">
        <Col md={6} lg={5}>
          <Card className="border-0 shadow">
            <Card.Header
              className="text-center py-4"
              style={{ backgroundColor: "rgba(182, 182, 182, 0.07)" }}
            >
              <FaUserCircle size={50} color="#b81f22" className="mb-3" />
              <Card.Title className="text-danger fw-bold">
                Se connecter
              </Card.Title>
            </Card.Header>
            <Card.Body className="p-4">
              {errors.message && (
                <Alert variant="danger" className="text-center">
                  {errors.message}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <p className="text-muted text-center mb-4">
                  Entrez votre adresse e-mail et votre mot de passe pour vous
                  connecter.
                </p>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Adresse e-mail"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-danger py-2"
                    isInvalid={!!errors.email}
                    required
                  />
                  {errors.email && (
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <Form.Group className="mb-4 position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    className="border-danger py-2"
                    isInvalid={!!errors.password}
                    required
                  />
                  <Button
                    variant="link"
                    className="position-absolute end-0 top-50 translate-middle-y me-2"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <FaEyeSlash color="#b81f22" />
                    ) : (
                      <FaEye color="#b81f22" />
                    )}
                  </Button>
                  {errors.password && (
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="danger"
                    type="submit"
                    className="fw-bold py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Connecter;