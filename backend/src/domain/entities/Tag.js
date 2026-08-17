export class Tag {
  constructor({ id = null, name, slug = null, color = "#667085" }) {
    this.id = id;
    this.name = this.validateName(name);
    this.slug = this.validateSlug(slug || name);
    this.color = this.validateColor(color);
  }

  validateName(name) {
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      const error = new Error("El nombre de la etiqueta es obligatorio.");
      error.statusCode = 400;
      throw error;
    }
    return name.trim();
  }

  validateSlug(slug) {
    if (!slug || typeof slug !== "string") return "";
    return slug.toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes
  }

  validateColor(color) {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!color || !hexRegex.test(color)) {
      const error = new Error("El color de la etiqueta debe ser un código hexadecimal válido (ej: #FF0000).");
      error.statusCode = 400;
      throw error;
    }
    return color.toUpperCase();
  }
}
