//api/myariza.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectMongo from "../../../lib/mongodb";
import mongoose from "mongoose";
import ArizaSchema from "../../../models/Ariza";

export async function GET(request) {
  try {
    await connectMongo();

    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((cookie) => cookie.split("="))
    );
    const token = cookies.token;
    if (!token) {
      return NextResponse.json({ error: "Token topilmadi" }, { status: 401 });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
      console.log("user id", userId);
    } catch (err) {
      return NextResponse.json({ error: "Token yaroqsiz" }, { status: 401 });
    }

    const applications = await ArizaSchema.find({
      user: new mongoose.Types.ObjectId(userId),
    });
    console.log(applications);
    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error("arizani olishda xatolik", error);
    return NextResponse.json({ error: "Ichki server xatosi" }, { status: 500 });
  }
}
