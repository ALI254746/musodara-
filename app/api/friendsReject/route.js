import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getSessionUser } from "@/lib/auth";

export async function POST(req) {
  await dbConnect();
  const { notificationId } = await req.json();
  const currentUser = await getSessionUser(req);

  if (!currentUser || !notificationId) {
    return NextResponse.json(
      { success: false, message: "Xatolik" },
      { status: 400 }
    );
  }

  try {
    // Foydalanuvchining notifications massividan notificationni o‘chirish
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { notifications: { _id: notificationId } },
    });

    return NextResponse.json({ success: true, message: "So‘rov rad etildi" });
  } catch (error) {
    console.error("Rad etishda xatolik:", error);
    return NextResponse.json(
      { success: false, message: "Server xatoligi" },
      { status: 500 }
    );
  }
}
