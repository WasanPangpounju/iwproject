import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import ButtonBG1 from "../Button/ButtonBG1";

const ImageCropModal = ({ imageSrc, onCropComplete, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const croppedAreaPixelsRef = useRef(null);

  const onCropDone = async () => {
    if (!croppedAreaPixelsRef.current) return;
    const croppedImage = await getCroppedImg(
      imageSrc,
      croppedAreaPixelsRef.current
    );
    onCropComplete(croppedImage);
  };

  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    croppedAreaPixelsRef.current = croppedAreaPixels;
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4">
      <div className="bg-white p-4 rounded-lg w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* พื้นที่ Crop */}
        <div className="relative flex-1 min-h-[300px]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        {/* ปุ่มด้านล่าง */}
        <div className="flex justify-end mt-4 gap-2">
          <div
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-2xl"
          >
            ยกเลิก
          </div>
          <ButtonBG1 handleClick={onCropDone} text={"บันทึก"} />
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;

async function getCroppedImg(imageSrc, crop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
      resolve(file);
    }, "image/jpeg");
  });
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (error) => reject(error));
    img.setAttribute("crossOrigin", "anonymous"); // สำคัญมากสำหรับ base64 หรือ url จาก firebase
    img.src = url;
  });
}
