import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";

// Modelos
import { UserModel } from "../models/user.model.js";
import { CategoryModel } from "../models/category.model.js";
import { TagModel } from "../models/tag.model.js";
import { ColorModel } from "../models/color.model.js";
import { ProductModel } from "../models/product.model.js";
import { AuditLogModel } from "../models/auditLog.model.js";

// Enums
import { Size } from "../domain/enums/Size.js";
import { StockStatus } from "../domain/enums/StockStatus.js";

dotenv.config({ path: "./backend/.env" });

const seedDatabase = async () => {
  try {
    console.log("=== INICIANDO SEMILLERO DE BASE DE DATOS ===");
    await connectDB();

    console.log("\n1. Limpiando colecciones existentes...");
    await UserModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await TagModel.deleteMany({});
    await ColorModel.deleteMany({});
    await ProductModel.deleteMany({});
    await AuditLogModel.deleteMany({});
    console.log("✓ Base de datos limpia.");

    console.log("\n2. Creando Usuario Administrador Inicial...");
    const salt = await bcrypt.genSalt(10);
    const seedPassword = process.env.ADMIN_SEED_PASSWORD;
    const hashedPassword = await bcrypt.hash(seedPassword, salt);
    
    const adminUser = await UserModel.create({
      username: "admin",
      passwordHash: hashedPassword,
      role: "Admin"
    });
    console.log("✓ Usuario Administrador creado:");
    console.log(`   - Usuario: admin`);
    console.log(`   - Clave: ${seedPassword}`);

    console.log("\n3. Creando Categorías...");
    const buzosCat = await CategoryModel.create({
      name: "Buzos",
      slug: "buzos",
      description: "Buzos de jersey peinado y friza premium con capucha"
    });
    const remerasCat = await CategoryModel.create({
      name: "Remeras",
      slug: "remeras",
      description: "Remeras lisas y estampadas boxy fit 100% algodón"
    });
    const pantalonesCat = await CategoryModel.create({
      name: "Pantalones",
      slug: "pantalones",
      description: "Joggers, pantalones cargo y bermudas rústicas"
    });
    const accesoriosCat = await CategoryModel.create({
      name: "Accesorios",
      slug: "accesorios",
      description: "Gorros, medias y accesorios de moda urbana"
    });
    console.log("✓ Categorías creadas.");

    console.log("\n4. Creando Etiquetas (Tags)...");
    const nuevoTag = await TagModel.create({ name: "Nuevo", slug: "nuevo", color: "#22C55E" });
    const hotSaleTag = await TagModel.create({ name: "Hot Sale", slug: "hot-sale", color: "#EF4444" });
    const destacadoTag = await TagModel.create({ name: "Destacado", slug: "destacado", color: "#3B82F6" });
    console.log("✓ Etiquetas creadas.");

    console.log("\n5. Creando Colores...");
    const negroColor = await ColorModel.create({ name: "Negro", hexCode: "#000000" });
    const blancoColor = await ColorModel.create({ name: "Blanco Crudo", hexCode: "#F5F5DC" });
    const azulColor = await ColorModel.create({ name: "Azul Zafiro", hexCode: "#0F4C81" });
    const grisColor = await ColorModel.create({ name: "Gris Melange", hexCode: "#8F8F8F" });
    const verdeColor = await ColorModel.create({ name: "Verde Militar", hexCode: "#4B5320" });
    console.log("✓ Colores creados.");

    console.log("\n6. Creando Productos de Catálogo...");
    const productsData = [
      {
        name: "Buzo Oversized Zafiro",
        price: 38000,
        image: "https://res.cloudinary.com/demo/image/upload/v1625627047/sample.jpg",
        gallery: [],
        fabric: "Friza invisible de algodón premium",
        colors: [azulColor._id, negroColor._id],
        sizes: [Size.M, Size.L, Size.XL],
        print: "Bordado central tono sobre tono",
        details: "Corte oversized real con hombros caídos y capucha forrada en jersey.",
        stock: StockStatus.DISPONIBLE,
        measurements: {
          [Size.M]: "Ancho: 58cm, Largo: 70cm",
          [Size.L]: "Ancho: 61cm, Largo: 72cm",
          [Size.XL]: "Ancho: 64cm, Largo: 74cm"
        },
        categoryId: buzosCat._id,
        tags: [destacadoTag._id, nuevoTag._id]
      },
      {
        name: "Remera Boxy Fit Off-White",
        price: 18000,
        image: "https://res.cloudinary.com/demo/image/upload/v1625627047/sample.jpg",
        gallery: [],
        fabric: "Jersey de algodón peinado 20/1 pesado",
        colors: [blancoColor._id, grisColor._id],
        sizes: [Size.S, Size.M, Size.L],
        print: "Serigrafía textil al agua en espalda",
        details: "Corte Boxy Fit cuadrado y cuello de rib de 3cm que no se deforma.",
        stock: StockStatus.DISPONIBLE,
        measurements: {
          [Size.S]: "Ancho: 54cm, Largo: 66cm",
          [Size.M]: "Ancho: 57cm, Largo: 68cm",
          [Size.L]: "Ancho: 60cm, Largo: 70cm"
        },
        categoryId: remerasCat._id,
        tags: [nuevoTag._id]
      },
      {
        name: "Pantalón Cargo Black",
        price: 42000,
        image: "https://res.cloudinary.com/demo/image/upload/v1625627047/sample.jpg",
        gallery: [],
        fabric: "Gabardina esmerilada pesada de 8 oz",
        colors: [negroColor._id, verdeColor._id],
        sizes: [Size.M, Size.L],
        print: "Sin estampa",
        details: "Pantalón cargo multibolsillos con cordones ajustables en tobillos.",
        stock: StockStatus.DISPONIBLE,
        measurements: {
          [Size.M]: "Cintura: 40cm, Largo: 104cm",
          [Size.L]: "Cintura: 42cm, Largo: 106cm"
        },
        categoryId: pantalonesCat._id,
        tags: [hotSaleTag._id]
      }
    ];

    await ProductModel.create(productsData);
    console.log("✓ Productos iniciales creados con éxito.");

    console.log("\n=== SEMILLERO COMPLETADO CON ÉXITO ===");
  } catch (error) {
    console.error("❌ Error durante la ejecución del semillero:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Conexión a base de datos cerrada.");
  }
};

seedDatabase();
