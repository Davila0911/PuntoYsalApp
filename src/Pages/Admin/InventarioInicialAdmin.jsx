import React, { useEffect, useState } from "react";
// 📝 COMMENTED FOR LATER GIT PUSH: import { modifyAdminInitialCount } from "../../api/AdminApi";
import { getAdminInventory, saveAdminInitial } from "../../api/AdminApi";

const categoriasCocina = [
  "Verduras y frutas",
  "Lácteos",
  "Carnes & Embutidos",
  "Aceite & Grasa",
  "Salsas & Aderezos",
  "Subproductos (prep)",
  "Panes y harinas",
  "Condimentos",
  "Limpieza & Otros",
];

const categoriasBar = [
  "Gaseosas", "Jugos", "Frutas y frutas congeladas", "Postres", "Tizanas",
  "Finest Call", "Leches líquidas y en polvo", "Whisky", "Ron", "Vodka",
  "Tequila", "Gin", "Otros licores", "Vinos Tintos", "Vinos Blancos",
  "Cervezas", "Productos Variados", "Plásticos", "Limpieza",
];

function InventarioInicialAdmin({ tipoInventario }) {
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [conteos, setConteos] = useState({});
  const [guardado, setGuardado] = useState({});
  //  COMMENTED FOR LATER GIT PUSH:
  // const [esModificacion, setEsModificacion] = useState({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  const itemsPerPage = 10;
  const categorias = tipoInventario === "Bar" ? categoriasBar : categoriasCocina;

  useEffect(() => {
    const fetchInventario = async () => {
      try {
        setLoading(true);
        const data = await getAdminInventory(tipoInventario, page, itemsPerPage, categoriaSeleccionada);
        setProductos(data.inventory || []);
        setTotalPages(Math.ceil((data.productCount || 1) / itemsPerPage));
      } finally {
        setLoading(false);
      }
    };
    fetchInventario();
  }, [tipoInventario, page, categoriaSeleccionada]);

  const handleGuardar = async (codigo, valor) => {
    const value = parseFloat(valor);
    if (valor === "" || isNaN(value) || value < 0) {
      alert("Por favor ingrese un valor válido.");
      return;
    }
    try {
      /*  COMMENTED FOR LATER GIT PUSH:
      if (esModificacion[codigo]) {
        await modifyAdminInitialCount(codigo, value, tipoInventario);
      } else {
        await saveAdminInitial(codigo, value, tipoInventario);
      }
      setEsModificacion((prev) => ({ ...prev, [codigo]: false }));
      */

      // Baseline saving logic:
      await saveAdminInitial(codigo, value, tipoInventario);
      
      setGuardado((prev) => ({ ...prev, [codigo]: true }));
    } catch (err) {
      alert(err.message || "No se pudo guardar el conteo inicial.");
    }
  };

  /*  COMMENTED FOR LATER GIT PUSH:
  const handleModificarClick = (codigo) => {
    setGuardado((prev) => ({ ...prev, [codigo]: false }));
    setEsModificacion((prev) => ({ ...prev, [codigo]: true }));
  };
  */

  const handleInputChange = (codigo, valor) => {
    if (/^\d*\.?\d*$/.test(valor)) {
      setConteos((prev) => ({ ...prev, [codigo]: valor }));
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Inventario Inicial - {tipoInventario}</h2>

      <div style={styles.filterContainer}>
        <label style={styles.filterLabel}>Categoría: </label>
        <select
          value={categoriaSeleccionada}
          onChange={(e) => { setCategoriaSeleccionada(e.target.value); setPage(1); }}
          style={styles.selectFilter}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={styles.loading}>Cargando productos...</p>
      ) : (
        <>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.headerRow}>
                  <th style={styles.th}>Código</th>
                  <th style={styles.th}>Producto</th>
                  <th style={styles.th}>Categoría</th>
                  <th style={styles.th}>Unidad</th>
                  <th style={styles.th}>Conteo Inicial</th>
                  <th style={styles.th}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {productos.length > 0 ? (
                  productos.map((item) => (
                    <tr key={item.code}>
                      <td style={styles.td}>{item.code}</td>
                      <td style={styles.td}>{item.product}</td>
                      <td style={styles.td}>{item.category}</td>
                      <td style={styles.td}>{item.measurementUnit}</td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={conteos[item.code] ?? ""}
                          onChange={(e) => handleInputChange(item.code, e.target.value)}
                          style={styles.input}
                          placeholder="0"
                          disabled={guardado[item.code]} 
                        />
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                          <button
                            style={{
                              ...styles.btnGuardar,
                              backgroundColor: guardado[item.code] ? "#c62828" : "#2e7d32",
                              cursor: guardado[item.code] ? "not-allowed" : "pointer"
                            }}
                            onClick={() => handleGuardar(item.code, conteos[item.code] || 0)}
                            disabled={guardado[item.code]}
                          >
                            {guardado[item.code] ? "Guardado" : "Guardar"}
                          </button>

                          {/*COMMENTED FOR LATER GIT PUSH:
                          {guardado[item.code] && (
                            <button
                              style={styles.btnModificar}
                              onClick={() => handleModificarClick(item.code)}
                            >
                              Modificar
                            </button>
                          )}
                          */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={styles.emptyRow}>No hay productos en esta categoría.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={styles.pagination}>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              style={{ ...styles.btnPage, opacity: page === 1 ? 0.5 : 1 }}
            >
              Anterior
            </button>
            <span style={styles.pageText}>Página {page} de {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              style={{ ...styles.btnPage, opacity: page === totalPages ? 0.5 : 1 }}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "20px", maxWidth: "100%", boxSizing: "border-box" },
  title: { fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "#333", marginBottom: "10px" },
  filterContainer: { marginBottom: "20px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", flexWrap: "wrap" },
  filterLabel: { fontWeight: "600", color: "#444", fontSize: "14px" },
  selectFilter: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", outline: "none", cursor: "pointer", backgroundColor: "#fff" },
  loading: { fontSize: "16px", color: "#555" },
  tableWrapper: { overflowX: "auto", marginTop: "10px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "700px" },
  headerRow: { backgroundColor: "#1976d2", color: "white" },
  th: { padding: "10px", border: "1px solid #ddd", fontSize: "14px" },
  td: { padding: "8px", border: "1px solid #ddd", fontSize: "14px" },
  emptyRow: { padding: "12px", textAlign: "center", color: "#555" },
  input: { width: "80px", padding: "5px", textAlign: "center", borderRadius: "5px", border: "1px solid #aaa" },
  btnGuardar: { color: "white", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "14px", transition: "background 0.3s ease" },
  // 📝 COMMENTED FOR LATER GIT PUSH:
  // btnModificar: { color: "white", backgroundColor: "#1565c0", border: "none", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", fontSize: "14px", transition: "background 0.3s ease" },
  pagination: { marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "10px" },
  btnPage: { backgroundColor: "#8b0101ff", color: "white", border: "none", borderRadius: "5px", padding: "8px 15px", fontSize: "14px", cursor: "pointer" },
  pageText: { color: "#333", fontSize: "14px" },
};

export default InventarioInicialAdmin;