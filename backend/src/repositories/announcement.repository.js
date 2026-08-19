import { AnnouncementModel } from "../models/announcement.model.js";

export class AnnouncementRepository {
  async get() {
    let doc = await AnnouncementModel.findOne();
    if (!doc) {
      doc = await AnnouncementModel.create({
        items: [
          "Talles M — XXL",
          "Jersey 20.1",
          "Calidad de estampado",
          "Hecho en Argentina 🇦🇷"
        ]
      });
    }
    return doc.items;
  }

  async save(items) {
    let doc = await AnnouncementModel.findOne();
    if (!doc) {
      doc = await AnnouncementModel.create({ items });
    } else {
      doc.items = items;
      await doc.save();
    }
    return doc.items;
  }
}
