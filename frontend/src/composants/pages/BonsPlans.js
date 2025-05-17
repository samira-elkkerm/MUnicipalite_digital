import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCarSide } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const styles = {
  page: {
    background: "#f7f6f4",
    minHeight: "100vh",
    padding: "2.5rem 0",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 1rem",
  },
  title: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: "2.3rem",
    marginBottom: "2.5rem",
    color: "#111",
    letterSpacing: 1,
    position: "relative",
    width: "fit-content",
    left: "50%",
    transform: "translateX(-50%)",
  },
  underline: {
    display: "block",
    width: 90,
    height: 4,
    background: "#c00",
    margin: "0.3rem auto 0 auto",
    borderRadius: 2,
  },
  cardWrapper: {
    padding: "0 10px",
    boxSizing: "border-box",
  },
  card: {
    background: "#fff",
    borderRadius: "22px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
    overflow: "hidden",
    border: "2.5px solid #e53935",
    display: "flex",
    flexDirection: "column",
    transition: "box-shadow 0.2s, transform 0.2s",
    minHeight: 420,
    width: 320,
  },
  image: {
    width: "100%",
    height: 220,
    objectFit: "cover",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
  },
  cardBody: {
    flexGrow: 1,
    padding: "1.2rem 1.4rem 1.1rem 1.4rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  lieu: {
    fontWeight: 700,
    fontSize: "1.18rem",
    margin: "0.2rem 0 0.7rem 0",
    letterSpacing: 1,
  },
  infos: {
    color: "#222",
    fontSize: "1.02rem",
    marginBottom: "0.5rem",
    lineHeight: 1.5,
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
  },
  departRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.3rem",
  },
  departText: {
    fontWeight: "bold",
  },
  icon: {
    color: "#b71c1c",
    fontSize: "1.5rem",
  },
  description: {
    color: "#444",
    fontSize: "0.99rem",
    marginTop: "0.7rem",
    lineHeight: 1.4,
    minHeight: 40,
  },
};

const BonsPlans = () => {
  const [bonsPlans, setBonsPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/bons-plans")
      .then((res) => {
        setBonsPlans(res.data.data || res.data || []);
      })
      .catch(() => setBonsPlans([]))
      .finally(() => setLoading(false));
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: bonsPlans.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.title}>
          Bons Plans
          <span style={styles.underline}></span>
        </div>
        {loading ? (
          <div>Chargement...</div>
        ) : bonsPlans.length === 0 ? (
          <div>Aucun bon plan trouvé.</div>
        ) : (
          <Slider {...sliderSettings}>
            {bonsPlans.map((plan) => (
              <div key={plan.id} style={styles.cardWrapper}>
                <div style={styles.card}>
                  <img
                    src={
                      plan.image.startsWith("http")
                        ? plan.image
                        : `http://localhost:8000/images/${plan.image}`
                    }
                    alt={plan.lieu}
                    style={styles.image}
                    onError={(e) => {
                      e.target.src =
                        "https://pplx-res.cloudinary.com/image/private/user_uploads/365773/3a6d2eb2-8ddf-49cc-8abb-a6032c958545/BON-PLANS.jpg";
                    }}
                  />
                  <div style={styles.cardBody}>
                    <div>
                      <div style={styles.lieu}>{plan.lieu?.toUpperCase()}</div>
                      <div style={styles.infos}>
                        <div style={styles.departRow}>
                          <span style={styles.departText}>{plan.depart}</span>
                          <FaCarSide style={styles.icon} />
                        </div>
                        <span>H = {plan.duree}</span>
                        <span>D = {plan.distance}</span>
                        <span>{plan.lieu}</span>
                      </div>
                    </div>
                    <div style={styles.description}>{plan.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default BonsPlans;
