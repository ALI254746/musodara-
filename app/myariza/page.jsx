import * as React from "react";
import AppNabar from "../tooldashboard/components/AppNavbar";
import Myariza from "./myariza";
import Footer from "../tooldashboard/components/Footer";

export default function Mainpage() {
  return (
    <div>
      <AppNabar />
      <Myariza />
      <Footer />
    </div>
  );
}
