import React, { useState, useEffect } from "react";
import InventarioInicial from "./InventarioInicial";
import InventarioFinal from "./InventarioFinal";
import Movimientos from "./MovimientosCocina";

function DashboardCocina() {
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState("menu"); // "menu" | "inicial" | "final" | "movimientos"

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUsuario(JSON.parse(storedUser));
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (!usuario) return <p>Cargando datos del usuario...</p>;

 return (
  <div style={styles.wrapper}>
    <div style={styles.panel} className="fade-up">
      {vista === "menu" && (
        <>
          <h1 style={styles.title}>Bienvenid@, {usuario.name}</h1>
          <p style={styles.role}>Rol: Cocina</p>

          <div style={styles.grid}>
            <button
              style={{ ...styles.button, ...styles.fade1 }}
              onClick={() => setVista("inicial")}
            >
              Inventario Inicial
            </button>
            <button
              style={{ ...styles.button, ...styles.fade2 }}
              onClick={() => setVista("final")}
            >
              Inventario Final
            </button>
            <button
              style={{ ...styles.button, ...styles.fade3 }}
              onClick={() => setVista("movimientos")}
            >
              Movimientos
            </button>
            <button
              style={{ ...styles.button, ...styles.red }}
              onClick={cerrarSesion}
            >
              Cerrar Sesión
            </button>
          </div>
        </>
      )}

      {vista === "inicial" && (
        <>
          <button style={styles.back} onClick={() => setVista("menu")}>
            Volver
          </button>
          <InventarioInicial />
        </>
      )}

      {vista === "final" && (
        <>
          <button style={styles.back} onClick={() => setVista("menu")}>
            Volver
          </button>
          <InventarioFinal />
        </>
      )}

      {vista === "movimientos" && (
        <>
          <button style={styles.back} onClick={() => setVista("menu")}>
            Volver
          </button>
          <Movimientos />
        </>
      )}
    </div>
  </div>
);
}

const styles = {
  /* === Fondo gradiente tipo login === */
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
  },

  /* === Panel blanco === */
  panel: {
    background: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.25)",
    width: "95%",
    maxWidth: "560px",
    padding: "45px 35px",
    textAlign: "center",
    position: "relative",
    zIndex: 2,
  },

  /* === Encabezado === */
  title: {
    color: "#000",
    fontSize: "1.9rem",
    fontWeight: "600",
    marginBottom: "10px",
  },

  role: {
    color: "#555",
    fontSize: "1rem",
    marginBottom: "30px",
  },

  /* === Botones === */
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
    transition: "background 0.2s ease",
  },

/* Colores */
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

  /* Animación del fondo */
  "@keyframes gradientShift": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
};

export default DashboardCocina;