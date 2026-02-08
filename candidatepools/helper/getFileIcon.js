import {
  mdiFilePdfBox,
  mdiFileWordBox,
  mdiFileExcelBox,
  mdiFilePowerpointBox,
  mdiFileImage,
  mdiFileOutline,
} from "@mdi/js";

export const getFileIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "pdf":
      return mdiFilePdfBox;
    case "doc":
    case "docx":
      return mdiFileWordBox;
    case "xls":
    case "xlsx":
      return mdiFileExcelBox;
    case "ppt":
    case "pptx":
      return mdiFilePowerpointBox;
    case "jpg":
    case "jpeg":
    case "png":
    case "webp":
      return mdiFileImage;
    default:
      return mdiFileOutline;
  }
};