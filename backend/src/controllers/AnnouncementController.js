export class AnnouncementController {
  constructor(announcementService) {
    this.announcementService = announcementService;
  }

  getAll = async (req, res, next) => {
    try {
      const items = await this.announcementService.getAnnouncements();
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  };

  save = async (req, res, next) => {
    try {
      // req.body debe ser un array de strings
      const items = await this.announcementService.saveAnnouncements(req.body);
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  };
}
