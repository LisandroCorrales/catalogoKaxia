import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true, trim: true },
    gallery: [{ type: String, trim: true }],
    fabric: { type: String, default: "Jersey peinado 20.1", trim: true },
    colors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Color" }],
    sizes: [{ type: String, required: true, trim: true }],
    print: { type: String, default: "Serigrafía", trim: true },
    details: { type: String, default: "" },
    stock: { type: String, required: true, trim: true },
    measurements: { type: Map, of: String, default: {} },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }]
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model("Product", productSchema);
