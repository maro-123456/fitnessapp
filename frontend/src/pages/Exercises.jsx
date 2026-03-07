import { useEffect, useState } from "react";
import api from "../services/api"; // axios instance

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState({}); // Pour suivre l'état de chargement par exercice

  // Récupérer tous les exercices
  const fetchExercises = async () => {
    try {
      setLoading(true);
      const res = await api.get("/exercises");
      setExercises(res.data);
      setError(null);
    } catch (err) {
      console.log("Erreur fetchExercises:", err);
      setError("Impossible de charger les exercices");
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les favoris
  const fetchFavorites = async () => {
    try {
      const res = await api.get("/exercises/favorites"); // si pas de auth, ça renvoie []
      setFavorites(res.data);
    } catch (err) {
      console.log("Erreur fetchFavorites:", err);
    }
  };

  // Ajouter / retirer un favori
  const toggleFavorite = async (id) => {
    try {
      setFavoriteLoading(prev => ({ ...prev, [id]: true }));
      
      const response = await api.post(`/exercises/favorite/${id}`);
      console.log("Toggle favorite response:", response.data);
      
      await fetchFavorites(); // recharge la liste des favoris
      
      // Afficher un message de succès
      if (response.data.message) {
        // Optionnel: afficher une notification de succès
        console.log("Success:", response.data.message);
      }
    } catch (err) {
      console.log("Erreur toggleFavorite:", err);
      if (err.response?.status === 401) {
        alert("Veuillez vous connecter pour ajouter des favoris");
      } else if (err.response?.status === 404) {
        alert("Exercice non trouvé");
      } else {
        alert("Impossible d'ajouter aux favoris. Veuillez réessayer.");
      }
    } finally {
      setFavoriteLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Filtrer par catégorie
  const filtered =
    category === "all"
      ? exercises
      : exercises.filter((ex) => ex.category === category);

  // Gestionnaire d'erreur pour les images
  const handleImageError = (e) => {
    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%232d2d2d'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='14' fill='%23a1a1a1'%3EImage non disponible%3C/text%3E%3C/svg%3E";
  };

  useEffect(() => {
    fetchExercises();
    fetchFavorites();
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.welcomeSection}>
          <h1 style={styles.title}>🏋️ Bibliothèque d'exercices</h1>
          <p style={styles.subtitle}>Explorez notre collection complète d'exercices</p>
        </div>
        <div style={styles.userAvatar}>
          <div style={styles.avatarCircle}>
            💪
          </div>
        </div>
      </header>

      <div style={styles.filtersSection}>
        <span style={styles.filterLabel}>Filtrer par catégorie:</span>
        <div style={styles.filterButtons}>
          {[
            { value: "all", label: "Tous", icon: "🏋️" },
            { value: "chest", label: "Pectoraux", icon: "💪" },
            { value: "back", label: "Dos", icon: "🔙" },
            { value: "legs", label: "Jambes", icon: "🦵" },
            { value: "arms", label: "Bras", icon: "💪" },
            { value: "abs", label: "Abdos", icon: "🎯" }
          ].map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              style={{
                ...styles.filterBtn,
                background: category === c.value ? "#6366f1" : "#2d2d2d",
                color: category === c.value ? "#ffffff" : "#e5e5e5",
                border: category === c.value ? "1px solid #6366f1" : "1px solid #404040",
                transform: category === c.value ? "translateY(-2px)" : "translateY(0)",
                boxShadow: category === c.value ? "0 4px 12px rgba(99, 102, 241, 0.3)" : "none"
              }}
            >
              <span style={styles.filterIcon}>{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Chargement des exercices...</p>
        </div>
      )}

      {error && (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>⚠️ {error}</p>
          <button onClick={fetchExercises} style={styles.retryBtn}>Réessayer</button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={styles.emptyContainer}>
          <p style={styles.emptyText}>🔍 Aucun exercice trouvé pour cette catégorie</p>
          <button onClick={() => setCategory("all")} style={styles.resetBtn}>Voir tous les exercices</button>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div style={styles.grid}>
          {filtered.map((ex) => {
            const isFav = favorites.some((f) => f._id === ex._id);
            return (
              <div key={ex._id} style={styles.card}>
                <div style={styles.imageContainer}>
                  <img 
                    src={ex.image} 
                    alt={ex.name} 
                    style={styles.image} 
                    onError={handleImageError}
                  />
                  <div style={styles.categoryBadge}>
                    {ex.category}
                  </div>
                </div>
                <div style={styles.content}>
                  <h3 style={styles.exerciseName}>{ex.name}</h3>
                  <button
                    onClick={() => toggleFavorite(ex._id)}
                    disabled={favoriteLoading[ex._id]}
                    style={{
                      ...styles.favBtn,
                      background: favoriteLoading[ex._id] 
                        ? "#404040" 
                        : isFav 
                          ? "#ef4444" 
                          : "#2d2d2d",
                      color: favoriteLoading[ex._id] || isFav ? "#ffffff" : "#e5e5e5",
                      border: favoriteLoading[ex._id] || isFav ? "none" : "1px solid #404040",
                      cursor: favoriteLoading[ex._id] ? "not-allowed" : "pointer",
                      opacity: favoriteLoading[ex._id] ? 0.7 : 1
                    }}
                  >
                    <span style={styles.favIcon}>
                      {favoriteLoading[ex._id] ? "⏳" : (isFav ? "❤️" : "🤍")}
                    </span>
                    {favoriteLoading[ex._id] ? "Chargement..." : (isFav ? "Favori" : "Ajouter")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Styles noir et gris élégants - Full Screen complet (incluant sidebar)
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
  
  filtersSection: {
    background: "#2d2d2d",
    padding: "1rem",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    border: "1px solid #404040",
    marginBottom: "1.5rem",
    animation: "fadeIn 0.8s ease-out",
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
    gap: "12px",
    flexWrap: "wrap"
  },
  
  filterBtn: {
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  
  filterIcon: {
    fontSize: "16px"
  },
  
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
    animation: "fadeIn 0.5s ease-in",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  
  card: {
    background: "#2d2d2d",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
    transition: "all 0.3s ease",
    border: "1px solid #404040",
    cursor: "pointer"
  },
  
  imageContainer: {
    position: "relative",
    height: "160px",
    overflow: "hidden"
  },
  
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease"
  },
  
  categoryBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "rgba(45, 45, 45, 0.9)",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#e5e5e5",
    backdropFilter: "blur(10px)",
    border: "1px solid #404040"
  },
  
  content: {
    padding: "15px"
  },
  
  exerciseName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: "12px",
    lineHeight: "1.4"
  },
  
  favBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  
  favIcon: {
    fontSize: "16px"
  },
  
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    textAlign: "center",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
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
    borderRadius: "12px",
    border: "2px dashed #404040",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  
  emptyText: {
    fontSize: "16px",
    color: "#a1a1a1",
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
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @media (max-width: 1024px) {
      .left-panel {
        display: none !important;
      }
      
      .right-panel {
        flex: 1 !important;
      }
    }
    
    @media (max-width: 768px) {
      .grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important;
        gap: 16px !important;
      }
      
      .filter-buttons {
        justify-content: center;
      }
      
      .filter-btn {
        font-size: 12px;
        padding: 8px 12px;
      }
      
      .title {
        font-size: 28px !important;
      }
    }
    
    @media (max-width: 480px) {
      .grid {
        grid-template-columns: 1fr !important;
      }
      
      .title {
        font-size: 24px !important;
      }
      
      .exercises-container {
        padding: 20px !important;
      }
    }
    
    .filter-btn:hover {
      background-color: #6366f1 !important;
      color: #ffffff !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3) !important;
    }
    
    .card:hover {
      transform: translateY(-4px) !important;
      box-shadow: 0 12px 32px rgba(0,0,0,0.4) !important;
    }
    
    .card:hover .image {
      transform: scale(1.05) !important;
    }
    
    .reset-btn:hover {
      transform: translateY(-2px) !important;
      background-color: #4f46e5 !important;
    }
    
    .retry-btn:hover {
      background-color: #4f46e5 !important;
    }
  `;
  document.head.appendChild(style);
}