// src/components/RootLayout.jsx

import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}