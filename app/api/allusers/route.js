// app/api/users/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({}, { password: 0 }); // Parolni qaytarmaslik
    return NextResponse.json({ success: true, users });
  } catch {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
