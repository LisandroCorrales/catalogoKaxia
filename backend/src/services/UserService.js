import bcrypt from "bcryptjs";
import { User } from "../domain/entities/User.js";

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getUsers() {
    const users = await this.userRepository.findAll();
    return users.map(u => ({
      id: u.id,
      username: u.username,
      role: u.role,
      isDeleted: u.isDeleted
    }));
  }

  async createUser({ username, role, password }) {
    const cleanUsername = username.trim();
    const existingUser = await this.userRepository.findByUsername(cleanUsername);
    if (existingUser) {
      const error = new Error("El nombre de usuario ya está registrado.");
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || "123456", salt);

    const user = new User({
      username: cleanUsername,
      passwordHash,
      role,
      isDeleted: false
    });

    const saved = await this.userRepository.create(user);
    return {
      id: saved.id,
      username: saved.username,
      role: saved.role,
      isDeleted: saved.isDeleted
    };
  }

  async updatePassword(id, newPassword) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      const error = new Error("Usuario no encontrado.");
      error.statusCode = 404;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    user.passwordHash = passwordHash;
    await this.userRepository.update(id, user);
    return true;
  }

  async deleteUser(id, currentUserId) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      const error = new Error("Usuario no encontrado.");
      error.statusCode = 404;
      throw error;
    }

    if (currentUserId && currentUserId.toString() === id.toString()) {
      const error = new Error("No puedes eliminar a tu propio usuario activo.");
      error.statusCode = 400;
      throw error;
    }

    await this.userRepository.delete(id);
    return true;
  }

  async restoreUser(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      const error = new Error("Usuario no encontrado.");
      error.statusCode = 404;
      throw error;
    }

    await this.userRepository.restore(id);
    return true;
  }
}
