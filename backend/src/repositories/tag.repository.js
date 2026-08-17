import { TagModel } from "../models/tag.model.js";
import { Tag } from "../domain/entities/Tag.js";

export class TagRepository {
  static toDomain(doc) {
    if (!doc) return null;
    return new Tag({
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      color: doc.color
    });
  }

  static toDatabase(entity) {
    if (!entity) return null;
    return {
      name: entity.name,
      slug: entity.slug,
      color: entity.color
    };
  }

  async findAll() {
    const docs = await TagModel.find().sort({ name: 1 });
    return docs.map(TagRepository.toDomain);
  }

  async findById(id) {
    const doc = await TagModel.findById(id);
    return TagRepository.toDomain(doc);
  }

  async create(tagEntity) {
    const dbObj = TagRepository.toDatabase(tagEntity);
    const doc = await TagModel.create(dbObj);
    return TagRepository.toDomain(doc);
  }

  async update(id, tagEntity) {
    const dbObj = TagRepository.toDatabase(tagEntity);
    const doc = await TagModel.findByIdAndUpdate(id, dbObj, {
      new: true,
      runValidators: true
    });
    return TagRepository.toDomain(doc);
  }

  async delete(id) {
    await TagModel.findByIdAndDelete(id);
    return true;
  }
}
