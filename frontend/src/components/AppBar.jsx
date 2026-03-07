import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AppBar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000);

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <>
      <nav className={`app-bar ${scrolled ? 'scrolled' : ''}`}>
        <div className="app-bar-left">
          <div className="logo" onClick={() => navigate("/dashboard")}>
            <div className="logo-icon">💪</div>
            <div className="logo-text">
              <span className="logo-primary">Fitness</span>
              <span className="logo-secondary">Pro</span>
            </div>
          </div>
          
          <div className="date-time">
            <div className="current-time">
              <span className="time-icon">🕒</span>
              {formatTime(time)}
            </div>
            <div className="current-date">{formatDate(time)}</div>
          </div>
        </div>

        <div className="app-bar-right">
          <div className="user-actions">
            <button 
              className="notification-btn"
              onClick={() => navigate("/notifications")}
              aria-label="Notifications"
            >
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>
            
            <button 
              className="profile-btn"
              onClick={() => navigate("/profile")}
              aria-label="Profil"
            >
              <div className="profile-avatar">
                <span>👤</span>
              </div>
            </button>

            <div className="logout-container">
              <button 
                className="logout-btn"
                onClick={() => setShowLogoutConfirm(true)}
                aria-label="Déconnexion"
              >
                <span className="logout-icon">🚪</span>
                <span className="logout-text">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showLogoutConfirm && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <div className="modal-icon">⚠️</div>
            <h3>Déconnexion</h3>
            <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <div className="modal-actions">
              <button 
                className="modal-btn cancel"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Annuler
              </button>
              <button 
                className="modal-btn confirm"
                onClick={logout}
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .app-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 30px;
          z-index: 1000;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid #404040;
        }

        .app-bar.scrolled {
          height: 60px;
          background: rgba(26, 26, 26, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        .app-bar-left {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .logo-icon {
          font-size: 2rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .logo-primary {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .logo-secondary {
          font-size: 0.9rem;
          font-weight: 500;
          opacity: 0.9;
          margin-top: 2px;
        }

        .date-time {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .current-time {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          color: #e5e5e5;
        }

        .time-icon {
          font-size: 0.9rem;
        }

        .current-date {
          font-size: 0.85rem;
          opacity: 0.9;
          font-weight: 500;
          color: #a1a1a1;
        }

        .app-bar-right {
          display: flex;
          align-items: center;
        }

        .user-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .notification-btn,
        .profile-btn,
        .logout-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 8px;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .notification-btn:hover,
        .profile-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .app-bar.scrolled .notification-btn:hover,
        .app-bar.scrolled .profile-btn:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .notification-icon {
          font-size: 1.3rem;
        }

        .notification-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: #ef4444;
          color: white;
          font-size: 0.7rem;
          font-weight: 600;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
        }

        .profile-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
        }

        .profile-btn:hover .profile-avatar {
          transform: scale(1.1);
        }

        .logout-btn {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: 600;
          gap: 8px;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .logout-icon {
          font-size: 1.1rem;
        }

        .logout-text {
          font-size: 0.95rem;
        }

        .logout-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.3s ease;
        }

        .logout-modal {
          background: #2d2d2d;
          border: 1px solid #404040;
          border-radius: 20px;
          padding: 30px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.4s ease;
        }

        .modal-icon {
          font-size: 3rem;
          margin-bottom: 20px;
          animation: shake 0.5s ease;
        }

        .logout-modal h3 {
          color: #ffffff;
          margin: 0 0 10px 0;
          font-size: 1.5rem;
        }

        .logout-modal p {
          color: #a1a1a1;
          margin: 0 0 25px 0;
          line-height: 1.5;
        }

        .modal-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .modal-btn {
          padding: 12px 30px;
          border: none;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .modal-btn.cancel {
          background: #404040;
          color: #e5e5e5;
          border: 1px solid #555555;
        }

        .modal-btn.cancel:hover {
          background: #555555;
          transform: translateY(-2px);
        }

        .modal-btn.confirm {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        }

        .modal-btn.confirm:hover {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          70% {
            transform: scale(1.1);
            box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        @media (max-width: 768px) {
          .app-bar {
            padding: 0 15px;
            height: 60px;
          }

          .app-bar-left {
            gap: 15px;
          }

          .logo-text {
            display: none;
          }

          .date-time {
            display: none;
          }

          .logout-text {
            display: none;
          }

          .logout-btn {
            padding: 10px;
          }

          .user-actions {
            gap: 10px;
          }

          .modal-actions {
            flex-direction: column;
          }

          .modal-btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}