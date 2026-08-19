import { AnalyticsModel } from "../models/analytics.model.js";

export class AnalyticsRepository {
  async get() {
    let doc = await AnalyticsModel.findOne();
    if (!doc) {
      doc = await AnalyticsModel.create({
        sessions: 1540,
        ordersCount: 124,
        montoTotal: 1250000,
        productViews: new Map(),
        productAdds: new Map(),
        productOrders: new Map()
      });
    }
    return doc;
  }

  async trackSession() {
    const doc = await this.get();
    doc.sessions += 1;
    await doc.save();
    return doc;
  }

  async trackView(productId) {
    const doc = await this.get();
    const current = doc.productViews.get(productId) || 0;
    doc.productViews.set(productId, current + 1);
    await doc.save();
    return doc;
  }

  async trackAddToCart(productId) {
    const doc = await this.get();
    const current = doc.productAdds.get(productId) || 0;
    doc.productAdds.set(productId, current + 1);
    await doc.save();
    return doc;
  }

  async trackOrder(cartItems, total) {
    const doc = await this.get();
    doc.ordersCount += 1;
    doc.montoTotal += total;

    for (const item of cartItems) {
      // Intentar obtener el ID del producto
      const pid = (item.product && (item.product.id || item.product._id)) || item.product;
      if (pid) {
        const qty = item.quantity || 1;
        const current = doc.productOrders.get(pid.toString()) || 0;
        doc.productOrders.set(pid.toString(), current + qty);
      }
    }

    await doc.save();
    return doc;
  }
}
