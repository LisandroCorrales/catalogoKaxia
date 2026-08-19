import { Router } from "express";
import { AnnouncementController } from "../controllers/AnnouncementController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { Rol } from "../domain/enums/Rol.js";

export const createAnnouncementRouter = (announcementService) => {
  const router = Router();
  const controller = new AnnouncementController(announcementService);

  router.get("/", controller.getAll);
  router.put("/", authenticateToken, requireRole([Rol.ADMIN, Rol.VENDEDOR]), controller.save);

  return router;
};
