"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Icon from "@mdi/react";
import {
  mdiForum,
  mdiSend,
  mdiClose,
  mdiShieldAccount,
  mdiPaperclip,
} from "@mdi/js";
import { useTheme } from "../ThemeContext";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import { useFileUpload } from "@/hooks/useFileUpload";
import { isImageFile } from "@/helper/isImageFile";
import { getFileIcon } from "@/helper/getFileIcon";

function ChatComponent({ id, dataUser }) {
  // Theme
  const { bgColorNavbar, bgColor, bgColorWhite, bgColorMain2 } = useTheme();

  const [openChat, setOpenChat] = useState(false);

  // state สำหรับไฟล์ที่เลือก
  const {
    files,
    uploadFile,
    removeFile,
    uploadProgress,
    isUploading,
    resetFiles,
  } = useFileUpload();

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
    if (!text && files.length === 0) return;

    setLoaderMessage(true);

    // optimistic update
    setMessage((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      {
        message: text,
        senderRole: "user",
        timestamp: new Date().toISOString(),
        file: files.map((f) => {
          return {
            name: f.name,
            size: f.sizeMB,
            fileType: f.type,
            url: f.url,
          };
        }),
      },
    ]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: id,
            message: text,
            senderRole: "user",
            statusRead: false,
            statusReadAdmin: true,
            file: files.map((f) => {
              return {
                name: f.name,
                size: f.sizeMB,
                fileType: f.type,
                url: f.url,
              };
            }),
          }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        setMessage(
          Array.isArray(data?.data?.roomChat) ? data.data.roomChat : [],
        );
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
      resetFiles();
    }
  }

  async function getMessage() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/messages/${id}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      if (!res.ok) throw new Error("Error getting data from API");

      const data = await res.json();
      setMessage(
        Array.isArray(data?.chats?.roomChat) ? data.chats.roomChat : [],
      );
      setDataMessage(data?.chats || null);
    } catch (err) {
      console.error("Error fetching API", err);
    }
  }

  async function handleUpdateStatusRead(userId) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/messages/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statusRead: false }),
        },
      );

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
        : date.toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
          });

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
              {renderedMessages.map(
                ({
                  chat,
                  index,
                  formattedDate,
                  formattedTime,
                  isUser,
                  ariaLabel,
                }) => {
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
                        <div
                          className={`${isUser ? "" : "self-start"} text-[10px]`}
                        >
                          {formattedDate && formattedTime
                            ? `${formattedDate}, ${formattedTime}`
                            : ""}
                        </div>

                        <div
                          className={`${isUser ? "" : "self-start"} flex flex-col items-end gap-1`}
                        >
                          <div
                            className={`border py-1 px-2 rounded-xl ${bgColor} w-fit ${
                              isUser
                                ? "self-end rounded-tr-none"
                                : `rounded-tl-none self-start ${bgColorNavbar} ${bgColorWhite}`
                            }`}
                          >
                            <p className="max-w-44 break-words">
                              {chat?.message}
                            </p>
                            {chat?.file?.length > 0 && (
                              <div className="flex flex-col gap-1">
                                {chat.file.map((file, i) =>
                                  isImageFile(file.fileType) ? (
                                    <a
                                      key={i}
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-block"
                                    >
                                      <img
                                        src={file.url}
                                        alt={file.name}
                                        className="max-w-48 rounded border cursor-pointer hover:opacity-90"
                                      />
                                    </a>
                                  ) : (
                                    <a
                                      key={i}
                                      href={file.url}
                                      download
                                      target="_blank"
                                      className="flex text-ellipsis whitespace-nowrap overflow-hidden items-center gap-2 px-2 py-1 bg-gray-100 rounded border hover:bg-gray-200"
                                    >
                                      <Icon
                                        path={getFileIcon(file.fileType)}
                                        size={1}
                                        className="text-gray-600 flex-shrink-0"
                                      />
                                      <p className="text-xs text-black truncate max-w-[140px]">
                                        {file.name}
                                      </p>
                                    </a>
                                  ),
                                )}
                              </div>
                            )}
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
                          <Icon
                            path={mdiShieldAccount}
                            size={0.8}
                            aria-label="เจ้าหน้าที่"
                          />
                        )}
                      </div>
                    </div>
                  );
                },
              )}

              <div ref={chatEndRef} />
            </div>
            <div>
              <div className="flex items-end flex-wrap gap-2 mb-2 px-2">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative flex flex-col items-center "
                  >
                    {isImageFile(file.type) ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-16 h-16  object-cover rounded border"
                      />
                    ) : (
                      <div
                        key={idx}
                        href={file.url}
                        download
                        target="_blank"
                        className="w-16 h-16  flex flex-col text-ellipsis whitespace-nowrap overflow-hidden items-center gap-2 px-2 py-1 bg-gray-100 rounded border hover:bg-gray-200"
                      >
                        <Icon
                          path={getFileIcon(file.type)}
                          size={1}
                          className="text-gray-600 flex-shrink-0"
                        />
                        <p className="text-xs truncate max-w-[140px]">
                          {file.name.split(".").pop()?.toUpperCase() || "FILE"}
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      onClick={() => removeFile(idx)}
                      title="ลบไฟล์นี้"
                    >
                      ×
                    </button>
                    <span className="text-[10px] mt-1 max-w-16 truncate text-center">
                      {file.name}
                    </span>
                  </div>
                ))}
                {/* overlay progress */}
                {isUploading && <span className="">{uploadProgress}%</span>}
              </div>
              {/* Input area */}
              <form
                onSubmit={sendMessage}
                className={`py-2 px-4 ${bgColor} flex justify-between items-center gap-2 shadow-lg`}
                aria-label="ส่งข้อความแชท"
              >
                {/* แสดงไฟล์ที่แนบมา */}

                {/* ปุ่มแนบไฟล์/รูป */}
                <label
                  className="p-2 cursor-pointer flex items-center"
                  htmlFor="chat-file-input"
                >
                  <Icon path={mdiPaperclip} size={1} />
                  <input
                    id="chat-file-input"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      if (isUploading) {
                        toast.error("กรุณารอให้การอัปโหลดไฟล์เสร็จก่อน");
                        return;
                      }
                      if (!e.target.files?.[0]) return;
                      await uploadFile(e.target.files[0], `users/message/file`);
                      e.target.value = "";
                    }}
                  />
                </label>
                <input
                  id={chatInputId}
                  ref={inputRef}
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
                bgColorNavbar === "bg-[#F97201]"
                  ? "bg-red-500"
                  : `${bgColorNavbar}`
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
