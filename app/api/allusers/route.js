// app/api/users/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User"; // model nomi sizda qanday bo‘lsa, shunga qarab

export async function GET() {
  try {
    await connectDB(); // MongoDBga ulanish

    const users = await User.find({}, { password: 0 }); // Parolni chiqarilmasin
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
