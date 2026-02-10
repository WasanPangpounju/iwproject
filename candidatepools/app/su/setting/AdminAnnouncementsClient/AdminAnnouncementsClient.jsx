"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/app/ThemeContext";
import InputLabelForm from "@/app/components/Form/InputLabelForm";
import ButtonBG2 from "@/app/components/Button/ButtonBG2";
import ReportTable from "@/app/components/Table/ReportTable";
import Icon from "@mdi/react";
import { mdiDelete, mdiPencil, mdiPlus } from "@mdi/js";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import useAnnouncementStore from "@/stores/useAnnouncementStore";

// Firebase
// import { storage } from "@/lib/firebaseStorage";
import { storage } from "@/app/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

async function uploadImageToFirebase(file) {
  if (!file) return "";
  const safeName = `${Date.now()}-${file.name}`.replace(/\s+/g, "-");
  const fileRef = ref(storage, `announcements/${safeName}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}

export default function AdminAnnouncementsClient() {
  const { bgColorMain2, bgColor } = useTheme();

  const {
    announcements,
    loading,
    fetchAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  } = useAnnouncementStore();

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const rows = useMemo(() => {
    const list = Array.isArray(announcements) ? announcements : [];
    const q = (search || "").toLowerCase();

    return list
      .filter((a) => {
        const t = (a.title || "").toLowerCase();
        const d = (a.description || "").toLowerCase();
        return t.includes(q) || d.includes(q);
      })
      .map((a, idx) => ({
        no: idx + 1,
        title: a.title || "(ไม่มีหัวข้อ)",
        pinned: a.pinned ? "ปักหมุด" : "-",
        publishedAt: a.publishedAt
          ? new Date(a.publishedAt).toLocaleString("th-TH")
          : "-",
        action: a._id,
        id: a._id,
        raw: a,
      }));
  }, [announcements, search]);

  const columns = [
    { id: "no", label: "ลำดับ", minWidth: 10, align: "left" },
    { id: "title", label: "หัวข้อ", minWidth: 180, align: "left" },
    { id: "pinned", label: "สถานะ", minWidth: 80, align: "left" },
    { id: "publishedAt", label: "เผยแพร่", minWidth: 140, align: "left" },
    {
      id: "action",
      label: "การจัดการ",
      minWidth: 10,
      align: "right",
      render: (_v, row) => (
        <div className="flex gap-2 justify-end">
          <Icon
            onClick={() => openModal(row.raw)}
            className="cursor-pointer text-gray-40 mx-1"
            path={mdiPencil}
            size={0.8}
          />
          <Icon
            onClick={() => confirmDelete(row.id, row.title)}
            className="cursor-pointer text-gray-40 mx-1"
            path={mdiDelete}
            size={0.8}
          />
        </div>
      ),
    },
  ];

  const handleChangePage = (_e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(0);
  };

  async function openModal(existing) {
    const isEdit = !!existing?._id;

    const html = `
  <div
  id="announcement-form"
  class="
    flex flex-col gap-4
    max-h-[65vh] overflow-auto px-4
    text-left
    font-sans
  "
>

  <!-- Title -->
  <div>
    <label for="a_title" style="font-weight:600;display:block">
      หัวข้อ <span style="color:#e03131">*</span>
    </label>
    <input
      id="a_title"
      class="border border-gray-400 py-2 px-4 rounded-lg
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      placeholder="หัวข้อประกาศ"
      style="margin-top:6px;width:100%"
      value="${escapeHtml(existing?.title || "")}"
    />
  </div>

  <!-- Description -->
  <div>
    <label for="a_desc" style="font-weight:600;display:block">
      คำอธิบายสั้น <span style="color:#e03131">*</span>
    </label>
    <div style="font-size:12px;color:#6b7280;margin-top:2px">
      แสดงก่อนกด “อ่านเพิ่มเติม”
    </div>
    <textarea
      id="a_desc"
      class="border border-gray-400 py-2 px-4 rounded-lg
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      rows="3"
      placeholder="สรุปเนื้อหาประกาศโดยย่อ"
      style="margin-top:6px;width:100%;resize:vertical"
    >${escapeHtml(existing?.description || "")}</textarea>
  </div>

  <!-- Content -->
  <div>
    <label for="a_content" style="font-weight:600;display:block">
      เนื้อหาเต็ม <span style="color:#e03131">*</span>
    </label>
    <textarea
      id="a_content"
    class="border border-gray-400 py-2 px-4 rounded-lg
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      rows="6"
      placeholder="รายละเอียดประกาศทั้งหมด"
      style="margin-top:6px;width:100%;resize:vertical"
    >${escapeHtml(existing?.content || "")}</textarea>
  </div>

  <!-- Link URL -->
  <div>
    <label for="a_linkUrl" style="font-weight:600;display:block">
      ลิงก์ (optional)
    </label>
    <input
      id="a_linkUrl"
      class="border border-gray-400 py-2 px-4 rounded-lg
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      placeholder="https://example.com"
      style="margin-top:6px;width:100%"
      value="${escapeHtml(existing?.linkUrl || "")}"
    />
  </div>

  <!-- Link Text -->
  <div>
    <label for="a_linkText" style="font-weight:600;display:block">
      ข้อความลิงก์
    </label>
    <input
      id="a_linkText"
      class="border border-gray-400 py-2 px-4 rounded-lg
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      placeholder="อ่านเพิ่มเติม"
      style="margin-top:6px;width:100%"
      value="${escapeHtml(existing?.linkText || "")}"
    />
  </div>

  <!-- Pinned -->
  <div
    style="
      padding:12px;
      background:#f8fafc;
      border:1px solid #e5e7eb;
      border-radius:8px;
    "
  >
    <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
      <input
        id="a_pinned"
        type="checkbox"
        style="transform:scale(1.1)"
        ${existing?.pinned ? "checked" : ""}
      />
      <span style="font-weight:600">ปักหมุดประกาศ</span>
      <span style="font-size:12px;color:#6b7280">
        (แสดงก่อนประกาศทั่วไป)
      </span>
    </label>
  </div>

  <!-- Image -->
  <div>
    <label style="font-weight:600;display:block">
      รูปประกอบ (optional)
    </label>

    <input
      id="a_image"
      type="file"
      accept="image/*"
      class="swal2-file"
      style="margin-top:8px"
    />

    <div
      id="image_preview"
      style="
        margin-top:10px;
        display:${existing?.imageUrl ? "block" : "none"};
      "
    >
      <img
        id="image_preview_img"
        src="${escapeHtml(existing?.imageUrl || "")}"
        alt="ตัวอย่างรูปประกาศ"
        style="
          max-width:100%;
          max-height:200px;
          border-radius:8px;
          border:1px solid #e5e7eb;
          background:#f9fafb;
        "
      />
    </div>

    <div style="font-size:12px;color:#6b7280;margin-top:6px">
      หากไม่เลือกรูปใหม่ ระบบจะใช้รูปเดิม
    </div>
  </div>

</div>
`;

    const result = await Swal.fire({
      title: isEdit ? "แก้ไขประกาศ" : "เพิ่มประกาศ",
      html,
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "บันทึก",
      confirmButtonColor: "#74c7c2",
      focusConfirm: false,

      didOpen: () => {
        // โฟกัสช่องแรก (keyboard navigation)
        document.getElementById("a_title")?.focus();

        // --- Image preview ---
        const fileInput = document.getElementById("a_image");
        const previewBox = document.getElementById("image_preview");
        const previewImg = document.getElementById("image_preview_img");

        fileInput?.addEventListener("change", (e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = () => {
            previewImg.src = reader.result;
            previewBox.style.display = "block";
          };
          reader.readAsDataURL(file);
        });

        // --- Responsive บน mobile ---
        if (window.innerWidth < 640) {
          const form = document.getElementById("announcement-form");
          if (form) {
            form.style.gridTemplateColumns = "1fr";
          }
        }
      },

      preConfirm: async () => {
        const title = document.getElementById("a_title")?.value?.trim() || "";
        const description =
          document.getElementById("a_desc")?.value?.trim() || "";
        const content =
          document.getElementById("a_content")?.value?.trim() || "";
        const linkUrl =
          document.getElementById("a_linkUrl")?.value?.trim() || "";
        const linkText =
          document.getElementById("a_linkText")?.value?.trim() || "";
        const pinned = !!document.getElementById("a_pinned")?.checked;

        if (!title) {
          Swal.showValidationMessage("กรุณากรอกหัวข้อ (Title)");
          return false;
        }
        if (!description) {
          Swal.showValidationMessage("กรุณากรอกคำอธิบายสั้น (Description)");
          return false;
        }
        if (!content) {
          Swal.showValidationMessage("กรุณากรอกเนื้อหาเต็ม (Content)");
          return false;
        }

        const fileInput = document.getElementById("a_image");
        const file = fileInput?.files?.[0];

        let imageUrl = existing?.imageUrl || "";
        if (file) {
          try {
            imageUrl = await uploadImageToFirebase(file);
          } catch {
            Swal.showValidationMessage("อัปโหลดรูปไม่สำเร็จ");
            return false;
          }
        }

        return {
          title,
          description,
          content,
          linkUrl,
          linkText,
          pinned,
          imageUrl,
        };
      },
    });

    if (!result.isConfirmed) return;

    // ✅ guard ใช้ทั้ง create/edit
    if (!result.value) {
      toast.error("ไม่พบข้อมูลจากฟอร์ม (กรุณาลองใหม่)");
      return;
    }

    try {
      const r = isEdit
        ? await updateAnnouncement(existing._id, result.value)
        : await addAnnouncement(result.value);

      if (r && r.ok === false) {
        toast.error("บันทึกไม่สำเร็จ");
        return;
      }

      toast.success("บันทึกสำเร็จ");
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      toast.error("บันทึกไม่สำเร็จ");
    }
  }

  async function confirmDelete(id, title) {
    const result = await Swal.fire({
      title: `ต้องการลบประกาศ\n"${title}" ?`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
      confirmButtonColor: "#f27474",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteAnnouncement(id);
      toast.success("ลบเรียบร้อย");
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      toast.error("ลบไม่สำเร็จ");
    }
  }

  if (loading) return null;

  return (
    <div className={`${bgColorMain2} ${bgColor} rounded-lg p-5`}>
      <p>ตั้งค่าประกาศ (Admin Announcements)</p>

      <div className="mt-5 flex justify-between items-end">
        <InputLabelForm
          label="ค้นหา"
          value={search}
          setValue={setSearch}
          editMode={true}
          placeholder="ค้นหาหัวข้อ/คำอธิบาย"
          tailwind="w-60"
        />
        <ButtonBG2
          handleClick={() => openModal(null)}
          mdiIcon={mdiPlus}
          text="เพิ่ม"
          tailwind="h-fit"
        />
      </div>

      <hr className="my-7 border-gray-500" />

      <ReportTable
        columns={columns}
        resultRows={rows}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}

function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
