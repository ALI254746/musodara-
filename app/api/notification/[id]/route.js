import connectMongo from "@/lib/mongodb";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    await connectMongo();
    params = await params;
    const { id: notificationId } = params;
    const body = await request.json();
    const { userId } = body;
    console.log("notificationId:", notificationId);
    console.log("userId:", userId);
    const result = await UserModel.updateOne(
      { _id: userId, "notifications._id": notificationId },
      {
        $set: {
          "notifications.$.read": true,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Bildirishnoma topilmadi yoki yangilanmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Bildirishnoma o'qilgan deb belgilandi",
    });
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
