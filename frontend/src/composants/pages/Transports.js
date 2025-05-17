import React from 'react';

// Import des images locales (adaptez les chemins selon votre projet)
import busBhnsImage from './../../Images/Bus BHNS.jpg';
import taxiImage from './../../Images/Taxi.jpg';
import busImage from './../../Images/Bus.jpg';
import calecheImage from './../../Images/Calèche.jpg';

const transports = [
  {
    id: 1,
    nom: 'Bus BHNS (Bus à Haut Niveau de Service)',
    image: busBhnsImage,
    description:
      "Les bus BHNS sont électriques, rapides et confortables, circulant sur des voies dédiées. Ils relient les principaux quartiers de Marrakech avec une fréquence élevée (toutes les 5 à 10 minutes).",
    infos: [
      "Tarif : 4 DH par trajet.",
      "Principales lignes : Bab Doukkala ↔ Iziki, Massira ↔ M'hamid.",
      "Exploité par ALSA, réseau moderne et écologique.",
    ],
  },
  {
    id: 2,
    nom: 'Taxi',
    image: taxiImage,
    description:
      "Les petits taxis rouges circulent en ville (jusqu'à 3 passagers), les grands taxis (souvent blancs) assurent les trajets interurbains et peuvent être partagés.",
    infos: [
      "Toujours négocier le prix avant de monter.",
      "Tarif centre-ville : 10-30 DH selon la distance.",
      "Forfait pour trajets excentrés (ex : aéroport).",
    ],
  },
  {
    id: 3,
    nom: 'Bus urbain classique',
    image: busImage,
    description:
      "Le réseau de bus urbain dessert toute la ville et ses environs. C'est le moyen le plus économique, mais les bus peuvent être bondés aux heures de pointe.",
    infos: [
      "Ticket : 4 DH à bord ou aux arrêts.",
      "Nombreuses lignes classiques et périurbaines.",
      "Carte Ikhlass disponible pour tarifs réduits.",
    ],
  },
  {
    id: 4,
    nom: 'Calèche',
    image: calecheImage,
    description:
      "Les calèches offrent une balade traditionnelle à travers la médina et les jardins. Idéales pour les visites touristiques.",
    infos: [
      "Négociez toujours le prix avant la balade.",
      "Expérience authentique, mais lente.",
      "Populaire auprès des touristes.",
    ],
  },
];

const styles = {
  page: {
    backgroundColor: '#b71c1c',
    minHeight: '90vh',
    padding: '3rem 1rem',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1.5rem',
    borderRadius: '12px',
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
    justifyContent: 'center',
    gap: '2rem',
  },
  card: {
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '420px',
    width: '100%',
    maxWidth: '580px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
  },
  cardHover: {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
  },
  imageContainer: {
    height: '180px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderBottom: '3px solid #b71c1c',
  },
  cardContent: {
    padding: '1.5rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: '1.4rem',
    color: '#b71c1c',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  cardDesc: {
    color: '#555',
    marginBottom: '1.2rem',
    fontSize: '1rem',
    lineHeight: '1.5',
  },
  cardList: {
    paddingLeft: '1.2rem',
    color: '#444',
    fontSize: '0.95rem',
    margin: 0,
  },
};

const Transports = () => {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Transports à Marrakech</h1>

        <div style={styles.grid}>
          {transports.map((transport) => (
            <div
              key={transport.id}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
              }}
            >
              <div style={styles.imageContainer}>
                <img src={transport.image} alt={transport.nom} style={styles.image} />
              </div>

              <div style={styles.cardContent}>
                <h2 style={styles.cardTitle}>{transport.nom}</h2>
                <p style={styles.cardDesc}>{transport.description}</p>

                <ul style={styles.cardList}>
                  {transport.infos.map((info, index) => (
                    <li key={index}>{info}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transports;
