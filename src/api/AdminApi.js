import { API_BASE_URL } from "./config";

const BASE_URL = `${API_BASE_URL}/api`;

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "ngrok-skip-browser-warning": "true",
  };
};

const getTimeZoneId = () => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz.includes("Tegucigalpa")) return "Central America Standard Time";
  return tz || "Central America Standard Time";
};

export function inventoryTypeToEnum(tipo) {
  return tipo === "Bar" ? 0 : 1;
}

export const getAdminInventory = async (tipo, page = 1, itemsPerPage = 10, category = "") => {
  const inventoryType = inventoryTypeToEnum(tipo);
  let url = `${BASE_URL}/inventory?inventoryType=${inventoryType}&page=${page}&itemsPerPage=${itemsPerPage}`;

  if (category && category.trim() !== "") {
    url += `&category=${encodeURIComponent(category)}`;
  }

  const res = await fetch(url, { headers: getHeaders() });

  if (!res.ok) throw new Error("Error al obtener inventario");
  return await res.json();
};

export const saveAdminInitial = async (productCode, count, tipo) => {
  const mappedEnum = inventoryTypeToEnum(tipo);

  const body = {
    productCode,
    count: parseFloat(count),
    timeZoneId: getTimeZoneId(),
  };

  const url = `${BASE_URL}/movements/initial-count?inventoryType=${mappedEnum}`;

  const res = await fetch(url, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Error al guardar inventario inicial");
  return await res.text();
};

export const saveAdminFinal = async (productCode, count, tipo) => {
  const mappedEnum = inventoryTypeToEnum(tipo);

  const body = {
    productCode,
    count: parseFloat(count),
    timeZoneId: getTimeZoneId(),
  };

  const url = `${BASE_URL}/movements/final-count?inventoryType=${mappedEnum}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Error al guardar inventario final");
  return await res.text();
};

export const registerAdminMovement = async (payload, tipo) => {
  const mappedEnum = inventoryTypeToEnum(tipo);

  // FIXED: Changed inventoryType to _inventoryType. 
  // The underscore tells the linter: "I am intentionally ignoring this variable."
  const { inventoryType: _inventoryType, ...cleanPayload } = payload;
  
  const body = {
    ...cleanPayload,
    timeZoneId: getTimeZoneId(),
  };

  const url = `${BASE_URL}/movements/register-movement?inventoryType=${mappedEnum}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Error al registrar movimiento");
  return data;
};

// 🆕 ADDED: Function to modify your own initial counts within the 1-hour limit
export const modifyAdminInitialCount = async (productCode, count, tipo) => {
  const mappedEnum = inventoryTypeToEnum(tipo);

  const body = {
    productCode,
    count: parseFloat(count),
    timeZoneId: getTimeZoneId(),
  };

  const url = `${BASE_URL}/movements/modify-initial-count?inventoryType=${mappedEnum}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error al modificar el inventario inicial");
  }

  return await res.json();
};