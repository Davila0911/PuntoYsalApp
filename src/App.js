import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import DashboardAdmin from "./Pages/Admin/DashboardAdmin";
import InventariosAdmin from "./Pages/Admin/InventariosAdmin";
import RegistrosAdmin from "./Pages/Admin/RegistrosAdmin";
import DashboardCocina from "./Pages/Cocina/DashboardCocina";
import DashboardBar from "./Pages/Bar/DashboardBar";
import { getUser } from "./api/authApi";
import DashboardSuperUser from "./Pages/SuperUser/DashboardSuperUser";
import CreateUser from "./Pages/SuperUser/CreateUser";
import EditUser from "./Pages/SuperUser/EditUser";

function App() {
  const user = getUser();

  const getDashboardRoute = () => {
    if (!user) return <Login />;
    if (user.role === "Admin") return <DashboardAdmin />;
    if (user.role === "Cocina") return <DashboardCocina />;
    if (user.role === "Bar") return <DashboardBar />;
    if (user.role === "SuperAdmin") return <DashboardSuperUser />;
    return <Login />;
  };

  return (
    <Router>
      <Routes>
        {/* Ruta principal */}
        <Route
          path="/"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* Ruta de dashboard dinámico */}
        <Route path="/dashboard" element={getDashboardRoute()} />

         {/* Ruta de dashboard superUser */}
        <Route path="/superuser" element={<DashboardSuperUser />} />
        <Route path="/superuser/create" element={<CreateUser />} />
        <Route path="/superuser/edit" element={<EditUser />} />


        {/* Rutas internas de admin (acceso solo desde DashboardAdmin) */}
        <Route path="/admin/inventarios" element={<InventariosAdmin />} />
        <Route path="/admin/registros" element={<RegistrosAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
