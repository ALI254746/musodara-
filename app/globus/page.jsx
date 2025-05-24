// app/ariza/page.jsx
"use client";
import * as React from "react";
// agar AppNavbar va Footer `app/tooldashboard/components/` ichida bo'lsa:
import AppNavbar from "../tooldashboard/components/AppNavbar";

import Globus from "./globus";
export default function MapaPage() {
  return (
    <>
      <AppNavbar />
      <Globus />
    </>
  );
}
