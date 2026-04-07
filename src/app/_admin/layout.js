// src/app/admin/layout.js

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import "../globals.css"; // tailwind için gerekli

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6 bg-gray-100 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
