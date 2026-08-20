export class AnalyticsService {
  constructor(analyticsRepository) {
    this.analyticsRepository = analyticsRepository;
  }

  async getStats() {
    // Forzar el volcado del buffer a MongoDB para ver estadísticas actualizadas al instante
    const stats = await this.analyticsRepository.get(true);
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

  async trackAddToCart(productId, colorId, size, quantity) {
    const stats = await this.analyticsRepository.trackAddToCart(productId, colorId, size, quantity);
    return this._formatStats(stats);
  }

  async trackOrder(cartItems, total) {
    const stats = await this.analyticsRepository.trackOrder(cartItems, total);
    return this._formatStats(stats);
  }

  async trackConsultationClick() {
    const stats = await this.analyticsRepository.trackConsultationClick();
    return this._formatStats(stats);
  }

  async trackWholesalerClick() {
    const stats = await this.analyticsRepository.trackWholesalerClick();
    return this._formatStats(stats);
  }

  _formatStats(stats) {
    // Desestructurar mapa de colores planos (productId_colorId) a objeto anidado { productId: { colorId: qty } }
    const formattedColors = {};
    const colorsMap = stats.productColors instanceof Map ? stats.productColors : new Map(Object.entries(stats.productColors || {}));
    for (const [key, val] of colorsMap.entries()) {
      const [prodId, colId] = key.split("_");
      if (prodId && colId) {
        if (!formattedColors[prodId]) formattedColors[prodId] = {};
        formattedColors[prodId][colId] = val;
      }
    }

    // Desestructurar mapa de talles planos (productId_size) a objeto anidado { productId: { size: qty } }
    const formattedSizes = {};
    const sizesMap = stats.productSizes instanceof Map ? stats.productSizes : new Map(Object.entries(stats.productSizes || {}));
    for (const [key, val] of sizesMap.entries()) {
      const [prodId, size] = key.split("_");
      if (prodId && size) {
        if (!formattedSizes[prodId]) formattedSizes[prodId] = {};
        formattedSizes[prodId][size] = val;
      }
    }

    return {
      sessions: stats.sessions || 0,
      ordersCount: stats.ordersCount || 0,
      montoTotal: stats.montoTotal || 0,
      consultationClicks: stats.consultationClicks || 0,
      wholesalerClicks: stats.wholesalerClicks || 0,
      productViews: stats.productViews instanceof Map ? Object.fromEntries(stats.productViews) : stats.productViews || {},
      productAdds: stats.productAdds instanceof Map ? Object.fromEntries(stats.productAdds) : stats.productAdds || {},
      productOrders: stats.productOrders instanceof Map ? Object.fromEntries(stats.productOrders) : stats.productOrders || {},
      productColors: formattedColors,
      productSizes: formattedSizes,
      dailyRecords: (stats.dailyRecords || []).map(d => ({
        date: d.date,
        sessions: d.sessions || 0,
        ordersCount: d.ordersCount || 0,
        montoTotal: d.montoTotal || 0,
        consultationClicks: d.consultationClicks || 0,
        wholesalerClicks: d.wholesalerClicks || 0,
        productViews: d.productViews instanceof Map ? Object.fromEntries(d.productViews) : d.productViews || {},
        productAdds: d.productAdds instanceof Map ? Object.fromEntries(d.productAdds) : d.productAdds || {},
        productOrders: d.productOrders instanceof Map ? Object.fromEntries(d.productOrders) : d.productOrders || {},
        productColors: d.productColors instanceof Map ? Object.fromEntries(d.productColors) : d.productColors || {},
        productSizes: d.productSizes instanceof Map ? Object.fromEntries(d.productSizes) : d.productSizes || {}
      }))
    };
  }
}
