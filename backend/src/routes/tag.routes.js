import { Router } from "express";
import { TagController } from "../controllers/TagController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { Rol } from "../domain/enums/Rol.js";

export const createTagRouter = (tagService) => {
  const router = Router();
  const controller = new TagController(tagService);

  router.get("/", controller.getAll);
  router.get("/:id", controller.getById);

  // Operaciones protegidas de Administración
  router.post("/", authenticateToken, requireRole([Rol.ADMIN, Rol.VENDEDOR]), controller.create);
  router.put("/:id", authenticateToken, requireRole([Rol.ADMIN, Rol.VENDEDOR]), controller.update);
  router.delete("/:id", authenticateToken, requireRole([Rol.ADMIN, Rol.VENDEDOR]), controller.delete);

  return router;
};
