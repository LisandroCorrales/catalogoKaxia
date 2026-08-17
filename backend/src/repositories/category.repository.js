import { CategoryModel } from "../models/category.model.js";
import { Category } from "../domain/entities/Category.js";

export class CategoryRepository {
  static toDomain(doc) {
    if (!doc) return null;
    return new Category({
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      isActive: doc.isActive
    });
  }

  static toDatabase(entity) {
    if (!entity) return null;
    return {
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      isActive: entity.isActive
    };
  }

  async findAll() {
    const docs = await CategoryModel.find().sort({ name: 1 });
    return docs.map(CategoryRepository.toDomain);
  }

  async findById(id) {
    const doc = await CategoryModel.findById(id);
    return CategoryRepository.toDomain(doc);
  }

  async create(categoryEntity) {
    const dbObj = CategoryRepository.toDatabase(categoryEntity);
    const doc = await CategoryModel.create(dbObj);
    return CategoryRepository.toDomain(doc);
  }

  async update(id, categoryEntity) {
    const dbObj = CategoryRepository.toDatabase(categoryEntity);
    const doc = await CategoryModel.findByIdAndUpdate(id, dbObj, {
      new: true,
      runValidators: true
    });
    return CategoryRepository.toDomain(doc);
  }

  async delete(id) {
    await CategoryModel.findByIdAndDelete(id);
    return true;
  }
}
