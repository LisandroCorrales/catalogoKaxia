import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token de acceso requerido." });
  }

  const tokenSecret = process.env.JWT_SECRET;
  if (!tokenSecret) {
    return res.status(500).json({ message: "JWT_SECRET no configurado en el servidor." });
  }

  jwt.verify(token, tokenSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido o expirado." });
    }
    req.user = user;
    next();
  });
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "No tienes permisos suficientes para realizar esta acción." });
    }
    next();
  };
};
