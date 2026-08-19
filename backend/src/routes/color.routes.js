import { Router } from "express";
import { ColorController } from "../controllers/ColorController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { Rol } from "../domain/enums/Rol.js";

export const createColorRouter = (colorService) => {
  const router = Router();
  const controller = new ColorController(colorService);

  router.get("/", controller.getAll);
  router.get("/:id", controller.getById);

  router.post("/", authenticateToken, requireRole([Rol.ADMIN, Rol.VENDEDOR]), controller.create);
  router.put("/:id", authenticateToken, requireRole([Rol.ADMIN, Rol.VENDEDOR]), controller.update);
  router.delete("/:id", authenticateToken, requireRole([Rol.ADMIN, Rol.VENDEDOR]), controller.delete);

  return router;
};
