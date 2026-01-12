import React, { useEffect, useState } from "react";
import { getBarInventory, saveBarInitial } from "../../api/BarApi";

function InventarioInicialBar() {
 const [productos, setProductos] = useState([]);
  const [conteos, setConteos] = useState({});
  const [guardado, setGuardado] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  // Cargar inventario del Bar
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getBarInventory(page, itemsPerPage);
        setProductos(data.inventory || []);
        setTotalPages(Math.ceil((data.productCount || 1) / itemsPerPage));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  // Guardar conteo inicial
  const handleGuardar = async (codigo, count) => {
    if (count === "" || count === undefined) {
      alert("Ingrese un valor antes de guardar.");
      return;
    }

    const value = Number(count);
    if (!Number.isFinite(value) || value < 0) {
      alert("Por favor ingrese un número válido.");
      return;
    }

    try {
      await saveBarInitial(codigo, value);
      setGuardado((prev) => ({ ...prev, [codigo]: true }));

    } catch {
      alert("Error al guardar conteo inicial.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Inventario Inicial - Bar</h2>

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
                  <th style={styles.th}>Inventario Inicial</th>
                  <th style={styles.th}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.code}>
                    <td style={styles.td}>{p.code}</td>
                    <td style={styles.td}>{p.product}</td>
                    <td style={styles.td}>{p.category}</td>
                    <td style={styles.td}>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={conteos[p.code] ?? ""}
                        onChange={(e) =>
                          setConteos((prev) => ({ ...prev, [p.code]: e.target.value }))
                        }
                        style={styles.input}
                        placeholder="0"
                      />
                    </td>
                    <td style={styles.td}>
                      <button
                        style={{
                          ...styles.button,
                          backgroundColor: guardado[p.code] ? "#c62828" : "#2e7d32",
                        }}
                        onClick={() => handleGuardar(p.code, conteos[p.code] || 0)}
                      >
                        {guardado[p.code] ? "Guardado" : "Guardar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div style={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
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
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              style={{
                ...styles.btnPage,
                opacity: page === totalPages ? 0.5 : 1,
                cursor: page === totalPages ? "default" : "pointer",
              }}
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
  container: {
    textAlign: "center",
    padding: "20px",
    maxWidth: "100%",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "clamp(1.4rem, 4vw, 2rem)",
    color: "#333",
  },
  loading: {
    fontSize: "16px",
    color: "#555",
  },
  tableWrapper: {
    overflowX: "auto",
    marginTop: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px",
  },
  headerRow: {
    backgroundColor: "#1976d2",
    color: "white",
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
  input: {
    width: "80px",
    padding: "5px",
    textAlign: "center",
    borderRadius: "5px",
    border: "1px solid #aaa",
  },
  button: {
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
    borderRadius: "6px",
    padding: "8px 15px",
    fontSize: "14px",
  },
  pageText: {
    color: "#333",
    fontSize: "14px",
  },
};

export default InventarioInicialBar;
