import * as main from './main.js';
export function updateData() {
    fullUserDataTwomorrow = main.getfullUserDataTwomorrow();
    const EditName = document.getElementBy("edit-nome");
    const EditCpf = document.getElementBy("edit-cpf");
    const EditEmail = document.getElementBy("edit-email");
    const EditTelephone = document.getElementBy("edit-telephone");
    const EditGender = document.getElementBy("edit-gender");
    const EditBirth = document.getElementBy("edit-birth");
    const EditCity = document.getElementBy("edit-city");
    const EditNeigbor = document.getElementBy("edit-neigbor");
    const EditStreet = document.getElementBy("edit-street");
    const EditNumber = document.getElementBy("edit-number");
    const EditCep = document.getElementBy("edit-cep");

    if (EditName && fullUserDataTwomorrow.name) {
        EditName.value = fullUserDataTwomorrow.name;
    }
    console.log("Nenhuma funcionalidade de atualização de dados cadastrais até o momento")
}