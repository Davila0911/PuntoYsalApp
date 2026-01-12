import React, { useEffect, useState } from "react";
import { getLowStockProducts } from "../../api/ListadecomprasApi";

function ListaCompras() {
  const [tipoInventario, setTipoInventario] = useState("Cocina"); // Cocina o Bar
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 12;

  //  Cargar productos con bajo stock
  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        setLoading(true);
        const tipoEnum = tipoInventario === "Bar" ? 0 : 1;
        const data = await getLowStockProducts(tipoEnum);

        // Si el backend devuelve un array completo, lo paginamos manualmente
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageData = data.slice(start, end);

        setProductos(pageData);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (error) {
        console.error("Error al cargar productos con bajo stock:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock();
  }, [tipoInventario, page]);

 

return (
  <div style={styles.container} className="blur-in">
    <h2 style={styles.title}>Lista de Compras - {tipoInventario}</h2>

    {/* Selector de inventario */}
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

    {/* Tabla */}
    {loading ? (
      <p style={{ textAlign: "center" }}>Cargando productos...</p>
    ) : (
      <div style={styles.tableWrapper}>
        <p style={styles.counter}>
          Mostrando {productos.length} producto{productos.length !== 1 && "s"} con bajo stock
        </p>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Código</th>
              <th style={styles.th}>Producto</th>
              <th style={styles.th}>Categoría</th>
              <th style={styles.th}>Unidad</th>
              <th style={styles.th}>Stock Actual</th>
              <th style={styles.th}>Stock Mínimo</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.emptyRow}>
                  No hay productos con bajo stock
                </td>
              </tr>
            ) : (
              productos.map((item) => (
                <tr key={item.code}>
                  <td style={styles.td}>{item.code}</td>
                  <td style={styles.td}>{item.product}</td>
                  <td style={styles.td}>{item.category}</td>
                  <td style={styles.td}>{item.measurementUnit || "-"}</td>
                  <td
                    style={{
                      ...styles.td,
                      color: "#c62828", 
                      fontWeight: "bold",
                    }}
                  >
                    {item.currentStock}
                  </td>
                  <td style={styles.td}>{item.minimumStock}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    )}

    {/* Paginación */}
    <div style={styles.pagination}>
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
        style={styles.pageBtn}
      >
        Anterior
      </button>
      <span style={styles.pageText}>
        Página {page} de {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={() => setPage((p) => p + 1)}
        style={styles.pageBtn}
      >
        Siguiente
      </button>
    </div>
  </div>
  );
}


const styles = {
  container: { padding: "20px", textAlign: "center" },
  title: { fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "#333" },
  selectorContainer: {
    margin: "20px 0",
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
  tableWrapper: {
    overflowX: "auto",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px",
  },
  tableHeader: { backgroundColor: "#1976d2", color: "white" },
  th: { padding: "12px", border: "1px solid #ddd" },
  td: { padding: "10px", border: "1px solid #ddd" },
  emptyRow: {
    textAlign: "center",
    padding: "20px",
    color: "#555",
    fontStyle: "italic",
  },
  pagination: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  pageBtn: {
    padding: "10px 20px",
    backgroundColor: "#8b0101ff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },
  
  pageText: { fontSize: "16px", color: "#333" },
};

export default ListaCompras;
