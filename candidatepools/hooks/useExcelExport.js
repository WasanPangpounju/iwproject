// hooks/useExcelExport.ts
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const useExcelExport = () => {
  const exportExcel = async ({
    columns,
    rows,
    sheetName = "Exported Data",
    fileName = "exported_data.xlsx",
  }) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = columns.map((col) => ({
      header: col.label,
      key: col.id,
      width: col.minWidth ? col.minWidth / 7 : 20,
    }));

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    rows.forEach((row) => {
      worksheet.addRow(row);
    });

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return;
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center" };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, fileName);
  };

  return { exportExcel };
};