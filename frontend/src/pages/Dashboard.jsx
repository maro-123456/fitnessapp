import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import MotivationQuote from "../components/MotivationQuote";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { t } = useLanguage();
  const [activeCard, setActiveCard] = useState(null);

  const stats = [
    { id: 1, icon: "🎯", label: t('goal'), value: user?.goal, color: "#6366f1", desc: t('fitnessGoal') },
    { id: 2, icon: "⚖️", label: t('weight'), value: `${user?.weight} kg`, color: "#10b981", desc: t('currentWeight') },
    { id: 3, icon: "📏", label: t('height'), value: `${user?.height} cm`, color: "#f59e0b", desc: t('yourHeight') },
    { id: 4, icon: "📊", label: t('bmi'), value: calculateBMI(user?.weight, user?.height), color: "#8b5cf6", desc: t('bmiDescription') }
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
      <header>
        <div className="welcomeSection">
          <h1 className="title">{t('welcome')}, <span className="highlight">{user?.name}</span> 👋</h1>
          <p className="subtitle">{t('dashboardSubtitle')}</p>
        </div>
        <div className="userAvatar">
          <div className="avatarCircle">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div 
            key={stat.id}
            className="stat-card"
            onClick={() => setActiveCard(activeCard === stat.id ? null : stat.id)}
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
        <h2 style={{ color: "#ffffff", margin: "0 0 1rem 0", fontSize: "1.5rem", fontWeight: "700" }}>{t('motivationQuote')}</h2>
        <MotivationQuote />
      </div>

      <style jsx>{`
        .dashboard-container {
          width: calc(100vw - 220px);
          margin-left: 220px;
          margin: 0;
          padding: 1rem;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          min-height: 100vh;
          position: relative;
          left: 0;
          top: 0;
          overflow-x: hidden;
        }
        
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          background: #2d2d2d;
          padding: 1rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          border: 1px solid #404040;
          animation: slideDown 0.6s ease-out;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .welcomeSection {
          flex: 1;
        }
        
        .title {
          font-size: 2.5rem;
          color: #ffffff;
          margin: 0;
          font-weight: 700;
        }
        
        .highlight {
          color: #6366f1;
          font-weight: 700;
        }
        
        .subtitle {
          color: #a1a1a1;
          margin-top: 0.5rem;
          font-size: 1.1rem;
        }
        
        .userAvatar {
          position: relative;
        }
        
        .avatarCircle {
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
        
        .avatarCircle:hover {
          transform: scale(1.05);
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          animation: fadeIn 0.5s ease-in;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .stat-card {
          background: #2d2d2d;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
          border: 1px solid #404040;
          cursor: pointer;
          padding: 1.5rem;
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.4);
        }
        
        .card-icon {
          width: 60px;
          height: 60px,
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          transition: transform 0.3s ease;
        }
        
        .stat-card:hover .card-icon {
          transform: scale(1.1);
        }
        
        .card-content {
          flex: 1;
        }
        
        .card-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 10px 0;
        }
        
        .card-desc {
          color: #a1a1a1;
          font-size: 1rem;
          margin: 0 0 20px 0;
        }
        
        .bmi-indicator {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #404040;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 10px;
        }
        
        .bmi-bar {
          height: 8px;
          background: #404040;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 10px;
        }
        
        .bmi-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 6px;
          position: relative;
          transition: width 1s ease-in-out;
        }
        
        .bmi-fill::after {
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
        
        .bmi-category {
          font-size: 0.8rem;
          font-weight: 600,
          color: #a1a1a1;
        }
        
        .progress-section {
          background: #2d2d2d;
          padding: 1rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          border: 1px solid #404040;
          animation: fadeIn 0.8s ease-out;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .progress-section h2 {
          color: #ffffff;
          margin-bottom: 1rem;
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .progress-chart {
          margin-top: 1rem;
        }
        
        .progress-bar {
          height: 12px;
          background: #404040;
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
          color: #a1a1a1,
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
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          header {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
          }
          
          .title {
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