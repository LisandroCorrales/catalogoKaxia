export class Category {
  constructor({ id = null, name, slug = null, description = "", isActive = true }) {
    this.id = id;
    this.name = this.validateName(name);
    this.slug = this.validateSlug(slug || name);
    this.description = description;
    this.isActive = isActive;
  }

  validateName(name) {
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      const error = new Error("El nombre de la categoría es obligatorio.");
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
}
