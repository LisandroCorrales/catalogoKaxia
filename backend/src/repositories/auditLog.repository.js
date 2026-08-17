import { AuditLogModel } from "../models/auditLog.model.js";
import { AuditLog } from "../domain/entities/AuditLog.js";

export class AuditLogRepository {
  static toDomain(doc) {
    if (!doc) return null;
    return new AuditLog({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      username: doc.username,
      action: doc.action,
      entityType: doc.entityType,
      entityId: doc.entityId,
      details: doc.details,
      createdAt: doc.createdAt
    });
  }

  static toDatabase(entity) {
    if (!entity) return null;
    return {
      userId: entity.userId,
      username: entity.username,
      action: entity.action,
      entityType: entity.entityType,
      entityId: entity.entityId,
      details: entity.details
    };
  }

  async findAll() {
    const docs = await AuditLogModel.find().sort({ createdAt: -1 });
    return docs.map(AuditLogRepository.toDomain);
  }

  async create(auditLogEntity) {
    const dbObj = AuditLogRepository.toDatabase(auditLogEntity);
    const doc = await AuditLogModel.create(dbObj);
    return AuditLogRepository.toDomain(doc);
  }
}
