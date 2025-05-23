import { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function useUserFormBase(
  dataUser,
  setEditMode,
  options = {},
  handleStep
) {

  const router = useRouter();
  const { checkIdCardDisabled } = options;
  const { createUser, updateUserById, checkIdExists, checkUserExists } =
    useUserStore();
  const [error, setError] = useState("");
  const [errorIdCard, setErrorIdCard] = useState("");
  const [errorIdCardDisabled, setErrorIdCardDisabled] = useState("");

  const isValidName = (str) =>
    str.length >= 2 &&
    str.trim() === str &&
    !/(?:^|\s)\s+|\s+(?=\s|$)/.test(str);

  const isValidIdCard = (id) => /^\d{13}$/.test(id);

  const validateBirthday = (day, month, year) => {
    const thirtyDayMonths = ["เมษายน", "กันยายน", "พฤศจิกายน"];
    if (thirtyDayMonths.includes(month) && day > 30) return false;
    if (month === "กุมภาพันธ์") {
      if (year % 4 === 0) return day <= 29;
      else return day <= 28;
    }
    return true;
  };

  const handleFormSubmit = async (e, formState, requiredFields) => {
    e.preventDefault();
    const {
      idCard,
      idCardDisabled,
      firstName,
      lastName,
      nickname,
      addressIdCard,
      address,
      dateBirthday,
      monthBirthday,
      yearBirthday,
    } = formState;

    const hasEmptyField =
      requiredFields.some((v) => !v) ||
      ("typeDisabled" in formState &&
        checkIdCardDisabled &&
        (!Array.isArray(formState.typeDisabled) ||
          formState.typeDisabled.length === 0));

    if (hasEmptyField) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return false;
    }

    if (!isValidName(firstName) || !isValidName(lastName)) {
      setError("ใส่ชื่อนามสกุลที่ถูกต้อง");
      return false;
    }

    if (nickname?.length > 0 && !isValidName(nickname)) {
      setError("ใส่ชื่อเล่นที่ถูกต้อง");
      return false;
    }

    if (
      !validateBirthday(
        Number(dateBirthday),
        monthBirthday,
        Number(yearBirthday)
      )
    ) {
      setError("วันเกิดไม่ถูกต้อง");
      return false;
    }

    if (!isValidIdCard(idCard)) {
      const message = "เลขบัตรประจำตัวประชาชนให้ถูกต้อง";
      setError(message);
      setErrorIdCard(message);
      return false;
    }

    if (
      "idCardDisabled" in formState &&
      !isValidIdCard(idCardDisabled) &&
      checkIdCardDisabled
    ) {
      const message = "เลขบัตรประจำตัวคนพิการให้ถูกต้องss";
      setError(message);
      setErrorIdCardDisabled(message);
      return false;
    }

    if (addressIdCard.length < 2 || address.length < 2) {
      setError("ระบุที่อยู่ที่ถูกต้อง");
      return false;
    }

    setError("");
    setErrorIdCard("");
    setErrorIdCardDisabled("");

    try {
      // ✅ ตรวจสอบซ้ำก่อนสร้างหรือแก้ไข
      const { idCard: idCardExists, idCardDisabled: idCardDisabledExists } =
        await checkIdExists(idCard, idCardDisabled);

      const isEditing = Boolean(dataUser);

      if (!isEditing || idCard !== dataUser.idCard) {
        if (idCardExists) {
          setErrorIdCard("เลขบัตรประชาชนนี้มีการใช้งานแล้ว");
          return false;
        }
      }
      if (
        checkIdCardDisabled &&
        formState.idCardDisabled &&
        (!isEditing || idCardDisabled !== dataUser.idCardDisabled)
      ) {
        if (idCardDisabledExists) {
          setErrorIdCardDisabled("เลขบัตรประจำตัวคนพิการนี้มีการใช้งานแล้ว");
          return false;
        }
      }

      // ✅ ตรวจสอบ username และ email ซ้ำ (ถ้ามีการเปลี่ยนค่า)
      const checkUsernameChanged =
        !isEditing || formState.user !== dataUser.user;
      const checkEmailChanged =
        !isEditing || formState.email !== dataUser.email;
      if (checkUsernameChanged || checkEmailChanged) {
        const { userExists, emailExists } = await checkUserExists({
          user: formState.user,
          email: formState.email,
        });

        if (userExists && checkUsernameChanged) {
          setError("username มีการใช้งานแล้ว");
          return false;
        }

        if (emailExists && checkEmailChanged) {
          setError("email นี้มีการใช้งานแล้ว");
          return false;
        }
      }

      // ✅ Create หรือ Update
      const res = isEditing
        ? await updateUserById(dataUser.uuid, formState)
        : await createUser(formState);

      if (!res.ok) {
        toast.error("เกิดข้อผิดพลาด");
        return false;
      }

      toast.success("บันทึกข้อมูลสำเร็จ");

      if (handleStep) {
        handleStep();
      }
      if (!isEditing) {
        router.back();
      }
      setEditMode(false);

      return true;
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง");
      return false;
    }
  };

  return {
    handleFormSubmit,
    error,
    setError,
    errorIdCard,
    errorIdCardDisabled,
  };
}
