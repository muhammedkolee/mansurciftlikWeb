// src/app/admin/components/Sidebar.js

"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white p-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <Link href="/admin" className="hover:bg-gray-800 p-2 rounded">Dashboard</Link>
      <Link href="/admin/kullanicilar" className="hover:bg-gray-800 p-2 rounded">Kullanıcılar</Link>
      <Link href="/admin/ayarlar" className="hover:bg-gray-800 p-2 rounded">Ayarlar</Link>
    </div>
  );
}
