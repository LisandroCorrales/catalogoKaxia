export class AuditLog {
  constructor({
    id = null,
    userId,
    username,
    action,
    entityType,
    entityId,
    details = {},
    createdAt = new Date()
  }) {
    this.id = id;
    this.userId = this.validateRequired(userId, "userId");
    this.username = this.validateRequired(username, "username");
    this.action = this.validateRequired(action, "action");
    this.entityType = this.validateRequired(entityType, "entityType");
    this.entityId = this.validateRequired(entityId, "entityId");
    this.details = details;
    this.createdAt = createdAt;
  }

  validateRequired(val, fieldName) {
    if (!val || typeof val !== "string" || val.trim().length === 0) {
      const error = new Error(`El campo ${fieldName} es obligatorio en el log de auditoría.`);
      error.statusCode = 400;
      throw error;
    }
    return val.trim();
  }
}
