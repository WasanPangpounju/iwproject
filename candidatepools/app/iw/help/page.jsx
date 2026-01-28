"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/ThemeContext";
import Link from "next/link";
import ChatComponent from "@/app/components/ChatComponent";

function HelpPage() {
  const [loader, setLoader] = useState(true);

  const router = useRouter();
  const { status, data: session } = useSession();
  const [dataUser, setDataUser] = useState([]);

  useEffect(() => {
    if (status === "loading") return;

    setLoader(false);

    if (!session) {
      router.replace("/");
      return;
    }

    if (session?.user?.id) {
      getUser(session.user.id);
    } else {
      router.replace("/register");
    }
  }, [status, session, router]);

  async function getUser(id) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`,
        { method: "GET", cache: "no-store" }
      );

      if (!res.ok) throw new Error("Error getting data from API");

      const data = await res.json();
      setDataUser(data.user || {});
    } catch (err) {
      console.error("Error fetching API", err);
    } finally {
      setLoader(false);
    }
  }

  const { bgColor, bgColorMain2 } = useTheme();

  return (
    <>
      <main
        id="main-content"
        className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}
        aria-busy={loader ? "true" : "false"}
      >
        <h1 className="text-xl font-extrabold">ติดต่อเรา</h1>

        <div className="mt-5 flex flex-col gap-5">
          <section aria-labelledby="office-title">
            <h2 id="office-title" className="text-xl font-extrabold">
              ที่ทำการ
            </h2>
            <address className="mt-3 not-italic">
              มูลนิธินวัตกรรมทางสังคม เลขที่ 286 อาคารราฟเฟิล คอร์ท
              ถนนรัชดาภิเษก 20 (ซอยรุ่งเรือง) แขวงสามเสนนอก เขตห้วยขวาง กรุงเทพฯ
              10310
            </address>
          </section>

          <section aria-labelledby="phone-title">
            <h2 id="phone-title" className="text-xl font-extrabold">
              เบอร์ติดต่อ
            </h2>
            <div className="flex flex-col gap-1 mt-3">
              <p>
                โทรศัพท์{" "}
                <a className="underline" href="tel:+6622799385">
                  02-279-9385
                </a>
              </p>
              <p>โทรสาร 02-279-9345</p>
            </div>
          </section>

          <section aria-labelledby="follow-title">
            <h2 id="follow-title" className="text-xl font-extrabold">
              ติดตามเรา
            </h2>

            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.facebook.com/konpikanthai/"
                  className="flex gap-4 items-center cursor-pointer w-fit focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
                  aria-label="Facebook: คนพิการต้องมีงานทำ (เปิดแท็บใหม่)"
                >
                  <Image
                    src="/image/facebook.png"
                    height={1000}
                    width={1000}
                    priority
                    alt="" // ไอคอนตกแต่ง ชื่ออยู่ใน aria-label แล้ว
                    className="w-7"
                  />
                  <span className="underline">คนพิการต้องมีงานทำ</span>
                </Link>
              </li>

              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.facebook.com/socialinnovationfoundation/"
                  className="flex gap-4 items-center cursor-pointer w-fit focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
                  aria-label="Facebook: มูลนิธินวัตกรรมทางสังคม (เปิดแท็บใหม่)"
                >
                  <Image
                    src="/image/facebook.png"
                    height={1000}
                    width={1000}
                    priority
                    alt=""
                    className="w-7"
                  />
                  <span className="underline">มูลนิธินวัตกรรมทางสังคม</span>
                </Link>
              </li>

              <li>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.youtube.com/embed/kndCcFWHy-c?list=PLwffPXXUDsmFZb6R8WFAjFTp0Dvkro4bv"
                  className="flex gap-4 items-center cursor-pointer w-fit focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
                  aria-label="YouTube: คนพิการต้องมีงานทำ (เปิดแท็บใหม่)"
                >
                  <Image
                    src="/image/youtube.png"
                    height={1000}
                    width={1000}
                    priority
                    alt=""
                    className="w-7"
                  />
                  <span className="underline">คนพิการต้องมีงานทำ</span>
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </main>

      {/* Chat */}
      <ChatComponent id={session?.user?.id} dataUser={dataUser} />
    </>
  );
}

export default HelpPage;
