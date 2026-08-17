export class ColorController {
  constructor(colorService) {
    this.colorService = colorService;
  }

  getAll = async (req, res, next) => {
    try {
      const colors = await this.colorService.getColors();
      res.status(200).json(colors);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const color = await this.colorService.getColorById(req.params.id);
      res.status(200).json(color);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const color = await this.colorService.createColor(req.body);
      res.status(201).json(color);
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const color = await this.colorService.updateColor(req.params.id, req.body);
      res.status(200).json(color);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.colorService.deleteColor(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
}
