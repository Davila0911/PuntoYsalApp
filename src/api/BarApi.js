import { API_BASE_URL } from "./config";

// src/api/barApi.js
const BASE_URL = `${API_BASE_URL}/api`;

// Obtener encabezados estándar
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "ngrok-skip-browser-warning": "true",
  };
};

// Detectar la zona horaria local
const getTimeZoneId = () => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz.includes("Tegucigalpa")) return "Central America Standard Time";
  return tz || "Central America Standard Time";
};

// Obtener inventario del Bar con filtro de categoría
export const getBarInventory = async (page = 1, itemsPerPage = 10, category = "") => {
  try {
    let url = `${BASE_URL}/inventory?inventoryType=0&page=${page}&itemsPerPage=${itemsPerPage}`;
    
    // Si hay categoría, se añade a la query
    if (category && category.trim() !== "") {
      url += `&category=${encodeURIComponent(category)}`;
    }

    const res = await fetch(url, { headers: getHeaders() });

    if (!res.ok) throw new Error("Error al obtener inventario del bar");
    return await res.json();
  } catch (error) {
    throw new Error("No se pudo obtener el inventario del bar");
  }
};

// Guardar inventario inicial
export const saveBarInitial = async (productCode, count) => {
  const body = {
    productCode,
    count: parseFloat(count),
    timeZoneId: getTimeZoneId(),
  };

  const res = await fetch(`${BASE_URL}/movements/initial-count`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Error al guardar inventario inicial del bar");
  return await res.text();
};

// Guardar inventario final
export const saveBarFinal = async (productCode, count) => {
  const body = {
    productCode,
    count: parseFloat(count),
    timeZoneId: getTimeZoneId(),
  };

  const res = await fetch(`${BASE_URL}/movements/final-count`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Error al guardar inventario final del bar");
  return await res.text();
};

// Registrar movimiento
export const registerBarMovement = async (payload) => {
  const body = {
    ...payload,
    timeZoneId: getTimeZoneId(),
  };

  const res = await fetch(`${BASE_URL}/movements/register-movement`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error al registrar movimiento en Bar");
  return data;
};