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
    if (fullUserDataChatwoot.contact.name) nomeInput.value = fullUserDataChatwoot.contact.name;
    if (fullUserDataChatwoot.contact.identifier) cpfInput.value = fullUserDataChatwoot.contact.identifier;
    if (fullUserDataChatwoot.contact.email) emailInput.value = fullUserDataChatwoot.contact.email;
    if (fullUserDataChatwoot.contact.phone_number) telephoneInput.value = fullUserDataChatwoot.contact.phone_number;
}

// Do a request to register a fan
export async function registerFan() {
    const nomeInput = document.getElementById('complete-name-register').value;
    const cpfInput = document.getElementById('cpf-register').value;
    const emailInput = document.getElementById('email-register').value;
    const telephoneInput = document.getElementById('telephone-register').value;


    const url = `https://e694-2804-14d-5c5b-82f8-4b6-985e-3fe3-f71d.ngrok-free.app/createuser/`;

    const payload = {
        name: nomeInput,
        email: cpfInput,
        cpf: emailInput,
        telephone: telephoneInput,
        password: '0000'
    };
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

        if (!data.status_code) {
            utils.showNotification(data.status_code.message, 'error')
            return
        }
        else { return data; }
    } catch (erro) {
        utils.showNotification("Falha ao criar usuário", 'error')
        console.log("Erro ao criar usuário:", erro)

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
