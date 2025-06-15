
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  
  const menuItems = [
    { id: 'accueil', path: '/accueil', label: 'Accueil', icon: '🏠' },
    { id: 'recherche', path: '/recherche', label: 'Recherche', icon: '🔍' },
    { id: 'ajouter', path: '/ajouter', label: 'Ajouter un film', icon: '➕' }
  ];

  const isActive = (path) => {
    return location.pathname === path || (location.pathname === '/' && path === '/accueil');
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-header">
          <div to="/accueil" className="nav-logo">
            🎬 Movie Manager
          </div>
        </div>
        <div className="nav-menu">
          {menuItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'nav-item-active' : ''}`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;