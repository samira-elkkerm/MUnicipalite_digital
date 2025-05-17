import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    UserOutlined,
    PictureOutlined,
    AppstoreOutlined,
    StarOutlined,
    ShopOutlined,
    TagOutlined,
    LogoutOutlined
  } from '@ant-design/icons';
  import Municipalite_digital from '../Images/Municipalite_digital.png';

const MunicipaliteSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1] || 'dashboard';
  
  const pathToItemMap = {
    'dashboard': 'dashboard',
    'utilisateurs': 'users',
    'medias': 'media',
    'services': 'services',
    'incontournables': 'incontournables',
    'gastronomie': 'gastronomie',
    'bon-plans': 'bonplans'
  };

  const activeItem = pathToItemMap[currentPath] || 'dashboard';

  return (
    <div style={styles.sidebar}>
      <div style={styles.headerContainer}>
      <img
          src={Municipalite_digital}
          alt="Municipalite_digital"
          className="logo"
          style={{ width: "120px", height: "120px" }}
        />
      </div>
      
      <ul style={styles.menuList}>
        <li style={styles.menuItem}>
          <Link
            to="/dashboard"
            style={activeItem === 'dashboard' ? styles.activeMenuLink : styles.menuLink}
          >
            <DashboardOutlined style={styles.icon} />
            Tableau De Bord
          </Link>
        </li>
        <li style={styles.menuItem}>
          <Link
            to="/utilisateurs"
            style={activeItem === 'users' ? styles.activeMenuLink : styles.menuLink}
          >
            <UserOutlined style={styles.icon} />
            Utilisateurs
          </Link>
        </li>
        <li style={styles.menuItem}>
          <Link
            to="/medias"
            style={activeItem === 'media' ? styles.activeMenuLink : styles.menuLink}
          >
            <PictureOutlined style={styles.icon} />
            Medias
          </Link>
        </li>
        <li style={styles.menuItem}>
          <Link
            to="/services"
            style={activeItem === 'services' ? styles.activeMenuLink : styles.menuLink}
          >
            <AppstoreOutlined style={styles.icon} />
            Services
          </Link>
        </li>
        <li style={styles.menuItem}>
          <Link
            to="/incontournables"
            style={activeItem === 'incontournables' ? styles.activeMenuLink : styles.menuLink}
          >
            <StarOutlined style={styles.icon} />
            Incontournables
          </Link>
        </li>
        <li style={styles.menuItem}>
          <Link
            to="/gastronomie"
            style={activeItem === 'gastronomie' ? styles.activeMenuLink : styles.menuLink}
          >
            <ShopOutlined style={styles.icon} />
            Gastronomies
          </Link>
        </li>
        <li style={styles.menuItem}>
          <Link
            to="/bon-plans"
            style={activeItem === 'bonplans' ? styles.activeMenuLink : styles.menuLink}
          >
            <TagOutlined style={styles.icon} />
            Bon Plans
          </Link>
        </li>
        <li style={styles.menuItem}>
          <Link
            to="/"
            style={styles.menuLink}
          >
            <LogoutOutlined style={styles.icon} />
            Déconnexion
          </Link>
        </li>
      </ul>
    </div>
  );
};
const styles = {
    sidebar: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '280px',
      height: '100vh',
      backgroundColor: '#ffffff',
      color: '#333',
      padding: '20px 0',
      overflowY: 'auto',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000
    },
    headerContainer: {
      textAlign: 'center',
      borderBottom: '1px solid #f0f0f0',
    },
    title: {
      margin: 0,
      fontSize: '18px',
      fontWeight: '600',
      color: '#2c3e50'
    },
    menuList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    menuItem: {
      margin: '8px 0'
    },
    menuLink: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 24px',
      color: '#555',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      fontSize: '15px',
      borderRadius: '0 30px 30px 0',
      ':hover': {
        backgroundColor: 'rgba(184, 31, 34, 0.1)', // 10% opacity de #B81F22
        color: '#B81F22'
      }
    },
    activeMenuLink: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 24px',
      backgroundColor: 'rgba(184, 31, 34, 0.1)', // 10% opacity de #B81F22
      color: '#B81F22',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '500',
      borderRadius: '0 30px 30px 0',
      borderLeft: '4px solid #B81F22',
      ':hover': {
        backgroundColor: 'rgba(184, 31, 34, 0.15)', // Légèrement plus foncé au hover
        color: '#B81F22'
      }
    },
    icon: {
      marginRight: '12px',
      fontSize: '16px',
      transition: 'color 0.3s ease'
    }
  };
  
  export default MunicipaliteSidebar;