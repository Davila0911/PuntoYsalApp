import React, { useState, useEffect } from "react";
import InventariosAdmin from "./InventariosAdmin";
import { logout } from "../../api/authApi";
import RegistrosAdmin from "./RegistrosAdmin";
import ListaCompras from "./ListaCompras";

function DashboardAdmin() {
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState("menu"); 
  const [showToast, setShowToast] = useState(false); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));

      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 6000); 

      return () => clearTimeout(timer); 
    }
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  if (!usuario)
    return <p style={{ textAlign: "center" }}>Cargando datos del usuario...</p>;

  return (
    <div style={styles.wrapper}>
      
     {/* Toast */}
{showToast && (
  <div style={styles.toast} className="fade-in-toast">
    <div style={styles.toastContent}>
      <div>
        <strong style={{ display: "block", marginBottom: "4px" }}>Aviso de Sesión</strong>
        <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: "1.4" }}>
          Recuerda que dispones de 1 hora antes que tu sesión expire, una vez expirada, tendrás que volver a iniciar sesión.
        </p>
      </div>
      <button 
        onClick={() => setShowToast(false)} 
        style={styles.toastClose}
      >
        ✕
      </button>
    </div>
    <div style={styles.toastProgress}></div> 
  </div>
)}


      <div style={styles.panel} className="fade-up">
        {vista === "menu" && (
          <>
            <h1 style={styles.title}>Bienvenid@, {usuario.name}</h1>
            <p style={styles.role}>Rol: Administrador</p>

            <div style={styles.grid}>
              <button
                style={{
                  ...styles.button,
                  ...styles.fade1,
                  animation: "fadeUp 0.5s ease-out forwards",
                  animationDelay: "0.2s",
                  opacity: 0,
                }}
                onClick={() => setVista("inventarios")}
              >
                Inventarios
              </button>

              <button
                style={{
                  ...styles.button,
                  ...styles.fade2,
                  animation: "fadeUp 0.5s ease-out forwards",
                  animationDelay: "0.5s",
                  opacity: 0,
                }}
                onClick={() => setVista("registros")}
              >
                Registros
              </button>

              <button
                style={{
                  ...styles.button,
                  ...styles.fade3,
                  animation: "fadeUp 0.5s ease-out forwards",
                  animationDelay: "0.8s",
                  opacity: 0,
                }}
                onClick={() => setVista("compras")}
              >
                Lista de Compras
              </button>

              <button
                style={{
                  ...styles.button,
                  ...styles.red,
                  animation: "fadeUp 0.5s ease-out forwards",
                  animationDelay: "1.1s",
                  opacity: 0,
                }}
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </div>
          </>
        )}

        {vista === "inventarios" && (
          <>
            <button
              style={{
                ...styles.back,
                animation: "fadeUp 0.5s ease-out forwards",
                animationDelay: "0.2s",
                opacity: 0,
              }}
              onClick={() => setVista("menu")}
            >
              Volver al Menú
            </button>
            <InventariosAdmin />
          </>
        )}

        {vista === "registros" && (
          <>
            <button
              style={{
                ...styles.back,
                animation: "fadeUp 0.5s ease-out forwards",
                animationDelay: "0.2s",
                opacity: 0,
              }}
              onClick={() => setVista("menu")}
            >
              Volver al Menú
            </button>
            <RegistrosAdmin />
          </>
        )}

        {vista === "compras" && (
          <>
            <button
              style={{
                ...styles.back,
                animation: "fadeUp 0.5s ease-out forwards",
                animationDelay: "0.2s",
                opacity: 0,
              }}
              onClick={() => setVista("menu")}
            >
              Volver al Menú
            </button>
            <ListaCompras />
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #000000ff, #7c7c7eff, #d8d6d6ff)",
    backgroundSize: "200% 200%",
    animation: "gradientShift 8s ease infinite",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    padding: "40px 20px",
    position: "relative", 
  },

  panel: {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.25)",
    width: "95%",
    maxWidth: "600px",
    padding: "50px 40px",
    textAlign: "center",
    position: "relative",
    zIndex: 2,
  },

  title: {
    color: "#000",
    fontSize: "2rem",
    fontWeight: "600",
    marginBottom: "10px",
  },

  role: {
    color: "#666",
    fontSize: "1rem",
    marginBottom: "35px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    justifyItems: "center",
  },

  button: {
    width: "100%",
    padding: "14px 0",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  fade1: { background: "linear-gradient(135deg, #000000, #2e2e2e, #8c8c8c)" },
  fade2: { background: "linear-gradient(135deg, #8c8c8c, #2e2e2e, #000000)" },
  fade3: { background: "linear-gradient(135deg, #000000, #2e2e2e, #8c8c8c)" },
  red:   { backgroundColor: "#e53935" },

  back: {
    backgroundColor: "#8b0101ff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 18px",
    marginBottom: "20px",
    cursor: "pointer",
    fontWeight: "500",
  },

  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    backgroundColor: "rgba(30, 30, 30, 0.95)", 
    color: "white",
    padding: "0", 
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    zIndex: 9999,
    maxWidth: "350px",
    overflow: "hidden",
    borderLeft: "5px solid #e53935", 
  },
  toastContent: {
    display: "flex",
    alignItems: "flex-start",
    padding: "15px 20px",
    gap: "10px",
  },
  toastClose: {
    background: "transparent",
    border: "none",
    color: "#aaa",
    fontSize: "1.2rem",
    cursor: "pointer",
    marginLeft: "auto",
    padding: "0",
    lineHeight: "1",
  },
  toastProgress: {
    height: "3px",
    backgroundColor: "#e53935",
    width: "100%",
    animation: "progressShrink 6s linear forwards", 
  },

  "@keyframes gradientShift": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
};

if (typeof document !== "undefined" && document.styleSheets.length > 0) {
  const sheet = document.styleSheets[0];
  const fadeUp = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(25px); }
    to { opacity: 1; transform: translateY(0); }
  }`;
  

  const fadeInToast = `
  @keyframes fadeInToast {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in-toast { animation: fadeInToast 0.4s ease-out forwards; }
  `;

  const progressShrink = `
  @keyframes progressShrink {
    from { width: 100%; }
    to { width: 0%; }
  }`;

  try {
      sheet.insertRule(fadeUp, sheet.cssRules.length);
      sheet.insertRule(fadeInToast, sheet.cssRules.length);
      sheet.insertRule(progressShrink, sheet.cssRules.length);
  } catch (e) {
      // Ignorar si ya existen
  }
}

export default DashboardAdmin;