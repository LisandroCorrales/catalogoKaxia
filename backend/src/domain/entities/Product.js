import { StockStatus } from "../enums/StockStatus.js";
import { Size } from "../enums/Size.js";
import { Color } from "./Color.js";

export class Product {
  constructor({
    id = null,
    name,
    price,
    image,
    gallery = [],
    fabric = "Jersey peinado 20.1",
    colors = [],
    sizes = [Size.M, Size.L, Size.XL, Size.XXL],
    print = "Serigrafía",
    details = "",
    stock = StockStatus.DISPONIBLE,
    measurements = {},
    categoryId = null,
    tags = []
  }) {
    this.id = id;
    this.name = this.validateName(name);
    this.price = this.validatePrice(price);
    this.image = this.validateImage(image);
    this.gallery = gallery;
    this.fabric = fabric;
    this.colors = this.validateColors(colors);
    this.sizes = this.validateSizes(sizes);
    this.print = print;
    this.details = details;
    this.stock = this.validateStock(stock);
    this.measurements = measurements;
    this.categoryId = categoryId;
    this.tags = tags;
  }

  validateName(name) {
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      const error = new Error("El nombre del producto es obligatorio.");
      error.statusCode = 400;
      throw error;
    }
    return name.trim();
  }

  validatePrice(price) {
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      const error = new Error("El precio debe ser un número mayor o igual a 0.");
      error.statusCode = 400;
      throw error;
    }
    return numPrice;
  }

  validateImage(image) {
    if (!image || typeof image !== "string") {
      const error = new Error("La imagen principal es obligatoria.");
      error.statusCode = 400;
      throw error;
    }
    return image.trim();
  }

  validateStock(stock) {
    if (!Object.values(StockStatus).includes(stock)) {
      const error = new Error(`Estado de stock inválido: ${stock}`);
      error.statusCode = 400;
      throw error;
    }
    return stock;
  }

  validateColors(colors) {
    if (!Array.isArray(colors)) {
      const error = new Error("El campo colores debe ser un arreglo.");
      error.statusCode = 400;
      throw error;
    }
    for (const color of colors) {
      if (typeof color !== "string" && !(color instanceof Color)) {
        const error = new Error("Cada color debe ser un ID (string) o una instancia de la entidad Color.");
        error.statusCode = 400;
        throw error;
      }
    }
    return colors;
  }

  validateSizes(sizes) {
    if (!Array.isArray(sizes)) {
      const error = new Error("El campo talles debe ser un arreglo.");
      error.statusCode = 400;
      throw error;
    }
    const validSizes = Object.values(Size);
    for (const size of sizes) {
      if (!validSizes.includes(size)) {
        const error = new Error(`Talle inválido: ${size}`);
        error.statusCode = 400;
        throw error;
      }
    }
    return sizes;
  }

  // Métodos de negocio de la prenda
  updatePrice(newPrice) {
    this.price = this.validatePrice(newPrice);
  }

  updateStock(newStock) {
    this.stock = this.validateStock(newStock);
  }

  updateMeasurements(newMeasurements) {
    this.measurements = { ...this.measurements, ...newMeasurements };
  }
}