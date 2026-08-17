import { Router } from "express";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { Rol } from "../domain/enums/Rol.js";
import cloudinary from "../config/cloudinary.js";

const router = Router();

router.post("/", authenticateToken, requireRole([Rol.ADMIN, Rol.VENDEDOR]), upload.single("image"), (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("No se ha proporcionado ninguna imagen para subir.");
      error.statusCode = 400;
      throw error;
    }

    // Configurar la transmisión de carga hacia Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "kaxia_catalogo" }, // Guarda las fotos en la carpeta "kaxia_catalogo" de tu Cloudinary
      (err, result) => {
        if (err) {
          return next(err);
        }
        // Responder con la URL segura entregada por Cloudinary
        res.status(200).json({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    );

    // Escribir el buffer del archivo en la transmisión
    uploadStream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
});

export const uploadRouter = router;
