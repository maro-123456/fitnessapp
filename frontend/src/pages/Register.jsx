import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import SimpleLeafletMap from "../components/SimpleLeafletMap";

export default function Register() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    weight: "",
    height: "",
    goal: "loss",
    language: "fr",
    location: null
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSelect = (location) => {
    setForm({ ...form, location });
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur serveur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.brandSection}>
          <div style={styles.logo}>FitLife</div>
          <h1 style={styles.brandTitle}>Commencez votre transformation</h1>
          <p style={styles.brandDescription}>
            Rejoignez notre communauté fitness et atteignez vos objectifs 
            avec des programmes personnalisés et un accompagnement professionnel.
          </p>
        </div>
        
        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🎯</div>
            <div style={styles.featureContent}>
              <h3 style={styles.featureTitle}>Programmes sur mesure</h3>
              <p style={styles.featureDescription}>Plans d'entraînement adaptés à vos objectifs</p>
            </div>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>📊</div>
            <div style={styles.featureContent}>
              <h3 style={styles.featureTitle}>Suivi intelligent</h3>
              <p style={styles.featureDescription}>Analysez vos performances en temps réel</p>
            </div>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🏆</div>
            <div style={styles.featureContent}>
              <h3 style={styles.featureTitle}>Résultats garantis</h3>
              <p style={styles.featureDescription}>Méthodes prouvées par des experts</p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.registerContainer}>
          <div style={styles.header}>
            <h2 style={styles.title}>Créer un compte</h2>
            <p style={styles.subtitle}>Rejoignez la communauté FitLife</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {error && (
              <div style={styles.error}>
                {error}
              </div>
            )}

            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nom complet</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Jean Dupont"
                  onChange={handleChange}
                  value={form.name}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Adresse email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="jean@email.com"
                  onChange={handleChange}
                  value={form.email}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Mot de passe</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                value={form.password}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Âge</label>
                <input
                  name="age"
                  type="number"
                  placeholder="25"
                  onChange={handleChange}
                  value={form.age}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Poids (kg)</label>
                <input
                  name="weight"
                  type="number"
                  placeholder="70"
                  onChange={handleChange}
                  value={form.weight}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Taille (cm)</label>
                <input
                  name="height"
                  type="number"
                  placeholder="175"
                  onChange={handleChange}
                  value={form.height}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Objectif</label>
                <select 
                  name="goal" 
                  onChange={handleChange}
                  value={form.goal}
                  style={styles.select}
                >
                  <option value="loss">🔥 Perte de poids</option>
                  <option value="gain">💪 Prise de masse</option>
                  <option value="maintain">⚖️ Maintien</option>
                </select>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>📍 Votre localisation (cliquez sur la carte)</label>
              <SimpleLeafletMap onLocationSelect={handleLocationSelect} />
              {form.location && (
                <div style={{ 
                  marginTop: '8px', 
                  padding: '8px 12px', 
                  background: '#2d2d2d', 
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#a1a1a1'
                }}>
                  📍 Position: {form.location.lat.toFixed(4)}, {form.location.lng.toFixed(4)}
                </div>
              )}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Langue</label>
              <select 
                name="language" 
                onChange={handleChange}
                value={form.language}
                style={styles.select}
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇬🇧 English</option>
                <option value="ar">🇸🇦 العربية</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.button,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "not-allowed" : "pointer"
              }}
            >
              {isLoading ? "Inscription en cours..." : "S'inscrire gratuitement"}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerText}>ou</span>
          </div>

          <div style={styles.socialButtons}>
            <button style={styles.socialButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={styles.socialIcon}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuer avec Google
            </button>
          </div>

          <div style={styles.loginSection}>
            <p style={styles.loginText}>
              Déjà un compte ?{" "}
              <Link to="/login" style={styles.loginLink}>
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  
  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
    color: "white",
    padding: "80px 60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "relative"
  },
  
  brandSection: {
    marginBottom: "60px"
  },
  logo: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "16px",
    letterSpacing: "-0.5px"
  },
  brandTitle: {
    fontSize: "48px",
    fontWeight: "700",
    margin: "0 0 20px 0",
    lineHeight: "1.2",
    letterSpacing: "-1px"
  },
  brandDescription: {
    fontSize: "18px",
    lineHeight: "1.6",
    margin: 0,
    opacity: 0.9,
    maxWidth: "500px"
  },
  
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "32px"
  },
  feature: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start"
  },
  featureIcon: {
    fontSize: "24px",
    flexShrink: 0,
    marginTop: "4px"
  },
  featureContent: {
    flex: 1
  },
  featureTitle: {
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 8px 0"
  },
  featureDescription: {
    fontSize: "16px",
    lineHeight: "1.5",
    margin: 0,
    opacity: 0.8
  },
  
  rightPanel: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px"
  },
  
  registerContainer: {
    width: "100%",
    maxWidth: "500px"
  },
  
  header: {
    textAlign: "center",
    marginBottom: "40px"
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 8px 0"
  },
  subtitle: {
    fontSize: "16px",
    color: "#a1a1a1",
    margin: 0
  },
  
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  
  formRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px"
  },
  
  inputGroup: {
    display: "flex",
    flexDirection: "column"
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#e5e5e5",
    marginBottom: "6px"
  },
  input: {
    padding: "12px 16px",
    fontSize: "16px",
    border: "1px solid #404040",
    borderRadius: "8px",
    outline: "none",
    backgroundColor: "#2d2d2d",
    color: "#ffffff",
    transition: "all 0.2s ease"
  },
  select: {
    padding: "12px 16px",
    fontSize: "16px",
    border: "1px solid #404040",
    borderRadius: "8px",
    outline: "none",
    backgroundColor: "#2d2d2d",
    color: "#ffffff",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  
  error: {
    padding: "12px 16px",
    backgroundColor: "#991b1b",
    border: "1px solid #7f1d1d",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "500"
  },
  
  button: {
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    backgroundColor: "#6366f1",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "32px 0",
    position: "relative"
  },
  dividerText: {
    padding: "0 16px",
    fontSize: "14px",
    color: "#a1a1a1",
    backgroundColor: "#1a1a1a"
  },
  
  socialButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  socialButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "12px 16px",
    fontSize: "15px",
    fontWeight: "500",
    color: "#e5e5e5",
    backgroundColor: "#2d2d2d",
    border: "1px solid #404040",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  socialIcon: {
    flexShrink: 0
  },
  
  loginSection: {
    textAlign: "center",
    marginTop: "32px",
    paddingTop: "32px",
    borderTop: "1px solid #404040"
  },
  loginText: {
    fontSize: "14px",
    color: "#a1a1a1",
    margin: 0
  },
  loginLink: {
    color: "#6366f1",
    textDecoration: "none",
    fontWeight: "600"
  }
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 1024px) {
      .left-panel {
        display: none !important;
      }
      
      .right-panel {
        flex: 1 !important;
      }
    }
    
    @media (max-width: 640px) {
      .right-panel {
        padding: 20px !important;
      }
      
      .register-container {
        max-width: 100% !important;
      }
      
      .brand-title {
        font-size: 36px !important;
      }
      
      .brand-description {
        font-size: 16px !important;
      }
      
      .title {
        font-size: 28px !important;
      }
      
      .form-row {
        grid-template-columns: 1fr !important;
      }
      
      .social-button {
        font-size: 14px !important;
      }
      
      .login-section {
        margin-top: 24px !important;
        padding-top: 24px !important;
      }
    }
    
    /* Divider styles */
    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #404040;
    }
    
    /* Hover effects */
    .login-link:hover {
      text-decoration: underline !important;
    }
    
    .button:hover {
      background-color: #4f46e5 !important;
    }
    
    .social-button:hover {
      background-color: #404040 !important;
      border-color: #555555 !important;
    }
    
    /* Input focus styles */
    input:focus, select:focus {
      border-color: #6366f1 !important;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
    }
  `;
  document.head.appendChild(style);
}