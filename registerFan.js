//Function to register a fan
import * as checkFan from './checkFan.js';
import * as utils from './utils.js';


// Update the screen to register screen, doing the automatic fieling
export function register() {
    const fullUserDataChatwoot = checkFan.getfullUserDataChatwoot();
    utils.reloadScreen('CADASTRO');
    const nomeInput = document.getElementById('complete-name-register');
    const cpfInput = document.getElementById('cpf-register');
    const emailInput = document.getElementById('email-register');
    const telephoneInput = document.getElementById('telephone-register');
    if (fullUserDataChatwoot?.contact) {
        if (contact.name) nomeInput.value = contact.name;
        if (contact.identifier) cpfInput.value = contact.identifier;
        if (contact.email) emailInput.value = contact.email;
        if (contact.phone_number) telephoneInput.value = contact.phone_number;
    }
}

// Do a request to register a fan
export async function registerFan() {
    const nomeInput = document.getElementById('complete-name-register').value;
    const emailInput = document.getElementById('email-register').value;
    const telephoneInput = '+55' + document.getElementById('telephone-register').value.replace(/\D/g, '');
    const cpfInput = document.getElementById('cpf-register').value.replace(/\D/g, '');

    const url = `https://e694-2804-14d-5c5b-82f8-4b6-985e-3fe3-f71d.ngrok-free.app/createuser/`;

    const payload = {
        name: nomeInput,
        email: emailInput,
        cpf: cpfInput,
        telephone: telephoneInput,
        password: '0000'
    };
    //console.log(payload)
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
        //console.log("Data:", data)
        if (data.status_code === false) {
            utils.showNotification("cadastro", data.response.errorMessage, 'error')
            return
        }
        else {
            utils.showNotification("cadastro", "Usuário criado! Voltando para a tela inicial.", 'success')
            setTimeout(() => {
                utils.reloadScreen('CONSULTA');
            }, 5000);
            checkFan.cleanAllInputsSearch();
            checkFan.refilSearch(cpf = cpfInput, email = emailInput, phone_number = telefoneInput)
            const results = await checkFan.fetchData();
            setfullUserDataTwomorrow(checkFan.checkDataConsistency(results.results));

            return data;
        }
    } catch (erro) {
        utils.showNotification("cadastro", "Falha ao criar usuário", 'error')
        //console.log("Erro ao criar usuário:", erro)

        return
    }

}

// Send message to Fan
export function checkInformations() {
    const nomeInput = document.getElementById('complete-name-register');
    const cpfInput = document.getElementById('cpf-register');
    const emailInput = document.getElementById('email-register');
    const telephoneInput = document.getElementById('telephone-register');
    const message = `Pode confirmar seus dados para efetuarmos o seu registro como torcedor?\n
    Nome: ${nomeInput.value}\nCPF: ${cpfInput.value}\nEmail: ${emailInput.value}\nTelefone: ${telephoneInput.value}`;
    return
}
