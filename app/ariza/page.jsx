// app/ariza/page.jsx
"use client";
import * as React from "react";

// agar AppNavbar va Footer `app/tooldashboard/components/` ichida bo'lsa:
import AppNavbar from "../tooldashboard/components/AppNavbar";
import Footer from "../tooldashboard/components/Footer";
import Ariza from "./ariza";
export default function ArizaPage() {
  return (
    <>
      <AppNavbar />
      <Ariza />
      <Footer />
    </>
  );
}
