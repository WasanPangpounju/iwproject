import { useState } from "react";
import Swal from "sweetalert2";

//stores
import { useUserStore } from "@/stores/useUserStore";

export function usePersonalForm(dataUser, setEditMode) {
  const { updateUserById, checkIdExists } = useUserStore();
  const [error, setError] = useState("");
  const [errorIdCard, setErrorIdCard] = useState("");
  const [errorIdCardDisabled, setErrorIdCardDisabled] = useState("");

  const handleEditSubmit = async (e, formState) => {
    e.preventDefault();

    const {
      user,
      password,
      firstName,
      lastName,
      profile,
      typeDisabled,
      detailDisabled,
      university,
      email,
      prefix,
      nickname,
      sex,
      dateBirthday,
      monthBirthday,
      yearBirthday,
      nationality,
      religion,
      idCard,
      idCardDisabled,
      addressIdCard,
      addressIdCardProvince,
      addressIdCardAmphor,
      addressIdCardTambon,
      addressIdCardZipCode,
      address,
      addressProvince,
      addressAmphor,
      addressTambon,
      addressZipCode,
      tel,
      telEmergency,
      relationship,
      positon,
      role,
      inputGrayColor,
    } = formState;

    // console.log("submit -----");
    // console.log("user:", user);
    // console.log("password:", password);
    // console.log("firstName:", firstName);
    // console.log("lastName:", lastName);
    // console.log("profile:", profile);
    // console.log("typeDisabled:", typeDisabled);
    // console.log("detailDisabled:", detailDisabled);
    // console.log("university:", university);
    // console.log("email:", email);
    // console.log("prefix:", prefix);
    // console.log("nickname:", nickname);
    // console.log("sex:", sex);
    // console.log("dateBirthday:", dateBirthday);
    // console.log("monthBirthday:", monthBirthday);
    // console.log("yearBirthday:", yearBirthday);
    // console.log("nationality:", nationality);
    // console.log("religion:", religion);
    // console.log("idCard:", idCard);
    // console.log("idCardDisabled:", idCardDisabled);
    // console.log("addressIdCard:", addressIdCard);
    // console.log("addressIdCardProvince:", addressIdCardProvince);
    // console.log("addressIdCardAmphor:", addressIdCardAmphor);
    // console.log("addressIdCardTambon:", addressIdCardTambon);
    // console.log("addressIdCardZipCode:", addressIdCardZipCode);
    // console.log("address:", address);
    // console.log("addressProvince:", addressProvince);
    // console.log("addressAmphor:", addressAmphor);
    // console.log("addressTambon:", addressTambon);
    // console.log("addressZipCode:", addressZipCode);
    // console.log("tel:", tel);
    // console.log("telEmergency:", telEmergency);
    // console.log("relationship:", relationship);
    // console.log("profile:", profile);

    const requiredFields = [
      prefix,
      firstName,
      lastName,
      email,
      dateBirthday,
      monthBirthday,
      yearBirthday,
      nationality,
      idCard,
      idCardDisabled,
      addressIdCard,
      addressIdCardProvince,
      addressIdCardAmphor,
      addressIdCardTambon,
      addressIdCardZipCode,
      address,
      addressProvince,
      addressAmphor,
      addressTambon,
      addressZipCode,
      tel,
    ];

    const hasEmptyField =
      requiredFields.some((v) => !v) ||
      !Array.isArray(typeDisabled) ||
      typeDisabled.length === 0;

    if (hasEmptyField) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    const isValidName = (str) =>
      str.length >= 2 &&
      str.trim() === str &&
      !/(?:^|\s)\s+|\s+(?=\s|$)/.test(str);

    const isValidIdCard = (id) => /^\d{13}$/.test(id);

    if (!isValidName(firstName) || !isValidName(lastName)) {
      setError("ใส่ชื่อนามสกุลที่ถูกต้อง");
      return;
    }

    if (nickname.length > 0 && !isValidName(nickname)) {
      setError("ใส่ชื่อเล่นที่ถูกต้อง");
      return;
    }

    const thirtyDayMonths = ["เมษายน", "กันยายน", "พฤศจิกายน"];
    const day = Number(dateBirthday);
    const year = Number(yearBirthday);

    if (thirtyDayMonths.includes(monthBirthday) && day > 30) {
      setError("วันเกิดไม่ถูกต้อง");
      return;
    }

    if (
      monthBirthday === "กุมภาพันธ์" &&
      ((year % 4 === 0 && day > 29) || (year % 4 !== 0 && day > 28))
    ) {
      setError("วันเกิดไม่ถูกต้อง");
      return;
    }

    if (!isValidIdCard(idCard)) {
      const message = "เลขบัตรประจำตัวประชาชนให้ถูกต้อง";
      setError(message);
      setErrorIdCard(message);
      return;
    }
    if (!isValidIdCard(idCardDisabled)) {
      const message = "เลขบัตรประจำตัวคนพิการให้ถูกต้อง";
      setError(message);
      setErrorIdCardDisabled(message);
      return;
    }

    if (addressIdCard.length < 2) {
      setError("ระบุที่อยู่ตามบัตรประชาชนที่ถูกต้อง");
      return;
    }
    if (address.length < 2) {
      setError("ระบุที่อยู่ที่ปัจจุบันที่ถูกต้อง");
      return;
    }

    setError("");

    const bodyData = {
      user,
      password,
      firstName,
      lastName,
      profile,
      typeDisabled,
      detailDisabled,
      university,
      email,
      prefix,
      nickname,
      sex,
      dateBirthday,
      monthBirthday,
      yearBirthday,
      nationality,
      religion,
      idCard,
      idCardDisabled,
      addressIdCard,
      addressIdCardProvince,
      addressIdCardAmphor,
      addressIdCardTambon,
      addressIdCardZipCode,
      address,
      addressProvince,
      addressAmphor,
      addressTambon,
      addressZipCode,
      tel,
      telEmergency,
      relationship,
      inputGrayColor,
    };

    try {
      if (
        idCard !== dataUser.idCard ||
        idCardDisabled !== dataUser.idCardDisabled
      ) {
        const { idCard: idCardExists, idCardDisabled: idCardDisabledExists } =
          await checkIdExists(idCard, idCardDisabled);

        const isIdCardChanged = idCard !== dataUser.idCard;
        const isIdCardDisabledChanged =
          idCardDisabled !== dataUser.idCardDisabled;

        if (
          isIdCardChanged &&
          isIdCardDisabledChanged &&
          idCardExists &&
          idCardDisabledExists
        ) {
          setErrorIdCard("เลขบัตรประชาชนนี้มีการใช้งานแล้ว");
          setErrorIdCardDisabled("เลขบัตรประจำตัวคนพิการนี้มีการใช้งานแล้ว");
          return;
        }

        if (isIdCardChanged && idCardExists) {
          setErrorIdCard("เลขบัตรประชาชนนี้มีการใช้งานแล้ว");
          setErrorIdCardDisabled("");
          return;
        }

        if (isIdCardDisabledChanged && idCardDisabledExists) {
          setErrorIdCardDisabled("เลขบัตรประจำตัวคนพิการนี้มีการใช้งานแล้ว");
          setErrorIdCard("");
          return;
        }

        setErrorIdCard("");
        setErrorIdCardDisabled("");
      } else {
        setErrorIdCard("");
        setErrorIdCardDisabled("");
      }

      const res = await updateUserById(dataUser.uuid, bodyData);

      if (!res.ok) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่ในภายหลัง",
          icon: "error",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#f27474",
        });
        return;
      }

      Swal.fire({
        title: "บันทึกข้อมูลสำเร็จ",
        icon: "success",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#0d96f8",
      });

      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    handleEditSubmit,
    error,
    setError,
    errorIdCard,
    errorIdCardDisabled,
  };
}
