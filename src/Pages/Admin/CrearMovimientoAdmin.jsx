import React, { useState } from "react";
import InventarioInicialAdmin from "./InventarioInicialAdmin";
import InventarioFinalAdmin from "./InventarioFinalAdmin";
import MovimientosAdmin from "./MovimientosAdmin";

function CrearMovimientoAdmin() {
  const [tipoInventario, setTipoInventario] = useState("Cocina");
  const [vista, setVista] = useState("menu");

  const tipoLabel = tipoInventario === "Cocina" ? "Cocina" : "Bar";

  const renderComponent = () => {
    switch (vista) {
      case "inicial":
        return <InventarioInicialAdmin tipoInventario={tipoInventario} />;
      case "final":
        return <InventarioFinalAdmin tipoInventario={tipoInventario} />;
      case "movimientos":
        return <MovimientosAdmin tipoInventario={tipoInventario} />;
      default:
        return null;
    }
  };

  return (
    <div style={styles.container} className="blur-in">
      {vista === "menu" && (
        <>
          <h2 style={styles.title}>Crear Registro</h2>

          <div style={styles.selectorContainer}>
            <button
              onClick={() => setTipoInventario("Cocina")}
              style={{
                ...styles.selectorBtn,
                backgroundColor: tipoInventario === "Cocina" ? "#8b0101ff" : "#bbb",
              }}
            >
              Cocina
            </button>
            <button
              onClick={() => setTipoInventario("Bar")}
              style={{
                ...styles.selectorBtn,
                backgroundColor: tipoInventario === "Bar" ? "#8b0101ff" : "#bbb",
              }}
            >
              Bar
            </button>
          </div>

          <p style={styles.subtitle}>
            Tipo de inventario seleccionado: <strong>{tipoLabel}</strong>
          </p>

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
          </div>
        </>
      )}

      {vista !== "menu" && (
        <>
          <button style={styles.back} onClick={() => setVista("menu")}>
            Volver
          </button>
          {renderComponent()}
        </>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "20px", textAlign: "center" },
  title: { fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "#333" },
  subtitle: { fontSize: "1rem", color: "#555", marginBottom: "20px" },
  selectorContainer: {
    margin: "20px 0 10px 0",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  selectorBtn: {
    padding: "10px 20px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
    transition: "all 0.25s ease",
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
    transition: "background 0.2s ease",
  },
  fade1: { background: "linear-gradient(135deg, #000000, #2e2e2e, #8c8c8c)" },
  fade2: { background: "linear-gradient(135deg, #8c8c8c, #2e2e2e, #000000)" },
  fade3: { background: "linear-gradient(135deg, #000000, #2e2e2e, #8c8c8c)" },
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
};

export default CrearMovimientoAdmin;
