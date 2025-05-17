import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./composants/admin/Dashboard";
import Gestion_Utilisateurs from "./composants/admin/Utilisateurs/Gestion_Utilisateurs";
import Gestion_Medias from "./composants/admin/Medias/Gestion_Medias";
import Gestion_Services from "./composants/admin/Gestion_Services/Gestion_Services";
import Gestion_Incontournables from "./composants/admin/Gestion_Incontournables/Gestion_Incontournables";
import Gestion_Gastronomies from "./composants/admin/Gestion_Gastronomies/Gestion_Gastronomies";
import Gestion_BonPlans from "./composants/admin/Gestion_BonPlans/Gestion_BonPlans";
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
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="utilisateurs" element={<Gestion_Utilisateurs />} />
        <Route path="medias" element={<Gestion_Medias />} />
        <Route path="services" element={<Gestion_Services />} />
        <Route path="incontournables" element={<Gestion_Incontournables />} />
        <Route path="gastronomie" element={<Gestion_Gastronomies />} />
        <Route path="bon-plans" element={<Gestion_BonPlans />} />

        <Route index element={<Accueil  />} />
        <Route path="/municipalite" element={<Municipalite />} />
        <Route path="/pages/services" element={<Services />} />
        <Route path="/tourisme-culture" element={<TourismeCulture />} />
        <Route path="/pages/medias" element={<Medias />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/Connecter" element={<Connecter />} />
      </Routes>
    </Router>
  );
}

export default App;
