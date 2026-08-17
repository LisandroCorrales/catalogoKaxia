export class Color {
  constructor({ id = null, name, hexCode }) {
    this.id = id;
    this.name = this.validateName(name);
    this.hexCode = this.validateHexCode(hexCode);
  }

  validateName(name) {
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      const error = new Error("El nombre del color es obligatorio.");
      error.statusCode = 400;
      throw error;
    }
    return name.trim();
  }

  validateHexCode(hexCode) {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexCode || !hexRegex.test(hexCode)) {
      const error = new Error("El código hexadecimal del color es inválido (ej: #FF0000).");
      error.statusCode = 400;
      throw error;
    }
    return hexCode.toUpperCase();
  }
}
