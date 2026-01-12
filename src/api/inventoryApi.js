import { getToken } from "./authApi";
import { API_BASE_URL } from "./config";

const API_URL = `${API_BASE_URL}/api/inventory`;

/**
 * Obtener inventario (Cocina o Bar) con paginación
 */
export async function getInventory(tipo = null, page = 1, pageSize = 10) {
  const token = getToken();

  const url =
    tipo !== null
      ? `${API_URL}?inventoryType=${tipo}&page=${page}&pageSize=${pageSize}`
      : `${API_URL}?page=${page}&pageSize=${pageSize}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el inventario.");
  }

  return await response.json();
}

/**
 * Actualizar stock de un producto
 */
export async function updateStock(productName, newStock, inventoryType = 0) {
  const token = getToken();

  if (!productName || !Number.isFinite(Number(newStock))) {
    throw new Error("Datos inválidos.");
  }

  const response = await fetch(`${API_URL}/stock`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productName: productName.trim(),
      newStock: parseFloat(newStock),
      inventoryType, // 0 = Bar, 1 = Cocina
    }),
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar el stock.");
  }

  return await response.json();
}
