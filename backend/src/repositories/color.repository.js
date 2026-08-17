import { ColorModel } from "../models/color.model.js";
import { Color } from "../domain/entities/Color.js";

export class ColorRepository {
  static toDomain(doc) {
    if (!doc) return null;
    return new Color({
      id: doc._id.toString(),
      name: doc.name,
      hexCode: doc.hexCode
    });
  }

  static toDatabase(entity) {
    if (!entity) return null;
    return {
      name: entity.name,
      hexCode: entity.hexCode
    };
  }

  async findAll() {
    const docs = await ColorModel.find().sort({ name: 1 });
    return docs.map(ColorRepository.toDomain);
  }

  async findById(id) {
    const doc = await ColorModel.findById(id);
    return ColorRepository.toDomain(doc);
  }

  async create(colorEntity) {
    const dbObj = ColorRepository.toDatabase(colorEntity);
    const doc = await ColorModel.create(dbObj);
    return ColorRepository.toDomain(doc);
  }

  async update(id, colorEntity) {
    const dbObj = ColorRepository.toDatabase(colorEntity);
    const doc = await ColorModel.findByIdAndUpdate(id, dbObj, {
      new: true,
      runValidators: true
    });
    return ColorRepository.toDomain(doc);
  }

  async delete(id) {
    await ColorModel.findByIdAndDelete(id);
    return true;
  }
}
