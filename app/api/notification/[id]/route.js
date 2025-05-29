import connectMongo from "@/lib/mongodb";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    await connectMongo();

    const { id: notificationId } = params;
    const { userId } = await request.json();

    if (!userId || !notificationId) {
      return NextResponse.json(
        { error: "userId yoki notificationId yo'q" },
        { status: 400 }
      );
    }

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
        { error: "Bildirishnoma topilmadi yoki allaqachon o'qilgan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Bildirishnoma o'qilgan deb belgilandi",
    });
  } catch (error) {
    console.error("PUT /api/notification xatolik:", error);
    return NextResponse.json(
      { error: "Server xatosi yuz berdi" },
      { status: 500 }
    );
  }
}
