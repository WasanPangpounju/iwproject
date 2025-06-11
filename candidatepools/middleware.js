import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { ROLE } from "./const/enum";

const accessRules = [
  {
    path: "/api/educations",
    methods: ["GET"],
    roles: [ROLE.ADMIN, ROLE.SUPERVISOR],
    exact: true,
  },
  {
    path: "/api/educations",
    methods: ["POST", "PUT", "DELETE"],
    roles: [ROLE.ADMIN, ROLE.SUPERVISOR, ROLE.USER],
    exact: true,
  },
  {
    path: "/api/skill",
    methods: ["GET"],
    roles: [ROLE.ADMIN, ROLE.SUPERVISOR],
    exact: true,
  },
  {
    path: "/api/skill",
    methods: ["POST", "PUT", "DELETE"],
    roles: [ROLE.ADMIN, ROLE.SUPERVISOR, ROLE.USER],
    exact: true,
  },
  {
    path: "/api/historyWork",
    methods: ["GET"],
    roles: [ROLE.ADMIN, ROLE.SUPERVISOR],
    exact: true,
  },
  {
    path: "/api/historyWork",
    methods: ["POST", "PUT", "DELETE"],
    roles: [ROLE.ADMIN, ROLE.SUPERVISOR, ROLE.USER],
    exact: true,
  },
  {
    path: "/api/user",
    methods: ["GET"],
    roles: [ROLE.ADMIN, ROLE.SUPERVISOR],
    exact: true,
  },
  {
    path: "/api/user",
    methods: ["POST", "PUT", "DELETE"],
    roles: [ROLE.ADMIN, ROLE.SUPERVISOR, ROLE.USER],
    exact: true,
  },
  {
    path: "/api/messages",
    methods: ["GET"],
    roles: [ROLE.SUPERVISOR],
    exact: true,
  },
  {
    path: "/api/messages",
    methods: ["POST", "PUT", "DELETE"],
    roles: [ROLE.ADMIN, ROLE.SUPERVISOR, ROLE.USER],
    exact: true,
  },
  {
    path: "/api/interestedwork",
    methods: ["GET"],
    roles: [ROLE.ADMIN, ROLE.SUPERVISOR],
    exact: true,
  },
  {
    path: "/api/interestedwork",
    methods: ["POST", "PUT", "DELETE"],
    roles: [ROLE.ADMIN, ROLE.SUPERVISOR, ROLE.USER],
    exact: true,
  },
  {
    path: "/api/students",
    roles: [ROLE.ADMIN, ROLE.SUPERVISOR],
    startsWith: true,
  },
  {
    path: "/api/company",
    roles: [ROLE.SUPERVISOR],
    startsWith: true,
  },
  {
    path: "/api/systemLog",
    roles: [ROLE.SUPERVISOR],
    startsWith: true,
  },
];

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const pathname = req.nextUrl.pathname.replace(/\/$/, "") || "/";
  const method = req.method;

  for (const rule of accessRules) {
    const isMatch =
      (rule.exact && pathname === rule.path) ||
      (rule.startsWith && pathname.startsWith(rule.path));

    const methodAllowed = !rule.methods || rule.methods.includes(method);
    const roleAllowed = rule.roles.includes(token.role);

    if (isMatch && methodAllowed && !roleAllowed) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/students/:path*",
    "/api/company/:path*",
    "/api/educations/:path*",
    "/api/historyWork/:path*",
    "/api/interestedwork/:path*",
    "/api/messages/:path*",
    "/api/resume/:path*",
    "/api/skill/:path*",
    "/api/systemLog/:path*",
    "/api/upload/:path*",
    // "/api/user/:path*",
  ],
};
