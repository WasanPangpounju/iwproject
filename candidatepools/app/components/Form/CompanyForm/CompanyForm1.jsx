"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/ThemeContext";
import Icon from "@mdi/react";
import { mdiArrowDownDropCircle } from "@mdi/js";
import useProvinceData from "@/utils/province";
import { useRouter } from "next/navigation";
import ButtonGroup from "@/app/components/Form/ButtonGroup/ButtonGroup";

import { useCompanyStore } from "@/stores/useCompanyStore";
import { toast } from "react-toastify";
import SelectLabelForm from "../SelectLabelForm";
import { dataTypeBusiness } from "@/assets/dataTypeBusiness";
import InputLabelForm from "../InputLabelForm";

function CompanyForm1({ id, dataCompany, isEdit = false, path }) {
  //Theme
  const { bgColor, bgColorMain, bgColorMain2, inputEditColor } = useTheme();

  //store
  const { fetchCompanies, createCompany, updateCompany } = useCompanyStore();
  const router = useRouter();

  //address data
  const [editMode, setEditMode] = useState(!isEdit);
  const [nameCompany, setNameCompany] = useState("");
  const [addressIdCard, setAddressIdCard] = useState(null);
  const [addressIdCardProvince, setAddressIdCardProvince] = useState(null);
  const [addressIdCardAmphor, setAddressIdCardAmphor] = useState(null);
  const [addressIdCardTambon, setAddressIdCardTambon] = useState(null);
  const [addressIdCardZipCode, setAddressIdCardZipCode] = useState(null);
  const [typeBusiness, setTypeBusiness] = useState(null);
  const [quantityEmployee, setQuantityEmployee] = useState(null);
  const [quantityDisabled, setQuantityDisabled] = useState(null);
  const [coordinator, setCoordinator] = useState("");
  const [telCoordinator, setTelCoordinator] = useState("");
  const [emailCompany, setEmailCompany] = useState("");
  const [welfare, setWelfare] = useState([]);

  const [getAddressIdCard, setGetAddressIdCard] = useState("");
  const [IDaddressIdCardProvince, setIDAddressIdCardProvince] = useState("");
  const [IDaddressIdCardAmphor, setIDAddressIdCardAmphor] = useState("");
  const [IDaddressIdCardTambon, setIDAddressIdCardTambon] = useState("");

  const [getAddressIdCardProvince, setGetAddressIdCardProvince] = useState("");
  const [getAddressIdCardAmphor, setGetAddressIdCardAmphor] = useState("");
  const [getAddressIdCardTambon, setGetAddressIdCardTambon] = useState("");
  const [getAddressIdCardZipCode, setGetAddressIdCardZipCode] = useState("");
  const dataProvince = useProvinceData();

  const [error, setError] = useState("");

  //worktype

  const [getWorkType, setGetWorkType] = useState("");
  const [getWorkDetail, setGetWorkDetail] = useState("");

  //dateWork

  const [getDateStart, setGetDateStart] = useState("");
  const [getDateEnd, setGetDateEnd] = useState("");

  //time

  const [getTimeStart, setGetTimeStart] = useState("");
  const [getTimeEnd, setGetTimeEnd] = useState("");

  //welfare
  const [getWelfare, setGetWelfare] = useState([]);
  //Coordinator

  const [getCoordinator, setGetCoordinator] = useState("");
  const [getTetCoordinator, setGetTelCoordinator] = useState("");

  //name company
  const [getNameCompany, setGetNameCompany] = useState("");

  //handle array
  function mergeArrayValues(nonGetArray, getArray) {
    // ถ้า nonGetArray เป็นอาร์เรย์ว่าง ให้คืนค่า getArray โดยตรง
    if (nonGetArray.length === 0) {
      return getArray;
    }

    if (nonGetArray.length > getArray.length) {
      return nonGetArray.map((value, index) => {
        return value || getArray[index] || "";
      });
    } else {
      return getArray.map((value, index) => {
        return nonGetArray[index] || value || "";
      });
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();

    const tempNameCompany = nameCompany || getNameCompany;
    const tempAddress = addressIdCard || getAddressIdCard;
    const tempProvince = addressIdCardProvince || getAddressIdCardProvince;
    const tempAmphor = addressIdCardAmphor || getAddressIdCardAmphor;
    const tempTambon = addressIdCardTambon || getAddressIdCardTambon;
    const tempZipcode = addressIdCardZipCode || getAddressIdCardZipCode;
    const tempCoordinator = coordinator || getCoordinator;
    const tempCoordinatorTel = telCoordinator || getTetCoordinator;
    const mergedWelfare = mergeArrayValues(welfare, getWelfare);

    if (
      !tempNameCompany ||
      !tempAddress ||
      !tempProvince ||
      !tempAmphor ||
      !tempTambon ||
      !tempZipcode ||
      !tempCoordinator ||
      !tempCoordinatorTel ||
      !typeBusiness ||
      !quantityEmployee ||
      !quantityDisabled ||
      !emailCompany
    ) {
      setError("กรุณกรอกข้อมูลให้ครบทุกช่อง");

      return;
    }

    setError("");

    const body = {
      nameCompany: tempNameCompany,
      address: tempAddress,
      province: tempProvince,
      amphor: tempAmphor,
      tambon: tempTambon,
      zipcode: tempZipcode,
      welfare: mergedWelfare,
      coordinator: tempCoordinator,
      coordinator_tel: tempCoordinatorTel,
      typeBusiness: typeBusiness,
      quantityEmployee: quantityEmployee,
      quantityDisabled: quantityDisabled,
      emailCompany: emailCompany,
    };
    try {
      const res = (await isEdit)
        ? await updateCompany(id, body) // ใช้ id ได้ตรงนี้
        : await createCompany(body);

      if (!res.ok) {
        toast.error("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่ในภายหลัง");
        setError("");
        return;
      }

      toast.success("บันทึกข้อมูลสำเร็จ");
      if (isEdit) {
        setEditMode(false);
      } else {
        router.push(path);
      }
      fetchCompanies();
      setError("");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!dataCompany) return;

    // // ตั้งค่าตัวแปรต่าง ๆ จากข้อมูลใน dataHistoryWork
    setNameCompany(dataCompany?.nameCompany);
    setAddressIdCard(dataCompany?.address);
    setAddressIdCardProvince(dataCompany?.province);
    setAddressIdCardAmphor(dataCompany?.amphor);
    setAddressIdCardTambon(dataCompany?.tambon);
    setAddressIdCardZipCode(dataCompany?.zipcode);
    setCoordinator(dataCompany?.coordinator);
    setTelCoordinator(dataCompany?.coordinator_tel);
    setTypeBusiness(dataCompany?.typeBusiness);
    setQuantityEmployee(dataCompany?.quantityEmployee);
    setQuantityDisabled(dataCompany?.quantityDisabled);
    setEmailCompany(dataCompany?.emailCompany);

    setIDAddressIdCardProvince(
      dataProvince.find((p) => p.name_th === dataCompany.province)?.id || null
    );
    setIDAddressIdCardAmphor(
      dataProvince
        .find((p) => p.name_th === dataCompany.province)
        ?.amphure.find((a) => a.name_th === dataCompany.amphor)?.id || null
    );
    setIDAddressIdCardTambon(
      dataProvince
        .find((p) => p.name_th === dataCompany.province)
        ?.amphure.find((a) => a.name_th === dataCompany.amphor)
        ?.tambon.find((t) => t.name_th === dataCompany.tambon)?.id || null
    );
    // set ฟิลด์เริ่มต้น
  }, [dataCompany, dataProvince]);

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className={`${bgColorMain2} ${bgColor} rounded-lg flex flex-col gap-7`}
    >
      <div className="flex gap-y-5 gap-x-10 flex-wrap">
        <InputLabelForm
          label="ชื่อบริษัท"
          isRequire
          value={nameCompany || getNameCompany || ""}
          setValue={setNameCompany}
          editMode={editMode}
          placeholder={"ตัวอย่าง: บริษัทเฟรนลี่เดฟ จำกัด"}
          tailwind={"w-96"}
        />
        <div className="flex gap-x-10 gap-y-5 flex-wrap w-full">
          <InputLabelForm
            label="ที่ตั้ง"
            isRequire
            value={addressIdCard || getAddressIdCard || ""}
            setValue={setAddressIdCard}
            editMode={editMode}
            placeholder={"สถานที่ใกล้สถานีรถไฟฟ้า พหลโยธิน 59"}
            tailwind={"w-96"}
          />
          <div className=" flex flex-col ">
            <label>
              จังหวัด{" "}
              <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                *
              </span>
            </label>
            <div className="relative col w-fit mt-1">
              <select
                onChange={(e) => {
                  setIDAddressIdCardProvince(e.target.value);
                  setIDAddressIdCardAmphor("");
                  setIDAddressIdCardTambon("");
                  setAddressIdCardAmphor("");
                  setAddressIdCardTambon("");
                  setAddressIdCardZipCode("");
                  setAddressIdCardProvince(
                    dataProvince.find((p) => p.id === parseInt(e.target.value))
                      .name_th
                  );
                }}
                className={`${
                  !editMode
                    ? `${inputEditColor} cursor-default`
                    : `${bgColorMain} cursor-pointer`
                } ${bgColorMain} w-48 border border-gray-400 py-2 px-4 rounded-lg`}
                style={{ appearance: "none" }}
                disabled={!editMode}
                value={
                  dataProvince.find(
                    (p) => p.id === parseInt(IDaddressIdCardProvince)
                  )?.id || "0"
                }
              >
                <option value="0">-</option>
                {dataProvince.map((d, index) => (
                  <option key={index} value={d.id}>
                    {d.name_th}
                  </option>
                ))}
              </select>
              <Icon
                className={`${
                  !editMode ? "hidden" : ""
                } cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                path={mdiArrowDownDropCircle}
                size={0.8}
              />
            </div>
          </div>
          {IDaddressIdCardProvince ? (
            <div className=" flex flex-col">
              <label>
                {IDaddressIdCardProvince.toString() === "1"
                  ? "แขวง "
                  : "อำเภอ "}
                <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                  *
                </span>
              </label>
              <div className="relative col w-fit mt-1">
                <select
                  onChange={(e) => {
                    setIDAddressIdCardAmphor(e.target.value);
                    setIDAddressIdCardTambon("");
                    setAddressIdCardTambon("");
                    setAddressIdCardZipCode("");
                    setAddressIdCardAmphor(
                      dataProvince
                        .find((p) => p.id === parseInt(IDaddressIdCardProvince))
                        .amphure.find((a) => a.id === parseInt(e.target.value))
                        .name_th
                    );
                  }}
                  className={`${
                    !editMode
                      ? `${inputEditColor} cursor-default`
                      : `${bgColorMain} cursor-pointer`
                  } ${bgColorMain} w-48 border border-gray-400 py-2 px-4 rounded-lg`}
                  style={{ appearance: "none" }}
                  disabled={!editMode}
                  value={
                    dataProvince
                      .find((p) => p.id === parseInt(IDaddressIdCardProvince))
                      .amphure.find(
                        (a) => a.id === parseInt(IDaddressIdCardAmphor)
                      )?.id || "0"
                  }
                >
                  <option value="0">-</option>
                  {dataProvince
                    .find((p) => p.id === parseInt(IDaddressIdCardProvince))
                    .amphure.map((d, index) => (
                      <option key={index} value={d.id}>
                        {d.name_th}
                      </option>
                    ))}
                </select>
                <Icon
                  className={`${
                    !editMode ? "hidden" : ""
                  } cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                  path={mdiArrowDownDropCircle}
                  size={0.8}
                />
              </div>
            </div>
          ) : null}
          {IDaddressIdCardProvince && IDaddressIdCardAmphor ? (
            <div className=" flex flex-col">
              <label>
                {IDaddressIdCardProvince.toString() === "1" ? "เขต " : "ตำบล "}
                <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                  *
                </span>
              </label>
              <div className="relative col w-fit mt-1">
                <select
                  onChange={(e) => {
                    setIDAddressIdCardTambon(e.target.value);
                    setAddressIdCardTambon(
                      dataProvince
                        .find((p) => p.id === parseInt(IDaddressIdCardProvince))
                        .amphure.find(
                          (a) => a.id === parseInt(IDaddressIdCardAmphor)
                        )
                        .tambon.find((t) => t.id === parseInt(e.target.value))
                        .name_th
                    );
                    setAddressIdCardZipCode(
                      dataProvince
                        .find((p) => p.id === parseInt(IDaddressIdCardProvince))
                        .amphure.find(
                          (a) => a.id === parseInt(IDaddressIdCardAmphor)
                        )
                        .tambon.find((t) => t.id === parseInt(e.target.value))
                        .zip_code
                    );
                  }}
                  className={`${
                    !editMode
                      ? `${inputEditColor} cursor-default`
                      : `${bgColorMain} cursor-pointer`
                  } ${bgColorMain} w-48 border border-gray-400 py-2 px-4 rounded-lg`}
                  style={{ appearance: "none" }}
                  disabled={!editMode}
                  value={
                    dataProvince
                      .find((p) => p.id === parseInt(IDaddressIdCardProvince))
                      .amphure.find(
                        (a) => a.id === parseInt(IDaddressIdCardAmphor)
                      )
                      .tambon.find(
                        (t) => t.id === parseInt(IDaddressIdCardTambon)
                      )?.id || "0"
                  }
                >
                  <option value="0">-</option>
                  {dataProvince
                    .find((p) => p.id === parseInt(IDaddressIdCardProvince))
                    .amphure.find(
                      (a) => a.id === parseInt(IDaddressIdCardAmphor)
                    )
                    .tambon.map((d, index) => (
                      <option key={index} value={d.id}>
                        {d.name_th}
                      </option>
                    ))}
                </select>
                <Icon
                  className={`${
                    !editMode ? "hidden" : ""
                  } cursor-pointer text-gray-400 absolute right-0 top-[10px] mx-3`}
                  path={mdiArrowDownDropCircle}
                  size={0.8}
                />
              </div>
            </div>
          ) : null}
          {IDaddressIdCardProvince &&
          IDaddressIdCardAmphor &&
          IDaddressIdCardTambon ? (
            <div className=" flex flex-col ">
              <label>
                รหัสไปรษณีย์{" "}
                <span className={`${!editMode ? "hidden" : ""} text-red-500`}>
                  *
                </span>
              </label>
              <div className=" col w-fit mt-1">
                <p
                  className={`${inputEditColor}  focus:outline-none cursor-default w-36 ${bgColorMain}  border border-gray-400 py-2 px-4 rounded-lg`}
                >
                  {addressIdCardZipCode || getAddressIdCardZipCode || "-"}
                </p>
              </div>
            </div>
          ) : null}
        </div>
        <SelectLabelForm
          label="ประเภทธุรกิจ"
          isRequire
          editMode={editMode}
          value={typeBusiness}
          setValue={setTypeBusiness}
          options={dataTypeBusiness.map((item) => {
            return {
              id: item.id,
              value: item.name,
            };
          })}
          tailwind={"w-56"}
        />
        <InputLabelForm
          label="จำนวนพนักงานทั้งหมด"
          isRequire
          value={quantityEmployee}
          setValue={setQuantityEmployee}
          editMode={editMode}
          placeholder={"ใส่เป็นตัวเลขเช่น 100"}
          tailwind={"w-30"}
          type="number"
        />
        <InputLabelForm
          label="จำนวนคนพิการที่ต้องการ"
          isRequire
          value={quantityDisabled}
          setValue={setQuantityDisabled}
          editMode={editMode}
          placeholder={"ใส่เป็นตัวเลขเช่น 100"}
          tailwind={"w-30"}
          type="number"
        />
        <div className="w-full flex flex-wrap gap-y-5 gap-x-10">
          <InputLabelForm
            label="ผู้ประสานงาน"
            isRequire
            value={coordinator || getCoordinator || ""}
            setValue={setCoordinator}
            editMode={editMode}
            placeholder={"ตัวอย่าง: คุณสมชาย มานะ"}
            tailwind={"w-96"}
          />

          <InputLabelForm
            label="เบอร์ติดต่อ"
            isRequire
            value={telCoordinator || getTetCoordinator || ""}
            setValue={setTelCoordinator}
            editMode={editMode}
            placeholder={'ระบุเฉพาะตัวเลข เช่น " 0923235223 "'}
            tailwind={"w-64"}
            styles={"tel"}
          />
          <InputLabelForm
            label="อีเมล"
            isRequire
            value={emailCompany}
            setValue={setEmailCompany}
            editMode={editMode}
            placeholder={"example@gmail.com"}
            tailwind={"w-64"}
            type="email"
          />
        </div>
      </div>
      <div className="mt-7">
        {error && (
          <div className="w-full text-center">
            <p className="text-red-500">* {error}</p>
          </div>
        )}
        <ButtonGroup
          editMode={editMode}
          setEditMode={setEditMode}
          tailwind={"mt-5"}
          isCreate={!isEdit}
        />
      </div>
    </form>
  );
}

export default CompanyForm1;
