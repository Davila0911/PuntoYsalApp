import { API_BASE_URL } from "./config";

// src/api/authApi.js
const API_URL = `${API_BASE_URL}/api/auth`;

// Iniciar sesión
export async function login(username, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify({ name: username, password }),
    });

    if (!response.ok) {
      throw new Error("Error en el inicio de sesión");
    }

    const data = await response.json();

    //  Mapeo correcto del rol (enum a texto)
    const roleMap = {
      0: "Admin",
      1: "Bar",
      2: "Cocina",
      3: "SuperAdmin"
    };

    //  Crear objeto de usuario con los campos actuales del backend
    const userData = {
      id: data.user.userId,
      name: data.user.name,
      role: roleMap[data.user.userRole] || "Desconocido",
    };

    //  Guardar token, expiración y usuario
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("expiration", data.expiration);
    localStorage.setItem("user", JSON.stringify(userData));

    return userData;
  } catch {
    throw new Error("No se pudo iniciar sesión");
  }
}

// Cerrar sesión
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  localStorage.removeItem("user");
}

// Obtener usuario actual
export function getUser() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

// Obtener token JWT
export function getToken() {
  return localStorage.getItem("token") || null;
}
