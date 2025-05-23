import { TYPE_PERSON } from "@/const/enum";
import { useUserFormBase } from "./useUserFormBase";

export function useUserForm(dataUser, setEditMode) {
  const formBase = useUserFormBase(dataUser, setEditMode, { checkIdCardDisabled: false });

  const handleUserForm = (e, formState) => {
    const requiredFields = [
      formState.prefix,
      formState.firstName,
      formState.lastName,
      formState.email,
      formState.user,
      formState.dateBirthday,
      formState.monthBirthday,
      formState.yearBirthday,
      formState.nationality,
      formState.idCard,
      formState.addressIdCard,
      formState.addressIdCardProvince,
      formState.addressIdCardAmphor,
      formState.addressIdCardTambon,
      formState.addressIdCardZipCode,
      formState.address,
      formState.addressProvince,
      formState.addressAmphor,
      formState.addressTambon,
      formState.addressZipCode,
      formState.role,
      formState.tel,
    ];
    return formBase.handleFormSubmit(e, formState, requiredFields);
  };

  return {
    ...formBase,
    handleUserForm,
  };
}