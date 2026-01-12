import { getToken } from "./authApi";
import { API_BASE_URL } from "./config";
const API_URL = `${API_BASE_URL}/api/inventory`;

/**
 * Obtener productos con bajo stock (según tipo de inventario)
 * @param {number|null} inventoryType - 0 = Bar, 1 = Cocina, null = todos
 * @returns {Promise<Array>} Lista de productos [{ code, product, category, measurementUnit, currentStock, minimumStock }]
 */
export async function getLowStockProducts(inventoryType = null) {
  const token = getToken();

  try {
    const url =
      inventoryType !== null
        ? `${API_URL}/low-stock?inventoryType=${inventoryType}`
        : `${API_URL}/low-stock`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener productos con bajo stock: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(" Error en getLowStockProducts:", error);
    throw error;
  }
}
