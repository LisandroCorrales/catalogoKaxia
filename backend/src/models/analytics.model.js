import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true }, // Formato YYYY-MM-DD
    sessions: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
    montoTotal: { type: Number, default: 0 },
    consultationClicks: { type: Number, default: 0 },
    wholesalerClicks: { type: Number, default: 0 },
    productViews: { type: Map, of: Number, default: new Map() },
    productAdds: { type: Map, of: Number, default: new Map() },
    productOrders: { type: Map, of: Number, default: new Map() },
    productColors: { type: Map, of: Number, default: new Map() }, // Clave flat: `productId_colorId` -> Qty
    productSizes: { type: Map, of: Number, default: new Map() }    // Clave flat: `productId_size` -> Qty
  },
  { timestamps: true }
);

export const AnalyticsModel = mongoose.model("Analytics", analyticsSchema);
