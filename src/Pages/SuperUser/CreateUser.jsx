import { useState } from "react";
import { createUser } from "./SuperUserApi";

function CreateUser() {
const [name, setName] = useState(""); 
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(0);
  const [msg, setMsg] = useState("");

  const handleCreate = async () => {
    if (!name.trim() || !password.trim()) {
      setMsg("Nombre y contraseña son obligatorios");
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        password: password.trim(),
        role: Number(role)
      };

      setMsg("Creando usuario...");
      await createUser(payload);

      setMsg("Usuario creado correctamente");

      // Limpiar campos
      setName("");
      setPassword("");
      setRole(0);

      setTimeout(() => setMsg(""), 3000);

    } catch (err) {
      setMsg(err.message || "Error al crear usuario");
    }
  };

  return (
    <div>
      <h2>Crear Usuario</h2>

      <input
        placeholder="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <select value={role} onChange={e => setRole(Number(e.target.value))}>
        <option value={0}>Admin</option>
        <option value={1}>Bar</option>
        <option value={2}>Cocina</option>
        <option value={3}>SuperAdmin</option>
      </select>

      <button onClick={handleCreate}>Crear Usuario</button>

      {msg && <p>{msg}</p>}
    </div>
  );
}

export default CreateUser;
