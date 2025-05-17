import React from "react";
import Navigation from "../../layout/Navigation";
import Slider from "../../layout/Slider";
import styled from "styled-components";
import Footer from './../../layout/Footer';
import ServicesList from './ServicesList';

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
const Services = () => {
  return (
    <AccueilContainer>
      <Navigation transparent={true} />
      <Slider />
      <ServicesList/>
      <Footer/>
    </AccueilContainer>
  );
};

export default Services;
