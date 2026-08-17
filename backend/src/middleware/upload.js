import multer from "multer";

// Configurar almacenamiento en memoria (RAM)
const storage = multer.memoryStorage();

// Filtrar para aceptar únicamente imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    const error = new Error("El archivo no es una imagen válida. Debe ser tipo imagen (png, jpg, webp, etc).");
    error.statusCode = 400;
    cb(error, false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB por imagen
});
