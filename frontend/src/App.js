import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./layout/Navigation";
import Accueil from "./composants/pages/Accueil";
import Municipalite from "./composants/pages/Municipalite";
import Services from "./composants/pages/Services";
import TourismeCulture from "./composants/pages/TourismeCulture";
import Medias from "./composants/pages/Medias";
import Contact from "./composants/pages/Contact";
import Connecter from "./composants/Connecter";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/municipalite" element={<Municipalite />} />
        <Route path="/services" element={<Services />} />
        <Route path="/tourisme-culture" element={<TourismeCulture />} />
        <Route path="/medias" element={<Medias />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/Connecter" element={<Connecter />} />
      </Routes>
    </Router>
  );
}

export default App;
