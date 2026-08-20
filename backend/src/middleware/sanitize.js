export const sanitizeAuthBody = (req, res, next) => {
  const { username, password } = req.body;
  if (username !== undefined && typeof username !== "string") {
    return res.status(400).json({ message: "El nombre de usuario debe ser una cadena de texto." });
  }
  if (password !== undefined && typeof password !== "string") {
    return res.status(400).json({ message: "La contraseña debe ser una cadena de texto." });
  }
  next();
};

export const sanitizeUserPasswordBody = (req, res, next) => {
  const { newPassword } = req.body;
  if (newPassword !== undefined && typeof newPassword !== "string") {
    return res.status(400).json({ message: "La nueva contraseña debe ser una cadena de texto." });
  }
  next();
};
