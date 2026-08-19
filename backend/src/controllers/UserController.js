export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  getAll = async (req, res, next) => {
    try {
      const users = await this.userService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const { username, role, password } = req.body;
      const newUser = await this.userService.createUser({ username, role, password });
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  };

  updatePassword = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { password } = req.body;
      await this.userService.updatePassword(id, password);
      res.status(200).json({ message: "Contraseña actualizada exitosamente." });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      // req.user viene del middleware authenticateToken
      const currentUserId = req.user ? req.user.id : null;
      await this.userService.deleteUser(id, currentUserId);
      res.status(200).json({ message: "Usuario desactivado exitosamente." });
    } catch (error) {
      next(error);
    }
  };

  restore = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.userService.restoreUser(id);
      res.status(200).json({ message: "Usuario restaurado exitosamente." });
    } catch (error) {
      next(error);
    }
  };
}
