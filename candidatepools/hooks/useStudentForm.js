import { useUserFormBase } from "./useUserFormBase";

export function useStudentForm(dataUser, setEditMode) {
  const formBase = useUserFormBase(dataUser, setEditMode);

  const handleStudentForm = (e, formState) => {
    const requiredFields = [
      formState.prefix,
      formState.firstName,
      formState.lastName,
      formState.email,
      formState.dateBirthday,
      formState.monthBirthday,
      formState.yearBirthday,
      formState.nationality,
      formState.idCard,
      formState.idCardDisabled,
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
    handleStudentForm,
  };
}