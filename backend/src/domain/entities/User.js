// src/domain/entities/User.js
export class User {
  constructor({ id = null, username, passwordHash, role, isDeleted = false }) {
    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.role = role;
    this.isDeleted = isDeleted;
  }
}