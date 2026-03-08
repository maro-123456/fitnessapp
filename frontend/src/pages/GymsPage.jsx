import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import GymMapComponent from "../components/GymMapComponent";

export default function GymsPage() {
  const { user } = useContext(AuthContext);
  const { t } = useLanguage();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.welcomeSection}>
          <h1 style={styles.title}>🏋️ Salles de Sport</h1>
          <p style={styles.subtitle}>Trouvez la salle parfaite près de chez vous</p>
        </div>
        <div style={styles.userAvatar}>
          <div style={styles.avatarCircle}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <div style={styles.mapSection}>
        <div style={styles.mapHeader}>
          <h2 style={styles.mapTitle}>📍 Carte des salles de sport</h2>
          <p style={styles.mapDescription}>
            Cliquez sur les marqueurs pour voir les détails de chaque salle
          </p>
        </div>
        
        <GymMapComponent userLocation={user?.location} />
        
        {user?.location && (
          <div style={styles.userLocationInfo}>
            <h3 style={styles.infoTitle}>🎯 Salles près de votre position</h3>
            <p style={styles.infoText}>
              Votre position: {user.location.lat.toFixed(4)}, {user.location.lng.toFixed(4)}
            </p>
            <p style={styles.infoText}>
              Les salles sont classées par prix et équipements
            </p>
          </div>
        )}
      </div>

      <div style={styles.featuresSection}>
        <h2 style={styles.featuresTitle}>💡 Comment utiliser la carte</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🗺️</div>
            <h3 style={styles.featureTitle}>Navigation</h3>
            <p style={styles.featureDescription}>
              Zoomez et déplacez-vous pour explorer les différentes zones
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📍</div>
            <h3 style={styles.featureTitle}>Marqueurs</h3>
            <p style={styles.featureDescription}>
              Les couleurs indiquent le niveau de prix des salles
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>ℹ️</div>
            <h3 style={styles.featureTitle}>Informations</h3>
            <p style={styles.featureDescription}>
              Cliquez sur un marqueur pour voir les détails de la salle
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>👤</div>
            <h3 style={styles.featureTitle}>Votre position</h3>
            <p style={styles.featureDescription}>
              Le marqueur violet montre votre localisation enregistrée
            </p>
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
    animation: "slideDown 0.6s ease-out",
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
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "2rem",
    fontWeight: "bold",
    boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)",
    transition: "transform 0.3s ease",
    cursor: "pointer"
  },
  
  mapSection: {
    background: "#2d2d2d",
    padding: "1.5rem",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    border: "1px solid #404040",
    marginBottom: "1.5rem",
    animation: "fadeIn 0.8s ease-out",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  
  mapHeader: {
    marginBottom: "1rem"
  },
  
  mapTitle: {
    fontSize: "1.5rem",
    color: "#ffffff",
    margin: "0 0 0.5rem 0",
    fontWeight: "700"
  },
  
  mapDescription: {
    color: "#a1a1a1",
    margin: "0",
    fontSize: "1rem"
  },
  
  userLocationInfo: {
    marginTop: "1rem",
    padding: "1rem",
    background: "#1a1a1a",
    borderRadius: "12px",
    border: "1px solid #404040"
  },
  
  infoTitle: {
    color: "#ffffff",
    margin: "0 0 0.5rem 0",
    fontSize: "1.1rem",
    fontWeight: "600"
  },
  
  infoText: {
    color: "#a1a1a1",
    margin: "0.25rem 0",
    fontSize: "0.9rem"
  },
  
  featuresSection: {
    background: "#2d2d2d",
    padding: "1.5rem",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    border: "1px solid #404040",
    animation: "fadeIn 1s ease-out",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  
  featuresTitle: {
    fontSize: "1.5rem",
    color: "#ffffff",
    margin: "0 0 1rem 0",
    fontWeight: "700"
  },
  
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem"
  },
  
  featureCard: {
    background: "#1a1a1a",
    padding: "1rem",
    borderRadius: "12px",
    border: "1px solid #404040",
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)"
    }
  },
  
  featureIcon: {
    fontSize: "1.5rem",
    flexShrink: 0
  },
  
  featureTitle: {
    color: "#ffffff",
    margin: "0 0 0.5rem 0",
    fontSize: "1rem",
    fontWeight: "600"
  },
  
  featureDescription: {
    color: "#a1a1a1",
    margin: "0",
    fontSize: "0.9rem",
    lineHeight: "1.4"
  }
};
