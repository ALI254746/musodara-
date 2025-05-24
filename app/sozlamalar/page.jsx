"use client";
import * as React from "react";

// agar AppNavbar va Footer `app/tooldashboard/components/` ichida bo'lsa:
import AppNavbar from "../tooldashboard/components/AppNavbar";

import Setting from "./sozlamalar";
export default function TopilganaPage() {
  return (
    <>
      <AppNavbar />
      <Setting />
    </>
  );
}
