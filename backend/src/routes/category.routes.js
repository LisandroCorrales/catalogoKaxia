import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { Rol } from "../domain/enums/Rol.js";

export const createCategoryRouter = (categoryService) => {
  const router = Router();
  const controller = new CategoryController(categoryService);

  router.get("/", controller.getAll);
  router.get("/:id", controller.getById);

  // Operaciones protegidas de Administración
  router.post("/", authenticateToken, requireRole([Rol.ADMIN, Rol.VENDEDOR]), controller.create);
  router.put("/:id", authenticateToken, requireRole([Rol.ADMIN, Rol.VENDEDOR]), controller.update);
  router.delete("/:id", authenticateToken, requireRole([Rol.ADMIN, Rol.VENDEDOR]), controller.delete);

  return router;
};
