import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWheelchair } from "@fortawesome/free-solid-svg-icons";
import AccessibilityModal from "./AccessibilityModal";
import VilleDeMarrakech from "../Images/ville-de-Marrakech.png";
import MunicipaliteDigital from "../Images/Municipalite_digital.png";

// --- Styled Components ---
const NavigationContainer = styled.header`
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  background: ${({ scroll }) => (scroll ? "rgba(255,255,255,0.98)" : "transparent")};
  box-shadow: ${({ scroll }) => (scroll ? "0 2px 10px rgba(0,0,0,0.1)" : "none")};
  transition: background 0.3s ease, box-shadow 0.3s ease;
`;

const NavWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const Logo = styled.img`
  height: 100px;
  width: auto;
  @media (max-width: 768px) {
    height: 80px;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;

  @media (max-width: 992px) {
    display: block;
  }

  span {
    display: block;
    width: 25px;
    height: 3px;
    background: ${({ scroll }) => (scroll ? "#333" : "white")};
    margin: 5px 0;
    transition: all 0.3s ease;

    &:nth-child(1) {
      transform: ${({ mobileOpen }) =>
        mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none"};
    }
    &:nth-child(2) {
      opacity: ${({ mobileOpen }) => (mobileOpen ? "0" : "1")};
    }
    &:nth-child(3) {
      transform: ${({ mobileOpen }) =>
        mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none"};
    }
  }
`;

const NavMenu = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 992px) {
    position: fixed;
    top: 80px;
    left: ${({ mobileOpen }) => (mobileOpen ? "0" : "-100%")};
    width: 100%;
    height: calc(100vh - 80px);
    background: white;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 30px;
    transition: left 0.3s ease;
    z-index: 999;
  }
`;

const NavItem = styled.li`
  margin: 0 15px;
  @media (max-width: 992px) {
    margin: 15px 0;
  }
`;

const NavLinkStyled = styled(NavLink)`
  color: ${({ scroll }) => (scroll ? "#333" : "white")};
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 10px 0;
  position: relative;
  transition: color 0.3s ease;

  &:hover {
    color: #b81f22;
  }

  &.active {
    font-weight: bold;
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: #b81f22;
    }
  }

  @media (max-width: 992px) {
    color: #333;
    font-size: 1.2rem;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 20px;
`;

const AccessibilityButton = styled.button`
  background: none;
  border: none;
  color: ${({ scroll }) => (scroll ? "#333" : "white")};
  font-size: 1.5rem;
  cursor: pointer;
`;

// --- Composant principal ---
const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [accessibilityEnabled, setAccessibilityEnabled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // États accessibilité
  const [magnifierActive, setMagnifierActive] = useState(false);
  const [virtualKeyboardVisible, setVirtualKeyboardVisible] = useState(false);

  const synthRef = useRef(window.speechSynthesis);

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Stoppe la lecture vocale si désactivation ou fermeture modal
  useEffect(() => {
    if (!accessibilityEnabled || !modalVisible) {
      window.speechSynthesis.cancel();
    }
  }, [accessibilityEnabled, modalVisible]);

  // Lecture vocale automatique à chaque changement de route si activé
  useEffect(() => {
    if (accessibilityEnabled && window.speechSynthesis) {
      setTimeout(() => {
        const main = document.querySelector("main") || document.body;
        const texts = [];
        main.querySelectorAll("h1, h2, h3, p, a, li").forEach((el) => {
          if (el.innerText.trim()) texts.push(el.innerText.trim());
        });
        if (texts.length) {
          window.speechSynthesis.cancel();
          let i = 0;
          const speakNext = () => {
            if (i >= texts.length) return;
            const utter = new SpeechSynthesisUtterance(texts[i]);
            utter.rate = 1;
            utter.onend = () => {
              i++;
              speakNext();
            };
            window.speechSynthesis.speak(utter);
          };
          speakNext();
        }
      }, 300);
    }
  }, [location, accessibilityEnabled]);

  // Zoom sur <main> pour loupe
  useEffect(() => {
    const main = document.querySelector("main");
    if (main) {
      if (magnifierActive) {
        main.style.zoom = "1.2";
      } else {
        main.style.zoom = "";
      }
    }
  }, [magnifierActive]);

  const handleLoginClick = () => {
    navigate("/Connecter");
    setMobileOpen(false);
  };

  // Gestion actions modal accessibilité
  const handleAccessibilityAction = (action) => {
    switch (action) {
      case "text_reader":
        setAccessibilityEnabled(true);
        break;
      case "magnifier":
        setMagnifierActive((prev) => !prev);
        break;
      case "virtual_keyboard":
        setVirtualKeyboardVisible((prev) => !prev);
        break;
      case "stop_reader":
        setAccessibilityEnabled(false);
        window.speechSynthesis.cancel();
        break;
      default:
        break;
    }
    setModalVisible(false);
  };

  return (
    <>
      <NavigationContainer scroll={scrolled}>
        <NavWrapper>
          <TopBar>
            <Logo src={VilleDeMarrakech} alt="Ville de Marrakech" />
            <Logo src={MunicipaliteDigital} alt="Municipalité Digital" />
            <MobileMenuButton
              onClick={toggleMobileMenu}
              mobileOpen={mobileOpen}
              scroll={scrolled}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </MobileMenuButton>
          </TopBar>

          <NavMenu mobileOpen={mobileOpen}>
            <NavItem>
              <NavLinkStyled
                to="/"
                scroll={scrolled ? 1 : 0}
                onClick={() => setMobileOpen(false)}
              >
                Accueil
              </NavLinkStyled>
            </NavItem>
            <NavItem>
              <NavLinkStyled
                to="/municipalite"
                scroll={scrolled ? 1 : 0}
                onClick={() => setMobileOpen(false)}
              >
                La Municipalité
              </NavLinkStyled>
            </NavItem>
            <NavItem>
              <NavLinkStyled
                to="/pages/services"
                scroll={scrolled ? 1 : 0}
                onClick={() => setMobileOpen(false)}
              >
                Services
              </NavLinkStyled>
            </NavItem>
            <NavItem>
              <NavLinkStyled
                to="/tourisme-culture"
                scroll={scrolled ? 1 : 0}
                onClick={() => setMobileOpen(false)}
              >
                Tourisme & Culture
              </NavLinkStyled>
            </NavItem>
            <NavItem>
              <NavLinkStyled
                to="/pages/medias"
                scroll={scrolled ? 1 : 0}
                onClick={() => setMobileOpen(false)}
              >
                Medias
              </NavLinkStyled>
            </NavItem>
            <NavItem>
              <NavLinkStyled
                to="/contact"
                scroll={scrolled ? 1 : 0}
                onClick={() => setMobileOpen(false)}
              >
                Contact
              </NavLinkStyled>
            </NavItem>

            <AuthButtons>
              <AccessibilityButton
                aria-label="Options d'accessibilité"
                onClick={() => setModalVisible(true)}
                scroll={scrolled ? 1 : 0}
              >
                <FontAwesomeIcon icon={faWheelchair} />
              </AccessibilityButton>
              <button
                onClick={handleLoginClick}
                style={{
                  background: "#B81F22",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 20px",
                  cursor: "pointer",
                }}
              >
                Connexion
              </button>
            </AuthButtons>
          </NavMenu>
        </NavWrapper>
      </NavigationContainer>

      <AccessibilityModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAction={handleAccessibilityAction}
      />

      {/* Clavier virtuel minimal */}
      {virtualKeyboardVisible && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#eee",
            padding: "10px",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.2)",
            zIndex: 2000,
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((char) => (
            <button
              key={char}
              style={{
                padding: "10px 15px",
                fontSize: "1.1rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                background: "white",
                cursor: "pointer",
              }}
              onClick={() => {
                const active = document.activeElement;
                if (
                  active &&
                  (active.tagName === "INPUT" || active.tagName === "TEXTAREA")
                ) {
                  const start = active.selectionStart;
                  const end = active.selectionEnd;
                  const val = active.value;
                  active.value =
                    val.substring(0, start) + char + val.substring(end);
                  active.selectionStart = active.selectionEnd = start + 1;
                  active.focus();
                  const event = new Event("input", { bubbles: true });
                  active.dispatchEvent(event);
                }
              }}
            >
              {char}
            </button>
          ))}
          <button
            style={{
              padding: "10px 15px",
              fontSize: "1.1rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              background: "#f44336",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => setVirtualKeyboardVisible(false)}
          >
            Fermer
          </button>
        </div>
      )}
    </>
  );
};

export default Navigation;
