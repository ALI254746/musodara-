import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    points: { type: Number, default: 0 },

    avatar: { type: String, default: "" },

    bio: {
      type: String, // foydalanuvchi o‘zining bio sini yozadi
      default: "",
    },

    // ✅ Do‘stlar ro‘yxati
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ✅ Kelgan do‘stlik so‘rovlari
    friendRequests: [
      {
        from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        date: { type: Date, default: Date.now },
      },
    ],

    // ✅ Bildirishnomalar (like, comment, friend_request)
    notifications: [
      {
        type: {
          type: String,
          enum: ["friend_request", "comment", "like"],
          required: true,
        },
        message: { type: String, required: true },
        from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // comment yoki like qilingan post
        createdAt: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
