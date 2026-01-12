import { Link } from "react-router-dom";

function SuperUserDashboard() {
  return (
    <div>
      <h1>Panel SuperAdmin</h1>
      <Link to="/superuser/create">Crear Usuario</Link><br/>
      <Link to="/superuser/edit">Editar Usuario</Link>
    </div>
  );
}

export default SuperUserDashboard;
