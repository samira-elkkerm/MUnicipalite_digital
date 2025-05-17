import React from "react";
import Navigation from "../../layout/Navigation";
import Slider from "../../layout/Slider";
import Footer from './../../layout/Footer';
import CommuneMarrakech from './CommuneMarrakech';
import ArrondissementsMarrakech from './ArrondissementsMarrakech';
const Municipalite = () => {
  return (
    <>
      <Navigation transparent={true} />     
      <Slider />
      <CommuneMarrakech/>
      <ArrondissementsMarrakech/>
      <Footer/>

    </>
  );
};

export default Municipalite;
