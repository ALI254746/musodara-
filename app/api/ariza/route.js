import connectMongo from "../../../lib/mongodb";
import ArizaModel from "../../../models/Ariza";
import UserModel from "../../../models/User";

import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// GET: Arizalarni olish
export async function GET(request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const filter = status ? { status } : {};
    const arizalar = await ArizaModel.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify(arizalar), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ [GET Xatolik]:", error);
    return new Response(
      JSON.stringify({ error: "Ma'lumotlarni olishda xatolik" }),
      { status: 500 }
    );
  }
}

// POST: Yangi ariza joylash + do‘stlarga notification
export async function POST(request) {
  try {
    await connectMongo();

    // Tokenni cookie'dan olish
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((cookie) => cookie.split("="))
    );
    const token = cookies.token;
    if (!token) {
      return new Response(JSON.stringify({ error: "Token topilmadi" }), {
        status: 401,
      });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      return new Response(JSON.stringify({ error: "Token yaroqsiz" }), {
        status: 401,
      });
    }

    // FormData o'qish
    const form = await request.formData();
    const data = Object.fromEntries(form);

    // Rasmni olish
    const file = form.get("image");
    let imageBuffer = null;

    if (file && typeof file.arrayBuffer === "function") {
      const buffer = Buffer.from(await file.arrayBuffer());
      imageBuffer = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: buffer,
      };
    }

    // Ariza yaratish
    const arizaData = {
      ...data,
      image: imageBuffer,
      user: new mongoose.Types.ObjectId(userId),
    };

    const user = await UserModel.findById(userId).select("name friends").lean();

    // ariza yaratildi
    const ariza = new ArizaModel(arizaData);
    await ariza.save();

    // Arizani statusi va buyum nomi orqali xabar tuzish
    const message = `${user.name} ${ariza.status} arizasini "${ariza.itemType}" nomli buyum uchun joyladi`;

    const friends = user?.friends || [];

    if (friends.length > 0) {
      await UserModel.updateMany(
        { _id: { $in: friends } },
        {
          $push: {
            notifications: {
              type: "new-ariza",
              message,
              createdAt: new Date(),
              read: false,
            },
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Ariza yaratildi va do‘stlarga xabar yuborildi",
        ariza,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ [POST Xatolik]:", error);
    return new Response(JSON.stringify({ error: "Xatolik yuz berdi" }), {
      status: 500,
    });
  }
}
