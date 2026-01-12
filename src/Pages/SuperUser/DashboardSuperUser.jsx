import { Link} from "react-router-dom";
import { logout } from "../../api/authApi";

function SuperUserDashboard() {


const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div>
      <h1>Panel SuperAdmin</h1>
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <Link to="/superuser/create">Crear Usuario</Link>
        <Link to="/superuser/edit">Editar Usuario</Link>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            backgroundColor: "#8b0101",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default SuperUserDashboard;
