// src/components/RootLayout.jsx

import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

export default function RootLayout() {
  return (
    <Fragment>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </Fragment>
  );
}