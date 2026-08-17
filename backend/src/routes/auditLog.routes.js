import { Router } from "express";
import { AuditLogController } from "../controllers/AuditLogController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { Rol } from "../domain/enums/Rol.js";

export const createAuditLogRouter = (auditLogService) => {
  const router = Router();
  const controller = new AuditLogController(auditLogService);

  router.get("/", authenticateToken, requireRole([Rol.ADMIN]), controller.getAll);

  return router;
};
