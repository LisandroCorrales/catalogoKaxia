import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";

export const createAuthRouter = (authService) => {
  const router = Router();
  const controller = new AuthController(authService);

  router.post("/register", controller.register);
  router.post("/login", controller.login);

  return router;
};
