import { Router } from "express";
import { AnalyticsController } from "../controllers/AnalyticsController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { Rol } from "../domain/enums/Rol.js";

export const createAnalyticsRouter = (analyticsService) => {
  const router = Router();
  const controller = new AnalyticsController(analyticsService);

  // El administrador o vendedor pueden ver las estadísticas
  router.get("/", authenticateToken, requireRole([Rol.ADMIN, Rol.VENDEDOR]), controller.getStats);

  // Rutas públicas para el tracking desde el catálogo
  router.post("/session", controller.trackSession);
  router.post("/view", controller.trackView);
  router.post("/cart", controller.trackAddToCart);
  router.post("/order", controller.trackOrder);
  router.post("/consultation", controller.trackConsultationClick);
  router.post("/wholesaler", controller.trackWholesalerClick);

  return router;
};
