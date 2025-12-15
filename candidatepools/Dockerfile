# ---------- Stage 1: ติดตั้ง dependencies ----------
FROM node:20-alpine AS deps

WORKDIR /app

# ใช้ package*.json สำหรับติดตั้งแพ็กเกจ
COPY package*.json ./

# ใช้ npm ci ให้ตรงกับ package-lock (ถ้ามี)
# ถ้าในโปรเจกต์ไม่มี package-lock.json ให้เปลี่ยนเป็น:
# RUN npm install --omit=dev
RUN npm ci --omit=dev

# ---------- Stage 2: build โปรเจกต์ ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ปิด telemetry ของ Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# build production
RUN npm run build

# ---------- Stage 3: runtime image ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# สร้าง user ที่ไม่ใช่ root เพื่อความปลอดภัย
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nextjs -u 1001

# คัดลอกไฟล์ที่ใช้รันจริง
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# 🔥 ให้สิทธิ์ user nextjs ทั้งโฟลเดอร์ /app (แก้ EACCES ตอนเขียน .next/cache/image)
RUN chown -R nextjs:nodejs /app

USER nextjs

# Next.js ใช้ port 3000
EXPOSE 3000

# ใช้ script start ใน package.json
CMD ["npm", "start"]
