import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { Rol } from "../domain/enums/Rol.js";
import { sanitizeAuthBody, sanitizeUserPasswordBody } from "../middleware/sanitize.js";

export const createUserRouter = (userService) => {
  const router = Router();
  const controller = new UserController(userService);

  // Proteger todas las rutas de administración de usuarios para que sólo acceda el Administrador
  router.get("/", authenticateToken, requireRole([Rol.ADMIN]), controller.getAll);
  router.post("/", authenticateToken, requireRole([Rol.ADMIN]), sanitizeAuthBody, controller.create);
  router.put("/:id/password", authenticateToken, requireRole([Rol.ADMIN]), sanitizeUserPasswordBody, controller.updatePassword);
  router.delete("/:id", authenticateToken, requireRole([Rol.ADMIN]), controller.delete);
  router.put("/:id/restore", authenticateToken, requireRole([Rol.ADMIN]), controller.restore);

  return router;
};
