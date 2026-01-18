import React, { useEffect, useState } from "react";
import { getCocinaInventory, saveCocinaInitial } from "../../api/CocinaApi";

// Categorias
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

function InventarioInicial() {
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [conteos, setConteos] = useState({});
  const [guardado, setGuardado] = useState({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(""); 

  const itemsPerPage = 10;

  // Cargar inventario de cocina con filtro
  useEffect(() => {
    const fetchInventario = async () => {
      try {
        setLoading(true);
        const data = await getCocinaInventory(page, itemsPerPage, categoriaSeleccionada);
        setProductos(data.inventory || []);
        setTotalPages(Math.ceil((data.productCount || 1) / itemsPerPage));
      } finally {
        setLoading(false);
      }
    };
    fetchInventario();
  }, [page, categoriaSeleccionada]);

  const handleGuardar = async (codigo, valor) => {
    const value = parseFloat(valor);
    if (valor === "" || isNaN(value) || value < 0) {
      alert("Por favor ingrese un valor válido.");
      return;
    }

    try {
      await saveCocinaInitial(codigo, value);
      alert(`Inventario inicial guardado para ${codigo}`);
      setGuardado((prev) => ({ ...prev, [codigo]: true }));
    } catch {
      alert("No se pudo guardar el conteo inicial.");
    }
  };

  const handleInputChange = (codigo, valor) => {
    if (/^\d*\.?\d*$/.test(valor)) {
      setConteos((prev) => ({ ...prev, [codigo]: valor }));
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Inventario Inicial - Cocina</h2>

      {/* === Selector de Categoría === */}
      <div style={styles.filterContainer}>
        <label style={styles.filterLabel}>Categoría: </label>
        <select
          value={categoriaSeleccionada}
          onChange={(e) => {
            setCategoriaSeleccionada(e.target.value);
            setPage(1); 
          }}
          style={styles.selectFilter}
        >
          <option value=""> Todas las categorías </option>
          {categoriasCocina.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={styles.loading}>Cargando productos...</p>
      ) : (
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
                      />
                    </td>
                    <td style={styles.td}>
                      <button
                        style={{
                          ...styles.btnGuardar,
                          backgroundColor: guardado[item.code] ? "#c62828" : "#2e7d32",
                        }}
                        onClick={() => handleGuardar(item.code, conteos[item.code] || 0)}
                      >
                        {guardado[item.code] ? "Guardado" : "Guardar"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={styles.emptyRow}>
                    No hay productos en esta categoría.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      <div style={styles.pagination}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          style={{
            ...styles.btnPage,
            opacity: page === 1 ? 0.5 : 1,
            cursor: page === 1 ? "default" : "pointer",
          }}
        >
          Anterior
        </button>
        <span style={styles.pageText}>
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          style={{
            ...styles.btnPage,
            opacity: page === totalPages ? 0.5 : 1,
            cursor: page === totalPages ? "default" : "pointer",
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
    maxWidth: "100%",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "clamp(1.4rem, 4vw, 2rem)",
    color: "#333",
    marginBottom: "10px",
  },

  filterContainer: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  filterLabel: {
    fontWeight: "600",
    color: "#444",
    fontSize: "14px",
  },
  selectFilter: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
    backgroundColor: "#fff",
  },
 
  loading: {
    fontSize: "16px",
    color: "#555",
  },
  tableWrapper: {
    overflowX: "auto",
    marginTop: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px",
  },

  th: {
    padding: "10px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  td: {
    padding: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  emptyRow: {
    padding: "12px",
    textAlign: "center",
    color: "#555",
  },
  input: {
    width: "80px",
    padding: "5px",
    textAlign: "center",
    borderRadius: "5px",
    border: "1px solid #aaa",
  },
  btnGuardar: {
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background 0.3s ease",
  },
  pagination: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  btnPage: {
    backgroundColor: "#8b0101ff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "8px 15px",
    fontSize: "14px",
  },
  pageText: {
    color: "#333",
    fontSize: "14px",
  },
};

export default InventarioInicial;
