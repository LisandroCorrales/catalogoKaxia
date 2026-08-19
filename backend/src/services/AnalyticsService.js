export class AnalyticsService {
  constructor(analyticsRepository) {
    this.analyticsRepository = analyticsRepository;
  }

  async getStats() {
    const stats = await this.analyticsRepository.get();
    return this._formatStats(stats);
  }

  async trackSession() {
    const stats = await this.analyticsRepository.trackSession();
    return this._formatStats(stats);
  }

  async trackView(productId) {
    const stats = await this.analyticsRepository.trackView(productId);
    return this._formatStats(stats);
  }

  async trackAddToCart(productId) {
    const stats = await this.analyticsRepository.trackAddToCart(productId);
    return this._formatStats(stats);
  }

  async trackOrder(cartItems, total) {
    const stats = await this.analyticsRepository.trackOrder(cartItems, total);
    return this._formatStats(stats);
  }

  _formatStats(stats) {
    return {
      sessions: stats.sessions,
      ordersCount: stats.ordersCount,
      montoTotal: stats.montoTotal,
      productViews: stats.productViews instanceof Map ? Object.fromEntries(stats.productViews) : stats.productViews,
      productAdds: stats.productAdds instanceof Map ? Object.fromEntries(stats.productAdds) : stats.productAdds,
      productOrders: stats.productOrders instanceof Map ? Object.fromEntries(stats.productOrders) : stats.productOrders
    };
  }
}
