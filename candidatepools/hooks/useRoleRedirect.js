"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function useRoleRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    // กำหนดเฉพาะ protected route prefix ที่ต้องเช็ค login เท่านั้น
    const protectedRoutes = ["/ad", "/su", "/iw"]; // ตัวอย่างที่คุณให้มา

    // ตรวจสอบว่า path ปัจจุบันเป็น protected route หรือไม่
    const isProtectedRoute = protectedRoutes.some(
      (routePrefix) =>
        pathname === routePrefix || pathname.startsWith(routePrefix + "/")
    );

    // ถ้ายังไม่ login แล้วพยายามเข้าหน้า protected route → redirect ไป login หรือหน้า '/'
    if (!session && isProtectedRoute) {
      router.replace("/"); // หรือ '/login' ถ้าคุณมีหน้า login แยกต่างหาก
      return;
    }
    // ถ้า login แล้ว และอยู่ใน protected route ที่ไม่ตรงกับ role → redirect ไปหน้า role ของตัวเอง
    if (session) {
      const role = session.user.role;
      const image = session.user.image;
      const roleRoutes = {
        admin: "/ad",
        supervisor: "/su",
        user: "/iw",
      };

      // ✅ เงื่อนไขพิเศษสำหรับ OAuth (Google/Line)
      const isOAuthUser = Boolean(image); // มี image แสดงว่าเป็น OAuth

      // 🌟 ถ้าเป็น OAuth และยังไม่ลงทะเบียน → ไปที่หน้าลงทะเบียนก่อน
      if (isOAuthUser) {
        // ป้องกันไม่ให้วนลูปจากการอยู่ในหน้า register อยู่แล้ว
        if (
          !pathname.startsWith("/register") &&
          !pathname.startsWith("/agreement")
        ) {
          router.replace("/agreement"); // หรือ '/register' ตามลำดับของคุณ
        }
        return;
      }

      // 🔁 ถ้า login แล้วและอยู่ใน route ที่ไม่ตรงกับ role → redirect ไปหน้า role ของตน
      if (roleRoutes[role] && !pathname.startsWith(roleRoutes[role])) {
        router.replace(roleRoutes[role]);
      }
    }
  }, [session, status, pathname, router]);
}
