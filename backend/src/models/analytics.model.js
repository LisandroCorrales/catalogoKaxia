import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    sessions: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
    montoTotal: { type: Number, default: 0 },
    productViews: { type: Map, of: Number, default: new Map() },
    productAdds: { type: Map, of: Number, default: new Map() },
    productOrders: { type: Map, of: Number, default: new Map() }
  },
  { timestamps: true }
);

export const AnalyticsModel = mongoose.model("Analytics", analyticsSchema);
