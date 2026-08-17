import { ProductModel } from "../models/product.model.js";
import { Product } from "../domain/entities/Product.js";
import { ColorRepository } from "./color.repository.js";

export class ProductRepository {
  static toDomain(doc) {
    if (!doc) return null;
    return new Product({
      id: doc._id.toString(),
      name: doc.name,
      price: doc.price,
      image: doc.image,
      gallery: doc.gallery,
      fabric: doc.fabric,
      colors: doc.colors ? doc.colors.map(c => {
        if (typeof c === "object" && c._id && c.name) {
          return ColorRepository.toDomain(c);
        }
        return c.toString();
      }) : [],
      sizes: doc.sizes,
      print: doc.print,
      details: doc.details,
      stock: doc.stock,
      measurements: doc.measurements instanceof Map ? Object.fromEntries(doc.measurements) : doc.measurements,
      categoryId: doc.categoryId ? doc.categoryId.toString() : null,
      tags: doc.tags ? doc.tags.map(t => t.toString()) : []
    });
  }

  static toDatabase(entity) {
    if (!entity) return null;
    return {
      name: entity.name,
      price: entity.price,
      image: entity.image,
      gallery: entity.gallery,
      fabric: entity.fabric,
      colors: entity.colors.map(c => typeof c === "string" ? c : c.id),
      sizes: entity.sizes,
      print: entity.print,
      details: entity.details,
      stock: entity.stock,
      measurements: entity.measurements,
      categoryId: entity.categoryId,
      tags: entity.tags
    };
  }

  async findAll(filters = {}) {
    const query = {};
    if (filters.categoryId) query.categoryId = filters.categoryId;
    if (filters.tagId) query.tags = filters.tagId;

    const docs = await ProductModel.find(query).sort({ createdAt: -1 });
    return docs.map(ProductRepository.toDomain);
  }

  async findById(id) {
    const doc = await ProductModel.findById(id);
    return ProductRepository.toDomain(doc);
  }

  async create(productEntity) {
    const dbObj = ProductRepository.toDatabase(productEntity);
    const doc = await ProductModel.create(dbObj);
    return ProductRepository.toDomain(doc);
  }

  async update(id, productEntity) {
    const dbObj = ProductRepository.toDatabase(productEntity);
    const doc = await ProductModel.findByIdAndUpdate(id, dbObj, {
      new: true,
      runValidators: true
    });
    return ProductRepository.toDomain(doc);
  }

  async delete(id) {
    await ProductModel.findByIdAndDelete(id);
    return true;
  }
}
