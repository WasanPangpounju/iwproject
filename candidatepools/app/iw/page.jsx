"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Image from "next/image";
import useAppStore from "@/stores/useAppStore";

export default function HomePage() {
  const { posts, isLoading, fetchPosts } = useAppStore();

  // state สำหรับอ่านเพิ่มเติม (ต่อ post)
  const [expanded, setExpanded] = useState({});

  const toggleExpanded = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p>กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>ยังไม่มีประกาศ</p>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {posts.map((post) => {
        const isExpanded = !!expanded[post.id];

        /* ======================================================
           ✅ ADMIN ANNOUNCEMENT
        ====================================================== */
        if (post.isAdmin) {
          return (
            <article
              key={post.id}
              className="group relative flex flex-col md:flex-row gap-6
             rounded-xl border border-gray-200 bg-white p-5
             shadow-sm hover:shadow-md transition-shadow"
            >
              {/* ===== Content ===== */}
              <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium
                         px-2.5 py-1 rounded-full
                         bg-blue-100 text-blue-700"
                    >
                      ประกาศจากระบบ
                    </span>

                    {post.pinned && (
                      <span
                        className="inline-flex items-center gap-1 text-xs font-medium
                           px-2.5 py-1 rounded-full
                           bg-yellow-100 text-yellow-700"
                      >
                        ปักหมุด
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                {post.title && (
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 leading-snug">
                    {post.title}
                  </h2>
                )}

                {/* Body */}
                {!isExpanded ? (
                  <p className="text-gray-700 leading-relaxed line-clamp-4">
                    {post.description || post.content}
                  </p>
                ) : (
                  <div
                    id={`admin-full-${post.id}`}
                    className="text-gray-800 whitespace-pre-wrap leading-relaxed line-clamp-4 overflow-y-scroll max-h-64"
                  >
                    <p>{post.description}</p>
                    <p>{post.content}</p>
                  </div>
                )}

                {/* เวลา */}
                <time
                  dateTime={post.created_time}
                  className="text-xs text-gray-500 whitespace-nowrap mt-4"
                >
                  {new Date(post.created_time).toLocaleDateString("th-TH", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
                {/* Actions */}
                <div className="mt-2 flex items-center gap-4 flex-wrap">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(post.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`admin-full-${post.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium
                   text-blue-700 hover:text-blue-800
                   focus:outline-none focus-visible:ring-2
                   focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    {isExpanded ? "ย่อกลับ" : "อ่านเพิ่มเติม"}
                  </button>

                  {post.linkUrl && (
                    <a
                      href={post.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm
                     text-blue-600 hover:underline"
                    >
                      {post.linkText || "เปิดลิงก์เพิ่มเติม"}
                      <span className="sr-only"> (เปิดในแท็บใหม่)</span>
                    </a>
                  )}
                </div>
              </div>

              {/* ===== Image ===== */}
              {post.full_picture && (
                <div className="shrink-0">
                  <Image
                    src={post.full_picture}
                    alt={
                      post.title
                        ? `รูปประกอบ: ${post.title}`
                        : "รูปประกอบประกาศ"
                    }
                    width={640}
                    height={400}
                    className="w-full md:w-96 h-56 object-cover rounded-lg border bg-gray-100"
                  />
                </div>
              )}
            </article>
          );
        }

        /* ======================================================
           ✅ FACEBOOK POST
        ====================================================== */
        return (
          <article
            key={post.id}
            className="flex flex-col md:flex-row gap-5 border rounded-lg p-4 bg-white shadow-sm max-h-64"
          >
            <div className="flex-1">
              <p className="font-bold text-gray-900 line-clamp-6">
                {post.message || "ไม่มีข้อความ"}
              </p>
              {/* เวลา */}
              <div className="mt-4"> 
                <time
                  dateTime={post.created_time}
                  className="text-xs text-gray-500 whitespace-nowrap mt-4"
                >
                  {new Date(post.created_time).toLocaleDateString("th-TH", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>
              <a
                href={`https://www.facebook.com/${post.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 text-blue-600 text-sm hover:underline
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                อ่านต่อ...
                <span className="sr-only"> (เปิดในแท็บใหม่)</span>
              </a>
            </div>

            <Image
              src={post.full_picture || "/image/main/postermain.png"}
              alt={
                post.message
                  ? `ข่าวจาก Facebook: ${post.message.slice(0, 60)}`
                  : "ข่าวประชาสัมพันธ์"
              }
              width={640}
              height={400}
              className="w-full md:w-96 h-56 object-cover rounded-lg border"
            />
          </article>
        );
      })}
    </main>
  );
}
