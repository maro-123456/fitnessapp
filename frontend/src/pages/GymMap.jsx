import { useState, useEffect } from "react";

export default function GymMap() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGym, setSelectedGym] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Simuler des données de salles de sport (remplacer par appel API réel)
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoading(true);
        
        // Simuler des salles de sport autour de Paris
        const mockGyms = [
          {
            id: 1,
            name: "FitLife Paris Centre",
            address: "15 Rue de la Paix, 75002 Paris",
            lat: 48.8698,
            lng: 2.3324,
            distance: 0.8,
            rating: 4.5,
            reviews: 234,
            price: "€29.99/mois",
            amenities: ["Piscine", "Sauna", "Cours collectifs", "Ouvert 24/7"],
            phone: "01 42 61 23 45",
            website: "www.fitlife-paris.fr",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
          },
          {
            id: 2,
            name: "Muscle Factory",
            address: "42 Boulevard Saint-Michel, 75005 Paris",
            lat: 48.8529,
            lng: 2.3441,
            distance: 1.2,
            rating: 4.8,
            reviews: 189,
            price: "€39.99/mois",
            amenities: ["Musculation", "CrossFit", "Nutritionniste", "Parking"],
            phone: "01 44 27 89 12",
            website: "www.muscle-factory.fr",
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop"
          },
          {
            id: 3,
            name: "Yoga Flow Studio",
            address: "8 Rue du Temple, 75004 Paris",
            lat: 48.8547,
            lng: 2.3609,
            distance: 1.5,
            rating: 4.9,
            reviews: 156,
            price: "€49.99/mois",
            amenities: ["Yoga", "Pilates", "Méditation", "Spa"],
            phone: "01 48 87 65 43",
            website: "www.yogaflow.fr",
            image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop"
          },
          {
            id: 4,
            name: "City Gym",
            address: "25 Avenue des Champs-Élysées, 75008 Paris",
            lat: 48.8708,
            lng: 2.2956,
            distance: 2.1,
            rating: 4.3,
            reviews: 312,
            price: "€34.99/mois",
            amenities: ["Cardio", "Musculation", "Cours", "Sauna"],
            phone: "01 45 62 34 78",
            website: "www.citygym.fr",
            image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop"
          },
          {
            id: 5,
            name: "Elite Fitness Club",
            address: "123 Rue de Rivoli, 75001 Paris",
            lat: 48.8570,
            lng: 2.3588,
            distance: 0.5,
            rating: 4.7,
            reviews: 278,
            price: "€44.99/mois",
            amenities: ["Luxury", "Coach perso", "Spa", "Restaurant"],
            phone: "01 42 96 87 54",
            website: "www.elitefitness.fr",
            image: "https://images.unsplash.com/photo-1581009148191-88842c86f7b9?w=400&h=300&fit=crop"
          }
        ];
        
        setGyms(mockGyms);
        
        // Obtenir la position de l'utilisateur
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLat = position.coords.latitude;
              const userLng = position.coords.longitude;
              setUserLocation({ lat: userLat, lng: userLng });
            },
            (error) => {
              console.log("Erreur de géolocalisation:", error);
            }
          );
        }
        
        setError(null);
      } catch (err) {
        console.log("Erreur fetchGyms:", err);
        setError("Impossible de charger les salles de sport");
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, []);

  const handleGymSelect = (gym) => {
    setSelectedGym(gym);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Chargement des salles de sport...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>⚠️ {error}</p>
          <button onClick={() => window.location.reload()} style={styles.retryBtn}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.welcomeSection}>
          <h1 style={styles.title}>🏋️ Carte des Salles de Sport</h1>
          <p style={styles.subtitle}>Trouvez la salle de sport parfaite près de chez vous</p>
        </div>
        <div style={styles.userAvatar}>
          <div style={styles.avatarCircle}>
            🗺️
          </div>
        </div>
      </header>

      <div style={styles.content}>
        {/* Section Carte */}
        <div style={styles.mapSection}>
          <div style={styles.mapContainer}>
            <div style={styles.mapPlaceholder}>
              <div style={styles.mapContent}>
                <div style={styles.mapIcon}>🗺️</div>
                <h3 style={styles.mapTitle}>Carte Interactive</h3>
                <p style={styles.mapSubtitle}>
                  {gyms.length} salles de sport trouvées dans votre région
                </p>
                {userLocation && (
                  <p style={styles.locationText}>
                    📍 Votre position : {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section Liste des Salles */}
        <div style={styles.gymsSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Salles de Sport à Proximité</h2>
            <div style={styles.filters}>
              <select style={styles.filterSelect}>
                <option value="distance">Plus proches</option>
                <option value="rating">Mieux notées</option>
                <option value="price">Moins chères</option>
              </select>
            </div>
          </div>

          <div style={styles.gymsGrid}>
            {gyms.map((gym) => (
              <div key={gym.id} style={styles.gymCard}>
                <div style={styles.gymImageContainer}>
                  <img 
                    src={gym.image} 
                    alt={gym.name} 
                    style={styles.gymImage}
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%232d2d2d'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='18' fill='%23a1a1a1'%3EGym Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div style={styles.distanceBadge}>
                    📍 {gym.distance} km
                  </div>
                  <div style={styles.ratingBadge}>
                    ⭐ {gym.rating}
                  </div>
                </div>
                
                <div style={styles.gymContent}>
                  <h3 style={styles.gymName}>{gym.name}</h3>
                  <p style={styles.gymAddress}>📍 {gym.address}</p>
                  <p style={styles.gymPrice}>{gym.price}</p>
                  
                  <div style={styles.amenities}>
                    {gym.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} style={styles.amenityTag}>
                        {amenity}
                      </span>
                    ))}
                    {gym.amenities.length > 3 && (
                      <span style={styles.amenityTag}>+{gym.amenities.length - 3}</span>
                    )}
                  </div>
                  
                  <div style={styles.gymActions}>
                    <button 
                      onClick={() => handleGymSelect(gym)}
                      style={styles.viewBtn}
                    >
                      🗺️ Voir sur la carte
                    </button>
                    <button style={styles.contactBtn}>
                      📞 Contacter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Gym Sélectionné */}
      {selectedGym && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{selectedGym.name}</h2>
              <button 
                onClick={() => setSelectedGym(null)}
                style={styles.closeBtn}
              >
                ✕
              </button>
            </div>
            
            <div style={styles.modalContent}>
              <img 
                src={selectedGym.image} 
                alt={selectedGym.name} 
                style={styles.modalImage}
              />
              
              <div style={styles.modalInfo}>
                <p style={styles.modalAddress}>📍 {selectedGym.address}</p>
                <p style={styles.modalPrice}>{selectedGym.price}</p>
                <p style={styles.modalRating}>⭐ {selectedGym.rating} ({selectedGym.reviews} avis)</p>
                
                <div style={styles.modalAmenities}>
                  <h4 style={styles.modalAmenitiesTitle}>Équipements et Services</h4>
                  <div style={styles.amenitiesList}>
                    {selectedGym.amenities.map((amenity, index) => (
                      <span key={index} style={styles.amenityTag}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div style={styles.modalContact}>
                  <p style={styles.modalContactText}>📞 {selectedGym.phone}</p>
                  <p style={styles.modalContactText}>🌐 {selectedGym.website}</p>
                </div>
                
                <div style={styles.modalActions}>
                  <button style={styles.reserveBtn}>Réserver une visite</button>
                  <button style={styles.directionsBtn}>🗺️ Itinéraire</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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

  // Content Layout
  content: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
    maxWidth: "1400px",
    marginLeft: "auto",
    marginRight: "auto"
  },

  // Map Section
  mapSection: {
    display: "flex",
    flexDirection: "column"
  },
  mapContainer: {
    background: "#2d2d2d",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    border: "1px solid #404040",
    height: "500px"
  },
  mapPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
  },
  mapContent: {
    textAlign: "center",
    color: "#ffffff"
  },
  mapIcon: {
    fontSize: "4rem",
    marginBottom: "1rem"
  },
  mapTitle: {
    fontSize: "1.5rem",
    margin: "0 0 0.5rem 0",
    color: "#ffffff"
  },
  mapSubtitle: {
    color: "#a1a1a1",
    margin: "0 0 1rem 0"
  },
  locationText: {
    color: "#6366f1",
    fontSize: "0.9rem",
    margin: "0"
  },

  // Gyms Section
  gymsSection: {
    display: "flex",
    flexDirection: "column"
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem"
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: "1.5rem",
    margin: "0",
    fontWeight: "600"
  },
  filters: {
    display: "flex",
    gap: "10px"
  },
  filterSelect: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #404040",
    background: "#1a1a1a",
    color: "#ffffff",
    cursor: "pointer"
  },

  // Gyms Grid
  gymsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxHeight: "500px",
    overflowY: "auto"
  },
  gymCard: {
    background: "#2d2d2d",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
    transition: "all 0.3s ease",
    border: "1px solid #404040",
    cursor: "pointer"
  },
  gymImageContainer: {
    position: "relative",
    height: "120px",
    overflow: "hidden"
  },
  gymImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  distanceBadge: {
    position: "absolute",
    top: "8px",
    left: "8px",
    background: "rgba(0, 0, 0, 0.8)",
    color: "#ffffff",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: "600"
  },
  ratingBadge: {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "rgba(99, 102, 241, 0.9)",
    color: "#ffffff",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: "600"
  },
  gymContent: {
    padding: "1rem"
  },
  gymName: {
    color: "#ffffff",
    fontSize: "1.1rem",
    fontWeight: "600",
    margin: "0 0 0.5rem 0"
  },
  gymAddress: {
    color: "#a1a1a1",
    fontSize: "0.9rem",
    margin: "0 0 0.5rem 0"
  },
  gymPrice: {
    color: "#6366f1",
    fontSize: "1rem",
    fontWeight: "600",
    margin: "0 0 0.5rem 0"
  },
  amenities: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    marginBottom: "1rem"
  },
  amenityTag: {
    background: "rgba(99, 102, 241, 0.2)",
    color: "#6366f1",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "0.7rem",
    fontWeight: "500"
  },
  gymActions: {
    display: "flex",
    gap: "8px"
  },
  viewBtn: {
    flex: 1,
    background: "#6366f1",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.8rem",
    transition: "all 0.3s ease"
  },
  contactBtn: {
    flex: 1,
    background: "#404040",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.8rem",
    transition: "all 0.3s ease"
  },

  // Modal
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
    overflow: "hidden",
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
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
    padding: "1.5rem"
  },
  modalImage: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
    borderRadius: "12px"
  },
  modalInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  modalAddress: {
    color: "#a1a1a1",
    margin: "0"
  },
  modalPrice: {
    color: "#6366f1",
    fontSize: "1.2rem",
    fontWeight: "600",
    margin: "0"
  },
  modalRating: {
    color: "#ffffff",
    margin: "0"
  },
  modalAmenities: {
    color: "#ffffff"
  },
  modalAmenitiesTitle: {
    margin: "0 0 0.5rem 0",
    fontSize: "1rem"
  },
  amenitiesList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px"
  },
  modalContact: {
    color: "#a1a1a1"
  },
  modalContactText: {
    margin: "0"
  },
  modalActions: {
    display: "flex",
    gap: "10px",
    marginTop: "1rem"
  },
  reserveBtn: {
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
  directionsBtn: {
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

  // Loading et Error
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
    margin: "20px 0"
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
    
    .gym-card:hover {
      transform: translateY(-4px) !important;
      box-shadow: 0 12px 32px rgba(0,0,0,0.4) !important;
    }
    
    .view-btn:hover {
      background-color: #4f46e5 !important;
      transform: translateY(-2px) !important;
    }
    
    .contact-btn:hover {
      background-color: #555555 !important;
      transform: translateY(-2px) !important;
    }
    
    .reserve-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3) !important;
    }
    
    .directions-btn:hover {
      background-color: #555555 !important;
      transform: translateY(-2px) !important;
    }
    
    .close-btn:hover {
      background-color: #404040 !important;
      color: #ffffff !important;
    }
  `;
  document.head.appendChild(style);
}
