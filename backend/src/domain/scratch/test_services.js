import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../../config/db.js";

import { UserRepository } from "../../repositories/user.repository.js";
import { CategoryRepository } from "../../repositories/category.repository.js";
import { TagRepository } from "../../repositories/tag.repository.js";
import { ProductRepository } from "../../repositories/product.repository.js";

import { AuthService } from "../../services/AuthService.js";
import { CategoryService } from "../../services/CategoryService.js";
import { TagService } from "../../services/TagService.js";
import { ProductService } from "../../services/ProductService.js";

import { Size } from "../enums/Size.js";
import { Color } from "../value-objects/Color.js";

// Cargar variables de entorno
dotenv.config();

console.log("=== INICIANDO PRUEBAS DE LA CAPA DE SERVICIOS ===");

const runTests = async () => {
  try {
    // Conectar DB
    await connectDB();

    // Instanciar repositorios
    const userRepo = new UserRepository();
    const categoryRepo = new CategoryRepository();
    const tagRepo = new TagRepository();
    const productRepo = new ProductRepository();

    // Instanciar servicios
    const authService = new AuthService(userRepo);
    const categoryService = new CategoryService(categoryRepo);
    const tagService = new TagService(tagRepo);
    const productService = new ProductService(productRepo, categoryRepo, tagRepo);

    // Listas para borrar al final
    const usersToDelete = [];
    const categoriesToDelete = [];
    const tagsToDelete = [];
    const productsToDelete = [];

    console.log("\n1. Probando AuthService (Autenticación)...");
    
    // Registrar usuario
    const userPayload = {
      username: "admin_test_" + Date.now(),
      password: "SuperSecurePassword123!",
      role: "Admin"
    };
    const registeredUser = await authService.register(userPayload);
    console.log("✓ Usuario registrado con éxito:", registeredUser);
    usersToDelete.push(registeredUser.id);

    // Intentar duplicado
    try {
      await authService.register(userPayload);
    } catch (err) {
      console.log("✓ Capturado error esperado de duplicación:", err.message);
    }

    // Login correcto
    const loginResult = await authService.login({
      username: userPayload.username,
      password: userPayload.password
    });
    console.log("✓ Login correcto. Token JWT generado:", loginResult.token.substring(0, 30) + "...");
    console.log("Datos de usuario devueltos en login:", loginResult.user);

    // Login incorrecto
    try {
      await authService.login({
        username: userPayload.username,
        password: "WrongPassword!"
      });
    } catch (err) {
      console.log("✓ Capturado error esperado de login inválido:", err.message);
    }

    console.log("\n2. Probando CategoryService y TagService...");
    const categorySaved = await categoryService.createCategory({ name: "Remeras Test", slug: "remeras-test" });
    console.log("✓ Categoría creada:", categorySaved);
    categoriesToDelete.push(categorySaved.id);

    const tagSaved = await tagService.createTag({ name: "Destacado Test", color: "#FFD700" });
    console.log("✓ Etiqueta creada:", tagSaved);
    tagsToDelete.push(tagSaved.id);

    console.log("\n3. Probando ProductService (Integridad Referencial)...");
    
    // Crear producto válido
    const colorRed = new Color({ name: "Rojo Fuego", hexCode: "#FF0000" });
    const productSaved = await productService.createProduct({
      name: "Remera Oversized Red",
      price: 25000,
      image: "https://kaxia.com/images/remera-red.jpg",
      colors: [colorRed],
      sizes: [Size.M, Size.L],
      categoryId: categorySaved.id,
      tags: [tagSaved.id]
    });
    console.log("✓ Producto creado vinculando categoría y tag correctamente:", productSaved);
    productsToDelete.push(productSaved.id);

    // Intentar crear producto con categoría inválida
    try {
      await productService.createProduct({
        name: "Remera Error",
        price: 15000,
        image: "https://kaxia.com/images/remera-error.jpg",
        colors: [colorRed],
        sizes: [Size.M],
        categoryId: new mongoose.Types.ObjectId().toString(), // ID aleatorio
        tags: []
      });
    } catch (err) {
      console.log("✓ Capturado error esperado de categoría asociada inexistente:", err.message);
    }

    // Intentar crear producto con tag inválido
    try {
      await productService.createProduct({
        name: "Remera Error Tag",
        price: 15000,
        image: "https://kaxia.com/images/remera-error.jpg",
        colors: [colorRed],
        sizes: [Size.M],
        categoryId: categorySaved.id,
        tags: [new mongoose.Types.ObjectId().toString()] // ID aleatorio
      });
    } catch (err) {
      console.log("✓ Capturado error esperado de etiqueta asociada inexistente:", err.message);
    }

    console.log("\n4. Limpiando base de datos...");
    for (const pid of productsToDelete) await productService.deleteProduct(pid);
    for (const cid of categoriesToDelete) await categoryService.deleteCategory(cid);
    for (const tid of tagsToDelete) await tagService.deleteTag(tid);
    for (const uid of usersToDelete) await userRepo.delete(uid);
    console.log("✓ Todos los registros temporales fueron removidos.");

    console.log("\n=== PRUEBAS DE LA CAPA DE SERVICIOS COMPLETADAS CON ÉXITO ===");
  } catch (error) {
    console.error("❌ Error inesperado durante las pruebas de servicios:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Conexión de base de datos cerrada.");
  }
};

runTests();
