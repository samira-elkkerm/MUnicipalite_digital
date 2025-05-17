import React from "react";
import Attractions from './Attractions';
import Gastronomies from './Gastronomies';
import Transports from './Transports';
import BonsPlans from './BonsPlans';
import Navigation from '../../layout/Navigation';  
import Slider from '../../layout/Slider';
import Footer from './../../layout/Footer';

const TourismeCulture = () => {
  return (
    <>
    <Navigation transparent={true} />
    <Slider />
    <Attractions/>
    <Gastronomies/>
    <Transports/>
    <BonsPlans/>
    <Footer/>
    </>
  );
};

export default TourismeCulture;
