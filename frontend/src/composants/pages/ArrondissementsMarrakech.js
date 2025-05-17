import React from "react";
import styled from "styled-components";

const arrondissements = [
  {
    nom: "Médina",
    population: "~ 180 000",
    superficie: "12,5 km²",
    president: "Mohamed ben aaroussi",
    particularites: [
      "Cœur historique de Marrakech",
      "Patrimoine UNESCO",
      "Souks, monuments, places célèbres (Jemaa el-Fna)"
    ]
  },
  {
    nom: "Guéliz",
    population: "~ 200 000",
    superficie: "22 km²",
    president: "Omar Salki",
    particularites: [
      "Quartier moderne et administratif",
      "Centre commercial et d'affaires",
      "Gare ferroviaire, jardins publics"
    ]
  },
  {
    nom: "Sidi Youssef Ben Ali",
    population: "~ 170 000",
    superficie: "16 km²",
    president: "Mohamed Nakil",
    particularites: [
      "Quartier populaire et résidentiel",
      "Marchés locaux, activités artisanales",
      "Projets de réhabilitation urbaine"
    ]
  },
  {
    nom: "Ménara",
    population: "~ 190 000",
    superficie: "30 km²",
    president: "Abdelwahed Chafiki",
    particularites: [
      "Zone résidentielle et touristique",
      "Aéroport Marrakech-Menara",
      "Jardins de la Ménara"
    ]
  },
  {
    nom: "Annakhil",
    population: "~ 110 000",
    superficie: "15 km²",
    president: "El hassan el mounadi",
    particularites: [
      "Quartier en expansion",
      "Complexes hôteliers",
      "Projets urbains récents"
    ]
  }
];

// ===== Styles =====
const Container = styled.div`
  max-width: 100%;
  margin: 4rem auto;
  padding: 0 1.5rem;
  overflow-x: auto;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: #e53e3e;
    margin: 1rem auto 0;
    border-radius: 2px;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 2rem;
  padding-bottom: 1rem;
  width: max-content;
  min-width: 100%;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 280px;
  min-width: 280px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const CardHeader = styled.div`
  background: #B81F22;
  color: white;
  padding: 1.5rem;
  text-align: center;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #edf2f7;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #4a5568;
`;

const InfoValue = styled.span`
  color: #2d3748;
`;

const PresidentInfo = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  text-align: center;
  font-weight: 500;
  color: #2d3748;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  padding: 0.75rem 0;
  border-bottom: 1px solid #edf2f7;
  display: flex;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &::before {
    content: "•";
    color: #e53e3e;
    font-size: 1.5rem;
    margin-right: 0.75rem;
  }
`;

// ===== Composant =====
const ArrondissementsMarrakech = () => (
  <Container>
    <SectionTitle>Arrondissements de Marrakech</SectionTitle>
    
    <CardsContainer>
      {arrondissements.map((arrondissement, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{arrondissement.nom}</CardTitle>
          </CardHeader>
          
          <CardBody>
            <InfoItem>
              <InfoLabel>Population</InfoLabel>
              <InfoValue>{arrondissement.population}</InfoValue>
            </InfoItem>
            
            <InfoItem>
              <InfoLabel>Superficie</InfoLabel>
              <InfoValue>{arrondissement.superficie}</InfoValue>
            </InfoItem>
            
            <PresidentInfo>
              Président(e) : {arrondissement.president}
            </PresidentInfo>
            
            <FeaturesList>
              {arrondissement.particularites.map((feature, i) => (
                <FeatureItem key={i}>{feature}</FeatureItem>
              ))}
            </FeaturesList>
          </CardBody>
        </Card>
      ))}
    </CardsContainer>
  </Container>
);

export default ArrondissementsMarrakech;