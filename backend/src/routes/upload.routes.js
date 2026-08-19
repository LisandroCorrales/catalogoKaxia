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

const getPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex === -1) return null;
  let startIndex = uploadIndex + 1;
  if (parts[startIndex] && parts[startIndex].startsWith("v")) {
    startIndex += 1;
  }
  const publicIdWithExtension = parts.slice(startIndex).join("/");
  const lastDotIndex = publicIdWithExtension.lastIndexOf(".");
  if (lastDotIndex === -1) return publicIdWithExtension;
  return publicIdWithExtension.substring(0, lastDotIndex);
};

router.delete("/", authenticateToken, requireRole([Rol.ADMIN, Rol.VENDEDOR]), async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) {
      const error = new Error("URL de imagen requerida.");
      error.statusCode = 400;
      throw error;
    }

    const publicId = getPublicIdFromUrl(url);
    if (!publicId) {
      return res.status(400).json({ message: "No se pudo extraer el public_id de la URL provista." });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    res.status(200).json({ message: "Imagen eliminada de Cloudinary con éxito.", result });
  } catch (error) {
    next(error);
  }
});

export const uploadRouter = router;
