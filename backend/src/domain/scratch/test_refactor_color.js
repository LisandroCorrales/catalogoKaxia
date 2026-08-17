import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../../config/db.js";

import { UserRepository } from "../../repositories/user.repository.js";
import { CategoryRepository } from "../../repositories/category.repository.js";
import { TagRepository } from "../../repositories/tag.repository.js";
import { ColorRepository } from "../../repositories/color.repository.js";
import { ProductRepository } from "../../repositories/product.repository.js";

import { CategoryService } from "../../services/CategoryService.js";
import { TagService } from "../../services/TagService.js";
import { ColorService } from "../../services/ColorService.js";
import { ProductService } from "../../services/ProductService.js";

import { Size } from "../enums/Size.js";

dotenv.config();

console.log("=== INICIANDO PRUEBAS DE REFACTORIZACIÓN A COLOR ENTIDAD ===");

const runTests = async () => {
  try {
    await connectDB();

    const categoryRepo = new CategoryRepository();
    const tagRepo = new TagRepository();
    const colorRepo = new ColorRepository();
    const productRepo = new ProductRepository();

    const categoryService = new CategoryService(categoryRepo);
    const tagService = new TagService(tagRepo);
    const colorService = new ColorService(colorRepo);
    const productService = new ProductService(productRepo, categoryRepo, tagRepo, colorRepo);

    const categoriesToDelete = [];
    const tagsToDelete = [];
    const colorsToDelete = [];
    const productsToDelete = [];

    console.log("\n1. Creando Categoría, Tag y Color de forma persistente...");
    
    const rand = Date.now();
    const categorySaved = await categoryService.createCategory({ name: "Buzos Test Color " + rand, slug: "buzos-test-color-" + rand });
    categoriesToDelete.push(categorySaved.id);
    console.log("✓ Categoría persistida:", categorySaved);

    const tagSaved = await tagService.createTag({ name: "Oferta Color " + rand, color: "#FFA500" });
    tagsToDelete.push(tagSaved.id);
    console.log("✓ Etiqueta persistida:", tagSaved);

    // Crear la Entidad Color persistida con hexCode aleatorio para evitar duplicados
    const randomHex = "#" + Math.floor(Math.random()*16777215).toString(16).padEnd(6, '0');
    const colorSaved = await colorService.createColor({ name: "Azul Zafiro Test " + rand, hexCode: randomHex });
    colorsToDelete.push(colorSaved.id);
    console.log("✓ Entidad Color persistida:", colorSaved);

    console.log("\n2. Creando un Producto que asocie el ID del Color...");
    const productSaved = await productService.createProduct({
      name: "Buzo Kaxia Blue Test",
      price: 38000,
      image: "https://kaxia.com/images/buzo-blue.jpg",
      colors: [colorSaved.id], // Enviamos el ID persistido!
      sizes: [Size.M, Size.L],
      categoryId: categorySaved.id,
      tags: [tagSaved.id]
    });
    productsToDelete.push(productSaved.id);
    console.log("✓ Producto persistido con la referencia a Color:", productSaved);

    console.log("\n3. Recuperando el producto guardado y chequeando referencia...");
    // Al hacer findAll en el repo, toDomain lee el array de IDs
    const products = await productService.getProducts({ categoryId: categorySaved.id });
    console.log("✓ Producto recuperado:", products[0]);
    console.log("Colores asociados (IDs):", products[0].colors);
    console.log("¿El ID coincide con el color guardado?:", products[0].colors.includes(colorSaved.id));

    console.log("\n4. Probando integridad referencial en ProductService...");
    try {
      await productService.createProduct({
        name: "Buzo Error Color",
        price: 30000,
        image: "https://kaxia.com/images/buzo-error.jpg",
        colors: [new mongoose.Types.ObjectId().toString()], // ID inválido
        sizes: [Size.M],
        categoryId: categorySaved.id,
        tags: []
      });
    } catch (err) {
      console.log("✓ Capturado error esperado de color inexistente:", err.message);
    }

    console.log("\n5. Limpiando base de datos...");
    for (const pid of productsToDelete) await productService.deleteProduct(pid);
    for (const cid of categoriesToDelete) await categoryService.deleteCategory(cid);
    for (const tid of tagsToDelete) await tagService.deleteTag(tid);
    for (const colId of colorsToDelete) await colorService.deleteColor(colId);
    console.log("✓ Todos los registros temporales fueron removidos.");

    console.log("\n=== PRUEBAS COMPLETADAS CON ÉXITO ===");
  } catch (error) {
    console.error("❌ Error inesperado durante las pruebas de refactorización:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Conexión cerrada.");
  }
};

runTests();
