import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { sanitizeAuthBody } from "../middleware/sanitize.js";

export const createAuthRouter = (authService) => {
  const router = Router();
  const controller = new AuthController(authService);

  router.post("/register", sanitizeAuthBody, controller.register);
  router.post("/login", sanitizeAuthBody, controller.login);

  return router;
};
