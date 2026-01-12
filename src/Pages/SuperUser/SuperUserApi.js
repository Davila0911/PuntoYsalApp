// src/api/superuserApi.js
import { API_BASE_URL } from "../../api/config";

const BASE_URL = `${API_BASE_URL}/api/users`;

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Obtener usuario por ID
export const getUserById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: authHeader(),
  });

  if (!res.ok) {
    let errorMsg = "Error al obtener el usuario";
    try {
      const errData = await res.json();
      if (errData?.message) errorMsg = errData.message;
    } catch {}
    throw new Error(errorMsg);
  }

  return await res.json();
};

// Crear nuevo usuario
export const createUser = async (data) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMsg = "Error al crear usuario";
    try {
      const errData = await res.json();
      if (errData?.message) errorMsg = errData.message;
    } catch {}
    throw new Error(errorMsg);
  }

  return await res.json();
};

// Actualizar usuario existente
export const updateUser = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMsg = "Error al actualizar usuario";
    try {
      const errData = await res.json();
      if (errData?.message) errorMsg = errData.message;
    } catch {}
    throw new Error(errorMsg);
  }
};