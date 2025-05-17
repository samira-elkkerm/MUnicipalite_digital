import React from "react";
import Navigation from "../../layout/Navigation";
import Slider from "../../layout/Slider";
import styled from "styled-components";
import MunicipaliteSection from './MunicipaliteSection';
import ServicesCards from './ServicesCards';
import TourismeCultureAcc from './TourismeCultureAcc';
import StatistiquesSlider from './StatistiquesSlider';
import MediasSectionAcc from './MediasSectionAcc';
import Footer from './../../layout/Footer';
const AccueilContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  padding: 2rem 5%;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Accueil = () => {
  return (
    <AccueilContainer>
      <Navigation transparent={true} />     
      <Slider />
      <ServicesCards/>
      <MunicipaliteSection/>
      <TourismeCultureAcc/>
      <StatistiquesSlider/>
      <MediasSectionAcc/>
      <Footer/>
    </AccueilContainer>
  );
};

export default Accueil;