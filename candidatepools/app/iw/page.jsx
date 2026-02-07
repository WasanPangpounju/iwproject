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
              className="flex flex-col md:flex-row gap-5 border rounded-lg p-4 bg-white shadow-sm"
            >
              {/* เนื้อหา */}
              <div className="flex-1">
                {/* badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded bg-blue-600 text-white">
                    ประกาศจากระบบ
                  </span>

                  {post.pinned && (
                    <span className="text-xs px-2 py-1 rounded bg-yellow-500 text-white">
                      ปักหมุด
                    </span>
                  )}
                </div>

                {/* title */}
                {post.title && (
                  <h2 className="font-bold text-lg mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                )}

                {/* description / content */}
                {!isExpanded ? (
                  <p className="text-gray-800 line-clamp-4">
                    {post.description}
                  </p>
                ) : (
                  <div
                    className="text-gray-800 whitespace-pre-wrap"
                    id={`admin-full-${post.id}`}
                  >
                    {post.content}
                  </div>
                )}

                {/* อ่านเพิ่มเติม */}
                <button
                  type="button"
                  onClick={() => toggleExpanded(post.id)}
                  className="mt-3 inline-flex items-center gap-2 text-blue-700 underline
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  aria-expanded={isExpanded}
                  aria-controls={`admin-full-${post.id}`}
                >
                  {isExpanded ? "ย่อกลับ" : "อ่านเพิ่มเติม"}
                </button>

                {/* ลิงก์เสริม (ถ้ามี) */}
                {post.linkUrl && (
                  <a
                    href={post.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-sm text-blue-600 hover:underline"
                  >
                    {post.linkText || "เปิดลิงก์เพิ่มเติม"}
                    <span className="sr-only"> (เปิดในแท็บใหม่)</span>
                  </a>
                )}
              </div>

              {/* รูป */}
              {post.full_picture && (
                <Image
                  src={post.full_picture}
                  alt={post.title ? `รูปประกอบ: ${post.title}` : "รูปประกอบประกาศ"}
                  width={640}
                  height={400}
                  className="w-full md:w-96 h-56 object-cover rounded-lg border"
                />
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
            className="flex flex-col md:flex-row gap-5 border rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex-1">
              <p className="font-bold text-gray-900 line-clamp-6">
                {post.message || "ไม่มีข้อความ"}
              </p>

              <a
                href={`https://www.facebook.com/${post.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-600 text-sm hover:underline
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
