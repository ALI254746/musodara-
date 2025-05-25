import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Like from "@/models/like";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import Ariza from "@/models/Ariza";
import User from "@/models/User"; // User modelini chaqirishni unutmang

export async function POST(req) {
  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let userData;
  try {
    userData = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }

  const { postId } = await req.json();

  if (!postId) {
    return NextResponse.json({ message: "postId kerak" }, { status: 400 });
  }

  try {
    const postObjectId = new mongoose.Types.ObjectId(postId);
    const userObjectId = new mongoose.Types.ObjectId(userData.id);

    const existingLike = await Like.findOne({
      userId: userObjectId,
      postId: postObjectId,
    });

    let updatedAriza;

    if (existingLike) {
      // unlike: like ni o'chirib tashlaymiz va -1
      await Like.deleteOne({ _id: existingLike._id });

      updatedAriza = await Ariza.findByIdAndUpdate(
        postId,
        { $inc: { likeCount: -1 } },
        { new: true }
      );

      return NextResponse.json(
        {
          isLiked: false,
          likeCount: updatedAriza.likeCount,
          message: "Like olib tashlandi",
        },
        { status: 200 }
      );
    } else {
      // like: yangi like qo‘shish va +1
      await Like.create({ userId: userObjectId, postId: postObjectId });

      updatedAriza = await Ariza.findByIdAndUpdate(
        postId,
        { $inc: { likeCount: 1 } },
        { new: true }
      );
      // ✅ Ariza egasining profiliga notification qo‘shamiz
      if (updatedAriza && updatedAriza.user) {
        await User.findByIdAndUpdate(updatedAriza.user, {
          $push: {
            notifications: {
              type: "like", // yoki "like" deb yangisini qo‘shsang ham bo‘ladi
              message: `${userData.name} sizning arizangizni yoqtirdi.`,
              from: userObjectId,
              createdAt: new Date(),
              read: false,
            },
          },
        });
      }

      return NextResponse.json(
        {
          isLiked: true,
          likeCount: updatedAriza.likeCount,
          message: "Like qo'yildi",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Like POST xatolik:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
