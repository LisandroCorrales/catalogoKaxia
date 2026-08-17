import { AuditLog } from "../domain/entities/AuditLog.js";

export class AuditLogService {
  constructor(auditLogRepository) {
    this.auditLogRepository = auditLogRepository;
  }

  async getLogs() {
    return await this.auditLogRepository.findAll();
  }

  async log({ userId, username, action, entityType, entityId, details = {} }) {
    const auditLog = new AuditLog({
      userId,
      username,
      action,
      entityType,
      entityId,
      details
    });
    return await this.auditLogRepository.create(auditLog);
  }
}
