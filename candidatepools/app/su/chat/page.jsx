"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import { mdiSend, mdiShieldAccount, mdiMagnify, mdiPaperclip } from "@mdi/js";
import { ClipLoader } from "react-spinners";
import { useFileUpload } from "@/hooks/useFileUpload";

//store
import { useChatStore } from "@/stores/useChatStore";
import { useUserStore } from "@/stores/useUserStore";
import { isImageFile } from "@/helper/isImageFile";
import { getFileIcon } from "@/helper/getFileIcon";
import { toast } from "react-toastify";

function ChatPage() {
  // state สำหรับไฟล์ที่เลือก
  const {
    files,
    uploadFile,
    removeFile,
    uploadProgress,
    isUploading,
    resetFiles,
  } = useFileUpload();

  //store
  const { fetchChats, sendMessage, updateStatusRead, chats } = useChatStore();
  const { getUserById } = useUserStore();

  // Validate session and fetch user data
  const fetchChatData = () => {
    fetchChats();
  };

  //Theme
  const { bgColorNavbar, bgColor, bgColorWhite, bgColorMain2 } = useTheme();

  const [dataChats, setDataChats] = useState([]);
  //for system search
  const [filteredUsers, setFilteredUsers] = useState([]);

  //users
  const loadedChatIds = useRef(new Set()); // ใช้ set เพื่อติดตาม uuid ที่โหลดแล้ว

  useEffect(() => {
    if (Array.isArray(chats) && chats.length > 0) {
      chats.forEach((chat) => {
        if (chat?.uuid && !loadedChatIds.current.has(chat.uuid)) {
          // ถ้ายังไม่มีใน loadedChatIds, เพิ่มแล้วเรียก getUserChat
          loadedChatIds.current.add(chat.uuid);
          getUserChat(chat.uuid);
        }
      });
    }
  }, [chats]);

  async function getUserChat(id) {
    try {
      const res = await getUserById(id);

      if (!res) {
        throw new Error("Error getting data from API");
      }

      const data = res;
      // ตรวจสอบว่า data.user ไม่เป็น null และเป็น object
      if (data && typeof data === "object") {
        setDataChats((prev) => [...prev, data]); // เพิ่ม object เข้าไปในอาร์เรย์
        setFilteredUsers((prev) => [...prev, data]);
      } else {
        console.error(
          "Expected 'data.user' to be a valid object but got:",
          data,
        );
      }
    } catch (err) {
      console.error("Error fetching API", err);
    } finally {
    }
  }

  //show chat
  const [showChat, setShowChat] = useState([]);
  const [statusChat, setStatusChat] = useState("");

  //sendMessage
  const [input, setInput] = useState("");
  const [loaderMessage, setLoaderMessage] = useState(false);

  async function sendMessageFunctiom(e, id) {
    e.preventDefault();

    if (!input.trim() && files.length === 0) {
      return;
    }
    setLoaderMessage(true);

    if (!id) {
      return;
    }

    setShowChat((prevChat) => ({
      ...prevChat,
      uuid: id,
      roomChat: [
        ...(prevChat?.roomChat || []),
        {
          message: input, // ข้อความใหม่
          senderRole: "admin", // role ของผู้ส่งข้อความ
          file: files.map((f) => {
            return {
              name: f.name,
              size: f.sizeMB,
              fileType: f.type,
              url: f.url,
            };
          }),
        },
      ],
    }));

    try {
      const res = await sendMessage({
        userId: id,
        message: input,
        senderRole: "admin",
        statusRead: true,
        statusReadAdmin: false,
        file: files.map((f) => {
          return {
            name: f.name,
            size: f.sizeMB,
            fileType: f.type,
            url: f.url,
          };
        }),
      });

      if (res.ok) {
        setLoaderMessage(false);
        setShowChat(res?.data);

        fetchChatData();
        setInput(""); // เคลียร์ input หลังจากส่ง
        resetFiles();
      }
    } catch (err) {
      console.error("Error fetching API", err);
      alert("เกิดข้อผิดพลาด");
      window.location.reload();
    }
  }

  //latest chat
  const chatEndRef = useRef(null);

  useEffect(() => {
    // เลื่อนลงไปที่ข้อความล่าสุดทันทีเมื่อเปิด
    chatEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [showChat]); // ใช้ dependency array เป็น [] เพื่อให้ทำงานเฉพาะครั้งแรก

  //serch user
  const [inputSearch, setInputSearch] = useState("");

  useEffect(() => {
    if (inputSearch.trim() === "") {
      setFilteredUsers(dataChats || []); // คืนค่าทั้งหมดถ้าไม่มีคำค้นหา
      return;
    }

    // ค้นหาใน dataChats
    const filtered = dataChats?.filter((user) => {
      const name = `${user?.firstName} ${user?.lastName}`; // รวมชื่อและนามสกุล
      return name.toLowerCase().includes(inputSearch.toLowerCase());
    });

    setFilteredUsers(filtered || []);
  }, [inputSearch]);

  async function handleUpdateStatusRead(id) {
    try {
      const res = await updateStatusRead({
        userId: id,
        statusReadAdmin: false,
      });

      if (res.ok) {
        const data = await res.json(); // รับข้อมูลที่ได้จาก API
        if (chats?.some((u) => u?.uuid === id)) {
          fetchChatData();
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg flex h-screen`}>
      {/* sender */}
      <div className=" max-w-72 flex flex-col ">
        <div className="p-5">
          <div
            className={`${bgColor} border w-fit flex rounded-lg items-center gap-2 px-2 py-1`}
          >
            <input
              type="text"
              className={`${bgColor} px-2  outline-none `}
              placeholder="ค้นหา"
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
            />
            <Icon className={` cursor-pointer`} path={mdiMagnify} size={1} />
          </div>
        </div>
        <hr className="w-full" />
        {!filteredUsers ? (
          <div className="flex flex-col gap-2 justify-center items-center mt-3 text-xs">
            <ClipLoader color="" size={15} />
            <p>กำลังโหลด...</p>
          </div>
        ) : (
          <div
            className="flex-grow  "
            style={{
              overflowY: "auto",
              scrollbarWidth: "none", // สำหรับ Firefox
              msOverflowStyle: "none", // สำหรับ IE
            }}
          >
            {filteredUsers
              ?.sort((a, b) => {
                const chatA = chats?.find((c) => c?.uuid === a?.uuid);
                const chatB = chats?.find((c) => c?.uuid === b?.uuid);

                const timeA = new Date(
                  chatA?.roomChat[chatA?.roomChat?.length - 1]?.timestamp || 0,
                ).getTime();
                const timeB = new Date(
                  chatB?.roomChat[chatB?.roomChat?.length - 1]?.timestamp || 0,
                ).getTime();

                return timeB - timeA; // จัดเรียงจากเวลาล่าสุดไปยังเก่าสุด
              })
              ?.map((user, index) => {
                const chatLatest = chats?.find((c) => c?.uuid === user?.uuid);
                let sender = false;

                if (
                  chatLatest?.roomChat[chatLatest?.roomChat?.length - 1]
                    ?.senderRole === "admin"
                ) {
                  sender = true;
                }
                const isRead = chatLatest?.statusReadAdmin;

                const date = new Date(
                  chatLatest?.roomChat[chatLatest?.roomChat?.length - 1]
                    ?.timestamp,
                );
                const formattedDate = date.toLocaleDateString("th-TH", {
                  weekday: "short", // วันในสัปดาห์ (เช่น "จ.", "อ.", "พ.")
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                const formattedTime = date.toLocaleTimeString("th-TH", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={index}
                    className={` ${
                      statusChat === user?.uuid ? "bg-gray-200" : ""
                    }  transition-colors flex px-5  py-2 border gap-3 items-center cursor-pointer  hover:bg-gray-200 relative`}
                    onClick={(e) => {
                      setShowChat(chats?.find((c) => c.uuid === user?.uuid));
                      setStatusChat(user?.uuid);
                      setInput("");
                      handleUpdateStatusRead(user?.uuid);
                      resetFiles();
                    }}
                  >
                    <Image
                      priority
                      alt="icon"
                      className="w-11 h-11 flex-shrink-0 rounded-full"
                      src={user?.profile || "/image/main/user.png"}
                      height={1000}
                      width={1000}
                    />
                    <div className="flex flex-col text-ellipsis overflow-hidden ">
                      <p className={` text-[10px]`}>
                        {formattedDate} ,{formattedTime}
                      </p>
                      <p
                        className={` whitespace-nowrap text-ellipsis overflow-hidden `}
                      >
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p
                        className={`${
                          isRead ? `` : "text-gray-400"
                        } whitespace-nowrap text-ellipsis overflow-hidden `}
                      >
                        {sender ? "คุณ: " : ""}{" "}
                        {chatLatest?.roomChat[chatLatest?.roomChat?.length - 1]
                          ?.message || "ส่งไฟล์แนบ"}
                      </p>
                    </div>
                    <div
                      className={`${
                        isRead ? `bg-red-500` : `bg-gray-400`
                      } m-2  rounded-full w-3 h-3 absolute top-0 right-0`}
                    ></div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
      {/* chat */}
      <form
        onSubmit={(e) => sendMessageFunctiom(e, statusChat)}
        className={`border-l-2 w-full px-10 py-5 flex flex-col `}
      >
        {!statusChat ? (
          <div className=" h-full  flex justify-center items-center text-xs">
            <p>คลิกเลือกผู้ใช้เพื่อเปิดดูข้อความ</p>
          </div>
        ) : (
          <>
            <div
              className=" flex-grow  px-3 py-10  "
              style={{
                overflowY: "auto",
                scrollbarWidth: "none", // สำหรับ Firefox
                msOverflowStyle: "none", // สำหรับ IE
              }}
            >
              <div className={"flex flex-col gap-1"}>
                {showChat &&
                  showChat?.roomChat?.map((chat, index) => {
                    const date = new Date(chat?.timestamp);
                    const formattedDate = date.toLocaleDateString("th-TH", {
                      weekday: "short", // วันในสัปดาห์ (เช่น "จ.", "อ.", "พ.")
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });
                    const formattedTime = date.toLocaleTimeString("th-TH", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={index}
                        className={`${
                          chat?.senderRole === "user"
                            ? "flex-row-reverse self-start "
                            : `self-end`
                        } flex gap-3 items-start mt-1`}
                      >
                        <div className="flex flex-col ">
                          <div className="flex flex-col">
                            <div
                              className={`${
                                chat?.senderRole === "user"
                                  ? "self-start"
                                  : "self-end"
                              } `}
                            >
                              <p className={` text-[10px]`}>
                                {formattedDate}, {formattedTime}
                              </p>
                            </div>
                            <div
                              className={`${
                                chat?.senderRole === "user"
                                  ? `${bgColorNavbar} ${bgColorWhite} rounded-tl-none self-start`
                                  : `self-end rounded-tr-none`
                              } border py-1 px-2 rounded-lg ${bgColor} w-fit max-w-96`}
                            >
                              {/* ข้อความ */}
                              {chat?.message && (
                                <p className="break-words mb-1">
                                  {chat.message}
                                </p>
                              )}

                              {/* ไฟล์ */}
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
                                          className=" rounded border cursor-pointer hover:opacity-90"
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
                                        <p
                                          className={`text-black text-xs truncate ]`}
                                        >
                                          {file.name}
                                        </p>
                                      </a>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          {chat?.senderRole === "admin" &&
                            index === showChat?.roomChat.length - 1 && (
                              <div className="self-end mt-1">
                                {loaderMessage ? (
                                  <ClipLoader color="" size={10} />
                                ) : showChat?.statusRead ? (
                                  <div className="flex gap-1 items-center">
                                    <p className="text-[10px]">ส่งแล้ว</p>
                                  </div>
                                ) : (
                                  <div className="flex gap-1 items-center">
                                    <p className="text-[10px]">เห็นแล้ว</p>
                                  </div>
                                )}
                              </div>
                            )}
                        </div>
                        {chat?.senderRole === "user" ? (
                          <Image
                            priority
                            alt="icon"
                            className="w-5 h-5 shadow flex-shrink-0 rounded-full border"
                            src={`${
                              dataChats?.find((d) => d?.uuid === showChat?.uuid)
                                ?.profile || "/image/main/user.png"
                            }`}
                            height={1000}
                            width={1000}
                          />
                        ) : (
                          <Icon
                            className={`cursor-pointer`}
                            path={mdiShieldAccount}
                            size={1}
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
              <div ref={chatEndRef} />
            </div>
            <div className="">
              {/* Preview ไฟล์/รูปที่เลือก */}
              <div className="flex items-end flex-wrap gap-2 mb-2">
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
              <div className={`flex items-end rounded-lg ${bgColor}`}>
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
                  type="text"
                  value={input}
                  className={`${bgColor} outline-none w-full py-2 px-4 rounded-xl resize-none`}
                  placeholder="พิมพ์ข้อความ"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessageFunctiom(e, statusChat);
                      setInput("");
                    }
                  }}
                />
                <button type="submit" className="p-2">
                  <Icon
                    className="cursor-pointer self-end"
                    path={mdiSend}
                    size={1.2}
                    aria-hidden="true"
                    aria-label="close_chat"
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default ChatPage;
