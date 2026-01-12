import { API_BASE_URL } from "./config";

// src/api/cocinaApi.js
const BASE_URL = `${API_BASE_URL}/api`;

// Obtener encabezados estándar
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    //"ngrok-skip-browser-warning": "true",
  };
};

// Detectar la zona horaria local
const getTimeZoneId = () => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz.includes("Tegucigalpa")) return "Central America Standard Time";
  return tz || "Central America Standard Time";
};

// Obtener inventario de cocina
export const getCocinaInventory = async (page = 1, itemsPerPage = 10) => {
  try {
    const res = await fetch(
      `${BASE_URL}/inventory?inventoryType=1&page=${page}&itemsPerPage=${itemsPerPage}`,
      { headers: getHeaders() }
    );

    if (!res.ok) throw new Error("Error al obtener inventario de cocina");
    return await res.json();
  } catch {
    throw new Error("No se pudo obtener el inventario de cocina");
  }
};

// Guardar inventario inicial
export const saveCocinaInitial = async (productCode, count) => {
  try {
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

    if (!res.ok) {
      throw new Error("Error al guardar inventario inicial");
    }

    return await res.text();
  } catch {
    throw new Error("No se pudo guardar el inventario inicial");
  }
};

// Guardar inventario final
export const saveCocinaFinal = async (productCode, count) => {
  try {
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

    if (!res.ok) {
      throw new Error("Error al guardar inventario final");
    }

    return await res.text();
  } catch {
    throw new Error("No se pudo guardar el inventario final");
  }
};

// Registrar movimiento
export const registerCocinaMovement = async (payload) => {
  try {
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

    if (!res.ok) {
      throw new Error(data?.message || "Error al registrar movimiento");
    }

    return data;
  } catch {
    throw new Error("No se pudo registrar el movimiento");
  }
};