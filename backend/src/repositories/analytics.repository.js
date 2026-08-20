import { AnalyticsModel } from "../models/analytics.model.js";

// RAM Buffer Singleton
let statsBuffer = {
  sessions: 0,
  ordersCount: 0,
  montoTotal: 0,
  consultationClicks: 0,
  wholesalerClicks: 0,
  productViews: {}, // productId -> Qty
  productAdds: {},  // productId -> Qty
  productOrders: {}, // productId -> Qty
  productColors: {}, // `${productId}_${colorId}` -> Qty
  productSizes: {}   // `${productId}_${size}` -> Qty
};

let bufferTimer = null;
let isFlushing = false;

const todayStr = () => new Date().toISOString().split("T")[0];

// Iniciar timer automático de volcado si no está iniciado
if (!bufferTimer) {
  bufferTimer = setInterval(async () => {
    try {
      await flushStatsToDatabase();
    } catch (err) {
      console.error("Error en flush automático de analíticas:", err);
    }
  }, 2 * 60 * 1000); // Cada 2 minutos
}

// Persistir antes de que se apague el proceso (despliegues de Render)
process.on("SIGTERM", async () => {
  console.log("SIGTERM recibido, guardando buffer de analíticas...");
  await flushStatsToDatabase();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT recibido, guardando buffer de analíticas...");
  await flushStatsToDatabase();
  process.exit(0);
});

// Función para volcar los datos acumulados de RAM a la base de datos usando un $inc atómico
async function flushStatsToDatabase() {
  if (isFlushing) return;

  const hasData =
    statsBuffer.sessions > 0 ||
    statsBuffer.ordersCount > 0 ||
    statsBuffer.montoTotal > 0 ||
    statsBuffer.consultationClicks > 0 ||
    statsBuffer.wholesalerClicks > 0 ||
    Object.keys(statsBuffer.productViews).length > 0 ||
    Object.keys(statsBuffer.productAdds).length > 0 ||
    Object.keys(statsBuffer.productOrders).length > 0 ||
    Object.keys(statsBuffer.productColors).length > 0 ||
    Object.keys(statsBuffer.productSizes).length > 0;

  if (!hasData) return;

  isFlushing = true;

  try {
    const currentDate = todayStr();
    const updateObj = {};

    if (statsBuffer.sessions > 0) updateObj.sessions = statsBuffer.sessions;
    if (statsBuffer.ordersCount > 0) updateObj.ordersCount = statsBuffer.ordersCount;
    if (statsBuffer.montoTotal > 0) updateObj.montoTotal = statsBuffer.montoTotal;
    if (statsBuffer.consultationClicks > 0) updateObj.consultationClicks = statsBuffer.consultationClicks;
    if (statsBuffer.wholesalerClicks > 0) updateObj.wholesalerClicks = statsBuffer.wholesalerClicks;

    for (const [prodId, count] of Object.entries(statsBuffer.productViews)) {
      updateObj[`productViews.${prodId}`] = count;
    }
    for (const [prodId, count] of Object.entries(statsBuffer.productAdds)) {
      updateObj[`productAdds.${prodId}`] = count;
    }
    for (const [prodId, count] of Object.entries(statsBuffer.productOrders)) {
      updateObj[`productOrders.${prodId}`] = count;
    }
    for (const [key, count] of Object.entries(statsBuffer.productColors)) {
      updateObj[`productColors.${key}`] = count;
    }
    for (const [key, count] of Object.entries(statsBuffer.productSizes)) {
      updateObj[`productSizes.${key}`] = count;
    }

    // Clonar y vaciar el buffer antes del await para no perder nuevos eventos mientras se escribe en DB
    statsBuffer = {
      sessions: 0,
      ordersCount: 0,
      montoTotal: 0,
      consultationClicks: 0,
      wholesalerClicks: 0,
      productViews: {},
      productAdds: {},
      productOrders: {},
      productColors: {},
      productSizes: {}
    };

    await AnalyticsModel.updateOne(
      { date: currentDate },
      { $inc: updateObj },
      { upsert: true }
    );
  } catch (err) {
    console.error("Error al persistir estadísticas en MongoDB:", err);
  } finally {
    isFlushing = false;
  }
}

// Consolidar varios documentos de días distintos en un único objeto sumado
function consolidateDocs(docs) {
  const result = {
    sessions: 0,
    ordersCount: 0,
    montoTotal: 0,
    consultationClicks: 0,
    wholesalerClicks: 0,
    productViews: new Map(),
    productAdds: new Map(),
    productOrders: new Map(),
    productColors: new Map(),
    productSizes: new Map()
  };

  for (const doc of docs) {
    result.sessions += doc.sessions || 0;
    result.ordersCount += doc.ordersCount || 0;
    result.montoTotal += doc.montoTotal || 0;
    result.consultationClicks += doc.consultationClicks || 0;
    result.wholesalerClicks += doc.wholesalerClicks || 0;

    if (doc.productViews) {
      for (const [prodId, count] of doc.productViews.entries()) {
        result.productViews.set(prodId, (result.productViews.get(prodId) || 0) + count);
      }
    }
    if (doc.productAdds) {
      for (const [prodId, count] of doc.productAdds.entries()) {
        result.productAdds.set(prodId, (result.productAdds.get(prodId) || 0) + count);
      }
    }
    if (doc.productOrders) {
      for (const [prodId, count] of doc.productOrders.entries()) {
        result.productOrders.set(prodId, (result.productOrders.get(prodId) || 0) + count);
      }
    }
    if (doc.productColors) {
      for (const [key, count] of doc.productColors.entries()) {
        result.productColors.set(key, (result.productColors.get(key) || 0) + count);
      }
    }
    if (doc.productSizes) {
      for (const [key, count] of doc.productSizes.entries()) {
        result.productSizes.set(key, (result.productSizes.get(key) || 0) + count);
      }
    }
  }

  return result;
}

export class AnalyticsRepository {
  // forceFlush es true sólo cuando el dashboard (GET /analytics) solicita las métricas actuales
  async get(forceFlush = false) {
    if (forceFlush) {
      await flushStatsToDatabase();
    }

    const docs = await AnalyticsModel.find({});

    // Si la base está vacía del todo y no hay nada, inicializar un registro diario con valores históricos base
    if (docs.length === 0) {
      return {
        sessions: 0,
        ordersCount: 0,
        montoTotal: 0,
        consultationClicks: 0,
        wholesalerClicks: 0,
        productViews: new Map(),
        productAdds: new Map(),
        productOrders: new Map(),
        productColors: new Map(),
        productSizes: new Map()
      };
    }

    return consolidateDocs(docs);
  }

  async trackSession() {
    statsBuffer.sessions += 1;
    return this.get(false); // No fuerza flush, responde instantáneo de RAM + DB consolidada
  }

  async trackView(productId) {
    if (productId) {
      const pidStr = productId.toString();
      statsBuffer.productViews[pidStr] = (statsBuffer.productViews[pidStr] || 0) + 1;
    }
    return this.get(false);
  }

  async trackAddToCart(productId, colorId, size, quantity) {
    const qty = parseInt(quantity) || 1;
    if (productId) {
      const pidStr = productId.toString();
      statsBuffer.productAdds[pidStr] = (statsBuffer.productAdds[pidStr] || 0) + qty;
      
      if (colorId) {
        const key = `${pidStr}_${colorId.toString()}`;
        statsBuffer.productColors[key] = (statsBuffer.productColors[key] || 0) + qty;
      }
      if (size) {
        const key = `${pidStr}_${size}`;
        statsBuffer.productSizes[key] = (statsBuffer.productSizes[key] || 0) + qty;
      }
    }
    return this.get(false);
  }

  async trackOrder(cartItems, total) {
    statsBuffer.ordersCount += 1;
    statsBuffer.montoTotal += parseFloat(total) || 0;

    for (const item of cartItems) {
      const pid = (item.product && (item.product.id || item.product._id)) || item.product;
      if (pid) {
        const pidStr = pid.toString();
        const qty = parseInt(item.quantity) || 1;
        statsBuffer.productOrders[pidStr] = (statsBuffer.productOrders[pidStr] || 0) + qty;

        const colorId = item.color && (item.color.id || item.color._id || item.color);
        if (colorId) {
          const key = `${pidStr}_${colorId.toString()}`;
          statsBuffer.productColors[key] = (statsBuffer.productColors[key] || 0) + qty;
        }

        if (item.size) {
          const key = `${pidStr}_${item.size}`;
          statsBuffer.productSizes[key] = (statsBuffer.productSizes[key] || 0) + qty;
        }
      }
    }

    return this.get(false);
  }

  async trackConsultationClick() {
    statsBuffer.consultationClicks += 1;
    return this.get(false);
  }

  async trackWholesalerClick() {
    statsBuffer.wholesalerClicks += 1;
    return this.get(false);
  }
}
