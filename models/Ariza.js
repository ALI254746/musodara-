// models/Ariza.js
import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
    size: Number,
    data: Buffer,
  },
  { _id: false } // bu image maydoni ichida alohida _id yaratmaslik uchun
);

const ArizaSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: String,
    phone: String,
    email: String,
    itemType: String,
    itemDescription: String,
    date: String,
    status: String,
    location: String,
    region: { type: String, required: true },
    district: { type: String, required: true },
    image: ImageSchema, // bu yerda image nested schema sifatida
    likeCount: {
      type: Number,
      default: 0,
    },
    isLikedByCurrentUser: { type: Boolean, default: false },
  },

  { timestamps: true }
);

export default mongoose.models.Ariza || mongoose.model("Ariza", ArizaSchema);
