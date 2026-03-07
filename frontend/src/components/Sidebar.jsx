import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { path: "/dashboard", icon: "🏠", label: "Accueil" },
    { path: "/dashboard/exercises", icon: "🏋️", label: "Exercices" },
    { path: "/dashboard/nutrition", icon: "🥗", label: "Nutrition" },
    { path: "/dashboard/gyms", icon: "🗺️", label: "Salles de sport" },
    { path: "/dashboard/emails", icon: "📧", label: "Emails coaching" },
    { path: "/dashboard/progress", icon: "📈", label: "Progression" },
    { path: "/dashboard/profile", icon: "👤", label: "Profil" },
  ];

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">💪</span>
            <span className="logo-text">FitLife</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isHovered = hoveredItem === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="nav-icon">
                  <span>{item.icon}</span>
                </div>
                <span className="nav-label">{item.label}</span>
                {isActive && <div className="active-indicator"></div>}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-icon">🔥</span>
              <span className="stat-value">7</span>
              <span className="stat-label">jours</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🏆</span>
              <span className="stat-value">12</span>
              <span className="stat-label">exos</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 60px;
          left: 0;
          width: 200px;
          height: calc(100vh - 60px);
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border-right: 2px solid #404040;
          display: flex;
          flex-direction: column;
          z-index: 999;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
          overflow-y: auto; /* Scroller pour le sidebar */
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #404040;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }

        .logo:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(2px);
        }

        .logo-icon {
          font-size: 1.5rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .logo-text {
          font-size: 1.2rem;
          font-weight: 700;
          color: #ffffff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 20px;
          text-decoration: none;
          color: #a1a1a1;
          border-radius: 0 25px 25px 0;
          margin-right: 10px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          transform: translateX(5px);
        }

        .nav-item.active {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .nav-item.active .nav-icon {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .nav-label {
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .nav-item.active .nav-label {
          font-weight: 600;
        }

        .active-indicator {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid #404040;
        }

        .quick-stats {
          display: flex;
          justify-content: space-around;
          gap: 10px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          flex: 1;
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .stat-icon {
          font-size: 1rem;
          margin-bottom: 5px;
        }

        .stat-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 2px;
        }

        .stat-label {
          font-size: 0.7rem;
          color: #a1a1a1;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}