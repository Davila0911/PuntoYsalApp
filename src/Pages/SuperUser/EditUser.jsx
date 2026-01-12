import { useState } from "react";
import { getUserById, updateUser } from "./SuperUserApi";

function EditUser() {
const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(0);
  const [msg, setMsg] = useState("");

  const fetchUser = async () => {
    if (!userId.trim()) {
      setMsg("Ingrese un ID válido");
      return;
    }

    try {
      const user = await getUserById(userId);
      setName(user.name || "");
      setRole(user.userRole ?? 0);
      setMsg("Usuario cargado correctamente");
    } catch (error) {
      setName("");
      setRole(0);
      setMsg(error.message || "No se encontró el usuario");
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      setMsg("El nombre no puede estar vacío");
      return;
    }

    try {
      await updateUser(userId, { name, password, role });
      setMsg("Usuario actualizado correctamente");
      setPassword(""); 
    } catch (error) {
      setMsg(error.message || "Error al actualizar usuario");
    }
  };

  return (
    <div>
      <h2>Editar Usuario</h2>

      <input
        placeholder="ID del usuario"
        value={userId}
        onChange={e => setUserId(e.target.value)}
      />

      <button onClick={fetchUser}>Buscar</button>

      {name && (
        <>
          <input value={name} onChange={e => setName(e.target.value)} />
          <input
            placeholder="Nueva contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <select value={role} onChange={e => setRole(Number(e.target.value))}>
            <option value={0}>Admin</option>
            <option value={1}>Bar</option>
            <option value={2}>Cocina</option>
            <option value={3}>SuperAdmin</option>
          </select>

          <button onClick={handleUpdate}>Actualizar</button>
        </>
      )}

      {msg && <p>{msg}</p>}
    </div>
  );
}

export default EditUser;
