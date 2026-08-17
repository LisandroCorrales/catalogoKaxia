export class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  getAll = async (req, res, next) => {
    try {
      const { categoryId, tagId } = req.query;
      const products = await this.productService.getProducts({ categoryId, tagId });
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const product = await this.productService.createProduct(req.body, req.user);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const product = await this.productService.updateProduct(req.params.id, req.body, req.user);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.productService.deleteProduct(req.params.id, req.user);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
}
