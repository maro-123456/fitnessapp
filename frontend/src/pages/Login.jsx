import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.brandSection}>
          <div style={styles.logo}>FitLife</div>
          <h1 style={styles.brandTitle}>Rejoignez la communauté fitness</h1>
          <p style={styles.brandDescription}>
            Accédez à vos programmes d'entraînement personnalisés, 
            suivez votre progression et atteignez vos objectifs avec notre plateforme complète.
          </p>
        </div>
        
        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>📊</div>
            <div style={styles.featureContent}>
              <h3 style={styles.featureTitle}>Suivi avancé</h3>
              <p style={styles.featureDescription}>Analysez vos performances en temps réel</p>
            </div>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🎯</div>
            <div style={styles.featureContent}>
              <h3 style={styles.featureTitle}>Objectifs personnalisés</h3>
              <p style={styles.featureDescription}>Programmes adaptés à vos besoins</p>
            </div>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🏆</div>
            <div style={styles.featureContent}>
              <h3 style={styles.featureTitle}>Accompagnement pro</h3>
              <p style={styles.featureDescription}>Coaching par des experts certifiés</p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.loginContainer}>
          <div style={styles.header}>
            <h2 style={styles.title}>Connexion</h2>
            <p style={styles.subtitle}>Accédez à votre espace personnel</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Adresse email</label>
              <input
                name="email"
                type="email"
                placeholder="nom@exemple.com"
                onChange={handleChange}
                value={form.email}
                required
                style={styles.input}
              />
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

            {error && (
              <div style={styles.error}>
                {error}
              </div>
            )}

            <div style={styles.options}>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" style={styles.checkbox} />
                <span style={styles.checkboxText}>Se souvenir de moi</span>
              </label>
              <Link to="/forgot-password" style={styles.link}>
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Connexion..." : "Se connecter"}
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

          <div style={styles.register}>
            <p style={styles.registerText}>
              Pas encore de compte ?{" "}
              <Link to="/register" style={styles.registerLink}>
                Créer un compte gratuitement
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
  
  loginContainer: {
    width: "100%",
    maxWidth: "400px"
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
  inputFocused: {
    borderColor: "#6366f1",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)"
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
  
  options: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px"
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer"
  },
  checkbox: {
    accentColor: "#6366f1"
  },
  checkboxText: {
    color: "#a1a1a1"
  },
  link: {
    color: "#6366f1",
    textDecoration: "none",
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
  
  register: {
    textAlign: "center",
    marginTop: "32px",
    paddingTop: "32px",
    borderTop: "1px solid #404040"
  },
  registerText: {
    fontSize: "14px",
    color: "#a1a1a1",
    margin: 0
  },
  registerLink: {
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
      
      .login-container {
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
      
      .social-button {
        font-size: 14px !important;
      }
      
      .register {
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
    .link:hover {
      text-decoration: underline !important;
    }
    
    .button:hover {
      background-color: #4f46e5 !important;
    }
    
    .social-button:hover {
      background-color: #404040 !important;
      border-color: #555555 !important;
    }
    
    .register-link:hover {
      text-decoration: underline !important;
    }
    
    /* Input focus styles */
    input:focus {
      border-color: #6366f1 !important;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
    }
  `;
  document.head.appendChild(style);
}