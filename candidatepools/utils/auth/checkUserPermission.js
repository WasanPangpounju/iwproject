// utils/auth/checkUserPermission.js
import { ROLE } from "@/const/enum";

export function checkUserPermission(sessionRole, targetRole) {
  // ตรวจสอบว่า role ที่ส่งเข้ามาถูกต้องไหม
  const validRoles = [ROLE.ADMIN, ROLE.USER, ROLE.SUPERVISOR];
  if (!validRoles.includes(targetRole)) {
    return { allowed: false, message: "Error Invalid Role", status: 401 };
  }

  // ADMIN และ SUPERVISOR ต้องมี session เป็น SUPERVISOR เท่านั้น
  if (
    (targetRole === ROLE.ADMIN || targetRole === ROLE.SUPERVISOR) &&
    sessionRole !== ROLE.SUPERVISOR
  ) {
    return {
      allowed: false,
      message: "Forbidden",
      status: 403,
    };
  }

  // ผ่านการตรวจสอบ
  return { allowed: true };
}