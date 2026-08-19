import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./backend/src/config/db.js";

// Repositorios
import { UserRepository } from "./backend/src/repositories/user.repository.js";
import { CategoryRepository } from "./backend/src/repositories/category.repository.js";
import { TagRepository } from "./backend/src/repositories/tag.repository.js";
import { ColorRepository } from "./backend/src/repositories/color.repository.js";
import { ProductRepository } from "./backend/src/repositories/product.repository.js";
import { AuditLogRepository } from "./backend/src/repositories/auditLog.repository.js";
import { AnnouncementRepository } from "./backend/src/repositories/announcement.repository.js";
import { AnalyticsRepository } from "./backend/src/repositories/analytics.repository.js";

// Servicios
import { AuthService } from "./backend/src/services/AuthService.js";
import { UserService } from "./backend/src/services/UserService.js";
import { CategoryService } from "./backend/src/services/CategoryService.js";
import { TagService } from "./backend/src/services/TagService.js";
import { ColorService } from "./backend/src/services/ColorService.js";
import { ProductService } from "./backend/src/services/ProductService.js";
import { AuditLogService } from "./backend/src/services/AuditLogService.js";
import { AnnouncementService } from "./backend/src/services/AnnouncementService.js";
import { AnalyticsService } from "./backend/src/services/AnalyticsService.js";

// Router factories
import { createAuthRouter } from "./backend/src/routes/auth.routes.js";
import { createUserRouter } from "./backend/src/routes/user.routes.js";
import { createCategoryRouter } from "./backend/src/routes/category.routes.js";
import { createTagRouter } from "./backend/src/routes/tag.routes.js";
import { createColorRouter } from "./backend/src/routes/color.routes.js";
import { createProductRouter } from "./backend/src/routes/product.routes.js";
import { createAuditLogRouter } from "./backend/src/routes/auditLog.routes.js";
import { createAnnouncementRouter } from "./backend/src/routes/announcement.routes.js";
import { createAnalyticsRouter } from "./backend/src/routes/analytics.routes.js";
import { uploadRouter } from "./backend/src/routes/upload.routes.js";

// Middlewares
import { errorHandler } from "./backend/src/middleware/errorHandler.js";

// Cargar variables de entorno
dotenv.config({ path: "./backend/.env" });

const app = express();
const PORT = process.env.PORT || 4000;

// Conectar a MongoDB
connectDB();

// Configuración de CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : "http://localhost:5173"
}));

app.use(express.json());

// Inyección de dependencias
const userRepo = new UserRepository();
const categoryRepo = new CategoryRepository();
const tagRepo = new TagRepository();
const colorRepo = new ColorRepository();
const productRepo = new ProductRepository();
const auditLogRepo = new AuditLogRepository();
const announcementRepo = new AnnouncementRepository();
const analyticsRepo = new AnalyticsRepository();

const authService = new AuthService(userRepo);
const userService = new UserService(userRepo);
const auditLogService = new AuditLogService(auditLogRepo);
const categoryService = new CategoryService(categoryRepo, auditLogService);
const tagService = new TagService(tagRepo, auditLogService);
const colorService = new ColorService(colorRepo);
const productService = new ProductService(productRepo, categoryRepo, tagRepo, colorRepo, auditLogService);
const announcementService = new AnnouncementService(announcementRepo);
const analyticsService = new AnalyticsService(analyticsRepo);

// Rutas de la API
app.use("/api/auth", createAuthRouter(authService));
app.use("/api/users", createUserRouter(userService));
app.use("/api/categories", createCategoryRouter(categoryService));
app.use("/api/tags", createTagRouter(tagService));
app.use("/api/colors", createColorRouter(colorService));
app.use("/api/products", createProductRouter(productService));
app.use("/api/audit-logs", createAuditLogRouter(auditLogService));
app.use("/api/announcements", createAnnouncementRouter(announcementService));
app.use("/api/analytics", createAnalyticsRouter(analyticsService));
app.use("/api/uploads", uploadRouter);

// Handler de errores global
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`[Server] Servidor backend corriendo en http://localhost:${PORT}`);
});
