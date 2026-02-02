"use client";

import React from "react";
import OriginSection from "./_sections/OriginSection";
import MissionSection from "./_sections/MissionSection";
import UniversitySection from "./_sections/UniversitySection";
import EmployerSection from "./_sections/EmployerSection";

export default function AboutPage() {
  return (
    <main className="w-full">
      {/* สารบัญ (กดแล้วเลื่อนไป section) */}
      <nav aria-label="สารบัญเกี่ยวกับเรา" className="mb-6">
        <ul className="flex flex-wrap gap-3">
          <li>
            <a className="underline" href="#origin">
              ที่มา
            </a>
          </li>
          <li>
            <a className="underline" href="#mission">
              พันธกิจ
            </a>
          </li>
          <li>
            <a className="underline" href="#university">
              มหาวิทยาลัย
            </a>
          </li>
          <li>
            <a className="underline" href="#employer">
              นายจ้าง/สถานประกอบการ
            </a>
          </li>
        </ul>
      </nav>

      {/* เรียงตาม submenu เดิม */}
      <OriginSection />
      <MissionSection />
      <UniversitySection />
      <EmployerSection />
    </main>
  );
}
