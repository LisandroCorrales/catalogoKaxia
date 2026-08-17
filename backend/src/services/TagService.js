import { Tag } from "../domain/entities/Tag.js";

export class TagService {
  constructor(tagRepository, auditLogService) {
    this.tagRepository = tagRepository;
    this.auditLogService = auditLogService;
  }

  async getTags() {
    return await this.tagRepository.findAll();
  }

  async getTagById(id) {
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      const error = new Error("Etiqueta no encontrada.");
      error.statusCode = 404;
      throw error;
    }
    return tag;
  }

  async createTag(data, executor) {
    const tag = new Tag(data);
    const saved = await this.tagRepository.create(tag);

    if (executor) {
      await this.auditLogService.log({
        userId: executor.id,
        username: executor.username,
        action: "CREATE",
        entityType: "Tag",
        entityId: saved.id,
        details: { name: saved.name }
      });
    }

    return saved;
  }

  async updateTag(id, data, executor) {
    const existing = await this.getTagById(id);
    const updated = new Tag({ ...existing, ...data, id });
    const saved = await this.tagRepository.update(id, updated);

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
        entityType: "Tag",
        entityId: saved.id,
        details: changedFields
      });
    }

    return saved;
  }

  async deleteTag(id, executor) {
    const existing = await this.getTagById(id);
    const result = await this.tagRepository.delete(id);

    if (executor) {
      await this.auditLogService.log({
        userId: executor.id,
        username: executor.username,
        action: "DELETE",
        entityType: "Tag",
        entityId: id,
        details: { name: existing.name }
      });
    }

    return result;
  }
}
