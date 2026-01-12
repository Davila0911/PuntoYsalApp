import React, { useEffect, useState } from "react";
import { getCocinaInventory, registerCocinaMovement } from "../../api/CocinaApi";

function Movimientos() {
  const [productos, setProductos] = useState([]);
  const [movimientos, setMovimientos] = useState([
    { producto: "", productoNombre: "", tipo: "0", cantidad: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchInventario = async (pagina = 1) => {
    try {
      setLoading(true);
      const data = await getCocinaInventory(pagina, itemsPerPage);
      setProductos(data.inventory || []);
      setTotalPages(Math.ceil((data.productCount || 1) / itemsPerPage));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventario();
  }, []);

  const handleAbrirModal = (index) => {
    setProductoSeleccionado(index);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setProductoSeleccionado(null);
  };

  const handleSeleccionarProducto = (producto) => {
    const nuevos = [...movimientos];
    nuevos[productoSeleccionado].producto = producto.code;
    nuevos[productoSeleccionado].productoNombre = producto.product;
    setMovimientos(nuevos);
    handleCerrarModal();
  };

  const handleChange = (index, campo, valor) => {
    const nuevos = [...movimientos];

    if (campo === "cantidad") {
      valor = valor
        .replace(",", ".")
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*)\./g, "$1");
    }

    nuevos[index][campo] = valor;
    setMovimientos(nuevos);
  };

  const agregarMovimiento = () => {
    setMovimientos(prev => [
      ...prev,
      { producto: "", productoNombre: "", tipo: "0", cantidad: "" }
    ]);
  };

  const eliminarMovimiento = (index) => {
    setMovimientos(prev => prev.filter((_, i) => i !== index));
  };

  const handleGuardar = async () => {
     for (const mov of movimientos) {
    if (!mov.producto || mov.cantidad === "" || isNaN(mov.cantidad)) {
      alert("Debes llenar todos los campos correctamente antes de guardar.");
      return;
    }

    const payload = {
      productCode: mov.producto,
      movementType: parseInt(mov.tipo),
      movementCount: parseFloat(mov.cantidad),
    };

    try {
      await registerCocinaMovement(payload);
    } catch {
      alert(`Error al registrar movimiento de ${mov.productoNombre}`);
      return;
    }
  }

  alert("Movimientos registrados correctamente.");
  setMovimientos([{ producto: "", productoNombre: "", tipo: "0", cantidad: "" }]);
  window.location.reload();
};

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchInventario(newPage);
  };

  //Render
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Registro de Movimientos - Cocina</h2>

      {movimientos.map((mov, index) => (
        <div key={index} style={styles.row}>
          {/* Producto */}
          <button
            style={styles.selectButton}
            onClick={() => handleAbrirModal(index)}
          >
            {mov.productoNombre || "Seleccionar producto"}
          </button>

          {/* Tipo */}
          <select
            style={styles.select}
            value={mov.tipo}
            onChange={(e) => handleChange(index, "tipo", e.target.value)}
          >
            <option value="0">Entrada</option>
            <option value="1">Cortesía</option>
            <option value="2">Dañado</option>
            <option value="3">Desperdicio</option>
          </select>

          {/* Cantidad */}
          <input
            type="text"
            style={styles.input}
            placeholder="Cantidad"
            value={mov.cantidad}
            onChange={(e) => handleChange(index, "cantidad", e.target.value)}
          />

          {/* Eliminar */}
          {movimientos.length > 1 && (
            <button style={styles.deleteButton} onClick={() => eliminarMovimiento(index)}>
              Eliminar
            </button>
          )}
        </div>
      ))}

      {/* Botones generales */}
      <div style={styles.buttonsContainer}>
        <button style={styles.addButton} onClick={agregarMovimiento}>
          Agregar Movimiento
        </button>
        <button style={styles.saveButton} onClick={handleGuardar}>
          Guardar Todo
        </button>
      </div>

      {/*Modal de productos*/}
      {mostrarModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Seleccionar producto</h3>

            {loading ? (
              <p>Cargando productos...</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={styles.th}>Código</th>
                      <th style={styles.th}>Producto</th>
                      <th style={styles.th}>Categoría</th>
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
                          <button
                            style={styles.selectBtn}
                            onClick={() => handleSeleccionarProducto(p)}
                          >
                            Seleccionar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Paginación */}
            <div style={styles.pagination}>
              <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                style={styles.pageBtn}
              >
                Anterior
              </button>
              <span style={styles.pageText}>
                Página {page} de {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
                style={styles.pageBtn}
              >
                Siguiente
              </button>
            </div>

            <button style={styles.closeBtn} onClick={handleCerrarModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: "20px" },
  title: { fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "#333", marginBottom: "15px" },
  row: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  selectButton: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
    minWidth: "160px",
  },
  select: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minWidth: "140px",
  },
  input: {
    padding: "8px",
    width: "90px",
    textAlign: "center",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  deleteButton: {
    backgroundColor: "#e53935",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 12px",
    cursor: "pointer",
  },
  buttonsContainer: {
    marginTop: "25px",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  addButton: {
    backgroundColor: "#0288d1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 15px",
    cursor: "pointer",
  },
  saveButton: {
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 15px",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    padding: "25px 30px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "700px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
  tableWrapper: { maxHeight: "300px", overflowY: "auto", marginTop: "10px" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" },
  tableHeader: { backgroundColor: "#1976d2", color: "white" },
  th: { padding: "8px", border: "1px solid #ddd" },
  td: { padding: "8px", border: "1px solid #ddd" },
  selectBtn: {
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    cursor: "pointer",
  },
  pagination: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  pageBtn: {
    backgroundColor: "#8b0101ff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "6px 12px",
    cursor: "pointer",
  },
  pageText: { color: "#333", fontSize: "0.95rem" },
  closeBtn: {
    marginTop: "15px",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 12px",
    cursor: "pointer",
  },
};

export default Movimientos;
