export class AnnouncementService {
  constructor(announcementRepository) {
    this.announcementRepository = announcementRepository;
  }

  async getAnnouncements() {
    return await this.announcementRepository.get();
  }

  async saveAnnouncements(items) {
    return await this.announcementRepository.save(items);
  }
}
