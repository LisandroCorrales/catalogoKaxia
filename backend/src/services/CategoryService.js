import { Category } from "../domain/entities/Category.js";

export class CategoryService {
  constructor(categoryRepository, auditLogService) {
    this.categoryRepository = categoryRepository;
    this.auditLogService = auditLogService;
  }

  async getCategories() {
    return await this.categoryRepository.findAll();
  }

  async getCategoryById(id) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      const error = new Error("Categoría no encontrada.");
      error.statusCode = 404;
      throw error;
    }
    return category;
  }

  async createCategory(data, executor) {
    const category = new Category(data);
    const saved = await this.categoryRepository.create(category);

    if (executor) {
      await this.auditLogService.log({
        userId: executor.id,
        username: executor.username,
        action: "CREATE",
        entityType: "Category",
        entityId: saved.id,
        details: { name: saved.name }
      });
    }

    return saved;
  }

  async updateCategory(id, data, executor) {
    const existing = await this.getCategoryById(id);
    const updated = new Category({ ...existing, ...data, id });
    const saved = await this.categoryRepository.update(id, updated);

    if (executor) {
      const changedFields = {};
      for (const key of Object.keys(data)) {
        if (data[key] !== existing[key]) {
          changedFields[key] = { previous: existing[key], current: data[key] };
        }
      }

      await this.auditLogService.log({
        userId: executor.id,
        username: executor.username,
        action: "UPDATE",
        entityType: "Category",
        entityId: saved.id,
        details: changedFields
      });
    }

    return saved;
  }

  async deleteCategory(id, executor) {
    const existing = await this.getCategoryById(id);
    const result = await this.categoryRepository.delete(id);

    if (executor) {
      await this.auditLogService.log({
        userId: executor.id,
        username: executor.username,
        action: "DELETE",
        entityType: "Category",
        entityId: id,
        details: { name: existing.name }
      });
    }

    return result;
  }
}
