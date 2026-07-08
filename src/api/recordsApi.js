import { getToken } from "./authApi";
import { API_BASE_URL } from "./config";
import { inventoryTypeToEnum } from "./AdminApi"; 

const API_URL = `${API_BASE_URL}/api/users`;

/**
 * Obtener zona horaria del usuario
 */
function getUserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "Central America Standard Time";
}

/**
 * Obtener lista de usuarios disponibles en el sistema
 */
export async function getUsers() {
  const token = getToken();

  try {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) throw new Error("Error al obtener usuarios");
    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Obtener registros de usuario con paginación
 * @param {string} userName 
 * @param {string} requestedDate 
 * @param {number} page 
 * @param {number} pageSize 
 * @param {string|null} tipo - 🆕 OPCIONAL: "Bar" o "Cocina" para modo Administrador
 */
export async function getUserRecords(userName, requestedDate, page = 1, pageSize = 12, tipo = null) {
  if (!userName || !requestedDate) {
    throw new Error("Debe proporcionar userName y requestedDate válidos.");
  }

  const token = getToken();
  const timeZoneId = getUserTimeZone();

  // Base URL construction
  let url = `${API_URL}/records?userName=${encodeURIComponent(
    userName
  )}&requestedDate=${encodeURIComponent(
    requestedDate
  )}&page=${page}&pageSize=${pageSize}&timeZoneId=${encodeURIComponent(timeZoneId)}`;

  
  if (tipo) {
    const mappedEnum = inventoryTypeToEnum(tipo);
    url += `&inventoryType=${mappedEnum}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener registros: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}