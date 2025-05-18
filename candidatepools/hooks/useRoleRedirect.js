'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function useRoleRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;

    // กำหนดเฉพาะ protected route prefix ที่ต้องเช็ค login เท่านั้น
    const protectedRoutes = ['/ad', '/su', '/iw']; // ตัวอย่างที่คุณให้มา

    // ตรวจสอบว่า path ปัจจุบันเป็น protected route หรือไม่
    const isProtectedRoute = protectedRoutes.some((routePrefix) =>
      pathname === routePrefix || pathname.startsWith(routePrefix + '/')
    );

    // ถ้ายังไม่ login แล้วพยายามเข้าหน้า protected route → redirect ไป login หรือหน้า '/'
    if (!session && isProtectedRoute) {
      router.replace('/');  // หรือ '/login' ถ้าคุณมีหน้า login แยกต่างหาก
      return;
    }

    // ถ้า login แล้ว และอยู่ใน protected route ที่ไม่ตรงกับ role → redirect ไปหน้า role ของตัวเอง
    if (session) {
      const role = session.user.role;
      const roleRoutes = {
        admin: '/ad',
        supervisor: '/su',
        user: '/iw',
      };

      if (
        roleRoutes[role] &&
        !pathname.startsWith(roleRoutes[role])
      ) {
        router.replace(roleRoutes[role]);
      }
    }

  }, [session, status, pathname, router]);
}