import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import VilleDeMarrakech from "../Images/ville-de-Marrakech.png";
import MunicipaliteDigital from "../Images/Municipalite_digital.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWheelchair } from "@fortawesome/free-solid-svg-icons";

const Navigation = () => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/Connecter");
  };
  return (
    <div className="w-100">
      {/* Ligne supérieure avec logos et Accueil */}
      <div className="d-flex justify-content-between align-items-center w-100 mb-3">
        <img
          src={VilleDeMarrakech}
          alt="Ville de Marrakech"
          style={{ width: "200px", height: "auto" }}
        />

        <div className="d-flex align-items-center gap-4">
          <img
            src={MunicipaliteDigital}
            alt="Municipalité Digital"
            style={{ width: "200px", height: "auto", paddingRight: "35px" }}
          />
        </div>
      </div>

      {/* Barre de navigation principale */}
      <div className="d-flex align-items-center w-100">
        <Navbar expand="lg" className="w-100 justify-content-between">
          <Nav className="gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-danger fw-bold fs-5" : "text-black fs-5"
              }
              style={{ textDecoration: "none", paddingLeft: "35px" }}
            >
              Accueil
            </NavLink>
            <NavLink
              to="/municipalite"
              className={({ isActive }) =>
                isActive ? "text-danger fw-bold fs-5" : "text-black fs-5"
              }
              style={{ textDecoration: "none" }}
            >
              La Municipalité
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                isActive ? "text-danger fw-bold fs-5" : "text-black fs-5"
              }
              style={{ textDecoration: "none" }}
            >
              Services
            </NavLink>
            <NavLink
              to="/tourisme-culture"
              className={({ isActive }) =>
                isActive ? "text-danger fw-bold fs-5" : "text-black fs-5"
              }
              style={{ textDecoration: "none" }}
            >
              Tourisme & Culture
            </NavLink>
            <NavLink
              to="/medias"
              className={({ isActive }) =>
                isActive ? "text-danger fw-bold fs-5" : "text-black fs-5"
              }
              style={{ textDecoration: "none" }}
            >
              Medias
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "text-danger fw-bold fs-5" : "text-black fs-5"
              }
              style={{ textDecoration: "none" }}
            >
              Contact
            </NavLink>
          </Nav>

          <div
            className="d-flex align-items-center gap-2 "
            style={{ paddingRight: "35px" }}
          >
            <button
              type="button"
              className="accessibility-toggle"
              aria-label="Options d'accessibilité"
              style={{
                border: "none",
                background: "transparent",
              }}
            >
              <FontAwesomeIcon
                icon={faWheelchair}
                style={{ fontSize: "1.5rem", color: "#000000" }}
              />
            </button>

            <button
              className="btn btn-danger rounded-pill px-3 py-1"
              style={{ color: "white" }}
              onClick={handleLoginClick}
            >
              <span className="fw-bold fs-5">Connexion</span>
            </button>
          </div>
        </Navbar>
      </div>
    </div>
  );
};

export default Navigation;
