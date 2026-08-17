import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../../config/db.js";
import { CategoryRepository } from "../../repositories/category.repository.js";
import { TagRepository } from "../../repositories/tag.repository.js";
import { ProductRepository } from "../../repositories/product.repository.js";
import { Category } from "../entities/Category.js";
import { Tag } from "../entities/Tag.js";
import { Product } from "../entities/Product.js";
import { Size } from "../enums/Size.js";
import { Color } from "../value-objects/Color.js";

// Cargar variables de entorno
dotenv.config();

console.log("=== INICIANDO PRUEBAS DE PERSISTENCIA MONGODB ===");
console.log("URI:", process.env.MONGO_URI ? "Encontrada" : "NO ENCONTRADA");

const runTests = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();

    const categoryRepo = new CategoryRepository();
    const tagRepo = new TagRepository();
    const productRepo = new ProductRepository();

    console.log("\n1. Creando registros de prueba...");
    
    // Crear y persistir Categoría
    const categoryEntity = new Category({ name: "Pantalones Cargo Test", slug: "pantalones-cargo-test" });
    const categorySaved = await categoryRepo.create(categoryEntity);
    console.log("✓ Categoría guardada en DB:", categorySaved);

    // Crear y persistir Tag
    const tagEntity = new Tag({ name: "Oferta Especial Test", color: "#FF5733" });
    const tagSaved = await tagRepo.create(tagEntity);
    console.log("✓ Etiqueta guardada en DB:", tagSaved);

    // Crear y persistir Producto
    const colorOlive = new Color({ name: "Verde Oliva", hexCode: "#556B2F" });
    const productEntity = new Product({
      name: "Cargo Pant Urban Test",
      price: 45000,
      image: "https://kaxia.com/images/cargo-olive.jpg",
      colors: [colorOlive],
      sizes: [Size.M, Size.L, Size.XL],
      categoryId: categorySaved.id,
      tags: [tagSaved.id]
    });
    const productSaved = await productRepo.create(productEntity);
    console.log("✓ Producto guardado en DB:", productSaved);

    console.log("\n2. Recuperando registros creados...");
    const products = await productRepo.findAll({ categoryId: categorySaved.id });
    console.log("✓ Productos encontrados para la categoría:", products);
    console.log("¿Los colores del producto recuperado son Value Objects?:", products[0].colors[0] instanceof Color);

    console.log("\n3. Limpiando datos de prueba...");
    if (productSaved.id) await productRepo.delete(productSaved.id);
    if (categorySaved.id) await categoryRepo.delete(categorySaved.id);
    if (tagSaved.id) await tagRepo.delete(tagSaved.id);
    console.log("✓ Registros de prueba eliminados correctamente.");

    console.log("\n=== PRUEBAS DE PERSISTENCIA MONGODB COMPLETADAS CON ÉXITO ===");
  } catch (error) {
    console.error("❌ Error durante las pruebas de base de datos:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Conexión cerrada.");
  }
};

runTests();
