import React, { useEffect, useState } from "react";
import { getInventory, updateStock } from "../../api/inventoryApi";

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

const categoriasBar = [
  "Gaseosas",
  "Jugos",
  "Frutas y frutas congeladas",
  "Postres",
  "Tizanas",
  "Finest Call",
  "Leches líquidas y en polvo",
  "Whisky",
  "Ron",
  "Vodka",
  "Tequila",
  "Gin",
  "Otros licores",
  "Vinos Tintos",
  "Vinos Blancos",
  "Cervezas",
  "Productos Variados",
  "Plásticos",
  "Limpieza",
];

function InventariosAdmin() {
  const [tipoInventario, setTipoInventario] = useState("Cocina");
  const [datos, setDatos] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [productosActualizados, setProductosActualizados] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  const itemsPerPage = 10;

  // Cargar inventario enviando la categoría al backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tipoEnum = tipoInventario === "Bar" ? 0 : 1;
        
        // --- CAMBIO: Enviamos categoriaSeleccionada al API ---
        const data = await getInventory(tipoEnum, page, itemsPerPage, categoriaSeleccionada);

        const inventarioReal = data.inventory.map((item) => ({
          code: item.code,
          product: item.product,
          category: item.category,
          measurementUnit: item.measurementUnit,
          currentStock: item.currentStock ?? 0,
          stockMinimo: item.minimumStock ?? 0,
          saved: false,
        }));

        setDatos(inventarioReal);
        setOriginalData(inventarioReal.map((i) => ({ ...i })));
        setTotalPages(Math.ceil((data.productCount || 1) / itemsPerPage));
      } catch (error) {
        console.error("Error al cargar inventario", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tipoInventario, page, categoriaSeleccionada]); // Se dispara al cambiar la categoría

  // Al cambiar de Cocina a Bar o viceversa, limpiamos categoría y volvemos a pág 1
  const cambiarTipoInventario = (tipo) => {
    setTipoInventario(tipo);
    setCategoriaSeleccionada("");
    setPage(1);
  };

  const handleStockChange = (codigo, nuevoValor) => {
    if (!/^\d*\.?\d*$/.test(nuevoValor)) return;

    setDatos((prev) =>
      prev.map((item) => {
        if (item.code === codigo) {
          const original = originalData.find((o) => o.code === codigo);
          const nuevoNum = parseFloat(nuevoValor || 0);
          const originalNum = parseFloat(original?.currentStock || 0);
          return {
            ...item,
            currentStock: nuevoValor,
            saved: nuevoNum === originalNum,
          };
        }
        return item;
      })
    );
  };

  const handleSave = async (productName, currentStock) => {
    try {
      const nuevoStock = parseFloat(currentStock);
      if (isNaN(nuevoStock)) return alert("Número inválido.");

      const tipoEnum = tipoInventario === "Bar" ? 0 : 1;
      await updateStock(productName, nuevoStock, tipoEnum);

      setProductosActualizados((prev) => [...prev, productName]);
      setDatos((prev) =>
        prev.map((item) =>
          item.product === productName
            ? { ...item, currentStock: currentStock, saved: true }
            : item
        )
      );
    } catch {
      alert("Error al guardar cambios");
    }
  };

  const listaCategorias = tipoInventario === "Cocina" ? categoriasCocina : categoriasBar;

  return (
    <div style={styles.container} className="blur-in">
      <h2 style={styles.title}>Inventario de {tipoInventario}</h2>

      <div style={styles.selectorContainer}>
        <button
          onClick={() => cambiarTipoInventario("Cocina")}
          style={{
            ...styles.selectorBtn,
            backgroundColor: tipoInventario === "Cocina" ? "#8b0101ff" : "#bbb",
          }}
        >
          Cocina
        </button>
        <button
          onClick={() => cambiarTipoInventario("Bar")}
          style={{
            ...styles.selectorBtn,
            backgroundColor: tipoInventario === "Bar" ? "#8b0101ff" : "#bbb",
          }}
        >
          Bar
        </button>
      </div>

      <div style={styles.filterContainer}>
        <label style={styles.filterLabel}>Filtrar por categoría: </label>
        <select
          value={categoriaSeleccionada}
          onChange={(e) => {
            setCategoriaSeleccionada(e.target.value);
            setPage(1); // Resetear a página 1 al filtrar
          }}
          style={styles.selectFilter}
        >
          <option value="">-- Ver Todo --</option>
          {listaCategorias.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Cargando inventario...</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Código</th>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Categoría</th>
                <th style={styles.th}>Unidad</th>
                <th style={styles.th}>Stock Actual</th>
                <th style={styles.th}>Stock Mínimo</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datos.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: "20px", color: "#666" }}>
                    No hay productos disponibles.
                  </td>
                </tr>
              ) : (
                datos.map((item) => (
                  <tr key={item.code} style={parseFloat(item.currentStock) <= parseFloat(item.stockMinimo) ? {backgroundColor: "#ffcccc"} : {}}>
                    <td style={styles.td}>{item.code}</td>
                    <td style={styles.td}>{item.product}</td>
                    <td style={styles.td}>{item.category}</td>
                    <td style={styles.td}>{item.measurementUnit || "-"}</td>
                    <td style={styles.td}>
                      <input
                        type="number"
                        min="0"
                        value={item.currentStock}
                        onChange={(e) => handleStockChange(item.code, e.target.value)}
                        style={styles.input}
                      />
                    </td>
                    <td style={styles.td}>{item.stockMinimo}</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleSave(item.product, item.currentStock)}
                        style={{
                          ...styles.saveBtn,
                          backgroundColor: (item.saved || parseFloat(item.currentStock) === parseFloat(originalData.find(o => o.code === item.code)?.currentStock)) ? "#9e9e9e" : "#2e7d32",
                          cursor: (item.saved) ? "not-allowed" : "pointer",
                        }}
                        disabled={item.saved}
                      >
                        {item.saved ? "Guardado" : "Guardar"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Botones de Paginación */}
      <div style={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          style={styles.pageBtn}
        >
          Anterior
        </button>
        <span style={styles.pageText}>Página {page} de {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          style={styles.pageBtn}
        >
          Siguiente
        </button>
      </div>

      <div style={{ marginTop: "25px" }}>
        <button style={styles.pageBtn} onClick={() => setMostrarModal(true)}>
          Ver productos actualizados
        </button>
      </div>

      {mostrarModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Productos actualizados</h3>
            {productosActualizados.length === 0 ? (
              <p>No se han actualizado productos.</p>
            ) : (
              <ul style={{ textAlign: "left" }}>
                {productosActualizados.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            )}
            <button style={styles.pageBtn} onClick={() => setMostrarModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Estilos
const styles = {
  container: { padding: "20px", textAlign: "center" },
  title: { fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "#333" },
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
  // Estilos para el filtro
  filterContainer: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  filterLabel: {
    fontWeight: "bold",
    color: "#444",
  },
  selectFilter: {
    padding: "8px 12px",
    borderRadius: "5px",
    border: "1px solid #aaa",
    fontSize: "15px",
    cursor: "pointer",
    outline: "none",
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
  tableHeader: { backgroundColor: "#2563eb", color: "white" },
  th: { padding: "12px", border: "1px solid #ddd" },
  td: { padding: "10px", border: "1px solid #ddd" },
  input: {
    width: "70px",
    padding: "5px",
    borderRadius: "5px",
    border: "1px solid #aaa",
    textAlign: "center",
  },
  saveBtn: {
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    transition: "all 0.25s ease",
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
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    padding: "25px 30px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
};

export default InventariosAdmin;