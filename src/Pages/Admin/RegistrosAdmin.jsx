import React, { useState } from "react";
import { getUserRecords } from "../../api/recordsApi";

function RegistrosAdmin() {
  const [userName, setUserName] = useState("");
  const [fecha, setFecha] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  
  const [viewMode, setViewMode] = useState("empleado"); 
  const [adminInventoryType, setAdminInventoryType] = useState("Cocina"); 

  // Cargar registros del backend
  const fetchRecords = async (pagina = 1) => {
    if (!userName.trim() || !fecha) {
      alert("Debe ingresar el nombre del usuario y seleccionar una fecha.");
      return;
    }

    try {
      setLoading(true);

      const localDate = new Date(fecha + "T00:00"); 
      const isoDate = localDate.toISOString(); 

      
      const tipoParam = viewMode === "admin" ? adminInventoryType : null;

      const data = await getUserRecords(
        userName.trim(),
        isoDate,  
        pagina,
        itemsPerPage,
        tipoParam 
      );

      setRecords(data.userRecords || []);
      setTotalPages(Math.ceil((data.recordsCount || 1) / itemsPerPage));
      setPage(pagina);
    } catch (err) {
      console.error("Error al obtener registros:", err);
      alert(
        "No se pudieron obtener los registros. Verifique el nombre del usuario o la fecha."
      );
    } finally {
      setLoading(false);
    }
  };

  // Hover 
  const hoverEffect = (e, enter) => {
    if (enter) {
      e.target.style.transform = "scale(1.05)";
      e.target.style.boxShadow = "0px 6px 15px rgba(0,0,0,0.2)";
    } else {
      e.target.style.transform = "scale(1)";
      e.target.style.boxShadow = "0px 3px 6px rgba(0,0,0,0.1)";
    }
  };

  return (
    <div style={styles.container} className="blur-in">
      <h2 style={styles.title}>Registros de Usuario</h2>

     
      <div style={styles.modeToggleContainer}>
          <button
            onClick={() => {
              setViewMode("empleado");
              setUserName(""); // Clear selection to avoid cross-view bugs
            }}
            style={{
              ...styles.modeBtn,
              backgroundColor: viewMode === "empleado" ? "#8b0101ff" : "#ccc",
            }}
          >
            Empleados
          </button>
          <button
            onClick={() => {
              setViewMode("admin");
              setUserName(""); // Clear selection to avoid cross-view bugs
            }}
            style={{
              ...styles.modeBtn,
              backgroundColor: viewMode === "admin" ? "#1976d2" : "#ccc",
            }}
          >
            Mis Registros
          </button>
        </div>

      {viewMode === "admin" && (
        <div style={styles.adminSubContainer}>
          <span style={{ marginRight: "10px", fontWeight: "600", color: "#333" }}>
            Tipo Inventario:
          </span>
          <button
            onClick={() => setAdminInventoryType("Cocina")}
            style={{
              ...styles.subBtn,
              backgroundColor: adminInventoryType === "Cocina" ? "#1976d2" : "#fff",
              color: adminInventoryType === "Cocina" ? "#fff" : "#333",
              borderColor: adminInventoryType === "Cocina" ? "#1976d2" : "#ccc",
            }}
          >
            Cocina
          </button>
          <button
            onClick={() => setAdminInventoryType("Bar")}
            style={{
              ...styles.subBtn,
              backgroundColor: adminInventoryType === "Bar" ? "#1976d2" : "#fff",
              color: adminInventoryType === "Bar" ? "#fff" : "#333",
              borderColor: adminInventoryType === "Bar" ? "#1976d2" : "#ccc",
            }}
          >
            Bar
          </button>
        </div>
      )}

      {/* Filtros */}
      <div style={styles.filters}>
 <select
  value={userName}
  onChange={(e) => setUserName(e.target.value)}
  style={styles.select}
        >
          <option value="">Seleccione un usuario</option>
          
          {viewMode === "admin" ? (
            <>
              <option value="Vcastro">Victor Castro</option>
              <option value="Gcastillo">Gabriel Castillo</option>
              <option value="Pcasco">Perla Casco</option>
            </>
          ) : (
            <>
              <option value="Astridvalle">Astrid Valle</option>
              <option value="Alevaldez">Alexis Valdez</option>
              <option value="Elinuñez">Elizabeth Nuñez</option>
              <option value="Marifonseca">María Fonseca</option>
              <option value="SherMurillo">Sherlyn Murillo</option>
              <option value="Jcastillo">Juan Castillo</option>
              <option value="Elisanchez">Elisa Sanchez</option>
              <option value="Lorebustillo">Lorena Bustillo</option>
            </>
          )}
        </select>

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          style={styles.date}
        />

        <button
          onClick={() => fetchRecords(1)}
          style={styles.btnBuscar}
          onMouseEnter={(e) => hoverEffect(e, true)}
          onMouseLeave={(e) => hoverEffect(e, false)}
        >
          Buscar
        </button>
      </div>

      {/* Tabla de resultados */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Cargando registros...</p>
      ) : records.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>
          No hay registros para esta fecha y usuario.
        </p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Código</th>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Inventario Inicial</th>
                <th style={styles.th}>Entradas</th>
                <th style={styles.th}>Dañados</th>
                <th style={styles.th}>Cortesía</th>
                <th style={styles.th}>Desperdicios</th>
                <th style={styles.th}>Movimiento diario</th>
                <th style={styles.th}>Inventario Final</th>
                <th style={styles.th}>Diferencia</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i}>
                  <td style={styles.td}>{r.productCode}</td>
                  <td style={styles.td}>{r.productName}</td>
                  <td style={styles.td}>{r.initialInventory}</td>
                  <td style={styles.td}>{r.entries}</td>
                  <td style={styles.td}>{r.damaged}</td>
                  <td style={styles.td}>{r.courtesy}</td>
                  <td style={styles.td}>{r.remains}</td>
                  <td style={styles.td}>{r.dailyMove}</td> 
                  <td style={styles.td}>{r.finalInventory}</td>
                  <td style={styles.td}>{r.difference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {records.length > 0 && (
        <div style={styles.pagination}>
          <button
            disabled={page === 1}
            onClick={() => fetchRecords(page - 1)}
            style={styles.pageBtn}
            onMouseEnter={(e) => hoverEffect(e, true)}
            onMouseLeave={(e) => hoverEffect(e, false)}
          >
            Anterior
          </button>

          <span style={styles.pageText}>
            Página {page} de {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => fetchRecords(page + 1)}
            style={styles.pageBtn}
            onMouseEnter={(e) => hoverEffect(e, true)}
            onMouseLeave={(e) => hoverEffect(e, false)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  title: {
    fontSize: "clamp(1.4rem, 4vw, 2rem)",
    color: "#080808ff",
    marginBottom: "20px",
  },
  
  modeToggleContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "15px",
  },
  modeBtn: {
    padding: "10px 20px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
  },
  adminSubContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    width: "fit-content",
    margin: "0 auto 20px auto"
  },
  subBtn: {
    padding: "6px 16px",
    border: "1px solid",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  filters: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "25px",
  },
  inputText: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #aaa",
    fontSize: "16px",
    minWidth: "200px",
  },
  date: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #aaa",
    fontSize: "16px",
  },
  btnBuscar: {
    backgroundColor: "#8b0101ff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
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
  pageText: {
    fontSize: "16px",
    color: "#333",
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #aaa",
    fontSize: "16px",
    minWidth: "220px",
    backgroundColor: "#fff",
    color: "#333",
  },
};

export default RegistrosAdmin;