import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../domain/entities/User.js";

export class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register({ username, password, role }) {
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      const error = new Error("El nombre de usuario ya está registrado.");
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      passwordHash,
      role
    });

    const savedUser = await this.userRepository.create(user);
    
    // Omitir contraseña al devolver
    return {
      id: savedUser.id,
      username: savedUser.username,
      role: savedUser.role
    };
  }

  async login({ username, password }) {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      const error = new Error("Credenciales inválidas.");
      error.statusCode = 401;
      throw error;
    }

    if (user.isDeleted) {
      const error = new Error("Este usuario ha sido desactivado.");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const error = new Error("Credenciales inválidas.");
      error.statusCode = 401;
      throw error;
    }

    const tokenSecret = process.env.JWT_SECRET;
    if (!tokenSecret) {
      const error = new Error("JWT_SECRET no está configurado en el servidor.");
      error.statusCode = 500;
      throw error;
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      tokenSecret,
      { expiresIn: "1h" }
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      token
    };
  }
}
