import { useEffect, useState } from "react";
import api from "../services/api";

export default function NutritionPlans() {
  const [plans, setPlans] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Obtenir la couleur selon l'objectif
  const getObjectiveColor = (objective) => {
    switch (objective) {
      case "perte": return "#ff6b6b";
      case "maintien": return "#4ecdc4";
      case "prise": return "#45b7d1";
      default: return "#6c63ff";
    }
  };

  // Obtenir l'icône selon l'objectif
  const getObjectiveIcon = (objective) => {
    switch (objective) {
      case "perte": return "🔥";
      case "maintien": return "⚖️";
      case "prise": return "💪";
      default: return "🥗";
    }
  };

  // Récupérer tous les plans nutrition depuis le backend
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get("/nutrition");
      setPlans(res.data);
      setError(null);
    } catch (err) {
      console.log("Erreur fetchPlans:", err);
      setError("Impossible de charger les plans nutritionnels");
    } finally {
      setLoading(false);
    }
  };

  // Générer et télécharger un PDF
  const generateAndDownloadPDF = async (planId) => {
    try {
      setPdfLoading(prev => ({ ...prev, [planId]: true }));
      
      const response = await api.post(`/nutrition/${planId}/pdf`, {}, {
        responseType: 'blob'
      });
      
      // Créer un URL temporaire et télécharger le fichier
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `plan-nutrition-${planId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.log("Erreur generatePDF:", err);
      alert("Impossible de générer le PDF. Veuillez réessayer.");
    } finally {
      setPdfLoading(prev => ({ ...prev, [planId]: false }));
    }
  };

  // Obtenir les détails d'un plan
  const getPlanDetails = async (planId) => {
    try {
      const res = await api.get(`/nutrition/${planId}`);
      setSelectedPlan(res.data);
      setShowModal(true);
    } catch (err) {
      console.log("Erreur getPlanDetails:", err);
      alert("Impossible de charger les détails du plan");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Filtrer les plans selon l'objectif
  const filteredPlans =
    filter === "all"
      ? plans
      : plans.filter((plan) => plan.objective === filter);

  // Loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Chargement des plans nutritionnels...</p>
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
          <button onClick={fetchPlans} style={styles.retryBtn}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.headerSection}>
        <div style={styles.headerContent}>
          <h1 style={styles.mainTitle}>🥗 Plans Nutrition</h1>
          <p style={styles.subtitle}>Découvrez nos plans nutritionnels personnalisés pour atteindre vos objectifs</p>
        </div>
      </div>

      {/* Filter Section */}
      <div style={styles.filterSection}>
        <div style={styles.filterContainer}>
          <span style={styles.filterLabel}>Filtrer par objectif:</span>
          <div style={styles.filterButtons}>
            {[
              { value: "all", label: "Tous", icon: "🥗" },
              { value: "perte", label: "Perte de poids", icon: "🔥" },
              { value: "maintien", label: "Maintien", icon: "⚖️" },
              { value: "prise", label: "Prise de masse", icon: "💪" }
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                style={{
                  ...styles.filterBtn,
                  background: filter === f.value 
                    ? `linear-gradient(135deg, ${getObjectiveColor(f.value)} 0%, ${getObjectiveColor(f.value)}dd 100%)` 
                    : "#fff",
                  color: filter === f.value ? "white" : "#333",
                  border: filter === f.value ? "none" : "2px solid #e1e5e9",
                  transform: filter === f.value ? "translateY(-2px)" : "translateY(0)",
                  boxShadow: filter === f.value ? `0 8px 20px ${getObjectiveColor(f.value)}40` : "0 4px 12px rgba(0,0,0,0.08)"
                }}
              >
                <span style={styles.filterIcon}>{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.statsSection}>
        <div style={styles.statsContainer}>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{filteredPlans.length}</span>
            <span style={styles.statLabel}>Plans disponibles</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{plans.filter(p => p.objective === "perte").length}</span>
            <span style={styles.statLabel}>Perte de poids</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{plans.filter(p => p.objective === "maintien").length}</span>
            <span style={styles.statLabel}>Maintien</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statNumber}>{plans.filter(p => p.objective === "prise").length}</span>
            <span style={styles.statLabel}>Prise de masse</span>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div style={styles.plansSection}>
        {filteredPlans.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <h3 style={styles.emptyTitle}>Aucun plan trouvé</h3>
            <p style={styles.emptyText}>Aucun plan ne correspond à cet objectif</p>
            <button onClick={() => setFilter("all")} style={styles.resetBtn}>Voir tous les plans</button>
          </div>
        ) : (
          <div style={styles.plansGrid}>
            {filteredPlans.map((plan) => (
              <div key={plan._id} style={styles.planCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardTop}>
                    <h3 style={styles.cardTitle}>{plan.name}</h3>
                    <div style={{
                      ...styles.objectiveBadge,
                      background: getObjectiveColor(plan.objective)
                    }}>
                      {getObjectiveIcon(plan.objective)} {plan.objective}
                    </div>
                  </div>
                  <p style={styles.description}>{plan.description}</p>
                </div>
                
                <div style={styles.cardBody}>
                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <span style={styles.infoIcon}>📅</span>
                      <div>
                        <span style={styles.infoLabel}>Durée</span>
                        <span style={styles.infoValue}>{plan.duration} jours</span>
                      </div>
                    </div>
                    <div style={styles.infoItem}>
                      <span style={styles.infoIcon}>🔥</span>
                      <div>
                        <span style={styles.infoLabel}>Calories</span>
                        <span style={styles.infoValue}>{plan.caloriesPerDay} kcal/jour</span>
                      </div>
                    </div>
                  </div>

                  {plan.macros && (
                    <div style={styles.macrosSection}>
                      <h4 style={styles.macrosTitle}>Macronutriments</h4>
                      <div style={styles.macrosGrid}>
                        <div style={styles.macroItem}>
                          <span style={styles.macroIcon}>🥩</span>
                          <span style={styles.macroLabel}>Protéines</span>
                          <span style={styles.macroValue}>{plan.macros.proteins}g</span>
                        </div>
                        <div style={styles.macroItem}>
                          <span style={styles.macroIcon}>🌾</span>
                          <span style={styles.macroLabel}>Glucides</span>
                          <span style={styles.macroValue}>{plan.macros.carbs}g</span>
                        </div>
                        <div style={styles.macroItem}>
                          <span style={styles.macroIcon}>🥑</span>
                          <span style={styles.macroLabel}>Lipides</span>
                          <span style={styles.macroValue}>{plan.macros.fats}g</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div style={styles.cardActions}>
                  <button
                    onClick={() => getPlanDetails(plan._id)}
                    style={styles.detailsBtn}
                  >
                    👁️ Voir détails
                  </button>
                  <button
                    onClick={() => generateAndDownloadPDF(plan._id)}
                    disabled={pdfLoading[plan._id]}
                    style={{
                      ...styles.downloadBtn,
                      background: pdfLoading[plan._id] ? "#6c757d" : "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                      cursor: pdfLoading[plan._id] ? "not-allowed" : "pointer",
                      opacity: pdfLoading[plan._id] ? 0.7 : 1
                    }}
                  >
                    {pdfLoading[plan._id] ? (
                      <>
                        <span style={styles.loadingSpinner}></span>
                        Génération...
                      </>
                    ) : (
                      <>
                        <span style={styles.btnIcon}>📄</span>
                        Télécharger PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Plan Details */}
      {showModal && selectedPlan && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{selectedPlan.name}</h2>
              <button
                onClick={() => setShowModal(false)}
                style={styles.closeBtn}
              >
                ✖️
              </button>
            </div>
            
            <div style={styles.modalContent}>
              <p style={styles.modalDescription}>{selectedPlan.description}</p>
              
              {selectedPlan.meals && selectedPlan.meals.length > 0 && (
                <div style={styles.modalSection}>
                  <h3 style={styles.sectionTitle}>🍽️ Plan Repas</h3>
                  {selectedPlan.meals.map((meal, index) => (
                    <div key={index} style={styles.mealCard}>
                      <h4 style={styles.mealTitle}>{meal.name} - {meal.type}</h4>
                      <p style={styles.mealCalories}>Calories: {meal.calories} kcal</p>
                      {meal.instructions && (
                        <p style={styles.mealInstructions}><strong>Instructions:</strong> {meal.instructions}</p>
                      )}
                      {meal.foods && meal.foods.length > 0 && (
                        <div style={styles.foodsList}>
                          <h5 style={styles.foodsTitle}>Aliments:</h5>
                          {meal.foods.map((food, foodIndex) => (
                            <div key={foodIndex} style={styles.foodItem}>
                              <strong>{food.name}</strong> - {food.quantity} ({food.calories} kcal)
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {selectedPlan.shoppingList && selectedPlan.shoppingList.length > 0 && (
                <div style={styles.modalSection}>
                  <h3 style={styles.sectionTitle}>🛒 Liste de Courses</h3>
                  <div style={styles.shoppingList}>
                    {selectedPlan.shoppingList.map((item, index) => (
                      <div key={index} style={styles.shoppingItem}>
                        <strong>{item.item}</strong> - {item.quantity} ({item.category})
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedPlan.tips && selectedPlan.tips.length > 0 && (
                <div style={styles.modalSection}>
                  <h3 style={styles.sectionTitle}>💡 Conseils</h3>
                  {selectedPlan.tips.map((tip, index) => (
                    <div key={index} style={styles.tipCard}>
                      <h4 style={styles.tipTitle}>{tip.title}</h4>
                      <p style={styles.tipContent}>{tip.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles modernes et améliorés
const styles = {
  container: {
    width: "calc(100vw - 220px)",
    marginLeft: "220px",
    margin: "0",
    padding: "1rem",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
    position: "relative",
    left: "0",
    top: "0",
    overflowX: "hidden"
  },
  
  // Header Section
  headerSection: {
    background: "rgba(45, 45, 45, 0.8)",
    backdropFilter: "blur(10px)",
    padding: "2rem 0",
    margin: "0 -1rem 2rem",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    border: "1px solid #404040",
    borderRadius: "20px",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  headerContent: {
    position: "relative",
    zIndex: 1
  },
  mainTitle: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#ffffff",
    margin: "0 0 10px 0",
    textShadow: "0 4px 8px rgba(0,0,0,0.3)"
  },
  subtitle: {
    fontSize: "1.3rem",
    color: "#a1a1a1",
    margin: "0",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  
  // Filter Section
  filterSection: {
    marginBottom: "1.5rem"
  },
  filterContainer: {
    background: "#2d2d2d",
    padding: "1rem",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    border: "1px solid #404040",
    textAlign: "center",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  filterLabel: {
    display: "block",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#e5e5e5",
    marginBottom: "1rem"
  },
  filterButtons: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  filterBtn: {
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    minWidth: "120px",
    justifyContent: "center"
  },
  filterIcon: {
    fontSize: "1.2rem"
  },
  
  // Stats Section
  statsSection: {
    marginBottom: "1.5rem"
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  statItem: {
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    transition: "transform 0.3s ease"
  },
  statNumber: {
    display: "block",
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#667eea",
    marginBottom: "5px"
  },
  statLabel: {
    fontSize: "0.9rem",
    color: "#636e72",
    fontWeight: "500"
  },
  
  // Plans Section
  plansSection: {
    marginBottom: "40px"
  },
  plansGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  planCard: {
    background: "#2d2d2d",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
    transition: "all 0.3s ease",
    border: "1px solid #404040",
    cursor: "pointer"
  },
  planHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid #404040",
    background: "#1a1a1a"
  },
  planTitle: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 0.5rem 0"
  },
  planDescription: {
    color: "#a1a1a1",
    fontSize: "0.9rem",
    margin: "0",
    lineHeight: "1.4"
  },
  planMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap"
  },
  planPrice: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0"
  },
  planDuration: {
    color: "#a1a1a1",
    fontSize: "0.9rem",
    margin: "0"
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "20px"
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  infoIcon: {
    fontSize: "1.3rem",
    width: "30px"
  },
  infoLabel: {
    display: "block",
    fontSize: "0.8rem",
    color: "#636e72",
    fontWeight: "500"
  },
  infoValue: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#2d3436"
  },
  macrosSection: {
    marginBottom: "20px"
  },
  macrosTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#2d3436",
    margin: "0 0 15px 0"
  },
  macrosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px"
  },
  macroItem: {
    textAlign: "center",
    padding: "12px",
    background: "#f8f9fa",
    borderRadius: "10px",
    border: "1px solid #e9ecef"
  },
  macroIcon: {
    display: "block",
    fontSize: "1.2rem",
    marginBottom: "5px"
  },
  macroLabel: {
    display: "block",
    fontSize: "0.75rem",
    color: "#6c757d",
    marginBottom: "3px"
  },
  macroValue: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#2d3436"
  },
  cardActions: {
    padding: "20px 25px",
    display: "flex",
    gap: "15px",
    borderTop: "1px solid #f1f3f4"
  },
  detailsBtn: {
    flex: 1,
    padding: "12px 20px",
    borderRadius: "10px",
    border: "2px solid #667eea",
    background: "white",
    color: "#667eea",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  downloadBtn: {
    flex: 1,
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  btnIcon: {
    fontSize: "1rem"
  },
  loadingSpinner: {
    display: "inline-block",
    width: "12px",
    height: "12px",
    border: "2px solid #ffffff",
    borderTop: "2px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginRight: "8px"
  },
  
  // Empty State
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    background: "#2d2d2d",
    borderRadius: "20px",
    border: "2px dashed #404040"
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
    marginBottom: "25px"
  },
  resetBtn: {
    background: "#6366f1",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "transform 0.2s ease"
  },
  
  // Modal Styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px"
  },
  modal: {
    background: "#2d2d2d",
    borderRadius: "20px",
    maxWidth: "800px",
    maxHeight: "90vh",
    width: "100%",
    overflow: "hidden",
    boxShadow: "0 25px 50px rgba(0,0,0,0.3)"
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "25px",
    borderBottom: "1px solid #404040",
    background: "#1a1a1a"
  },
  modalTitle: {
    margin: 0,
    color: "#2d3436",
    fontSize: "1.5rem",
    fontWeight: "700"
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "8px",
    transition: "background 0.3s ease",
    color: "#6c757d"
  },
  modalContent: {
    padding: "25px",
    overflowY: "auto",
    maxHeight: "calc(90vh - 80px)"
  },
  modalDescription: {
    fontSize: "1.1rem",
    color: "#495057",
    lineHeight: "1.6",
    marginBottom: "25px"
  },
  modalSection: {
    marginBottom: "30px"
  },
  sectionTitle: {
    color: "#2d3436",
    marginBottom: "15px",
    fontSize: "1.3rem",
    fontWeight: "600"
  },
  mealCard: {
    marginBottom: "20px",
    padding: "20px",
    background: "#f8f9fa",
    borderRadius: "12px",
    border: "1px solid #e9ecef"
  },
  mealTitle: {
    color: "#4CAF50",
    margin: "0 0 8px 0",
    fontSize: "1.2rem",
    fontWeight: "600"
  },
  mealCalories: {
    margin: "0 0 12px 0",
    color: "#495057",
    fontWeight: "500"
  },
  mealInstructions: {
    margin: "0 0 15px 0",
    color: "#495057",
    lineHeight: "1.5"
  },
  foodsList: {
    marginTop: "15px"
  },
  foodsTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: "10px"
  },
  foodItem: {
    margin: "8px 0",
    padding: "10px",
    background: "white",
    borderRadius: "8px",
    fontSize: "0.9rem",
    color: "#495057"
  },
  shoppingList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "10px"
  },
  shoppingItem: {
    padding: "12px",
    background: "#f0f8ff",
    borderRadius: "8px",
    fontSize: "0.9rem",
    color: "#495057"
  },
  tipCard: {
    marginBottom: "15px",
    padding: "15px",
    background: "#fff3cd",
    borderLeft: "4px solid #ffc107",
    borderRadius: "8px"
  },
  tipTitle: {
    color: "#856404",
    margin: "0 0 8px 0",
    fontSize: "1.1rem",
    fontWeight: "600"
  },
  tipContent: {
    margin: 0,
    color: "#856404",
    fontSize: "0.95rem",
    lineHeight: "1.5"
  },
  
  // Loading and Error States
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    textAlign: "center"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #404040",
    borderTop: "4px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px"
  },
  loadingText: {
    color: "#a1a1a1",
    fontSize: "16px"
  },
  errorContainer: {
    textAlign: "center",
    padding: "40px 20px",
    background: "#991b1b",
    border: "1px solid #7f1d1d",
    borderRadius: "12px",
    margin: "20px 0",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  errorText: {
    color: "#ffffff",
    fontSize: "16px",
    marginBottom: "16px"
  },
  retryBtn: {
    background: "#6366f1",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600"
  },
  emptyContainer: {
    textAlign: "center",
    padding: "60px 20px",
    background: "#2d2d2d",
    border: "2px dashed #404040",
    borderRadius: "12px",
    margin: "20px 0",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  emptyText: {
    color: "#a1a1a1",
    fontSize: "16px",
    marginBottom: "20px"
  },
  resetBtn: {
    background: "#6366f1",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "transform 0.2s ease"
  },
  planContent: {
    padding: "1.5rem"
  },
  planFeatures: {
    listStyle: "none",
    padding: "0",
    margin: "0"
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 0",
    borderBottom: "1px solid #404040",
    color: "#a1a1a1",
    fontSize: "0.9rem"
  },
  featureIcon: {
    fontSize: "1rem"
  },
  featureText: {
    flex: 1
  },
  planActions: {
    display: "flex",
    gap: "10px",
    padding: "0 1.5rem"
  },
  viewBtn: {
    flex: 1,
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
    transition: "all 0.3s ease"
  },
  pdfBtn: {
    background: "#404040",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
    transition: "all 0.3s ease"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  modal: {
    background: "#2d2d2d",
    borderRadius: "20px",
    maxWidth: "800px",
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto",
    border: "1px solid #404040"
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
    borderBottom: "1px solid #404040"
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: "1.5rem",
    margin: "0",
    fontWeight: "600"
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#a1a1a1",
    fontSize: "1.5rem",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
    transition: "all 0.3s ease"
  },
  modalContent: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1.5rem",
    padding: "1.5rem"
  },
  modalImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "12px"
  },
  modalInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: "1.2rem",
    margin: "0 0 0.5rem 0",
    fontWeight: "600"
  },
  modalDescription: {
    color: "#a1a1a1",
    margin: "0 0 1rem 0",
    lineHeight: "1.4"
  },
  modalPrice: {
    color: "#6366f1",
    fontSize: "1.2rem",
    fontWeight: "600",
    margin: "0 0 1rem 0"
  },
  modalFeatures: {
    color: "#ffffff",
    margin: "0 0 1rem 0"
  },
  modalFeature: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 0",
    borderBottom: "1px solid #404040"
  },
  modalFeatureIcon: {
    fontSize: "1rem"
  },
  modalFeatureText: {
    flex: 1
  },
  modalActions: {
    display: "flex",
    gap: "10px",
    marginTop: "1rem"
  },
  downloadBtn: {
    flex: 1,
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
    transition: "all 0.3s ease"
  },
  closeModalBtn: {
    flex: 1,
    background: "#404040",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
    transition: "all 0.3s ease"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    textAlign: "center"
  },
  loadingText: {
    color: "#a1a1a1",
    fontSize: "16px"
  },
  errorContainer: {
    textAlign: "center",
    padding: "40px 20px",
    background: "#991b1b",
    border: "1px solid #7f1d1d",
    borderRadius: "12px",
    margin: "20px 0",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  errorText: {
    color: "#ffffff",
    fontSize: "16px",
    marginBottom: "16px"
  },
  retryBtn: {
    background: "#6366f1",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600"
  },
  emptyContainer: {
    textAlign: "center",
    padding: "60px 20px",
    background: "#2d2d2d",
    border: "2px dashed #404040",
    borderRadius: "12px",
    margin: "20px 0",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  emptyText: {
    color: "#a1a1a1",
    fontSize: "16px",
    marginBottom: "20px"
  },
  resetBtn: {
    background: "#6366f1",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "transform 0.2s ease"
  }
};

// Ajouter les animations CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .plan-card:hover {
      transform: translateY(-4px) !important;
      box-shadow: 0 12px 32px rgba(0,0,0,0.4) !important;
    }
    
    .view-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3) !important;
    }
    
    .pdf-btn:hover {
      transform: translateY(-2px) !important;
      background-color: #555555 !important;
    }
    
    .reset-btn:hover {
      transform: translateY(-2px) !important;
      background-color: #45a049 !important;
    }
    
    .filter-btn:hover {
      transform: translateY(-2px) !important;
      color: #ffffff !important;
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3) !important;
        grid-template-columns: 1fr !important;
      }
      
      .main-title {
        font-size: 1.8rem !important;
      }
      
      .header-section {
        padding: 30px 0 !important;
      }
      
      .modal {
        margin: 10px;
        max-height: calc(100vh - 20px);
      }
      
      .info-grid {
        grid-template-columns: 1fr !important;
      }
      
      .macros-grid {
        grid-template-columns: 1fr !important;
      }
      
      .stats-container {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 15px !important;
      }
      
      .stat-item {
        padding: 20px !important;
      }
      
      .stat-number {
        font-size: 2rem !important;
      }
    }
  `;
  document.head.appendChild(style);
}
