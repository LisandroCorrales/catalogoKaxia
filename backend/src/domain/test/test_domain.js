import { Product } from "../entities/Product.js";
import { Category } from "../entities/Category.js";
import { Tag } from "../entities/Tag.js";
import { Color } from "../value-objects/Color.js";
import { Size } from "../enums/Size.js";

console.log("=== INICIANDO PRUEBAS DE DOMINIO ===");

try {
  console.log("\n1. Creando Categoría y Etiqueta...");
  const category = new Category({ name: "Buzos Oversized", slug: "buzos-oversized" });
  const tag = new Tag({ name: "Hot Sale", color: "#FF3366" });
  console.log("Categoría creada:", category);
  console.log("Etiqueta creada:", tag);

  console.log("\n2. Creando Colores (Value Objects)...");
  const colorBlack = new Color({ name: "Negro", hexCode: "#000000" });
  const colorWhite = new Color({ name: "Blanco Crudo", hexCode: "#F5F5F5" });
  console.log("Color Negro:", colorBlack);
  console.log("Color Blanco:", colorWhite);

  console.log("\n3. Creando un Producto Válido...");
  const product = new Product({
    name: "Hoodie Kaxia Black",
    price: 32000,
    image: "https://kaxia.com/images/hoodie-black.jpg",
    colors: [colorBlack, { name: "Gris Topo", hexCode: "#555555" }], // Debería convertir el segundo a Color automaticamente
    sizes: [Size.M, Size.L, Size.XL],
    categoryId: category.id || "cat_123",
    tags: [tag.id || "tag_456"]
  });
  console.log("Producto creado:", product);
  console.log("¿Los colores son instancias de Color?:", product.colors.every(c => c instanceof Color));

  console.log("\n4. Probando Validaciones (esperando fallas)...");

  try {
    new Product({ name: "", price: 1000, image: "img.png" });
  } catch (err) {
    console.log("✓ Capturado error esperado de nombre vacío:", err.message);
  }

  try {
    new Product({ name: "Hoodie", price: -10, image: "img.png" });
  } catch (err) {
    console.log("✓ Capturado error esperado de precio negativo:", err.message);
  }

  try {
    new Product({ name: "Hoodie", price: 1000, image: "img.png", sizes: ["XXXL"] });
  } catch (err) {
    console.log("✓ Capturado error esperado de talle inválido:", err.message);
  }

  try {
    new Product({ name: "Hoodie", price: 1000, image: "img.png", colors: [{ name: "Rojo", hexCode: "rojo-invalido" }] });
  } catch (err) {
    console.log("✓ Capturado error esperado de código hex de color inválido:", err.message);
  }

  console.log("\n=== PRUEBAS FINALIZADAS CON ÉXITO ===");
} catch (error) {
  console.error("❌ Ocurrió un error inesperado durante las pruebas:", error);
}
