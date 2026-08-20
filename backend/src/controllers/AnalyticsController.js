export class AnalyticsController {
  constructor(analyticsService) {
    this.analyticsService = analyticsService;
  }

  getStats = async (req, res, next) => {
    try {
      const stats = await this.analyticsService.getStats();
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  };

  trackSession = async (req, res, next) => {
    try {
      const stats = await this.analyticsService.trackSession();
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  };

  trackView = async (req, res, next) => {
    try {
      const { productId } = req.body;
      const stats = await this.analyticsService.trackView(productId);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  };

  trackAddToCart = async (req, res, next) => {
    try {
      const { productId, colorId, size, quantity } = req.body;
      const stats = await this.analyticsService.trackAddToCart(productId, colorId, size, quantity);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  };

  trackOrder = async (req, res, next) => {
    try {
      const { cartItems, total } = req.body;
      const stats = await this.analyticsService.trackOrder(cartItems, total);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  };

  trackConsultationClick = async (req, res, next) => {
    try {
      const stats = await this.analyticsService.trackConsultationClick();
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  };

  trackWholesalerClick = async (req, res, next) => {
    try {
      const stats = await this.analyticsService.trackWholesalerClick();
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  };
}
