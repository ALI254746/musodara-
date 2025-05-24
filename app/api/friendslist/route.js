import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req) {
  await dbConnect();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Token topilmadi" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // User'ni friends va notifications.from ni populate qilib olamiz
    const fullUser = await User.findById(userId)
      .populate("friends", "_id name avatar")
      .populate("notifications.from", "_id name avatar")
      .lean();

    if (!fullUser) {
      return NextResponse.json(
        { success: false, message: "Foydalanuvchi topilmadi" },
        { status: 404 }
      );
    }

    // Notifications va friends ni qaytaramiz
    return NextResponse.json({
      success: true,
      friends: fullUser.friends,
      notifications: fullUser.notifications,
    });
  } catch (error) {
    console.error("Do‘stlar ro‘yxatini olishda xatolik:", error);
    return NextResponse.json(
      { success: false, message: "Server xatoligi" },
      { status: 500 }
    );
  }
}
