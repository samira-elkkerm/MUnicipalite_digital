import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVolumeUp,
  faSearchPlus,
  faKeyboard
} from "@fortawesome/free-solid-svg-icons";
import { faLanguage } from "@fortawesome/free-solid-svg-icons/faLanguage";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: ${({ visible }) => (visible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 1500;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 18px 18px 12px 12px;
  width: 310px;
  max-width: 96vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  overflow: hidden;
  font-family: 'Segoe UI', Arial, sans-serif;
`;

const ModalHeader = styled.div`
  background: #B81F22;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 16px 20px;
  justify-content: space-between;
  position: relative;
`;

const Language = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  gap: 8px;
  background: #1b1d29;
  border-radius: 16px;
  padding: 4px 14px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.4rem;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: #b81f22;
  }
`;

const ModalTitle = styled.h2`
  flex: 1;
  text-align: center;
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  padding: 32px 26px 30px 26px;
  background: #fff;
`;

const GridButton = styled.button`
  background: #f4f5fa;
  border: 2px solid transparent;
  border-radius: 13px;
  padding: 25px 0 12px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: border 0.2s, background 0.2s;
  min-width: 190px;
  min-height: 90px;
  &:hover, &:focus {
    border: 2px solid #b81f22;
    background: #fbe9ea;
    outline: none;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 2.1rem;
  margin-bottom: 10px;
  color: #B81F22;
`;

const Label = styled.span`
  font-size: 1rem;
  color: #B81F22;
  font-weight: 500;
`;

const AccessibilityModal = ({ visible, onClose, onAction }) => {
  const options = [
    { icon: faVolumeUp, label: "Text Reader", action: "text_reader" },
  ];

  return (
    <ModalOverlay visible={visible} role="dialog" aria-modal="true" aria-labelledby="accessibility-modal-title">
      <ModalContent>
        <ModalHeader>
          <span></span>
          <Language>
            <FontAwesomeIcon icon={faLanguage} />
            Francais
          </Language>
          <CloseButton onClick={onClose} aria-label="Fermer le modal">
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        </ModalHeader>
        <ModalTitle id="accessibility-modal-title">Accessibilité</ModalTitle>
        <Grid>
          {options.map(opt => (
            <GridButton
              key={opt.label}
              onClick={() => onAction(opt.action)}
              tabIndex={0}
              aria-label={opt.label}
              type="button"
            >
              <Icon icon={opt.icon} />
              <Label>{opt.label}</Label>
            </GridButton>
          ))}
        </Grid>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AccessibilityModal;
