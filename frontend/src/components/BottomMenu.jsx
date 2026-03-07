import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

export default function BottomMenu() {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { path: "/dashboard", icon: "🏠", label: "Accueil" },
    { path: "/dashboard/exercises", icon: "🏋️", label: "Exercices" },
    { path: "/dashboard/nutrition", icon: "🥗", label: "Nutrition" },
    { path: "/dashboard/progress", icon: "📈", label: "Progression" },
    { path: "/dashboard/profile", icon: "👤", label: "Profil" },
  ];

  return (
    <>
      <div className="bottom-menu">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isHovered = hoveredItem === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`menu-item ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="menu-icon-wrapper">
                <span className="menu-icon">{item.icon}</span>
              </div>
              
              <div className="menu-content">
                <span className="menu-label">{item.label}</span>
                {isActive && (
                  <div className="active-indicator">
                    <div className="active-dot"></div>
                  </div>
                )}
              </div>
            </NavLink>
          );
        })}
      </div>

      <style jsx>{`
        .bottom-menu {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border-top: 1px solid #404040;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0 10px;
          z-index: 1000;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
        }

        .menu-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: #a1a1a1;
          padding: 8px 4px;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
          min-width: 60px;
          cursor: pointer;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .menu-item.active {
          color: #6366f1;
        }

        .menu-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
          position: relative;
        }

        .menu-icon {
          font-size: 1.4rem;
          transition: all 0.3s ease;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .menu-item.active .menu-icon {
          animation: bounce 0.5s ease;
          transform: scale(1.1);
        }

        .menu-item:hover .menu-icon {
          transform: scale(1.15);
        }

        .menu-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .menu-label {
          font-size: 0.75rem;
          font-weight: 500;
          text-align: center;
          line-height: 1;
          transition: all 0.3s ease;
        }

        .menu-item.active .menu-label {
          color: #6366f1;
          font-weight: 600;
        }

        .menu-item:hover .menu-label {
          color: #e5e5e5;
        }

        .active-indicator {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
        }

        .active-dot {
          width: 6px;
          height: 6px;
          background: #6366f1;
          border-radius: 50%;
          animation: pulse 2s infinite;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
        }

        @keyframes bounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }

        @media (max-width: 480px) {
          .bottom-menu {
            height: 65px;
            padding: 0 5px;
          }

          .menu-item {
            min-width: 50px;
            padding: 6px 2px;
          }

          .menu-icon {
            font-size: 1.2rem;
          }

          .menu-label {
            font-size: 0.7rem;
          }
        }

        @media (max-width: 360px) {
          .menu-item {
            min-width: 45px;
          }

          .menu-icon {
            font-size: 1.1rem;
          }

          .menu-label {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </>
  );
}
