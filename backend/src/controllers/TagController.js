export class TagController {
  constructor(tagService) {
    this.tagService = tagService;
  }

  getAll = async (req, res, next) => {
    try {
      const tags = await this.tagService.getTags();
      res.status(200).json(tags);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const tag = await this.tagService.getTagById(req.params.id);
      res.status(200).json(tag);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const tag = await this.tagService.createTag(req.body, req.user);
      res.status(201).json(tag);
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const tag = await this.tagService.updateTag(req.params.id, req.body, req.user);
      res.status(200).json(tag);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.tagService.deleteTag(req.params.id, req.user);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
}
