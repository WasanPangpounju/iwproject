"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Icon from "@mdi/react";
import { mdiForum, mdiSend, mdiClose, mdiShieldAccount } from "@mdi/js";
import { useTheme } from "../ThemeContext";
import { ClipLoader } from "react-spinners";
import Image from "next/image";

function ChatComponent({ id, dataUser }) {
  // Theme
  const { bgColorNavbar, bgColor, bgColorWhite, bgColorMain2 } = useTheme();

  const [openChat, setOpenChat] = useState(false);

  // sendMessage
  const [input, setInput] = useState("");
  const [message, setMessage] = useState([]); // ✅ ต้องเป็น array
  const [dataMessage, setDataMessage] = useState(null);
  const [loaderMessage, setLoaderMessage] = useState(false);

  // refs
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const logRef = useRef(null);

  // IDs for a11y
  const chatPanelId = "chat-panel";
  const chatLogId = "chat-log";
  const chatInputId = "chat-input";
  const chatHintId = "chat-hint";

  // fetch messages when id ready
  useEffect(() => {
    if (!id) return;
    getMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // focus + scroll when open
  useEffect(() => {
    if (!openChat) return;
    // focus textarea for keyboard users
    setTimeout(() => inputRef.current?.focus(), 0);
    chatEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [openChat]);

  // scroll when new message arrives
  useEffect(() => {
    if (!openChat) return;
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [openChat, message?.length]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!id) return;
    const text = String(input || "").trim();
    if (!text) return;

    setLoaderMessage(true);

    // optimistic update
    setMessage((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      { message: text, senderRole: "user", timestamp: new Date().toISOString() },
    ]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: id,
          message: text,
          senderRole: "user",
          statusRead: false,
          statusReadAdmin: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(Array.isArray(data?.data?.roomChat) ? data.data.roomChat : []);
        setDataMessage(data?.data || null);
        setInput("");
      } else {
        // fallback: stop loader but keep optimistic msg
        console.error("sendMessage failed:", res.status);
      }
    } catch (err) {
      console.error("Error fetching API", err);
      alert("เกิดข้อผิดพลาด");
      window.location.reload();
    } finally {
      setLoaderMessage(false);
    }
  }

  async function getMessage() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/messages/${id}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Error getting data from API");

      const data = await res.json();
      setMessage(Array.isArray(data?.chats?.roomChat) ? data.chats.roomChat : []);
      setDataMessage(data?.chats || null);
    } catch (err) {
      console.error("Error fetching API", err);
    }
  }

  async function handleUpdateStatusRead(userId) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/messages/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusRead: false }),
      });

      if (res.ok) {
        const data = await res.json();
        setDataMessage(data?.data || null);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const hasUnread = !!dataMessage?.statusRead;

  // helper: format time once per render
  const renderedMessages = useMemo(() => {
    return (Array.isArray(message) ? message : []).map((chat, index) => {
      const date = new Date(chat?.timestamp);
      const formattedDate = isNaN(date.getTime())
        ? ""
        : date.toLocaleDateString("th-TH", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          });
      const formattedTime = isNaN(date.getTime())
        ? ""
        : date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });

      const isUser = chat?.senderRole === "user";
      const ariaLabel = `${isUser ? "คุณ" : "เจ้าหน้าที่"}: ${chat?.message || ""}${
        formattedTime ? ` เวลา ${formattedTime}` : ""
      }${formattedDate ? ` วันที่ ${formattedDate}` : ""}`;

      return { chat, index, formattedDate, formattedTime, isUser, ariaLabel };
    });
  }, [message]);

  return (
    <div className="fixed bottom-0 right-0 m-5 lg:m-10">
      {openChat ? (
        <section
          id={chatPanelId}
          aria-label="แชทสนทนากับเจ้าหน้าที่"
          className="border shadow overflow-hidden rounded-lg"
        >
          {/* ✅ responsive width: มือถือเกือบเต็มจอ, เดสก์ท็อปใกล้เดิม */}
          <div className="w-[92vw] max-w-sm">
            {/* Header */}
            <div
              className={`${bgColorWhite} ${bgColorNavbar} flex justify-between py-2 px-4 shadow-md items-center`}
            >
              <div className="flex gap-2 items-center">
                <Icon path={mdiShieldAccount} size={1} aria-hidden="true" />
                <p className="font-semibold">สนทนากับเจ้าหน้าที่</p>
              </div>

              {/* ✅ ต้องเป็น button เพื่อให้คีย์บอร์ด/reader ใช้ได้ */}
              <button
                type="button"
                onClick={() => setOpenChat(false)}
                className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                aria-label="ปิดหน้าต่างแชท"
              >
                <Icon path={mdiClose} size={0.9} aria-hidden="true" />
              </button>
            </div>

            {/* Messages area */}
            <div
              ref={logRef}
              id={chatLogId}
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
              aria-label="ข้อความในแชท"
              tabIndex={0}
              className={`${bgColorMain2} h-[60vh] max-h-[22rem] pb-3 px-4 flex flex-col gap-1 outline-none`}
              style={{
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {renderedMessages.map(({ chat, index, formattedDate, formattedTime, isUser, ariaLabel }) => {
                const showStatus =
                  isUser && index === renderedMessages.length - 1; // แสดงสถานะเฉพาะข้อความล่าสุดของ user

                return (
                  <div
                    key={index}
                    className={`mt-2 flex items-end gap-2 ${
                      isUser ? "self-end" : "flex-row-reverse self-start"
                    }`}
                    role="article"
                    aria-label={ariaLabel}
                  >
                    <div className="flex flex-col items-end">
                      <div className={`${isUser ? "" : "self-start"} text-[10px]`}>
                        {formattedDate && formattedTime ? `${formattedDate}, ${formattedTime}` : ""}
                      </div>

                      <div className={`${isUser ? "" : "self-start"} flex flex-col items-end gap-1`}>
                        <div
                          className={`border py-1 px-2 rounded-xl ${bgColor} w-fit ${
                            isUser
                              ? "self-end rounded-tr-none"
                              : `rounded-tl-none self-start ${bgColorNavbar} ${bgColorWhite}`
                          }`}
                        >
                          <p className="max-w-44 break-words">{chat?.message}</p>
                        </div>
                      </div>

                      {showStatus && (
                        <div className="mt-1" aria-live="polite">
                          {loaderMessage ? (
                            <div className="flex items-center gap-1">
                              <ClipLoader color="" size={10} />
                              <span className="text-[10px]">กำลังส่ง</span>
                            </div>
                          ) : dataMessage?.statusReadAdmin ? (
                            <p className="text-[10px]">ส่งแล้ว</p>
                          ) : (
                            <p className="text-[10px]">เห็นแล้ว</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="self-start">
                      {isUser ? (
                        <Image
                          priority
                          alt="รูปโปรไฟล์ผู้ใช้"
                          className="w-5 h-5 shadow flex-shrink-0 rounded-full border"
                          src={dataUser?.profile || "/image/main/user.png"}
                          height={1000}
                          width={1000}
                        />
                      ) : (
                        <Icon path={mdiShieldAccount} size={0.8} aria-label="เจ้าหน้าที่" />
                      )}
                    </div>
                  </div>
                );
              })}

              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <form
              onSubmit={sendMessage}
              className={`py-2 px-4 ${bgColor} flex justify-between items-center gap-2 shadow-lg`}
              aria-label="ส่งข้อความแชท"
            >
              {/* ✅ label สำหรับ screen reader */}
              <label htmlFor={chatInputId} className="sr-only">
                พิมพ์ข้อความ
              </label>

              <textarea
                id={chatInputId}
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                className={`${bgColorMain2} w-full py-1 px-4 rounded-xl resize-none border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
                placeholder="พิมพ์ข้อความ"
                aria-describedby={chatHintId}
                // ✅ Enter ส่ง / Shift+Enter ขึ้นบรรทัดใหม่
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(e);
                  }
                }}
              />

              <p id={chatHintId} className="sr-only">
                กด Enter เพื่อส่งข้อความ หรือ Shift+Enter เพื่อขึ้นบรรทัดใหม่
              </p>

              <button
                type="submit"
                className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                aria-label="ส่งข้อความ"
              >
                <Icon path={mdiSend} size={1} aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>
      ) : (
        // ✅ ปุ่มเปิดแชท ต้องเป็น button
        <button
  type="button"
  onClick={() => {
    setOpenChat(true);
    handleUpdateStatusRead(id);
  }}
  className={`
    cursor-pointer relative
    flex items-center gap-2
    px-3 py-2
    rounded-full
    ${bgColor}
    shadow
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
  `}
  aria-label="คุยกับเจ้าหน้าที่"
  aria-controls={chatPanelId}
  aria-expanded="false"
>
  {hasUnread && (
    <span
      className={`${
        bgColorNavbar === "bg-[#F97201]" ? "bg-red-500" : `${bgColorNavbar}`
      } w-2 h-2 rounded-full absolute top-1 right-1`}
      aria-hidden="true"
    />
  )}

          <Icon
            className={`${bgColorNavbar === "bg-[#F97201]" ? "text-[#F97201]" : `${bgColor}`}`}
            path={mdiForum}
            size={2}
            aria-hidden="true"
          />

  {/* ✅ ข้อความที่มองเห็นได้ */}
  <span className="text-sm font-semibold whitespace-nowrap">
    คุยกับเจ้าหน้าที่
  </span>
</button>

      )}
    </div>
  );
}

export default ChatComponent;
