import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    weight: "",
    goal: "",
    language: ""
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        age: user.age || "",
        weight: user.weight || "",
        goal: user.goal || "",
        language: user.language || "fr"
      });
      fetchUserStats();
    }
    setLoading(false);
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const res = await api.get("/user/stats");
      setUserStats(res.data);
      setError(null);
    } catch (err) {
      console.log("Erreur fetchUserStats:", err);
      // Utiliser des données de démonstration si l'API ne répond pas
      setUserStats({
        totalWorkouts: 45,
        totalCaloriesBurned: 12500,
        avgWorkoutDuration: 45,
        favoriteExercise: "Développé couché",
        currentStreak: 12,
        longestStreak: 21,
        achievements: ["Premier entraînement", "Semaine parfaite", "Objectif atteint"],
        level: "Intermédiaire",
        experiencePoints: 1250,
        nextLevelPoints: 250
      });
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      // Reset form data to current user data
      setFormData({
        name: user.name || "",
        age: user.age || "",
        weight: user.weight || "",
        goal: user.goal || "",
        language: user.language || "fr"
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put("/user/profile", formData);
      
      // Mettre à jour le contexte utilisateur si disponible
      if (user && user.updateProfile) {
        await user.updateProfile(formData);
      }
      
      setEditMode(false);
      setError(null);
    } catch (err) {
      console.log("Erreur handleSave:", err);
      setError("Impossible de mettre à jour le profil");
    } finally {
      setSaving(false);
    }
  };

  const getGoalIcon = (goal) => {
    switch (goal) {
      case "perte": return "🔥";
      case "maintien": return "⚖️";
      case "prise": return "💪";
      default: return "🎯";
    }
  };

  const getGoalColor = (goal) => {
    switch (goal) {
      case "perte": return "#ff6b6b";
      case "maintien": return "#4ecdc4";
      case "prise": return "#45b7d1";
      default: return "#6c63ff";
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Débutant": return "#28a745";
      case "Intermédiaire": return "#ffc107";
      case "Avancé": return "#dc3545";
      case "Expert": return "#6f42c1";
      default: return "#6c757d";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Chargement du profil...</p>
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
          <button onClick={() => setError(null)} style={styles.retryBtn}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.headerSection}>
        <div style={styles.headerContent}>
          <h1 style={styles.mainTitle}>👤 Mon Profil</h1>
          <p style={styles.subtitle}>Gérez vos informations et suivez vos progrès</p>
        </div>
      </div>

      {/* Profile Tabs */}
      <div style={styles.tabsSection}>
        <div style={styles.tabsContainer}>
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              ...styles.tabBtn,
              background: activeTab === "overview" 
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                : "white",
              color: activeTab === "overview" ? "white" : "#333"
            }}
          >
            📊 Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            style={{
              ...styles.tabBtn,
              background: activeTab === "stats" 
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                : "white",
              color: activeTab === "stats" ? "white" : "#333"
            }}
          >
            📈 Statistiques
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            style={{
              ...styles.tabBtn,
              background: activeTab === "settings" 
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                : "white",
              color: activeTab === "settings" ? "white" : "#333"
            }}
          >
            ⚙️ Paramètres
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div style={styles.contentSection}>
          <div style={styles.profileGrid}>
            {/* Profile Info Card */}
            <div style={styles.profileCard}>
              <div style={styles.profileHeader}>
                <div style={styles.avatarContainer}>
                  <div style={styles.avatar}>
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <button
                    onClick={handleEditToggle}
                    style={styles.editBtn}
                  >
                    {editMode ? "❌" : "✏️"}
                  </button>
                </div>
                <div style={styles.profileInfo}>
                  {editMode ? (
                    <div style={styles.editForm}>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Nom</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          style={styles.formInput}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Âge</label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          style={styles.formInput}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Poids (kg)</label>
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          style={styles.formInput}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Objectif</label>
                        <select
                          name="goal"
                          value={formData.goal}
                          onChange={handleInputChange}
                          style={styles.formSelect}
                        >
                          <option value="">Sélectionner un objectif</option>
                          <option value="perte">Perte de poids</option>
                          <option value="maintien">Maintien</option>
                          <option value="prise">Prise de masse</option>
                        </select>
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Langue</label>
                        <select
                          name="language"
                          value={formData.language}
                          onChange={handleInputChange}
                          style={styles.formSelect}
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="es">Español</option>
                        </select>
                      </div>
                      <div style={styles.formActions}>
                        <button
                          onClick={handleEditToggle}
                          style={styles.cancelBtn}
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          style={{
                            ...styles.saveBtn,
                            background: saving ? "#6c757d" : "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                            cursor: saving ? "not-allowed" : "pointer",
                            opacity: saving ? 0.7 : 1
                          }}
                        >
                          {saving ? "Sauvegarde..." : "💾 Sauvegarder"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={styles.profileDetails}>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>👤 Nom</span>
                        <span style={styles.detailValue}>{user?.name || "Non défini"}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>📧 Email</span>
                        <span style={styles.detailValue}>{user?.email || "Non défini"}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>🎂 Âge</span>
                        <span style={styles.detailValue}>{user?.age || "Non défini"} ans</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>⚖️ Poids</span>
                        <span style={styles.detailValue}>{user?.weight || "Non défini"} kg</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>🎯 Objectif</span>
                        <span style={styles.detailValue}>
                          {user?.goal ? (
                            <>
                              <span style={{ color: getGoalColor(user.goal) }}>
                                {getGoalIcon(user.goal)} {user.goal}
                              </span>
                            </>
                          ) : "Non défini"}
                        </span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>🌍 Langue</span>
                        <span style={styles.detailValue}>{user?.language?.toUpperCase() || "FR"}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            {userStats && (
              <div style={styles.quickStatsCard}>
                <h3 style={styles.cardTitle}>📊 Statistiques Rapides</h3>
                <div style={styles.statsGrid}>
                  <div style={styles.statItem}>
                    <span style={styles.statIcon}>🏋️</span>
                    <div style={styles.statContent}>
                      <span style={styles.statNumber}>{userStats.totalWorkouts}</span>
                      <span style={styles.statLabel}>Entraînements</span>
                    </div>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statIcon}>🔥</span>
                    <div style={styles.statContent}>
                      <span style={styles.statNumber}>{userStats.totalCaloriesBurned}</span>
                      <span style={styles.statDescription}>Calories brûlées</span>
                    </div>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statIcon}>⏱️</span>
                    <div style={styles.statContent}>
                      <span style={styles.statNumber}>{userStats.avgWorkoutDuration}</span>
                      <span style={styles.statLabel}>Durée moyenne</span>
                    </div>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statIcon}>🔥</span>
                    <div style={styles.statContent}>
                      <span style={styles.statNumber}>{userStats.currentStreak}</span>
                      <span style={styles.statLabel}>Série actuelle</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Card */}
          {userStats && (
            <div style={styles.progressCard}>
              <h3 style={styles.cardTitle}>📈 Progression</h3>
              <div style={styles.progressSection}>
                <div style={styles.progressItem}>
                  <div style={styles.progressHeader}>
                    <span style={styles.progressLabel}>Niveau</span>
                    <span style={{
                      ...styles.progressValue,
                      background: getLevelColor(userStats.level),
                      color: "white"
                    }}>
                      {userStats.level}
                    </span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{
                      ...styles.progressFill,
                      width: `${(userStats.experiencePoints / (userStats.experiencePoints + userStats.nextLevelPoints)) * 100}%`
                    }}></div>
                  </div>
                  <span style={styles.progressText}>
                    {Math.round((userStats.experiencePoints / (userStats.experiencePoints + userStats.nextLevelPoints)) * 100)}% vers le niveau suivant
                  </span>
                </div>

                <div style={styles.progressItem}>
                  <div style={styles.progressHeader}>
                    <span style={styles.progressLabel}>Série actuelle</span>
                    <span style={styles.progressValue}>{userStats.currentStreak} jours</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{
                      ...styles.progressFill,
                      width: `${(userStats.currentStreak / userStats.longestStreak) * 100}%`
                    }}></div>
                  </div>
                  <span style={styles.progressText}>
                    Record personnel : {userStats.longestStreak} jours
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === "stats" && userStats && (
        <div style={styles.contentSection}>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statHeader}>
                <span style={styles.statIcon}>🏋️</span>
                <span style={styles.statTitle}>Entraînements</span>
              </div>
              <div style={styles.statContent}>
                <span style={styles.statNumber}>{userStats.totalWorkouts}</span>
                <span style={styles.statDescription}>Total complété</span>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statHeader}>
                <span style={styles.statIcon}>🔥</span>
                <span style={styles.statTitle}>Calories</span>
              </div>
              <div style={styles.statContent}>
                <span style={styles.statNumber}>{userStats.totalCaloriesBurned.toLocaleString()}</span>
                <span style={styles.statDescription}>Total brûlées</span>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statHeader}>
                <span style={styles.statIcon}>⏱️</span>
                <span style={styles.statTitle}>Durée</span>
              </div>
              <div style={styles.statContent}>
                <span style={styles.statNumber}>{userStats.avgWorkoutDuration}</span>
                <span style={styles.statDescription}>Minutes/séance</span>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statHeader}>
                <span style={styles.statIcon}>🏆</span>
                <span style={styles.statTitle}>Exercice favori</span>
              </div>
              <div style={styles.statContent}>
                <span style={styles.statNumber}>{userStats.favoriteExercise}</span>
                <span style={styles.statDescription}>Plus pratiqué</span>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statHeader}>
                <span style={styles.statIcon}>🔥</span>
                <span style={styles.statTitle}>Série actuelle</span>
              </div>
              <div style={styles.statContent}>
                <span style={styles.statNumber}>{userStats.currentStreak}</span>
                <span style={styles.statDescription}>Jours consécutifs</span>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statHeader}>
                <span style={styles.statIcon}>🏆</span>
                <span style={styles.statTitle}>Record</span>
              </div>
              <div style={styles.statContent}>
                <span style={styles.statNumber}>{userStats.longestStreak}</span>
                <span style={styles.statDescription}>Meilleure série</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          {userStats.achievements && userStats.achievements.length > 0 && (
            <div style={styles.achievementsCard}>
              <h3 style={styles.cardTitle}>🏆 Réalisations</h3>
              <div style={styles.achievementsGrid}>
                {userStats.achievements.map((achievement, index) => (
                  <div key={index} style={styles.achievementItem}>
                    <span style={styles.achievementIcon}>🏆</span>
                    <span style={styles.achievementText}>{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div style={styles.contentSection}>
          <div style={styles.settingsGrid}>
            <div style={styles.settingsCard}>
              <h3 style={styles.cardTitle}>⚙️ Paramètres du compte</h3>
              <div style={styles.settingsContent}>
                <div style={styles.settingItem}>
                  <span style={styles.settingLabel}>📧 Email</span>
                  <span style={styles.settingValue}>{user?.email}</span>
                </div>
                <div style={styles.settingItem}>
                  <span style={styles.settingLabel}>🔐 Mot de passe</span>
                  <button style={styles.changePasswordBtn}>Changer le mot de passe</button>
                </div>
                <div style={styles.settingItem}>
                  <span style={styles.settingLabel}>📱 Notifications</span>
                  <label style={styles.toggleSwitch}>
                    <input type="checkbox" defaultChecked={true} />
                    <span style={styles.toggleSlider}></span>
                  </label>
                </div>
                <div style={styles.settingItem}>
                  <span style={styles.settingLabel}>🌍 Langue</span>
                  <span style={styles.settingValue}>{user?.language?.toUpperCase() || "FR"}</span>
                </div>
              </div>
            </div>

            <div style={styles.settingsCard}>
              <h3 style={styles.cardTitle}>📊 Préférences</h3>
              <div style={styles.settingsContent}>
                <div style={styles.settingItem}>
                  <span style={styles.settingLabel}>📈 Unités de mesure</span>
                  <select style={styles.settingSelect}>
                    <option value="metric">Métrique</option>
                    <option value="imperial">Impérial</option>
                  </select>
                </div>
                <div style={styles.settingItem}>
                  <span style={styles.settingLabel}>🎯 Objectifs par défaut</span>
                  <select style={styles.settingSelect}>
                    <option value="">Sélectionner</option>
                    <option value="perte">Perte de poids</option>
                    <option value="maintien">Maintien</option>
                    <option value="prise">Prise de masse</option>
                  </select>
                </div>
                <div style={styles.settingItem}>
                  <span style={styles.settingLabel}>📅 Rappels</span>
                  <label style={styles.toggleSwitch}>
                    <input type="checkbox" defaultChecked={true} />
                    <span style={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
            </div>

            <div style={styles.settingsCard}>
              <h3 style={styles.cardTitle}>🗑️ Confidentialité</h3>
              <div style={styles.settingsContent}>
                <div style={styles.settingItem}>
                  <span style={styles.settingLabel}>👁 Visibilité du profil</span>
                  <select style={styles.settingSelect}>
                    <option value="public">Public</option>
                    <option value="friends">Amis uniquement</option>
                    <option value="private">Privé</option>
                  </select>
                </div>
                <div style={styles.settingItem}>
                  <span style={styles.settingLabel}>📊 Partager les statistiques</span>
                  <label style={styles.toggleSwitch}>
                    <input type="checkbox" defaultChecked={true} />
                    <span style={styles.toggleSlider}></span>
                  </label>
                </div>
                <div style={styles.settingItem}>
                  <span style={styles.settingLabel}>🗑️ Supprimer le compte</span>
                  <button style={styles.deleteBtn}>Supprimer mon compte</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles modernes et professionnels pour Profile
const styles = {
  container: {
    width: "calc(100vw - 220px)",
    marginLeft: "220px",
    margin: "0",
    padding: "0.5rem",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
    position: "relative",
    left: "0",
    top: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  headerSection: {
    background: "rgba(45, 45, 45, 0.8)",
    backdropFilter: "blur(10px)",
    padding: "2rem 0",
    margin: "0 -0.5rem 2rem",
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
  
  // Tabs Section
  tabsSection: {
    marginBottom: "1.5rem",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  tabsContainer: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    padding: "1rem",
    background: "#2d2d2d",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    border: "1px solid #404040"
  },
  tabBtn: {
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  
  // Content Section
  contentSection: {
    marginBottom: "1.5rem",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  
  // Profile Grid
  profileGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "20px"
  },
  
  // Profile Card
  profileCard: {
    background: "#2d2d2d",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
    border: "1px solid #404040"
  },
  profileHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid #404040",
    background: "#1a1a1a"
  },
  avatarContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px"
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "white",
    textShadow: "0 4px 8px rgba(0,0,0,0.3)"
  },
  editBtn: {
    background: "rgba(255,255,255,0.2)",
    border: "2px solid #e1e5e9",
    color: "#333",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "1.2rem",
    transition: "all 0.3s ease"
  },
  profileInfo: {
    flex: 1
  },
  
  // Edit Form
  editForm: {
    padding: "0 1.5rem"
  },
  formGroup: {
    marginBottom: "1rem"
  },
  formLabel: {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: "8px"
  },
  formInput: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "2px solid #404040",
    fontSize: "1rem",
    background: "#1a1a1a",
    color: "#ffffff",
    transition: "border-color 0.3s ease"
  },
  formSelect: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "2px solid #404040",
    fontSize: "1rem",
    background: "#1a1a1a",
    color: "#ffffff",
    cursor: "pointer"
  },
  formActions: {
    display: "flex",
    gap: "10px",
    padding: "0 1.5rem"
  },
  cancelBtn: {
    background: "#404040",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem"
  },
  saveBtn: {
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
    transition: "all 0.3s ease"
  },
  
  // Profile Details
  profileDetails: {
    padding: "0 1.5rem"
  },
  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #404040"
  },
  detailLabel: {
    fontSize: "0.9rem",
    color: "#a1a1a1",
    fontWeight: "500",
    minWidth: "120px"
  },
  detailValue: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "right"
  },
  
  // Quick Stats Card
  quickStatsCard: {
    background: "#2d2d2d",
    borderRadius: "20px",
    padding: "1.5rem",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
    border: "1px solid #404040"
  },
  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 1rem 0"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px"
  },
  statItem: {
    background: "#f8f9fa",
    padding: "20px",
    borderRadius: "15px",
    border: "1px solid #e9ecef",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px"
  },
  statHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px"
  },
  statIcon: {
    fontSize: "1.5rem"
  },
  statTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#2d3436"
  },
  statContent: {
    textAlign: "center"
  },
  statNumber: {
    display: "block",
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: "5px"
  },
  statLabel: {
    fontSize: "0.8rem",
    color: "#636e72",
    fontWeight: "500"
  },
  statDescription: {
    fontSize: "0.8rem",
    color: "#636e72",
    fontWeight: "500"
  },
  
  // Progress Card
  progressCard: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)"
  },
  progressSection: {
    display: "flex",
    flexDirection: "column",
    gap: "25px"
  },
  progressItem: {
    background: "#f8f9fa",
    padding: "20px",
    borderRadius: "15px",
    border: "1px solid #e9ecef"
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px"
  },
  progressLabel: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#495057"
  },
  progressValue: {
    padding: "4px 12px",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: "600"
  },
  progressBar: {
    width: "100%",
    height: "8px",
    background: "#e9ecef",
    borderRadius: "4px",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #4CAF50 0%, #45a049 100%)",
    borderRadius: "4px",
    transition: "width 0.3s ease"
  },
  progressText: {
    fontSize: "0.8rem",
    color: "#636e72",
    textAlign: "center",
    marginTop: "10px"
  },
  
  // Achievements Card
  achievementsCard: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)"
  },
  achievementsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px"
  },
  achievementItem: {
    background: "#fff3cd",
    border: "1px solid #ffc107",
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  achievementIcon: {
    fontSize: "1.2rem"
  },
  achievementText: {
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#856404"
  },
  
  // Settings Grid
  settingsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "30px"
  },
  settingsCard: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)"
  },
  settingsContent: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  settingItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 0",
    borderBottom: "1px solid #f1f3f4"
  },
  settingLabel: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#2d3436",
    minWidth: "120px"
  },
  settingValue: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#2d3436",
    textAlign: "right"
  },
  changePasswordBtn: {
    background: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600"
  },
  settingSelect: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #e1e5e9",
    fontSize: "0.9rem",
    background: "white",
    cursor: "pointer"
  },
  toggleSwitch: {
    position: "relative",
    display: "inline-block",
    width: "44px",
    height: "24px"
  },
  toggleSlider: {
    position: "absolute",
    cursor: "pointer",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    background: "#ccc",
    transition: ".4s",
    borderRadius: "34px"
  },
  deleteBtn: {
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem"
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

// Ajouter les animations CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
      .profile-grid {
        grid-template-columns: 1fr !important;
        gap: 20px !important;
      }
      
      .tabs-container {
        flex-direction: column !important;
        gap: 10px !important;
      }
      
      .tab-btn {
        width: 100% !important;
      }
      
      .main-title {
        font-size: 2.2rem !important;
      }
      
      .subtitle {
        font-size: 1.1rem !important;
      }
      
      .header-section {
        padding: 40px 0 !important;
      }
      
      .avatar {
        width: 60px !important;
        height: 60px !important;
        font-size: 1.5rem !important;
      }
      
      .stat-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 15px !important;
      }
      
      .stat-item {
        padding: 15px !important;
      }
      
      .stat-number {
        font-size: 1.5rem !important;
      }
      
      .progress-card {
        padding: 20px !important;
      }
      
      .settings-grid {
        grid-template-columns: 1fr !important;
        gap: 20px !important;
      }
    }
    
    @media (max-width: 480px) {
      .profile-grid {
        grid-template-columns: 1fr !important;
        gap: 15px !important;
      }
      
      .main-title {
        font-size: 1.8rem !important;
      }
      
      .header-section {
        padding: 30px 0 !important;
      }
      
      .avatar {
        width: 50px !important;
        height: 50px !important;
        font-size: 1.2rem !important;
      }
      
      .stat-grid {
        grid-template-columns: 1fr !important;
      }
      
      .settings-grid {
        grid-template-columns: 1fr !important;
      }
      
      .progress-card {
        padding: 15px !important;
      }
      
      .settings-card {
        padding: 20px !important;
      }
      
      .settings-content {
        gap: 15px !important;
      }
    }
  `;
  document.head.appendChild(style);
}