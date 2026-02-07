"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "../ThemeContext";
import useAppStore from "@/stores/useAppStore";

function MainPage() {
  const { fontHeadSize, fontSize, bgColor, bgColorMain2 } = useTheme();
  const { posts } = useAppStore();

  if (!posts) {
    return (
      <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
        <div role="status" aria-live="polite" className="text-sm">
          กำลังโหลดข่าวประชาสัมพันธ์...
        </div>
      </div>
    );
  }

  return (
    <section className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <h2 className={`${fontHeadSize} font-bold mb-4`}>ข่าวประชาสัมพันธ์</h2>

      <div className="space-y-6 mt-5">
        {posts?.map((post) => {
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

          const postText = post.message || "ไม่มีข้อความ";
          const imageAlt =
            post.message?.slice(0, 60)
              ? `รูปประกอบข่าว: ${post.message.slice(0, 60)}`
              : "รูปประกอบข่าวประชาสัมพันธ์";

          return (
            <article
              key={post.id}
              className="flex flex-col md:flex-row items-start gap-5 border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex-1">
                <p className={`font-bold ${fontSize} line-clamp-6`}>
                  {postText}
                </p>

                <p className="text-sm text-gray-600 mt-2">
                  <span className="sr-only">วันเวลาเผยแพร่:</span>
                  {`${dateStr}, ${timeStr} น.`}
                </p>

                {post.id && (
                  <a
                    href={`https://www.facebook.com/${post.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-blue-600 text-sm mt-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    อ่านต่อ...
                    <span className="sr-only"> (เปิดในแท็บใหม่)</span>
                  </a>
                )}
              </div>

              <Image
                className="rounded-lg w-full md:w-96 h-56 object-cover border"
                src={post.full_picture || "/image/main/postermain.png"}
                height={400}
                width={640}
                alt={imageAlt}
                priority
              />
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default MainPage;
