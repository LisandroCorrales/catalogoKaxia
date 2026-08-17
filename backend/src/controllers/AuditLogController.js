export class AuditLogController {
  constructor(auditLogService) {
    this.auditLogService = auditLogService;
  }

  getAll = async (req, res, next) => {
    try {
      const logs = await this.auditLogService.getLogs();
      res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  };
}
