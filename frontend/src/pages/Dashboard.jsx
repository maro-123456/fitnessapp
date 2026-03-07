import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [activeCard, setActiveCard] = useState(null);

  const stats = [
    { id: 1, icon: "🎯", label: "Objectif", value: user?.goal, color: "#6366f1", desc: "Votre objectif de fitness" },
    { id: 2, icon: "⚖️", label: "Poids", value: `${user?.weight} kg`, color: "#10b981", desc: "Poids actuel" },
    { id: 3, icon: "📏", label: "Taille", value: `${user?.height} cm`, color: "#f59e0b", desc: "Votre taille" },
    { id: 4, icon: "📊", label: "IMC", value: calculateBMI(user?.weight, user?.height), color: "#8b5cf6", desc: "Indice de masse corporelle" }
  ];

  function calculateBMI(weight, height) {
    if (!weight || !height) return "N/A";
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    return bmi;
  }

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Insuffisance pondérale";
    if (bmi < 25) return "Poids normal";
    if (bmi < 30) return "Surpoids";
    return "Obésité";
  };

  const bmiValue = calculateBMI(user?.weight, user?.height);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="welcome-section">
          <h1>Bienvenue, <span className="highlight">{user?.name}</span> 👋</h1>
          <p className="subtitle">Voici votre tableau de bord personnel</p>
        </div>
        <div className="user-avatar">
          <div className="avatar-circle">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div 
            key={stat.id}
            className={`stat-card ${activeCard === stat.id ? 'active' : ''}`}
            onClick={() => setActiveCard(activeCard === stat.id ? null : stat.id)}
            style={{ 
              '--card-color': stat.color,
              transform: activeCard === stat.id ? 'translateY(-5px)' : 'none'
            }}
          >
            <div className="card-icon" style={{ backgroundColor: `${stat.color}20` }}>
              {stat.icon}
            </div>
            <div className="card-content">
              <h3>{stat.label}</h3>
              <p className="card-value">{stat.value}</p>
              <p className="card-desc">{stat.desc}</p>
            </div>
            {stat.id === 4 && bmiValue !== "N/A" && (
              <div className="bmi-indicator">
                <div className="bmi-bar">
                  <div 
                    className="bmi-fill"
                    style={{
                      width: `${Math.min((bmiValue / 40) * 100, 100)}%`,
                      backgroundColor: bmiValue < 18.5 ? '#3b82f6' : 
                                      bmiValue < 25 ? '#10b981' : 
                                      bmiValue < 30 ? '#f59e0b' : '#ef4444'
                    }}
                  ></div>
                </div>
                <span className="bmi-category">{getBMICategory(bmiValue)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="progress-section">
        <h2>Votre progression</h2>
        <div className="progress-chart">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: "65%" }}
              data-progress="65%"
            ></div>
          </div>
          <div className="progress-labels">
            <span>0%</span>
            <span className="current-progress">65% atteint</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 0 0 220px;
          padding: 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          background: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          animation: slideDown 0.6s ease-out;
        }

        .welcome-section h1 {
          font-size: 2.5rem;
          color: #1a1a1a;
          margin: 0;
        }

        .highlight {
          color: #6366f1;
          font-weight: 700;
        }

        .subtitle {
          color: #6b7280;
          margin-top: 0.5rem;
          font-size: 1.1rem;
        }

        .user-avatar {
          position: relative;
        }

        .avatar-circle {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2rem;
          font-weight: bold;
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
          transition: transform 0.3s ease;
          cursor: pointer;
        }

        .avatar-circle:hover {
          transform: scale(1.05);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          border: 2px solid transparent;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          border-color: var(--card-color);
        }

        .stat-card.active {
          border-color: var(--card-color);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--card-color);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .stat-card:hover::before,
        .stat-card.active::before {
          transform: scaleX(1);
        }

        .card-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin-bottom: 1rem;
          transition: transform 0.3s ease;
        }

        .stat-card:hover .card-icon {
          transform: scale(1.1);
        }

        .card-content h3 {
          color: #374151;
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .card-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0.5rem 0;
        }

        .card-desc {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 0.5rem 0 0 0;
        }

        .bmi-indicator {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .bmi-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .bmi-fill {
          height: 100%;
          transition: width 0.6s ease;
        }

        .bmi-category {
          font-size: 0.8rem;
          font-weight: 600;
          color: #4b5563;
        }

        .progress-section {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          animation: fadeIn 0.8s ease-out;
        }

        .progress-section h2 {
          color: #1a1a1a;
          margin-bottom: 1.5rem;
        }

        .progress-chart {
          margin-top: 1rem;
        }

        .progress-bar {
          height: 12px;
          background: #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 6px;
          position: relative;
          transition: width 1s ease-in-out;
        }

        .progress-fill::after {
          content: attr(data-progress);
          position: absolute;
          right: -40px;
          top: -30px;
          background: #6366f1;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .current-progress {
          color: #6366f1;
          font-weight: 600;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
          }

          .welcome-section h1 {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-container {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}