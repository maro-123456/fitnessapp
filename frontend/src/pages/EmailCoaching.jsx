import { useState, useEffect } from "react";
import api from "../services/api";

export default function EmailCoaching() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    weeklyRecap: true,
    workoutReminders: true,
    inactivityAlerts: true
  });
  const [emailHistory, setEmailHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testLoading, setTestLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmailData();
  }, []);

  const fetchEmailData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les préférences
      const prefsResponse = await api.get("/email/preferences");
      setPreferences(prefsResponse.data.preferences);
      
      // Récupérer l'historique
      const historyResponse = await api.get("/email/history");
      setEmailHistory(historyResponse.data.history);
      
      setError("");
    } catch (err) {
      console.log("Erreur fetchEmailData:", err);
      setError("Impossible de charger les données email");
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = async (key, value) => {
    try {
      const newPreferences = { ...preferences, [key]: value };
      setPreferences(newPreferences);
      
      await api.put("/email/preferences", newPreferences);
      
      setSuccessMessage("Préférences mises à jour avec succès !");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.log("Erreur mise à jour préférences:", err);
      setError("Erreur lors de la mise à jour des préférences");
      setTimeout(() => setError(""), 3000);
    }
  };

  const sendTestEmail = async (emailType) => {
    try {
      setTestLoading(true);
      
      // Simuler l'ID utilisateur (à remplacer par l'ID réel)
      const userId = "6999957ba988e893dfc2ec87";
      
      await api.post("/email/test", { userId, emailType });
      
      setSuccessMessage(`Email ${emailType} envoyé avec succès !`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.log("Erreur envoi email test:", err);
      setError("Erreur lors de l'envoi de l'email test");
      setTimeout(() => setError(""), 3000);
    } finally {
      setTestLoading(false);
    }
  };

  const getEmailTypeLabel = (type) => {
    const labels = {
      weekly_recap: "Récap Hebdomadaire",
      workout_reminder: "Rappel Entraînement",
      goal_achieved: "Objectif Atteint",
      inactivity_alert: "Alerte Inactivité"
    };
    return labels[type] || type;
  };

  const getEmailTypeIcon = (type) => {
    const icons = {
      weekly_recap: "📊",
      workout_reminder: "🏋️",
      goal_achieved: "🎉",
      inactivity_alert: "⏰"
    };
    return icons[type] || "📧";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Chargement des paramètres email...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.welcomeSection}>
          <h1 style={styles.title}>📧 Emails de Coaching</h1>
          <p style={styles.subtitle}>Personnalisez vos notifications et suivez votre progression</p>
        </div>
        <div style={styles.userAvatar}>
          <div style={styles.avatarCircle}>
            📧
          </div>
        </div>
      </header>

      {successMessage && (
        <div style={styles.successMessage}>
          ✅ {successMessage}
        </div>
      )}

      {error && (
        <div style={styles.errorMessage}>
          ❌ {error}
        </div>
      )}

      <div style={styles.content}>
        {/* Section Préférences */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>⚙️ Préférences de Notification</h2>
          <div style={styles.preferencesGrid}>
            <div style={styles.preferenceCard}>
              <div style={styles.preferenceHeader}>
                <div style={styles.preferenceIcon}>📊</div>
                <div style={styles.preferenceInfo}>
                  <h3 style={styles.preferenceTitle}>Récapitulatifs Hebdomadaires</h3>
                  <p style={styles.preferenceDescription}>
                    Recevez un résumé de vos performances chaque semaine
                  </p>
                </div>
              </div>
              <label style={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={preferences.weeklyRecap}
                  onChange={(e) => handlePreferenceChange('weeklyRecap', e.target.checked)}
                />
                <span style={styles.toggleSlider}></span>
              </label>
            </div>

            <div style={styles.preferenceCard}>
              <div style={styles.preferenceHeader}>
                <div style={styles.preferenceIcon}>🏋️</div>
                <div style={styles.preferenceInfo}>
                  <h3 style={styles.preferenceTitle}>Rappels d'Entraînement</h3>
                  <p style={styles.preferenceDescription}>
                    Soyez notifié avant vos séances programmées
                  </p>
                </div>
              </div>
              <label style={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={preferences.workoutReminders}
                  onChange={(e) => handlePreferenceChange('workoutReminders', e.target.checked)}
                />
                <span style={styles.toggleSlider}></span>
              </label>
            </div>

            <div style={styles.preferenceCard}>
              <div style={styles.preferenceHeader}>
                <div style={styles.preferenceIcon}>⏰</div>
                <div style={styles.preferenceInfo}>
                  <h3 style={styles.preferenceTitle}>Alertes d'Inactivité</h3>
                  <p style={styles.preferenceDescription}>
                    Recevez un encouragement si vous êtes inactif
                  </p>
                </div>
              </div>
              <label style={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={preferences.inactivityAlerts}
                  onChange={(e) => handlePreferenceChange('inactivityAlerts', e.target.checked)}
                />
                <span style={styles.toggleSlider}></span>
              </label>
            </div>

            <div style={styles.preferenceCard}>
              <div style={styles.preferenceHeader}>
                <div style={styles.preferenceIcon}>🎉</div>
                <div style={styles.preferenceInfo}>
                  <h3 style={styles.preferenceTitle}>Notifications Générales</h3>
                  <p style={styles.preferenceDescription}>
                    Activez/désactivez toutes les notifications email
                  </p>
                </div>
              </div>
              <label style={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                />
                <span style={styles.toggleSlider}></span>
              </label>
            </div>
          </div>
        </div>

        {/* Section Tests */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🧪 Tester les Emails</h2>
          <p style={styles.sectionDescription}>
            Envoyez des emails de test pour vérifier le fonctionnement
          </p>
          <div style={styles.testGrid}>
            <button
              onClick={() => sendTestEmail('weekly')}
              disabled={testLoading || !preferences.emailNotifications}
              style={{
                ...styles.testButton,
                opacity: (testLoading || !preferences.emailNotifications) ? 0.5 : 1,
                cursor: (testLoading || !preferences.emailNotifications) ? 'not-allowed' : 'pointer'
              }}
            >
              📊 Récap Hebdomadaire
            </button>
            <button
              onClick={() => sendTestEmail('reminder')}
              disabled={testLoading || !preferences.emailNotifications}
              style={{
                ...styles.testButton,
                opacity: (testLoading || !preferences.emailNotifications) ? 0.5 : 1,
                cursor: (testLoading || !preferences.emailNotifications) ? 'not-allowed' : 'pointer'
              }}
            >
              🏋️ Rappel Entraînement
            </button>
            <button
              onClick={() => sendTestEmail('goal')}
              disabled={testLoading || !preferences.emailNotifications}
              style={{
                ...styles.testButton,
                opacity: (testLoading || !preferences.emailNotifications) ? 0.5 : 1,
                cursor: (testLoading || !preferences.emailNotifications) ? 'not-allowed' : 'pointer'
              }}
            >
              🎉 Objectif Atteint
            </button>
            <button
              onClick={() => sendTestEmail('inactivity')}
              disabled={testLoading || !preferences.emailNotifications}
              style={{
                ...styles.testButton,
                opacity: (testLoading || !preferences.emailNotifications) ? 0.5 : 1,
                cursor: (testLoading || !preferences.emailNotifications) ? 'not-allowed' : 'pointer'
              }}
            >
              ⏰ Alerte Inactivité
            </button>
          </div>
        </div>

        {/* Section Historique */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📜 Historique des Emails</h2>
          <div style={styles.historyContainer}>
            {emailHistory.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📭</div>
                <h3 style={styles.emptyTitle}>Aucun email envoyé</h3>
                <p style={styles.emptyDescription}>
                  Les emails que vous recevrez apparaîtront ici
                </p>
              </div>
            ) : (
              <div style={styles.historyList}>
                {emailHistory.map((email) => (
                  <div key={email.id} style={styles.historyItem}>
                    <div style={styles.historyIcon}>
                      {getEmailTypeIcon(email.type)}
                    </div>
                    <div style={styles.historyContent}>
                      <h4 style={styles.historySubject}>{email.subject}</h4>
                      <p style={styles.historyType}>
                        {getEmailTypeLabel(email.type)}
                      </p>
                      <p style={styles.historyDate}>
                        Envoyé le {formatDate(email.sentAt)}
                      </p>
                    </div>
                    <div style={styles.historyStatus}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: email.status === 'sent' ? '#10b981' : '#ef4444'
                      }}>
                        {email.status === 'sent' ? '✓ Envoyé' : '✗ Erreur'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section Informations */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>ℹ️ Informations</h2>
          <div style={styles.infoGrid}>
            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>📅 Fréquence des Emails</h3>
              <ul style={styles.infoList}>
                <li style={styles.infoListItem}><strong>Hebdomadaire</strong> : Dimanche 9h00</li>
                <li style={styles.infoListItem}><strong>Rappels</strong> : 8h00 et 18h00 quotidiennement</li>
                <li style={styles.infoListItem}><strong>Inactivité</strong> : 10h00 quotidiennement</li>
              </ul>
            </div>
            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>🔧 Configuration</h3>
              <ul style={styles.infoList}>
                <li style={styles.infoListItem}><strong>Service</strong> : Nodemailer + Gmail</li>
                <li style={styles.infoListItem}><strong>Sécurité</strong> : Connexion sécurisée</li>
                <li style={styles.infoListItem}><strong>Personnalisation</strong> : Templates dynamiques</li>
              </ul>
            </div>
            <div style={styles.infoCard}>
              <h3 style={styles.infoTitle}>📊 Types d'Emails</h3>
              <ul style={styles.infoList}>
                <li style={styles.infoListItem}><strong>Récap</strong> : Statistiques hebdomadaires</li>
                <li style={styles.infoListItem}><strong>Rappels</strong> : Programmes d'entraînement</li>
                <li style={styles.infoListItem}><strong>Objectifs</strong> : Célébrations des réussites</li>
                <li style={styles.infoListItem}><strong>Inactivité</strong> : Encouragements personnalisés</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "calc(100vw - 220px)",
    marginLeft: "220px",
    margin: "0",
    padding: "1rem",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
    minHeight: "100vh",
    position: "relative",
    left: "0",
    top: "0",
    overflowX: "hidden"
  },

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    background: "#2d2d2d",
    padding: "1rem",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    border: "1px solid #404040",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  welcomeSection: {
    flex: 1
  },
  title: {
    fontSize: "2.5rem",
    color: "#ffffff",
    margin: "0",
    fontWeight: "700"
  },
  subtitle: {
    color: "#a1a1a1",
    marginTop: "0.5rem",
    fontSize: "1.1rem"
  },
  userAvatar: {
    position: "relative"
  },
  avatarCircle: {
    width: "60px",
    height: "60px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "1.5rem",
    fontWeight: "bold",
    boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)",
    transition: "transform 0.3s ease",
    cursor: "pointer"
  },

  // Messages
  successMessage: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    padding: "1rem",
    borderRadius: "10px",
    marginBottom: "1rem",
    textAlign: "center",
    fontWeight: "600",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  errorMessage: {
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "white",
    padding: "1rem",
    borderRadius: "10px",
    marginBottom: "1rem",
    textAlign: "center",
    fontWeight: "600",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },

  // Content
  content: {
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },

  // Section
  section: {
    background: "#2d2d2d",
    borderRadius: "20px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    border: "1px solid #404040"
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: "1.5rem",
    margin: "0 0 1rem 0",
    fontWeight: "600"
  },
  sectionDescription: {
    color: "#a1a1a1",
    margin: "0 0 1.5rem 0"
  },

  // Préférences Grid
  preferencesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1rem"
  },
  preferenceCard: {
    background: "#1a1a1a",
    borderRadius: "15px",
    padding: "1.5rem",
    border: "1px solid #404040",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  preferenceHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    flex: 1
  },
  preferenceIcon: {
    fontSize: "2rem",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(99, 102, 241, 0.2)",
    borderRadius: "10px"
  },
  preferenceInfo: {
    flex: 1
  },
  preferenceTitle: {
    color: "#ffffff",
    fontSize: "1.1rem",
    margin: "0 0 0.5rem 0",
    fontWeight: "600"
  },
  preferenceDescription: {
    color: "#a1a1a1",
    fontSize: "0.9rem",
    margin: "0",
    lineHeight: "1.4"
  },

  // Toggle Switch
  toggleSwitch: {
    position: "relative",
    display: "inline-block",
    width: "50px",
    height: "24px"
  },
  toggleSlider: {
    position: "absolute",
    cursor: "pointer",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    background: "#404040",
    transition: ".4s",
    borderRadius: "24px"
  },

  // Test Grid
  testGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem"
  },
  testButton: {
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "white",
    border: "none",
    padding: "1rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },

  // History
  historyContainer: {
    maxHeight: "400px",
    overflowY: "auto"
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem",
    color: "#a1a1a1"
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "1rem"
  },
  emptyTitle: {
    color: "#ffffff",
    margin: "0 0 0.5rem 0",
    fontSize: "1.2rem"
  },
  emptyDescription: {
    margin: "0",
    fontSize: "0.9rem"
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  historyItem: {
    background: "#1a1a1a",
    borderRadius: "12px",
    padding: "1rem",
    border: "1px solid #404040",
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  },
  historyIcon: {
    fontSize: "1.5rem",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(99, 102, 241, 0.2)",
    borderRadius: "8px"
  },
  historyContent: {
    flex: 1
  },
  historySubject: {
    color: "#ffffff",
    fontSize: "1rem",
    margin: "0 0 0.25rem 0",
    fontWeight: "600"
  },
  historyType: {
    color: "#6366f1",
    fontSize: "0.8rem",
    margin: "0 0 0.25rem 0"
  },
  historyDate: {
    color: "#a1a1a1",
    fontSize: "0.8rem",
    margin: "0"
  },
  historyStatus: {
    display: "flex",
    alignItems: "center"
  },
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "0.7rem",
    fontWeight: "600",
    color: "white"
  },

  // Info Grid
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1rem"
  },
  infoCard: {
    background: "#1a1a1a",
    borderRadius: "15px",
    padding: "1.5rem",
    border: "1px solid #404040"
  },
  infoTitle: {
    color: "#ffffff",
    fontSize: "1.1rem",
    margin: "0 0 1rem 0",
    fontWeight: "600"
  },
  infoList: {
    color: "#a1a1a1",
    margin: "0",
    paddingLeft: "1.5rem",
    lineHeight: "1.6"
  },
  infoListItem: {
    marginBottom: "0.5rem"
  },

  // Loading
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
    
    .toggle-switch input:checked + .toggle-slider {
      background-color: #6366f1 !important;
    }
    
    .toggle-switch input:checked + .toggle-slider:before {
      transform: translateX(26px) !important;
    }
    
    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
    
    .test-button:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3) !important;
    }
    
    .preference-card:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 12px 32px rgba(0,0,0,0.4) !important;
    }
    
    .history-item:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important;
    }
  `;
  document.head.appendChild(style);
}
