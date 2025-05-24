// app/api/register/route.js
import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
export async function POST(request) {
  try {
    await connectToDatabase();

    const { email, password, name } = await request.json();
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email va parol kiritilishi shart" },
        { status: 400 }
      );
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "Bunday foydalanuvchi allaqachon mavjud" },
        { status: 409 }
      );
    }

    // Parolni real loyihada hashlashni unutmang!

    // PAROLNI XESHLAYMIZ:
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (e) {
    console.error("Registratsiya xatosi:", e);
    return NextResponse.json(
      { error: "Ichki server xatosi yuz berdi" },
      { status: 500 }
    );
  }
}
