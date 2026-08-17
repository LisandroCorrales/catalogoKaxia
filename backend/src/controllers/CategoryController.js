export class CategoryController {
  constructor(categoryService) {
    this.categoryService = categoryService;
  }

  getAll = async (req, res, next) => {
    try {
      const categories = await this.categoryService.getCategories();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const category = await this.categoryService.getCategoryById(req.params.id);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const category = await this.categoryService.createCategory(req.body, req.user);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const category = await this.categoryService.updateCategory(req.params.id, req.body, req.user);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.categoryService.deleteCategory(req.params.id, req.user);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
}
