import { getToken } from "./authApi";
import { API_BASE_URL } from "./config";
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
 */
export async function getUserRecords(userName, requestedDate, page = 1, pageSize = 12) {
  if (!userName || !requestedDate) {
    throw new Error("Debe proporcionar userName y requestedDate válidos.");
  }

  const token = getToken();
  const timeZoneId = getUserTimeZone();

  const url = `${API_URL}/records?userName=${encodeURIComponent(
    userName
  )}&requestedDate=${encodeURIComponent(
    requestedDate
  )}&page=${page}&pageSize=${pageSize}&timeZoneId=${encodeURIComponent(timeZoneId)}`;

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
