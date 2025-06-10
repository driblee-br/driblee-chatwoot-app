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

export async function updateData(type_data) {

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
    let url;
    let payload;
    if (type_data == 'complement') {
        url = `${main.getHost()}/updatedata/`;

        payload = {
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
    } else if (type_data == 'address') {
        url = `${main.getHost()}/updateaddress/`;

        payload = {
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
        const results = await checkFan.fetchData();
        main.setfullUserDataTwomorrow(checkFan.checkDataConsistency(results.results));
        utils.showNotification("Dados atualizados com sucesso.", 'success')

        return data;
    } catch (e) {
        utils.showNotification(`Não foi possível concluir o update dos dados.`, 'error');
        console.log(e);
        return
    }
}

export function copyInformations(typeInformations) {
    const fullName = document.getElementById('edit-nome')?.value || '';
    const cpf = document.getElementById('edit-cpf')?.value || '';
    const phone = document.getElementById('edit-telephone')?.value || '';
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


    if (typeInformations == 'initial') {
        const message =
            "Olá! Você poderia, por favor, confirmar suas informações?\n\n" +
            "CPF: " + cpf + "\n" +
            "Nome Completo: " + fullName + "\n" +
            "Telefone: " + phone + "\n" +
            "Email: " + email

        navigator.clipboard.writeText(message.trim())
            .then(() => {
                utils.showNotification('Texto copiado para a área de transferência!', 'info');
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });
    }
    else if (typeInformations == 'personal') {
        const message =
            "Olá! Você poderia, por favor, confirmar suas informações?\n\n" +
            "Gênero: " + gender + "\n" +
            "Data de Nascimento: " + birthDate


        navigator.clipboard.writeText(message.trim())
            .then(() => {
                utils.showNotification('Texto copiado para a área de transferência!', 'info');
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });
    }

    else if (typeInformations == 'address') {
        const message =
            "Olá! Você poderia, por favor, confirmar suas informações?\n\n" +
            "Endereço:\n" +
            "CEP: " + zipCode + "\n" +
            "Estado: " + state + "\n" +
            "Cidade: " + city + "\n" +
            "Bairro: " + neighborhood + "\n" +
            "Rua: " + street + "\n" +
            "Número: " + number + "\n" +
            "Complemento: " + complement;

        navigator.clipboard.writeText(message.trim())
            .then(() => {
                utils.showNotification('Texto copiado para a área de transferência!', 'info');
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });
    }
    else if (typeInformations == 'key') {
        const message = "Enviamos um e-mail com instruções de redefinição de senha"
        navigator.clipboard.writeText(message.trim())
            .then(() => {
                utils.showNotification('Texto copiado para a área de transferência!', 'info');
            })
            .catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });

    }
}