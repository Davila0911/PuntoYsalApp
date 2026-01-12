import { Link, useNavigate } from "react-router-dom";

function SuperUserDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // borrar JWT
    navigate("/login"); // redirigir al login
  };

  return (
    <div>
      <h1>Panel SuperAdmin</h1>
      <Link to="/superuser/create">Crear Usuario</Link><br/>
      <Link to="/superuser/edit">Editar Usuario</Link><br/><br/>

      <button onClick={handleLogout} style={{ padding: "8px 16px", cursor: "pointer" }}>
        Cerrar Sesión
      </button>
    </div>
  );
}

export default SuperUserDashboard;
