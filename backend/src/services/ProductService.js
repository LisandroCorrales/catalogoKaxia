import { Product } from "../domain/entities/Product.js";

export class ProductService {
  constructor(productRepository, categoryRepository, tagRepository, colorRepository, auditLogService) {
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
    this.tagRepository = tagRepository;
    this.colorRepository = colorRepository;
    this.auditLogService = auditLogService;
  }

  async getProducts(filters = {}) {
    return await this.productRepository.findAll(filters);
  }

  async getProductById(id) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      const error = new Error("Producto no encontrado.");
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  async createProduct(data, executor) {
    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        const error = new Error("La categoría asociada no existe.");
        error.statusCode = 400;
        throw error;
      }
    }

    if (data.tags && data.tags.length > 0) {
      for (const tagId of data.tags) {
        const tag = await this.tagRepository.findById(tagId);
        if (!tag) {
          const error = new Error(`La etiqueta asociada no existe: ${tagId}`);
          error.statusCode = 400;
          throw error;
        }
      }
    }

    if (data.colors && data.colors.length > 0) {
      for (const colorId of data.colors) {
        const color = await this.colorRepository.findById(colorId);
        if (!color) {
          const error = new Error(`El color asociado no existe: ${colorId}`);
          error.statusCode = 400;
          throw error;
        }
      }
    }

    const product = new Product(data);
    const savedProduct = await this.productRepository.create(product);

    if (executor) {
      await this.auditLogService.log({
        userId: executor.id,
        username: executor.username,
        action: "CREATE",
        entityType: "Product",
        entityId: savedProduct.id,
        details: { name: savedProduct.name, price: savedProduct.price }
      });
    }

    return savedProduct;
  }

  async updateProduct(id, data, executor) {
    const existing = await this.getProductById(id);

    if (data.categoryId && data.categoryId !== existing.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        const error = new Error("La categoría asociada no existe.");
        error.statusCode = 400;
        throw error;
      }
    }

    if (data.tags) {
      for (const tagId of data.tags) {
        const tag = await this.tagRepository.findById(tagId);
        if (!tag) {
          const error = new Error(`La etiqueta asociada no existe: ${tagId}`);
          error.statusCode = 400;
          throw error;
        }
      }
    }

    if (data.colors) {
      for (const colorId of data.colors) {
        const color = await this.colorRepository.findById(colorId);
        if (!color) {
          const error = new Error(`El color asociado no existe: ${colorId}`);
          error.statusCode = 400;
          throw error;
        }
      }
    }

    const updated = new Product({ ...existing, ...data, id });
    const savedProduct = await this.productRepository.update(id, updated);

    if (executor) {
      const changedFields = {};
      for (const key of Object.keys(data)) {
        if (JSON.stringify(data[key]) !== JSON.stringify(existing[key])) {
          changedFields[key] = { previous: existing[key], current: data[key] };
        }
      }

      await this.auditLogService.log({
        userId: executor.id,
        username: executor.username,
        action: "UPDATE",
        entityType: "Product",
        entityId: savedProduct.id,
        details: changedFields
      });
    }

    return savedProduct;
  }

  async deleteProduct(id, executor) {
    const existing = await this.getProductById(id);
    const result = await this.productRepository.delete(id);

    if (executor) {
      await this.auditLogService.log({
        userId: executor.id,
        username: executor.username,
        action: "DELETE",
        entityType: "Product",
        entityId: id,
        details: { name: existing.name }
      });
    }

    return result;
  }
}
