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

    const role = session?.user?.role;

    // กำหนดเส้นทางหลักของแต่ละ role
    const roleRoutes = {
      admin: '/ad',
      supervisor: '/su',
      user: '/iw',
    };

    // ถ้าไม่ได้ login → redirect ไปหน้า login
    if (!session && pathname !== '/') {
      router.replace('/');
      return;
    }

    // ถ้า login แล้ว แต่ยังอยู่หน้า login หรือหน้าอื่นที่ไม่ใช่หน้าหลักของ role → ให้ redirect
    if (
      session &&
      role &&
      roleRoutes[role] &&
      !pathname.startsWith(roleRoutes[role])
    ) {
      router.replace(roleRoutes[role]);
    }

  }, [session, status, pathname, router]);
}