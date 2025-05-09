export const exportToCSV = ({
  columns,
  rows,
  fileName = "exported_data.csv",
}) => {
  // 1. เตรียม Header (ใช้ label)
  const headers = columns.map((col) => col.label);

  // 2. เตรียมข้อมูล
  const dataRows = rows.map((row) =>
    columns.map((col) => {
      const value = row[col.id];
      return typeof value === "string" || typeof value === "number"
        ? value
        : JSON.stringify(value ?? "");
    })
  );

  // 3. รวม Header + Data
  const allRows = [headers, ...dataRows];

  // 4. แปลงเป็น CSV string
  const csvContent = allRows.map((e) => e.join(",")).join("\n");

  // 5. ใส่ BOM สำหรับ Excel รองรับภาษาไทย
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  // 6. Trigger Download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};
