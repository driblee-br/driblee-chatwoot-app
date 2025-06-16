import * as main from './main.js';
import * as utils from './utils.js';
import * as checkFan from './checkFan.js';
//Automatic fieling of fields in update user's data screen


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
    const btneffectUpdate = document.getElementById('btn-effect-update');
    btneffectUpdate.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando mudanças...';
    btneffectUpdate.disabled = true;
    function stopLoadingBotton() {
        btneffectUpdate.innerHTML = 'Atualizar dados';
        btneffectUpdate.disabled = false;
    }

    const EditName = document.getElementById("edit-nome").value;
    const EditCpf = document.getElementById("edit-cpf").value;
    const EditEmail = document.getElementById("edit-email").value;
    let EditGender = document.getElementById("edit-gender").value;
    console.log(EditGender)
    const gender_mapping = {
        "Masculino": "M",
        "Feminino": "F",
        "Não Informado": "N",
        "Outro": "O"
    }
    EditGender = gender_mapping[EditGender] || "N";
    console.log(EditGender)
    let EditBirth = document.getElementById("edit-birth").value;
    const birthDateObj = new Date(`${EditBirth}T00:00:00`);
    EditBirth = birthDateObj.toISOString();

    const EditCity = document.getElementById("edit-city").value;
    const EditNeigbor = document.getElementById("edit-neigbor").value;
    const EditStreet = document.getElementById("edit-street").value;
    const EditNumber = document.getElementById("edit-number").value;
    const EditCep = document.getElementById("edit-cep").value;
    const EditComplement = document.getElementById("edit-complement").value;
    let url;
    let payload;
    url = `${main.getHost()}/updatedata/`;

    payload = {
        "name": EditName,
        "alias": "",
        "email": EditEmail,
        "mainDocument": EditCpf,
        "personGenderValue": EditGender,
        "birthDate": EditBirth,
        "postalCode": EditCep,
        "address": EditCity + ', ' + EditStreet,
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
        console.log("PAYLOAD:", payload)
        const data = await response.json();
        console.log("Response from api to update data:", data)
        if (data.response.success === false) {
            if (data.response.errorMessage) {
                utils.showNotification(`Erro:${data.response.errorMessage}`, 'error')

            } else if (data.response.message) {
                utils.showNotification(`Erro:${data.response.message}`, 'error')
            }
            stopLoadingBotton();
            return

        } else {


            const results = await checkFan.fetchData();
            console.log('results.results', results.results)
            for (const key in results.results) {
                if (results.results[key].message === '') {
                    main.setfullUserDataTwomorrow(results.results[key].resultObject);
                    break;
                }
            }
            if (data.response.message) {
                utils.showNotification(data.response.message, 'success')
            }
            utils.showNotification("Dados atualizados com sucesso.", 'success')
            stopLoadingBotton()
            document.getElementById("btn-edit").disabled = false;
            document.getElementById("btn-check-payment").disabled = false;
            document.getElementById("btn-twomorrow-payments").disabled = false;
            document.getElementById("btn-send-email").disabled = false;

            return data;
        }
    } catch (e) {
        utils.showNotification(`Não foi possível concluir o update dos dados.`, 'error');
        console.log(e);
        stopLoadingBotton()
        return

    }
}

export function copyFullInformations() {
    const fullName = document.getElementById('edit-nome')?.value || '';
    const cpf = document.getElementById('edit-cpf')?.value || '';
    const phone = document.getElementById('edit-phone')?.value || '';
    const email = document.getElementById('edit-email')?.value || '';
    const gender = document.getElementById('edit-gender')?.value || '';
    const birthDate = document.getElementById('edit-birth')?.value || '';
    const zipCode = document.getElementById('edit-cep')?.value || '';
    const state = document.getElementById('edit-state')?.value || '';
    const city = document.getElementById('edit-city')?.value || '';
    const neighborhood = document.getElementById('edit-neigbor')?.value || '';
    const street = document.getElementById('edit-street')?.value || '';
    const number = document.getElementById('edit-number')?.value || '';
    const complement = document.getElementById('edit-complement')?.value || '';
    const message =
        "Olá! Você poderia, por favor, confirmar suas informações?\n\n" +
        "CPF: " + cpf + "\n" +
        "Nome Completo: " + fullName + "\n" +
        "Telefone: " + phone + "\n" +
        "Email: " + email + "\n" +
        "Gênero: " + gender + "\n" +
        "Data de Nascimento: " + birthDate + "\n" +
        "Endereço:\n" +
        "CEP: " + zipCode + "\n" +
        "Estado: " + state + "\n" +
        "Cidade: " + city + "\n" +
        "Bairro: " + neighborhood + "\n" +
        "Rua: " + street + "\n" +
        "Número: " + number + "\n" +
        "Complemento: " + complement;

    console.log("Trying to copy informations");
    utils.legacyCopyText(message);
}

export function copyKeyInformations() {
    const message = "Enviamos um e-mail com instruções de redefinição de senha"

    console.log("Trying to copy informations");
    utils.legacyCopyText(message);
}
