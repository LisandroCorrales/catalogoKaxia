import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../../config/db.js";

import { UserRepository } from "../../repositories/user.repository.js";
import { CategoryRepository } from "../../repositories/category.repository.js";
import { TagRepository } from "../../repositories/tag.repository.js";
import { ColorRepository } from "../../repositories/color.repository.js";
import { ProductRepository } from "../../repositories/product.repository.js";
import { AuditLogRepository } from "../../repositories/auditLog.repository.js";

import { CategoryService } from "../../services/CategoryService.js";
import { TagService } from "../../services/TagService.js";
import { ColorService } from "../../services/ColorService.js";
import { ProductService } from "../../services/ProductService.js";
import { AuditLogService } from "../../services/AuditLogService.js";

import { Size } from "../enums/Size.js";

dotenv.config();

console.log("=== INICIANDO PRUEBAS DE REGISTRO DE AUDITORÍA (AUDIT LOG) ===");

const runTests = async () => {
  try {
    await connectDB();

    const userRepo = new UserRepository();
    const categoryRepo = new CategoryRepository();
    const tagRepo = new TagRepository();
    const colorRepo = new ColorRepository();
    const productRepo = new ProductRepository();
    const auditLogRepo = new AuditLogRepository();

    const auditLogService = new AuditLogService(auditLogRepo);
    const categoryService = new CategoryService(categoryRepo, auditLogService);
    const tagService = new TagService(tagRepo, auditLogService);
    const colorService = new ColorService(colorRepo);
    const productService = new ProductService(productRepo, categoryRepo, tagRepo, colorRepo, auditLogService);

    // Listas para limpieza
    const categoriesToDelete = [];
    const tagsToDelete = [];
    const colorsToDelete = [];
    const productsToDelete = [];

    // 1. Simular un usuario ejecutor (Administrador)
    const mockAdminExecutor = {
      id: new mongoose.Types.ObjectId().toString(),
      username: "admin_tester",
      role: "Admin"
    };

    console.log("\n1. Creando Categoría, Tag y Color bajo el contexto de Auditoría...");
    
    const rand = Date.now();
    const categorySaved = await categoryService.createCategory({
      name: "Remeras Premium " + rand,
      slug: "remeras-premium-" + rand
    }, mockAdminExecutor);
    categoriesToDelete.push(categorySaved.id);
    console.log("✓ Categoría persistida y logueada.");

    const tagSaved = await tagService.createTag({
      name: "Nuevo Ingreso " + rand,
      color: "#00FF00"
    }, mockAdminExecutor);
    tagsToDelete.push(tagSaved.id);
    console.log("✓ Etiqueta persistida y logueada.");

    const colorSaved = await colorService.createColor({
      name: "Negro Mate " + rand,
      hexCode: "#0F0F0F"
    });
    colorsToDelete.push(colorSaved.id);
    console.log("✓ Color persistido (lectura libre, no requiere log de auditoría).");

    // 2. Crear un producto
    console.log("\n2. Creando un Producto con el Servicio (debería disparar log)...");
    const productSaved = await productService.createProduct({
      name: "Remera Boxy Fit Black",
      price: 18000,
      image: "https://kaxia.com/images/boxy-black.jpg",
      colors: [colorSaved.id],
      sizes: [Size.M, Size.L],
      categoryId: categorySaved.id,
      tags: [tagSaved.id]
    }, mockAdminExecutor);
    productsToDelete.push(productSaved.id);
    console.log("✓ Producto persistido y logueado.");

    // 3. Modificar el producto (debería registrar el diff en la auditoría)
    console.log("\n3. Modificando el Producto (debería registrar el diff)...");
    const productUpdated = await productService.updateProduct(productSaved.id, {
      name: "Remera Boxy Fit Black II",
      price: 22000 // Cambio de precio
    }, mockAdminExecutor);
    console.log("✓ Producto modificado y logueado con éxito.");

    // 4. Consultar los logs de auditoría guardados
    console.log("\n4. Consultando el Historial de Auditoría guardado en MongoDB...");
    const logs = await auditLogService.getLogs();
    
    console.log("\n=================== HISTORIAL DE AUDITORÍA ===================");
    logs.forEach(log => {
      console.log(`[${log.createdAt.toISOString()}] Usuario: ${log.username} (${log.userId})`);
      console.log(`  Acción: ${log.action} | Recurso: ${log.entityType} (ID: ${log.entityId})`);
      console.log(`  Detalles:`, JSON.stringify(log.details, null, 2));
      console.log("--------------------------------------------------------------");
    });
    console.log("==============================================================");

    console.log("\n5. Limpiando base de datos...");
    for (const pid of productsToDelete) await productService.deleteProduct(pid, mockAdminExecutor);
    for (const cid of categoriesToDelete) await categoryService.deleteCategory(cid, mockAdminExecutor);
    for (const tid of tagsToDelete) await tagService.deleteTag(tid, mockAdminExecutor);
    for (const colId of colorsToDelete) await colorService.deleteColor(colId);
    
    // Eliminar también los logs generados en el test para no ensuciar la base de datos de producción
    const { AuditLogModel } = await import("../../models/auditLog.model.js");
    await AuditLogModel.deleteMany({ userId: mockAdminExecutor.id });
    console.log("✓ Todos los registros temporales y logs de prueba fueron removidos.");

    console.log("\n=== PRUEBAS DE AUDITORÍA COMPLETADAS CON ÉXITO ===");
  } catch (error) {
    console.error("❌ Error inesperado durante las pruebas de auditoría:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Conexión cerrada.");
  }
};

runTests();
