import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await dbConnect();

  const { senderId, notificationId } = await req.json();

  // 🍪 Cookie'dan tokenni olish
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Token mavjud emas" },
      { status: 401 }
    );
  }

  let currentUser;
  try {
    // 🔐 Tokenni tekshirish va foydalanuvchini aniqlash
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ⚠️ `.env` faylda `JWT_SECRET` bo‘lishi shart
    currentUser = await User.findById(decoded.id);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Token noto‘g‘ri yoki muddati tugagan" },
      { status: 401 }
    );
  }

  if (!currentUser || !senderId || !notificationId) {
    return NextResponse.json(
      { success: false, message: "Ma'lumotlar yetarli emas" },
      { status: 400 }
    );
  }

  try {
    // 🫂 Do‘stlikni qabul qilish
    await User.findByIdAndUpdate(currentUser._id, {
      $addToSet: { friends: senderId },
      $pull: { notifications: { _id: notificationId } },
    });

    await User.findByIdAndUpdate(senderId, {
      $addToSet: { friends: currentUser._id },
    });

    return NextResponse.json({
      success: true,
      message: "Do‘stlik qabul qilindi",
    });
  } catch (error) {
    console.error("Qabul qilishda xatolik:", error);
    return NextResponse.json(
      { success: false, message: "Server xatoligi" },
      { status: 500 }
    );
  }
}
