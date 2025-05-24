"use client";
import * as React from "react";

// agar AppNavbar va Footer `app/tooldashboard/components/` ichida bo'lsa:
import AppNavbar from "../tooldashboard/components/AppNavbar";
import Footer from "../tooldashboard/components/Footer";
import Xadiya from "./xadiya";
export default function TopilganaPage() {
  return (
    <>
      <AppNavbar />
      <Xadiya />
      <Footer />
    </>
  );
}
