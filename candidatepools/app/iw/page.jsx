"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "../ThemeContext";
import useAppStore from "@/stores/useAppStore";

function MainPage() {
  const { fontHeadSize, fontSize, bgColor, bgColorMain2 } = useTheme();
  const { posts } = useAppStore();

  if(!posts) return <div>กำลังโหลด...</div>
  return (
    
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <p className={`${fontHeadSize} font-bold mb-4`}>ข่าวประชาสัมพันธ์</p>

      <div className="space-y-6 mt-5">
        {posts?.map((post, index) => (
          <div
            key={post.id}
            className="flex flex-col md:flex-row items-start gap-5 border rounded-lg p-4 bg-white shadow-sm"
          >
            {/* ข้อความและเวลา */}
            <div className="flex-1">
              <p className={`font-bold ${fontSize} line-clamp-6`}>
                {post.message || "ไม่มีข้อความ"}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                {(() => {
                  const date = new Date(post.created_time);
                  const dateStr = date.toLocaleDateString("th-TH", {
                    timeZone: "Asia/Bangkok",
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  });
                  const timeStr = date.toLocaleTimeString("th-TH", {
                    timeZone: "Asia/Bangkok",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });
                  return `${dateStr}, ${timeStr} น.`;
                })()}
              </p>

              {/* อ่านต่อ */}
              {post.id && (
                <a
                  href={`https://www.facebook.com/${post.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-600 text-sm mt-2 hover:underline"
                >
                  อ่านต่อ...
                </a>
              )}
            </div>

            {/* รูปภาพ */}
            <Image
              className="rounded-lg w-full md:w-96 h-56 object-cover border"
              src={post.full_picture || "/image/main/postermain.png"}
              height={400}
              width={640}
              alt="photo-post"
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainPage;
