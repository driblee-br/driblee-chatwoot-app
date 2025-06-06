import * as main from './main.js';
import * as utils from './utils.js';
//Automatic fieling of fields in update user's data screen
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


// Confirm info with the Fan sanding a message
export function checkInformations() {
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
    const EditComplement = document.getElementById("edit-complement");

    const message = `Você confirma os seguintes dados atualizados?\n
    Nome: ${EditName?.value || '—'}\nCPF: ${EditCpf?.value || '—'}\nEmail: ${EditEmail?.value || '—'}\nTelefone: ${EditTelephone?.value || '—'}\nGênero: ${EditGender?.value || '—'}\nData de Nascimento: ${EditBirth?.value || '—'}\nCidade: ${EditCity?.value || '—'}\nBairro: ${EditNeigbor?.value || '—'}\nRua: ${EditStreet?.value || '—'}\nNúmero: ${EditNumber?.value || '—'}\nCEP: ${EditCep?.value || '—'}\nComplemento: ${EditComplement?.value || '—'}`;

    const response = utils.sendMessage(message);

    if (!response.errors) {
        utils.showNotification('registration', 'Erro ao enviar a mensagem', 'error')
    } else {
        utils.showNotification('registration', 'Mensagem enviada com sucesso', 'success')
    }
}

export function fillByCep(cep) {
    const streetInput = document.getElementById('edit-street');
    const neighborInput = document.getElementById('edit-neigbor');
    const cityInput = document.getElementById('edit-city');
    const stateInput = document.getElementById('edit-state');
    const numberInput = document.getElementById('edit-number');

    function clearAddressFields() {
        streetInput.value = '';
        neighborInput.value = '';
        cityInput.value = '';
        stateInput.value = '';
    }

    function fillAddressFields(data) {
        streetInput.value = data.logradouro || '';
        neighborInput.value = data.bairro || '';
        cityInput.value = data.localidade || '';
        stateInput.value = data.uf || '';
        numberInput.focus();
    }

    // Function to search cep in API viacep
    async function searchCep() {
        const cleanCep = cep.replace(/\D/g, '');

        if (cleanCep.length !== 8) {
            clearAddressFields();
            return;
        }

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (data.erro) {
                alert('CEP não encontrado.');
                clearAddressFields();
            } else {
                fillAddressFields(data);
            }
        } catch (error) {
            console.error('Erro ao buscar o CEP:', error);
            alert('Ocorreu um erro ao buscar o CEP. Tente novamente.');
            clearAddressFields();
        }
    }

    searchCep()
}

export async function updateData() {

    const EditName = document.getElementById("edit-nome").value;
    const EditCpf = document.getElementById("edit-cpf").value;
    const EditGender = document.getElementById("edit-gender").value;
    const EditBirth = document.getElementById("edit-birth").value;
    const EditCity = document.getElementById("edit-city").value;
    const EditNeigbor = document.getElementById("edit-neigbor").value;
    const EditStreet = document.getElementById("edit-street").value;
    const EditNumber = document.getElementById("edit-number").value;
    const EditCep = document.getElementById("edit-cep").value;
    const EditComplement = document.getElementById("edit-complement").value;

    const url = `${main.getHost()}/updatedata/`;

    const payload = {
        "name": EditName,
        "alias": "",
        "mainDocument": EditCpf,
        "personGenderValue": EditGender,
        "birthDate": EditBirth,
        "postalCode": EditCep,
        "address": EditCity + EditStreet,
        "number": EditNumber,
        "complement": EditComplement,
        "district": EditNeigbor,
        "cityId": 0,
        "description": "",
        "stateId": 0
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errorMessage || `Erro HTTP: ${response.status}`);
        }
        utils.showNotification("update", data.message, 'success')
        setTimeout(() => {
            utils.showNotification("update", "Voltando à tela inicial", 'info')
        }, 2000);
        setTimeout(() => {
            utils.reloadScreen('CONSULTATION');
        }, 3000);
        checkFan.cleanAllInputsSearch();
        checkFan.refilSearch(cpf = cpfInput, email = emailInput, phone_number = telefoneInput)
        const results = await checkFan.fetchData();
        //console.log("results in main", results)
        setfullUserDataTwomorrow(checkFan.checkDataConsistency(results.results));

        return data;
    } catch { return }
}