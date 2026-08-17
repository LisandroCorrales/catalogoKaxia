export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  register = async (req, res, next) => {
    try {
      const { username, password, role } = req.body;
      const user = await this.authService.register({ username, password, role });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const result = await this.authService.login({ username, password });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
