import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(name, password);
      navigate("/dashboard");
      window.location.reload();
    } catch {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container} className="fade-up">
        <h1 style={styles.title}>Punto Y Sal</h1>
        <p style={styles.subtitle}>Inicia sesión para continuar</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Usuario"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          {/* === Campo de contraseña con botón Mostrar === */}
          <div style={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.showButton}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <button type="submit" style={styles.button}>
            Iniciar Sesión
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>

        <p style={styles.footer}>© {new Date().getFullYear()} Punto y Sal • Sistema de Inventario</p>
      </div>
    </div>
  );
}

const styles = {
  // Fondo con gradiente profesional
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #000000ff, #7c7c7eff, #d8d6d6ff)",
    backgroundSize: "200% 200%",
    animation: "gradientShift 8s ease infinite",
  },

  // Caja principal estilo glass
  container: {
    width: "90%",
    maxWidth: "380px",
    padding: "40px 30px",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    color: "white",
  },

  title: {
    fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
    marginBottom: "10px",
    fontWeight: "600",
    letterSpacing: "1px",
  },

  subtitle: {
    fontSize: "clamp(0.9rem, 2vw, 1rem)",
    marginBottom: "25px",
    opacity: 0.85,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },

input: {
  width: "100%",
  padding: "12px 15px",
  borderRadius: "8px",
  border: "none",
  outline: "none",
  fontSize: "1rem",
  backgroundColor: "rgba(255, 255, 255, 0.85)",
  color: "#333",
  boxSizing: "border-box", //cajas parejas
},

passwordContainer: {
  position: "relative",
  width: "100%",
},

showButton: {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "transparent",
  border: "none",
  color: "#333",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "0.9rem",
  height: "100%", 
  display: "flex",
  alignItems: "center",
  paddingRight: "8px", 
},

  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#8b0101ff",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  error: {
    color: "#ffbaba",
    background: "rgba(255, 0, 0, 0.1)",
    borderRadius: "5px",
    padding: "8px",
    marginTop: "10px",
    fontSize: "0.9rem",
  },

  footer: {
    marginTop: "25px",
    fontSize: "0.85rem",
    opacity: 0.8,
  },

  "@keyframes gradientShift": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
};

export default Login;
