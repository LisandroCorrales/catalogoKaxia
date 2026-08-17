import { Color } from "../domain/entities/Color.js";

export class ColorService {
  constructor(colorRepository) {
    this.colorRepository = colorRepository;
  }

  async getColors() {
    return await this.colorRepository.findAll();
  }

  async getColorById(id) {
    const color = await this.colorRepository.findById(id);
    if (!color) {
      const error = new Error("Color no encontrado.");
      error.statusCode = 404;
      throw error;
    }
    return color;
  }

  async createColor(data) {
    const color = new Color(data);
    return await this.colorRepository.create(color);
  }

  async updateColor(id, data) {
    const existing = await this.getColorById(id);
    const updated = new Color({ ...existing, ...data, id });
    return await this.colorRepository.update(id, updated);
  }

  async deleteColor(id) {
    await this.getColorById(id);
    return await this.colorRepository.delete(id);
  }
}
