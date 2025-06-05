import * as main from './main.js';
export function FielingFieldsUpdateData() {
    const fullUserDataTwomorrow = main.getfullUserDataTwomorrow();


    const EditName = document.getElementById("edit-nome");
    const EditCpf = document.getElementById("edit-cpf");
    const EditEmail = document.getElementById("edit-email");
    const EditTelephone = document.getElementById("edit-telephone");
    const EditGender = document.getElementById("edit-gender");
    const EditBirth = document.getElementById("edit-birth");
    const EditCity = document.getElementById("edit-city");
    const EditNeigbor = document.getElementById("edit-neigbor");
    const EditStreet = document.getElementById("edit-street");
    const EditNumber = document.getElementById("edit-number");
    const EditCep = document.getElementById("edit-cep");

    if (EditName && fullUserDataTwomorrow.name) {
        EditName.value = fullUserDataTwomorrow.name;
    }

    if (EditCpf && fullUserDataTwomorrow.cpf) {
        EditCpf.value = fullUserDataTwomorrow.cpf;
    }

    if (EditEmail && fullUserDataTwomorrow.email) {
        EditEmail.value = fullUserDataTwomorrow.email;
    }

    if (EditTelephone && fullUserDataTwomorrow.mobile?.number) {
        EditTelephone.value = fullUserDataTwomorrow.mobile.number;
    }

    if (EditGender && fullUserDataTwomorrow.gender) {
        EditGender.value = fullUserDataTwomorrow.gender;
    }

    if (EditBirth && fullUserDataTwomorrow.birthDate) {
        EditBirth.value = fullUserDataTwomorrow.birthDate;
    }

    if (EditCity && fullUserDataTwomorrow.address?.city) {
        EditCity.value = fullUserDataTwomorrow.address.city;
    }

    if (EditNeigbor && fullUserDataTwomorrow.address?.neighborhood) {
        EditNeigbor.value = fullUserDataTwomorrow.address.neighborhood;
    }

    if (EditStreet && fullUserDataTwomorrow.address?.street) {
        EditStreet.value = fullUserDataTwomorrow.address.street;
    }

    if (EditNumber && fullUserDataTwomorrow.address?.number) {
        EditNumber.value = fullUserDataTwomorrow.address.number;
    }

    if (EditCep && fullUserDataTwomorrow.address?.cep) {
        EditCep.value = fullUserDataTwomorrow.address.cep;
    }
}
export function updateData() {
    console.log("Nenhuma funcionalidade de atualização de dados cadastrais até o momento")
}