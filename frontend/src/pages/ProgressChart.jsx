import { useEffect, useState } from "react";
import api from "../services/api";

// Styles modernes et professionnels pour ProgressChart
const styles = {
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 20px 40px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  
  // Header Section
  headerSection: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    padding: "60px 0",
    margin: "0 -20px 40px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden"
  },
  headerContent: {
    position: "relative",
    zIndex: 1
  },
  mainTitle: {
    fontSize: "3rem",
    fontWeight: "800",
    color: "white",
    margin: "0 0 15px 0",
    textShadow: "0 4px 8px rgba(0,0,0,0.3)"
  },
  subtitle: {
    fontSize: "1.3rem",
    color: "rgba(255,255,255,0.9)",
    margin: "0",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  
  // Stats Section
  statsSection: {
    marginBottom: "40px"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px"
  },
  statCard: {
    background: "white",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    transition: "transform 0.3s ease"
  },
  statIcon: {
    fontSize: "2.5rem",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "15px"
  },
  statContent: {
    flex: 1
  },
  statValue: {
    display: "block",
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: "5px"
  },
  statLabel: {
    fontSize: "0.9rem",
    color: "#636e72",
    fontWeight: "500"
  },
  
  // Controls Section
  controlsSection: {
    marginBottom: "40px"
  },
  controlsContainer: {
    background: "white",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    display: "flex",
    gap: "30px",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  controlGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  controlLabel: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#2d3436"
  },
  select: {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "2px solid #e1e5e9",
    fontSize: "1rem",
    background: "white",
    cursor: "pointer",
    transition: "border-color 0.3s ease",
    minWidth: "200px"
  },
  
  // Charts Section
  chartsSection: {
    marginBottom: "40px"
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: "30px"
  },
  chartCard: {
    background: "white",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)"
  },
  chartHeader: {
    padding: "25px",
    borderBottom: "1px solid #f1f3f4",
    background: "#f8f9fa"
  },
  chartTitle: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#2d3436",
    margin: "0 0 5px 0"
  },
  chartSubtitle: {
    fontSize: "0.9rem",
    color: "#636e72",
    margin: 0
  },
  chartContainer: {
    padding: "25px",
    height: "300px"
  },
  
  // Empty State
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    background: "white",
    borderRadius: "20px",
    border: "2px dashed #dee2e6"
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "20px"
  },
  emptyTitle: {
    fontSize: "1.5rem",
    color: "#2d3436",
    margin: "0 0 10px 0"
  },
  emptyText: {
    fontSize: "1rem",
    color: "#6c757d",
    margin: 0
  },
  
  // Summary Section
  summarySection: {
    marginBottom: "40px"
  },
  summaryCard: {
    background: "white",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)"
  },
  summaryTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#2d3436",
    margin: "0 0 25px 0"
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px"
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    background: "#f8f9fa",
    borderRadius: "10px",
    border: "1px solid #e9ecef"
  },
  summaryLabel: {
    fontSize: "0.9rem",
    color: "#636e72",
    fontWeight: "500"
  },
  summaryValue: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#2d3436"
  },
  
  // Loading and Error States
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "100px 20px",
    textAlign: "center"
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(255,255,255,0.3)",
    borderTop: "4px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px"
  },
  loadingText: {
    fontSize: "1.1rem",
    color: "white",
    margin: 0
  },
  errorContainer: {
    textAlign: "center",
    padding: "60px 20px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "15px",
    margin: "40px 0"
  },
  errorText: {
    color: "white",
    fontSize: "1.1rem",
    marginBottom: "20px"
  },
  retryBtn: {
    background: "white",
    color: "#667eea",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem"
  }
};

export default function ProgressChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [timeRange, setTimeRange] = useState("30");

  // Données de démonstration si l'API ne retourne rien
  const demoData = [
    { date: "01/01", weight: 75.2, imc: 24.5, performance: 85, calories: 2200, steps: 8000 },
    { date: "08/01", weight: 74.8, imc: 24.3, performance: 87, calories: 2150, steps: 9500 },
    { date: "15/01", weight: 74.5, imc: 24.2, performance: 88, calories: 2100, steps: 10200 },
    { date: "22/01", weight: 74.1, imc: 24.0, performance: 90, calories: 2050, steps: 11000 },
    { date: "29/01", weight: 73.8, imc: 23.9, performance: 92, calories: 2000, steps: 12000 },
    { date: "05/02", weight: 73.5, imc: 23.8, performance: 93, calories: 1980, steps: 12500 },
    { date: "12/02", weight: 73.2, imc: 23.6, performance: 94, calories: 1950, steps: 13000 },
    { date: "19/02", weight: 72.9, imc: 23.5, performance: 95, calories: 1920, steps: 13500 }
  ];

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/progress");
      
      if (res.data && res.data.length > 0) {
        setData(res.data.map(p => ({
          date: new Date(p.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
          weight: p.weight || 0,
          imc: p.imc || 0,
          performance: p.performance || 0,
          calories: p.calories || 0,
          steps: p.steps || 0
        })));
      } else {
        // Utiliser les données de démonstration si l'API ne retourne rien
        setData(demoData);
      }
      setError(null);
    } catch (err) {
      console.log("Erreur fetchProgressData:", err);
      // En cas d'erreur, utiliser les données de démonstration
      setData(demoData);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les données selon la plage de temps
  const getFilteredData = () => {
    const days = parseInt(timeRange);
    return data.slice(-days);
  };

  // Obtenir les statistiques
  const getStats = () => {
    const filteredData = getFilteredData();
    if (filteredData.length === 0) return { weightChange: 0, performanceChange: 0, avgPerformance: 0 };
    
    const firstWeight = filteredData[0].weight;
    const lastWeight = filteredData[filteredData.length - 1].weight;
    const weightChange = lastWeight - firstWeight;
    
    const firstPerformance = filteredData[0].performance;
    const lastPerformance = filteredData[filteredData.length - 1].performance;
    const performanceChange = lastPerformance - firstPerformance;
    
    const avgPerformance = Math.round(filteredData.reduce((sum, d) => sum + d.performance, 0) / filteredData.length);
    
    return { weightChange, performanceChange, avgPerformance };
  };

  // Obtenir la couleur selon la métrique
  const getMetricColor = (metric) => {
    switch (metric) {
      case "weight": return "#8884d8";
      case "imc": return "#82ca9d";
      case "performance": return "#ff7300";
      case "calories": return "#00c49f";
      case "steps": return "#ffbb28";
      default: return "#8884d8";
    }
  };

  // Obtenir l'icône selon la métrique
  const getMetricIcon = (metric) => {
    switch (metric) {
      case "weight": return "⚖️";
      case "imc": return "📊";
      case "performance": return "🎯";
      case "calories": return "🔥";
      case "steps": return "👟";
      default: return "📈";
    }
  };

  // Obtenir le label selon la métrique
  const getMetricLabel = (metric) => {
    switch (metric) {
      case "weight": return "Poids (kg)";
      case "imc": return "IMC";
      case "performance": return "Performance (%)";
      case "calories": return "Calories";
      case "steps": return "Pas";
      default: return "Métrique";
    }
  };

  const stats = getStats();
  const filteredData = getFilteredData();

  // Loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Chargement des données de progression...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>⚠️ {error}</p>
          <button onClick={fetchProgressData} style={styles.retryBtn}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.headerSection}>
        <div style={styles.headerContent}>
          <h1 style={styles.mainTitle}>📈 Suivi de Progression</h1>
          <p style={styles.subtitle}>Visualisez votre évolution et atteignez vos objectifs</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⚖️</div>
            <div style={styles.statContent}>
              <span style={styles.statValue}>{stats.weightChange > 0 ? '+' : ''}{stats.weightChange.toFixed(1)} kg</span>
              <span style={styles.statLabel}>Changement de poids</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🎯</div>
            <div style={styles.statContent}>
              <span style={styles.statValue}>+{stats.performanceChange}%</span>
              <span style={styles.statLabel}>Amélioration performance</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div style={styles.statContent}>
              <span style={styles.statValue}>{stats.avgPerformance}%</span>
              <span style={styles.statLabel}>Performance moyenne</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📅</div>
            <div style={styles.statContent}>
              <span style={styles.statValue}>{filteredData.length}</span>
              <span style={styles.statLabel}>Jours suivis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div style={styles.controlsSection}>
        <div style={styles.controlsContainer}>
          <div style={styles.controlGroup}>
            <label style={styles.controlLabel}>Période:</label>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              style={styles.select}
            >
              <option value="7">7 derniers jours</option>
              <option value="30">30 derniers jours</option>
              <option value="90">90 derniers jours</option>
              <option value="365">1 an</option>
            </select>
          </div>
          <div style={styles.controlGroup}>
            <label style={styles.controlLabel}>Métrique:</label>
            <select 
              value={selectedMetric} 
              onChange={(e) => setSelectedMetric(e.target.value)}
              style={styles.select}
            >
              <option value="all">Toutes les métriques</option>
              <option value="weight">Poids</option>
              <option value="imc">IMC</option>
              <option value="performance">Performance</option>
              <option value="calories">Calories</option>
              <option value="steps">Pas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={styles.chartsSection}>
        {filteredData.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📊</div>
            <h3 style={styles.emptyTitle}>Aucune donnée de progression</h3>
            <p style={styles.emptyText}>Commencez à suivre votre progression pour voir vos statistiques</p>
          </div>
        ) : (
          <div style={styles.chartsGrid}>
            {/* Weight Chart */}
            {(selectedMetric === "all" || selectedMetric === "weight") && (
              <div style={styles.chartCard}>
                <div style={styles.chartHeader}>
                  <h3 style={styles.chartTitle}>⚖️ Évolution du poids</h3>
                  <span style={styles.chartSubtitle}>Derniers {timeRange} jours</span>
                </div>
                <div style={styles.chartContainer}>
                  <svg width="100%" height="300" viewBox="0 0 600 300">
                    {/* Grid */}
                    {[0, 50, 100, 150, 200, 250, 300].map((y, i) => (
                      <line key={i} x1="50" y1={y} x2="550" y2={y} stroke="#e0e0e0" strokeWidth="1" />
                    ))}
                    {[50, 150, 250, 350, 450, 550].map((x, i) => (
                      <line key={i} x1={x} y1="0" x2={x} y2="300" stroke="#e0e0e0" strokeWidth="1" />
                    ))}
                    
                    {/* Weight Line */}
                    <polyline
                      fill="none"
                      stroke="#8884d8"
                      strokeWidth="3"
                      points={filteredData.map((d, i) => {
                        const x = 50 + (i * 500 / (filteredData.length - 1));
                        const y = 280 - ((d.weight - 70) * 100 / 10); // Normalisation
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    
                    {/* Data Points */}
                    {filteredData.map((d, i) => {
                      const x = 50 + (i * 500 / (filteredData.length - 1));
                      const y = 280 - ((d.weight - 70) * 100 / 10);
                      return (
                        <circle key={i} cx={x} cy={y} r="5" fill="#8884d8" />
                      );
                    })}
                    
                    {/* Labels */}
                    {filteredData.map((d, i) => {
                      if (i % Math.ceil(filteredData.length / 6) === 0) {
                        const x = 50 + (i * 500 / (filteredData.length - 1));
                        return (
                          <text key={i} x={x} y="295" fontSize="12" textAnchor="middle" fill="#666">
                            {d.date}
                          </text>
                        );
                      }
                      return null;
                    })}
                  </svg>
                </div>
              </div>
            )}

            {/* Performance Chart */}
            {(selectedMetric === "all" || selectedMetric === "performance") && (
              <div style={styles.chartCard}>
                <div style={styles.chartHeader}>
                  <h3 style={styles.chartTitle}>🎯 Performance</h3>
                  <span style={styles.chartSubtitle}>Derniers {timeRange} jours</span>
                </div>
                <div style={styles.chartContainer}>
                  <svg width="100%" height="300" viewBox="0 0 600 300">
                    {/* Grid */}
                    {[0, 50, 100, 150, 200, 250, 300].map((y, i) => (
                      <line key={i} x1="50" y1={y} x2="550" y2={y} stroke="#e0e0e0" strokeWidth="1" />
                    ))}
                    {[50, 150, 250, 350, 450, 550].map((x, i) => (
                      <line key={i} x1={x} y1="0" x2={x} y2="300" stroke="#e0e0e0" strokeWidth="1" />
                    ))}
                    
                    {/* Performance Line */}
                    <polyline
                      fill="none"
                      stroke="#ff7300"
                      strokeWidth="3"
                      points={filteredData.map((d, i) => {
                        const x = 50 + (i * 500 / (filteredData.length - 1));
                        const y = 280 - (d.performance * 2.5); // Normalisation
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    
                    {/* Data Points */}
                    {filteredData.map((d, i) => {
                      const x = 50 + (i * 500 / (filteredData.length - 1));
                      const y = 280 - (d.performance * 2.5);
                      return (
                        <circle key={i} cx={x} cy={y} r="5" fill="#ff7300" />
                      );
                    })}
                    
                    {/* Labels */}
                    {filteredData.map((d, i) => {
                      if (i % Math.ceil(filteredData.length / 6) === 0) {
                        const x = 50 + (i * 500 / (filteredData.length - 1));
                        return (
                          <text key={i} x={x} y="295" fontSize="12" textAnchor="middle" fill="#666">
                            {d.date}
                          </text>
                        );
                      }
                      return null;
                    })}
                  </svg>
                </div>
              </div>
            )}

            {/* Calories Chart */}
            {(selectedMetric === "all" || selectedMetric === "calories") && (
              <div style={styles.chartCard}>
                <div style={styles.chartHeader}>
                  <h3 style={styles.chartTitle}>🔥 Calories</h3>
                  <span style={styles.chartSubtitle}>Derniers {timeRange} jours</span>
                </div>
                <div style={styles.chartContainer}>
                  <svg width="100%" height="300" viewBox="0 0 600 300">
                    {/* Grid */}
                    {[0, 50, 100, 150, 200, 250, 300].map((y, i) => (
                      <line key={i} x1="50" y1={y} x2="550" y2={y} stroke="#e0e0e0" strokeWidth="1" />
                    ))}
                    {[50, 150, 250, 350, 450, 550].map((x, i) => (
                      <line key={i} x1={x} y1="0" x2={x} y2="300" stroke="#e0e0e0" strokeWidth="1" />
                    ))}
                    
                    {/* Calories Line */}
                    <polyline
                      fill="none"
                      stroke="#00c49f"
                      strokeWidth="3"
                      points={filteredData.map((d, i) => {
                        const x = 50 + (i * 500 / (filteredData.length - 1));
                        const y = 280 - ((d.calories - 1800) * 100 / 500); // Normalisation
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    
                    {/* Data Points */}
                    {filteredData.map((d, i) => {
                      const x = 50 + (i * 500 / (filteredData.length - 1));
                      const y = 280 - ((d.calories - 1800) * 100 / 500);
                      return (
                        <circle key={i} cx={x} cy={y} r="5" fill="#00c49f" />
                      );
                    })}
                    
                    {/* Labels */}
                    {filteredData.map((d, i) => {
                      if (i % Math.ceil(filteredData.length / 6) === 0) {
                        const x = 50 + (i * 500 / (filteredData.length - 1));
                        return (
                          <text key={i} x={x} y="295" fontSize="12" textAnchor="middle" fill="#666">
                            {d.date}
                          </text>
                        );
                      }
                      return null;
                    })}
                  </svg>
                </div>
              </div>
            )}

            {/* Steps Chart */}
            {(selectedMetric === "all" || selectedMetric === "steps") && (
              <div style={styles.chartCard}>
                <div style={styles.chartHeader}>
                  <h3 style={styles.chartTitle}>👟 Pas quotidiens</h3>
                  <span style={styles.chartSubtitle}>Derniers {timeRange} jours</span>
                </div>
                <div style={styles.chartContainer}>
                  <svg width="100%" height="300" viewBox="0 0 600 300">
                    {/* Grid */}
                    {[0, 50, 100, 150, 200, 250, 300].map((y, i) => (
                      <line key={i} x1="50" y1={y} x2="550" y2={y} stroke="#e0e0e0" strokeWidth="1" />
                    ))}
                    {[50, 150, 250, 350, 450, 550].map((x, i) => (
                      <line key={i} x1={x} y1="0" x2={x} y2="300" stroke="#e0e0e0" strokeWidth="1" />
                    ))}
                    
                    {/* Steps Line */}
                    <polyline
                      fill="none"
                      stroke="#ffbb28"
                      strokeWidth="3"
                      points={filteredData.map((d, i) => {
                        const x = 50 + (i * 500 / (filteredData.length - 1));
                        const y = 280 - ((d.steps - 7000) * 100 / 8000); // Normalisation
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    
                    {/* Data Points */}
                    {filteredData.map((d, i) => {
                      const x = 50 + (i * 500 / (filteredData.length - 1));
                      const y = 280 - ((d.steps - 7000) * 100 / 8000);
                      return (
                        <circle key={i} cx={x} cy={y} r="5" fill="#ffbb28" />
                      );
                    })}
                    
                    {/* Labels */}
                    {filteredData.map((d, i) => {
                      if (i % Math.ceil(filteredData.length / 6) === 0) {
                        const x = 50 + (i * 500 / (filteredData.length - 1));
                        return (
                          <text key={i} x={x} y="295" fontSize="12" textAnchor="middle" fill="#666">
                            {d.date}
                          </text>
                        );
                      }
                      return null;
                    })}
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div style={styles.summarySection}>
        <div style={styles.summaryCard}>
          <h3 style={styles.summaryTitle}>📊 Résumé de votre progression</h3>
          <div style={styles.summaryGrid}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Poids actuel:</span>
              <span style={styles.summaryValue}>{filteredData[filteredData.length - 1]?.weight || 0} kg</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>IMC actuel:</span>
              <span style={styles.summaryValue}>{filteredData[filteredData.length - 1]?.imc || 0}</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Performance:</span>
              <span style={styles.summaryValue}>{filteredData[filteredData.length - 1]?.performance || 0}%</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Moyenne calories:</span>
              <span style={styles.summaryValue}>
                {Math.round(filteredData.reduce((sum, d) => sum + d.calories, 0) / filteredData.length) || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}