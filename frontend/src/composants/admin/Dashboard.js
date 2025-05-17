import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Alert, Spinner, Badge,
  Container, ListGroup
} from 'react-bootstrap';
import { 
  FiUsers, FiMapPin, FiStar, FiCalendar, 
  FiFileText, FiImage, FiAlertCircle,
  FiActivity, FiRefreshCw, FiExternalLink
} from 'react-icons/fi';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MunicipaliteSidebar from '../../layout/MunicipaliteSidebar';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    services: 0,
    incontournables: 0,
    gastronomies: 0,
    medias: 0,
    bonsPlans: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [servicesByType, setServicesByType] = useState({});
  const [usersByMonth, setUsersByMonth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const API_ENDPOINTS = {
    users: 'http://localhost:8000/api/users',
    services: 'http://localhost:8000/api/services',
    incontournables: 'http://localhost:8000/api/incontournables',
    gastronomies: 'http://localhost:8000/api/gastronomies',
    medias: 'http://localhost:8000/api/medias',
    bonsPlans: 'http://localhost:8000/api/bons-plans'
  };

  // Fonction pour extraire le tableau de données selon la structure Laravel
  const extractArray = (res, key) => {
    if (Array.isArray(res.data)) return res.data;
    if (res.data[key]) return res.data[key];
    if (res.data.data) return res.data.data;
    return [];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Traitement utilisateurs par mois
  const processUsersByMonth = (users) => {
    const monthCounts = {};
    users.forEach(user => {
      const date = new Date(user.created_at || user.Date || new Date());
      const month = date.toLocaleString('fr-FR', { month: 'short' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    return Object.entries(monthCounts).map(([mois, count]) => ({ mois, count }));
  };

  // Traitement services par type
  const processServicesByType = (services) => {
    const typeCounts = {};
    services.forEach(service => {
      const type = service.type || 'Autre';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    return typeCounts;
  };

  // Génération activités récentes
  const generateRecentActivities = (services, users, incontournables, gastronomies) => {
    const activities = [
      ...services.slice(0, 3).map(service => ({
        id: service.id,
        type: 'service',
        title: `Nouveau service: ${service.nom || service.title}`,
        description: service.description || 'Aucune description',
        date: service.created_at || new Date().toISOString(),
        icon: <FiAlertCircle />,
        link: '/services'
      })),
      ...users.slice(0, 2).map(user => ({
        id: user.id,
        type: 'user',
        title: `Nouvel utilisateur: ${user.nom || user.email}`,
        description: user.Role || 'Utilisateur',
        date: user.created_at || user.Date || new Date().toISOString(),
        icon: <FiUsers />,
        link: '/utilisateurs'
      })),
      ...incontournables.slice(0, 2).map(item => ({
        id: item.id,
        type: 'incontournable',
        title: `Nouveau lieu: ${item.nom || item.title}`,
        description: item.categorie || 'Lieu incontournable',
        date: item.created_at || new Date().toISOString(),
        icon: <FiStar />,
        link: '/incontournables'
      })),
      ...gastronomies.slice(0, 2).map(item => ({
        id: item.id,
        type: 'gastronomie',
        title: `Nouvelle entrée gastronomie: ${item.nom}`,
        description: item.type || 'Gastronomie locale',
        date: item.created_at || new Date().toISOString(),
        icon: <FiMapPin />,
        link: '/gastronomies'
      }))
    ];
    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        usersRes,
        servicesRes,
        incontournablesRes,
        gastronomiesRes,
        mediasRes,
        bonsPlansRes
      ] = await Promise.all([
        axios.get(API_ENDPOINTS.users),
        axios.get(API_ENDPOINTS.services),
        axios.get(API_ENDPOINTS.incontournables),
        axios.get(API_ENDPOINTS.gastronomies),
        axios.get(API_ENDPOINTS.medias),
        axios.get(API_ENDPOINTS.bonsPlans)
      ]);

      const users = extractArray(usersRes, 'users');
      const services = extractArray(servicesRes, 'services');
      const incontournables = extractArray(incontournablesRes, 'incontournables');
      const gastronomies = extractArray(gastronomiesRes, 'gastronomies');
      const medias = extractArray(mediasRes, 'medias');
      const bonsPlans = extractArray(bonsPlansRes, 'bonsPlans');

      setStats({
        users: users.length,
        services: services.length,
        incontournables: incontournables.length,
        gastronomies: gastronomies.length,
        medias: medias.length,
        bonsPlans: bonsPlans.length
      });

      setServicesByType(processServicesByType(services));
      setUsersByMonth(processUsersByMonth(users));
      setRecentActivities(generateRecentActivities(services, users, incontournables, gastronomies));
      setLastUpdated(Date.now());
    } catch (err) {
      setError(`Erreur de chargement: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Options et données graphiques
  const servicesChartOptions = {
    chart: { type: 'bar', height: 350, toolbar: { show: false }, fontFamily: 'inherit' },
    colors: ['#3B82F6'],
    plotOptions: { bar: { borderRadius: 4, horizontal: true } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: Object.keys(servicesByType),
      labels: { style: { colors: '#64748b', fontSize: '12px' } }
    },
    yaxis: { labels: { style: { colors: '#64748b', fontSize: '12px' } } },
    grid: { borderColor: '#e2e8f0' },
    tooltip: { style: { fontSize: '14px' } }
  };
  const servicesChartData = [{ name: 'Services', data: Object.values(servicesByType) }];

  const usersChartOptions = {
    chart: { type: 'line', height: 350, toolbar: { show: false }, fontFamily: 'inherit' },
    colors: ['#10B981'],
    stroke: { curve: 'smooth', width: 3 },
    markers: { size: 5 },
    xaxis: {
      categories: usersByMonth.map(item => item.mois),
      labels: { style: { colors: '#64748b', fontSize: '12px' } }
    },
    yaxis: { labels: { style: { colors: '#64748b', fontSize: '12px' } } },
    grid: { borderColor: '#e2e8f0' },
    tooltip: { style: { fontSize: '14px' } }
  };
  const usersChartData = [{ name: 'Utilisateurs', data: usersByMonth.map(item => item.count) }];

  const statCards = [
    { key: 'users', title: 'Utilisateurs', icon: <FiUsers size={24} />, color: '#3B82F6', link: '/utilisateurs' },
    { key: 'services', title: 'Services', icon: <FiAlertCircle size={24} />, color: '#EF4444', link: '/services' },
    { key: 'incontournables', title: 'Incontournables', icon: <FiStar size={24} />, color: '#F59E0B', link: '/incontournables' },
    { key: 'gastronomies', title: 'Gastronomies', icon: <FiMapPin size={24} />, color: '#10B981', link: '/gastronomie' },
    { key: 'medias', title: 'Médias', icon: <FiImage size={24} />, color: '#8B5CF6', link: '/medias' },
    { key: 'bonsPlans', title: 'Bons plans', icon: <FiFileText size={24} />, color: '#EC4899', link: '/bon-plans' }
  ];

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <MunicipaliteSidebar />
      <div className="flex-grow-1" style={{ marginLeft: '250px', padding: '2rem' }}>
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0 d-flex align-items-center">
              <FiActivity className="me-2" />
              Tableau de Bord Municipal
            </h2>
            <div className="d-flex align-items-center">
              {lastUpdated && <small className="text-muted me-3">Mis à jour: {formatDate(lastUpdated)}</small>}
              <Button variant="outline-primary" size="sm" onClick={fetchData} disabled={loading}>
                <FiRefreshCw className={loading ? 'spin' : ''} />
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
              <FiAlertCircle className="me-2" />
              {error}
              <div className="mt-2 small">
                Vérifiez que le serveur backend est en marche et que vous êtes connecté.
              </div>
            </Alert>
          )}

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <Row className="g-4 mb-4">
                {statCards.map(card => (
                  <Col key={card.key} xs={12} sm={6} lg={4} xl={2}>
                    <Card className="h-100 shadow-sm border-0">
                      <Card.Body className="d-flex flex-column">
                        <div
                          className="d-flex align-items-center justify-content-center mb-3"
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: `${card.color}20`,
                            color: card.color
                          }}
                        >
                          {card.icon}
                        </div>
                        <h3 className="mb-1" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                          {stats[card.key]}
                        </h3>
                        <p className="text-muted mb-3">{card.title}</p>
                        <Link to={card.link} className="mt-auto text-decoration-none d-flex align-items-center" style={{ color: card.color }}>
                          Voir détails <FiExternalLink className="ms-1" size={14} />
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Row className="g-4 mb-4">
                <Col lg={6}>
                  <Card className="shadow-sm border-0 h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0 d-flex align-items-center">
                          <FiAlertCircle className="me-2 text-primary" />
                          Services par type
                        </h5>
                        <Badge bg="light" text="primary">
                          {Object.values(servicesByType).reduce((a, b) => a + b, 0)} total
                        </Badge>
                      </div>
                      <div style={{ minHeight: '350px' }}>
                        <Chart options={servicesChartOptions} series={servicesChartData} type="bar" height={350} />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={6}>
                  <Card className="shadow-sm border-0 h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0 d-flex align-items-center">
                          <FiUsers className="me-2 text-success" />
                          Inscriptions des utilisateurs
                        </h5>
                        <Badge bg="light" text="success">
                          {stats.users} total
                        </Badge>
                      </div>
                      <div style={{ minHeight: '350px' }}>
                        <Chart options={usersChartOptions} series={usersChartData} type="line" height={350} />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 d-flex align-items-center">
                      <FiActivity className="me-2 text-purple" />
                      Activités récentes
                    </h5>
                    <Badge bg="light" text="purple">
                      {recentActivities.length} activités
                    </Badge>
                  </div>

                  {recentActivities.length > 0 ? (
                    <ListGroup variant="flush">
                      {recentActivities.map((activity, index) => (
                        <ListGroup.Item key={`${activity.id}-${index}`} className="border-0 px-0 py-3">
                          <div className="d-flex align-items-start">
                            <div
                              className="d-flex align-items-center justify-content-center me-3"
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                backgroundColor: '#F3F4F6',
                                color: '#6B7280'
                              }}
                            >
                              {activity.icon}
                            </div>
                            <div>
                              <div style={{ fontWeight: 500 }}>{activity.title}</div>
                              <div className="text-muted small">{activity.description}</div>
                              <div className="text-muted small">{formatDate(activity.date)}</div>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <div className="text-muted">Aucune activité récente.</div>
                  )}
                </Card.Body>
              </Card>
            </>
          )}
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
