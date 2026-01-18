import { getToken } from "./authApi";
import { API_BASE_URL } from "./config";

const API_URL = `${API_BASE_URL}/api/inventory`;

/**
 * Obtener inventario (Cocina o Bar) con paginación
 */
export async function getInventory(tipo = null, page = 1, pageSize = 10, category = "") {
  const token = getToken();

  // Construimos la URL base con los parámetros obligatorios
  let url = `${API_URL}?page=${page}&pageSize=${pageSize}`;

  // Si hay tipo, lo agregamos
  if (tipo !== null) {
    url += `&inventoryType=${tipo}`;
  }

  // SI hay categoría y no está vacía, la agregamos codificada para la URL
  if (category && category.trim() !== "") {
    url += `&category=${encodeURIComponent(category)}`;
  }

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
