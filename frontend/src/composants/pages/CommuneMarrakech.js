import React from "react";
import styled from "styled-components";
import blasonUrl from './../../Images/ville-de-Marrakech.png';
import presidentPhoto from './../../Images/La présidente.jpg';


const Wrapper = styled.div`
display: flex;
flex-wrap: wrap;
background: #fff;
border-radius: 12px;
box-shadow: 0 4px 24px rgba(0,0,0,0.07);
overflow: hidden;
margin: 2rem auto;
max-width: 1100px;
border: 4px solid #B81F22;
`;

const Column = styled.div`
  flex: 1 1 50%;
  padding: 2.2rem 2rem 2.2rem 2rem;
  min-width: 340px;
  background: ${({ right }) => (right ? "#fff7f7" : "#f7f6f4")};
  display: flex;
  flex-direction: column;
  align-items: ${({ right }) => (right ? "center" : "flex-start")};
  border-left: ${({ right }) => (right ? "1px solid #eee" : "none")};

  @media (max-width: 800px) {
    flex: 1 1 100%;
    border-left: none;
    border-top: ${({ right }) => (right ? "1px solid #eee" : "none")};
    align-items: flex-start;
  }
`;

const Blason = styled.img`
width: 120px;
height: 150px;
object-fit: cover;
border-radius: 8px;
margin-bottom: 1.2rem;
`;

const Title = styled.h2`
  color: #b71c1c;
  font-size: 1.45rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
`;

const SubTitle = styled.h3`
  color: #b71c1c;
  font-size: 1.18rem;
  font-weight: 700;
  margin-bottom: 1.1rem;
`;



const List = styled.ul`
  margin: 0 0 1.1rem 0.5rem;
  padding: 0;
  list-style: disc inside;
  color: #333;
  font-size: 1.05rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.45rem;
  line-height: 1.5;
`;

const Bold = styled.span`
  font-weight: 700;
`;

const Photo = styled.img`
  width: 120px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1.2rem;
`;

const Name = styled.div`
  font-size: 1.18rem;
  font-weight: 700;
  color: #b71c1c;
  margin-bottom: 0.7rem;
`;

const InfoSection = styled.div`
  margin-bottom: 1.1rem;
`;

const InfoTitle = styled.div`
  font-weight: 700;
  color: #222;
  margin-bottom: 0.2rem;
`;

const InfoList = styled.ul`
  margin: 0 0 0.5rem 1.2rem;
  padding: 0;
  font-size: 1rem;
  color: #444;
`;

const InfoItem = styled.li`
  margin-bottom: 0.3rem;
  line-height: 1.4;
`;

const CommuneMarrakech = () => (
  <Wrapper>
    <Column right>
      <Blason src={blasonUrl} alt="Blason Marrakech" />
      <Title>La commune de Marrakech</Title>
      <List>
        <ListItem>
          <Bold>Statut :</Bold> Collectivité locale dotée de la personnalité morale et d’une autonomie administrative et financière.
        </ListItem>
        <ListItem>
          <Bold>Importance :</Bold> L’une des communes urbaines les plus importantes du Maroc, grâce à son rôle de pôle touristique, culturel et économique.
        </ListItem>
        <ListItem>
          <Bold>Cadre administratif :</Bold> Relève de la région Marrakech-Safi et de la préfecture de Marrakech.<br />
          Régie par la loi n° 113.14 sur les collectivités territoriales.
        </ListItem>
        <ListItem>
          <Bold>Compétences principales :</Bold>
          <InfoList>
            <InfoItem>Urbanisme : Planification, voirie, infrastructures.</InfoItem>
            <InfoItem>Transports : Amélioration des réseaux.</InfoItem>
            <InfoItem>Environnement : Gestion des déchets, espaces verts.</InfoItem>
            <InfoItem>Économie & Tourisme : Promotion des investissements, soutien au secteur touristique.</InfoItem>
            <InfoItem>Coopération internationale : Partenariats avec d’autres villes.</InfoItem>
            <InfoItem>Culture & Sport : Gestion des équipements, soutien aux festivals.</InfoItem>
          </InfoList>
        </ListItem>
        <ListItem>
          <Bold>Organisation territoriale :</Bold> Divisée en 5 arrondissements pour une gestion de proximité.
        </ListItem>
      </List>
    </Column>
    <Column right>
      <Photo src={presidentPhoto} alt="Présidente de la commune de Marrakech" />
      <SubTitle>La présidente La commune de Marrakech</SubTitle>
      <Name>Fatima ezzahra EL MANSOURI</Name>
      <InfoSection>
        <InfoTitle>Formation</InfoTitle>
        <InfoList>
          <InfoItem>Licence en droit privé (Université Mohammed V, Rabat).</InfoItem>
          <InfoItem>Diplôme d’études approfondies en droit des contrats d’affaires (Université de Montpellier, France).</InfoItem>
          <InfoItem>Certificat en droit anglo-saxon (Université Pace, États-Unis).</InfoItem>
          <InfoItem>Baccalauréat en sciences économiques.</InfoItem>
        </InfoList>
      </InfoSection>
      <InfoSection>
        <InfoTitle>Parcours professionnel</InfoTitle>
        <InfoList>
          <InfoItem>Avocate spécialisée en droit foncier et immobilier (Cabinet Abdelrahman El Mansouri, Marrakech).</InfoItem>
          <InfoItem>Membre du barreau de Marrakech depuis 2005.</InfoItem>
        </InfoList>
      </InfoSection>
      <InfoSection>
        <InfoTitle>Parcours politique</InfoTitle>
        <InfoList>
          <InfoItem>2009-2015 : Présidente du conseil communal de Marrakech.</InfoItem>
          <InfoItem>2015-présent : Présidente du Conseil national du Parti Authenticité et Modernité (PAM).</InfoItem>
          <InfoItem>2011-2021 : Députée au Parlement marocain (2 mandats).</InfoItem>
          <InfoItem>2021-présent : Ministre de l’Aménagement du Territoire National, de l’Urbanisme, de l’Habitat et de la Politique de la Ville.</InfoItem>
        </InfoList>
      </InfoSection>
    </Column>
  </Wrapper>
);

export default CommuneMarrakech;
