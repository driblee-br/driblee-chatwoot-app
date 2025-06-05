//Function to register a fan
import * as checkFan from './checkFan.js';
import * as utils from './utils.js';



function createUser() {
    console.log("Teoricamente, usuŕio criado. Falta testar o backend")
}

export function register() {
    const fullUserDataChatwoot = checkFan.getfullUserDataChatwoot();
    utils.reloadScreen('CADASTRO');
    const nomeInput = document.getElementById('complete-name-register');
    const cpfInput = document.getElementById('cpf-register');
    const emailInput = document.getElementById('email-register');
    const telephoneInput = document.getElementById('telephone-register');
    console.log("FUD:", fullUserDataChatwoot)
    if (fullUserDataChatwoot.contact.name) nomeInput.value = fullUserDataChatwoot.contact.name;
    if (fullUserDataChatwoot.contact.identifier) cpfInput.value = fullUserDataChatwoot.contact.identifier;
    if (fullUserDataChatwoot.contact.email) emailInput.value = fullUserDataChatwoot.contact.email;
    if (fullUserDataChatwoot.contact.phone_number) telephoneInput.value = fullUserDataChatwoot.contact.phone_number;
}

export function registerFan() {
    console.log("Sem funcionalidade de register por enquanto")
    createUser();
    return
}

export function checkInformations() {
    const nomeInput = document.getElementById('complete-name-register');
    const cpfInput = document.getElementById('cpf-register');
    const emailInput = document.getElementById('email-register');
    const telephoneInput = document.getElementById('telephone-register');
    const message = `Pode confirmar seus dados para efetuarmos o seu registro como torcedor?\n
    Nome: ${nomeInput.value}\nCPF: ${cpfInput.value}\nEmail: ${emailInput.value}\nTelefone: ${telephoneInput.value}`;
    utils.sendMessage(message)
    return
}
