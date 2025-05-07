// components/ClientRedirector.js
'use client';

import useRoleRedirect from '@/hooks/useRoleRedirect';

export default function ClientRedirector() {
  useRoleRedirect(); // ทำงานได้แน่นอน เพราะอยู่ภายใต้ SessionProvider
  return null;
}