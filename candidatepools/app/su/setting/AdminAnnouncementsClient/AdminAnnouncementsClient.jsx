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

  const { announcements, loading, fetchAnnouncements, addAnnouncement, updateAnnouncement, deleteAnnouncement } =
    useAnnouncementStore();

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
        publishedAt: a.publishedAt ? new Date(a.publishedAt).toLocaleString("th-TH") : "-",
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
          <Icon onClick={() => openModal(row.raw)} className="cursor-pointer text-gray-40 mx-1" path={mdiPencil} size={0.8} />
          <Icon onClick={() => confirmDelete(row.id, row.title)} className="cursor-pointer text-gray-40 mx-1" path={mdiDelete} size={0.8} />
        </div>
      ),
    },
  ];

  const handleChangePage = (_e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(Number(e.target.value)); setPage(0); };

  async function openModal(existing) {
  const isEdit = !!existing?._id;

  const html = `
  <div
    id="announcement-form"
    style="
      text-align:left;
      display:grid;
      grid-template-columns:1fr
      gap:16px;
      max-height:65vh;
      overflow:auto;
      padding-right:4px;
    "
  >

    <!-- Title -->
    <div style="grid-column:1 / -1">
      <label for="a_title"><b>หัวข้อ *</b></label>
      <input
        id="a_title"
        class="swal2-input"
        style="margin-top:4px"
        value="${escapeHtml(existing?.title || "")}"
      />
    </div>

    <!-- Description -->
    <div style="grid-column:1 / -1">
      <label for="a_desc">
        <b>คำอธิบายสั้น *</b>
        <div style="font-size:12px;opacity:.7">
          แสดงก่อนกดอ่านเพิ่มเติม
        </div>
      </label>
      <textarea
        id="a_desc"
        class="swal2-textarea"
        rows="3"
        style="margin-top:4px"
      >${escapeHtml(existing?.description || "")}</textarea>
    </div>

    <!-- Content -->
    <div style="grid-column:1 / -1">
      <label for="a_content"><b>เนื้อหาเต็ม *</b></label>
      <textarea
        id="a_content"
        class="swal2-textarea"
        rows="5"
        style="margin-top:4px"
      >${escapeHtml(existing?.content || "")}</textarea>
    </div>

    <!-- Link URL -->
    <div>
      <label for="a_linkUrl"><b>ลิงก์</b></label>
      <input
        id="a_linkUrl"
        class="swal2-input"
        placeholder="https://..."
        style="margin-top:4px"
        value="${escapeHtml(existing?.linkUrl || "")}"
      />
    </div>

    <!-- Link Text -->
    <div>
      <label for="a_linkText"><b>ข้อความลิงก์</b></label>
      <input
        id="a_linkText"
        class="swal2-input"
        placeholder="อ่านเพิ่มเติม"
        style="margin-top:4px"
        value="${escapeHtml(existing?.linkText || "")}"
      />
    </div>

    <!-- Pinned -->
    <div style="grid-column:1 / -1">
      <label style="display:flex;align-items:center;gap:6px">
        <input id="a_pinned" type="checkbox" ${existing?.pinned ? "checked" : ""} />
        <b>ปักหมุด</b>
        <span style="font-size:12px;opacity:.7">(แสดงก่อน Facebook)</span>
      </label>
    </div>

    <!-- Image -->
    <div style="grid-column:1 / -1">
      <label><b>รูปประกอบ (optional)</b></label>

      <input
        id="a_image"
        type="file"
        accept="image/*"
        class="swal2-file"
        style="margin-top:6px"
      />

      <div
        id="image_preview"
        style="
          margin-top:8px;
          display:${existing?.imageUrl ? "block" : "none"};
        "
      >
        <img
          id="image_preview_img"
          src="${escapeHtml(existing?.imageUrl || "")}"
          alt="ตัวอย่างรูปประกาศ"
          style="
            max-width:100%;
            max-height:180px;
            border-radius:6px;
            border:1px solid #ddd;
          "
        />
      </div>

      <div style="font-size:12px;opacity:.7;margin-top:4px">
        ไม่เลือกรูปใหม่ = ใช้รูปเดิม
      </div>
    </div>

  </div>
`;

  const html_back = `
    <div style="text-align:left">
      <label>หัวข้อ (Title) *</label>
      <input id="a_title" class="swal2-input" placeholder="หัวข้อ" value="${escapeHtml(existing?.title || "")}">

      <label>คำอธิบายสั้น (Description) * (โชว์ก่อนกดอ่านเพิ่มเติม)</label>
      <textarea id="a_desc" class="swal2-textarea" placeholder="สรุปสั้น ๆ">${escapeHtml(existing?.description || "")}</textarea>

      <label>เนื้อหาเต็ม (Content) *</label>
      <textarea id="a_content" class="swal2-textarea" placeholder="เนื้อหาเต็ม">${escapeHtml(existing?.content || "")}</textarea>

      <label>ลิงก์ (optional)</label>
      <input id="a_linkUrl" class="swal2-input" placeholder="https://..." value="${escapeHtml(existing?.linkUrl || "")}">
      <input id="a_linkText" class="swal2-input" placeholder="ข้อความลิงก์" value="${escapeHtml(existing?.linkText || "")}">

      <div style="margin-top:8px">
        <label>
          <input id="a_pinned" type="checkbox" ${existing?.pinned ? "checked" : ""} />
          ปักหมุด (Pinned)
        </label>
      </div>

      <div style="margin-top:12px">
        <label>รูปประกอบ (optional)</label>
        <input id="a_image" type="file" accept="image/*" class="swal2-file" />
        <div style="font-size:12px; opacity:.8; margin-top:6px">
          ไม่เลือกรูปใหม่ = ใช้รูปเดิม
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
      const description = document.getElementById("a_desc")?.value?.trim() || "";
      const content = document.getElementById("a_content")?.value?.trim() || "";
      const linkUrl = document.getElementById("a_linkUrl")?.value?.trim() || "";
      const linkText = document.getElementById("a_linkText")?.value?.trim() || "";
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

      return { title, description, content, linkUrl, linkText, pinned, imageUrl };
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


  async function openModal_back(existing) {
    const isEdit = !!existing?._id;

    const html = `
<div
  id="announcement-form"
  style="
    text-align:left;
    display:flex;
    flex-direction:column;
    gap:16px;
    max-height:65vh;
    overflow-y:auto;
    padding-right:6px;
  "
>

  <!-- Title -->
  <div style="display:flex;flex-direction:column;gap:6px">
    <label for="a_title"><b>หัวข้อ *</b></label>
    <input
      id="a_title"
      class="swal2-input"
      style="margin:0;width:100%"
      value="${escapeHtml(existing?.title || "")}"
    />
  </div>

  <!-- Description -->
  <div style="display:flex;flex-direction:column;gap:6px">
    <label for="a_desc">
      <b>คำอธิบายสั้น *</b>
      <div style="font-size:12px;opacity:.7">
        แสดงก่อนกดอ่านเพิ่มเติม
      </div>
    </label>
    <textarea
      id="a_desc"
      class="swal2-textarea"
      rows="3"
      style="margin:0;width:100%"
    >${escapeHtml(existing?.description || "")}</textarea>
  </div>

  <!-- Content -->
  <div style="display:flex;flex-direction:column;gap:6px">
    <label for="a_content"><b>เนื้อหาเต็ม *</b></label>
    <textarea
      id="a_content"
      class="swal2-textarea"
      rows="5"
      style="margin:0;width:100%"
    >${escapeHtml(existing?.content || "")}</textarea>
  </div>

  <!-- Link -->
  <div style="display:flex;flex-direction:column;gap:6px">
    <label for="a_linkUrl"><b>ลิงก์</b></label>
    <input
      id="a_linkUrl"
      class="swal2-input"
      placeholder="https://..."
      style="margin:0;width:100%"
      value="${escapeHtml(existing?.linkUrl || "")}"
    />
  </div>

  <!-- Pinned -->
  <div>
    <label style="display:flex;align-items:center;gap:8px">
      <input id="a_pinned" type="checkbox" ${existing?.pinned ? "checked" : ""} />
      <b>ปักหมุด</b>
    </label>
  </div>

  <!-- Image -->
  <div style="display:flex;flex-direction:column;gap:6px">
    <label><b>รูปประกอบ (optional)</b></label>
    <input id="a_image" type="file" accept="image/*" class="swal2-file" />

    <div
      id="image_preview"
      style="display:${existing?.imageUrl ? "block" : "none"}"
    >
      <img
        id="image_preview_img"
        src="${escapeHtml(existing?.imageUrl || "")}"
        alt="ตัวอย่างรูปประกาศ"
        style="
          max-width:100%;
          max-height:180px;
          border-radius:6px;
          border:1px solid #ddd;
        "
      />
    </div>

    <div style="font-size:12px;opacity:.7">
      ไม่เลือกรูปใหม่ = ใช้รูปเดิม
    </div>
  </div>

</div>
`;

    const html_back = `
      <div style="text-align:left">
        <label>หัวข้อ (Title) *</label>
        <input id="a_title" class="swal2-input" placeholder="หัวข้อ" value="${escapeHtml(existing?.title || "")}">

        <label>คำอธิบายสั้น (Description) * (โชว์ก่อนกดอ่านเพิ่มเติม)</label>
        <textarea id="a_desc" class="swal2-textarea" placeholder="สรุปสั้น ๆ">${escapeHtml(existing?.description || "")}</textarea>

        <label>เนื้อหาเต็ม (Content) *</label>
        <textarea id="a_content" class="swal2-textarea" placeholder="เนื้อหาเต็ม">${escapeHtml(existing?.content || "")}</textarea>

        <label>ลิงก์ (optional)</label>
        <input id="a_linkUrl" class="swal2-input" placeholder="https://..." value="${escapeHtml(existing?.linkUrl || "")}">
        <input id="a_linkText" class="swal2-input" placeholder="ข้อความลิงก์" value="${escapeHtml(existing?.linkText || "")}">

        <div style="margin-top:8px">
          <label>
            <input id="a_pinned" type="checkbox" ${existing?.pinned ? "checked" : ""} />
            ปักหมุด (Pinned)
          </label>
        </div>

        <div style="margin-top:12px">
          <label>รูปประกอบ (optional)</label>
          <input id="a_image" type="file" accept="image/*" class="swal2-file" />
          <div style="font-size:12px; opacity:.8; margin-top:6px">
            ไม่เลือกรูปใหม่ = ใช้รูปเดิม
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
      preConfirm: async () => {
        const title = document.getElementById("a_title")?.value?.trim() || "";
        const description = document.getElementById("a_desc")?.value?.trim() || "";
        const content = document.getElementById("a_content")?.value?.trim() || "";
        const linkUrl = document.getElementById("a_linkUrl")?.value?.trim() || "";
        const linkText = document.getElementById("a_linkText")?.value?.trim() || "";
        const pinned = !!document.getElementById("a_pinned")?.checked;

        const fileInput = document.getElementById("a_image");
        const file = fileInput?.files?.[0];

        if (!title) return Swal.showValidationMessage("กรุณากรอกหัวข้อ (Title)");
        if (!description) return Swal.showValidationMessage("กรุณากรอกคำอธิบายสั้น (Description)");
        if (!content) return Swal.showValidationMessage("กรุณากรอกเนื้อหาเต็ม (Content)");

        let imageUrl = existing?.imageUrl || "";
        if (file) {
          try {
            imageUrl = await uploadImageToFirebase(file);
          } catch {
            return Swal.showValidationMessage("อัปโหลดรูปไม่สำเร็จ");
          }
        }

        return { title, description, content, linkUrl, linkText, pinned, imageUrl };
      },
    });

    if (!result.isConfirmed) return;


    try {
      if (isEdit) await updateAnnouncement(existing._id, result.value);
      else {
    if (!result.value) {
  toast.error("ไม่พบข้อมูลจากฟอร์ม (กรุณาลองใหม่)");
  return;
}
        
        await addAnnouncement(result.value);
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
        <ButtonBG2 handleClick={() => openModal(null)} mdiIcon={mdiPlus} text="เพิ่ม" tailwind="h-fit" />
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
