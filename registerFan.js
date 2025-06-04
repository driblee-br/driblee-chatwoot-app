//Function to register a fan
import * as checkFan from './checkFan.js';
import * as utils from './utils.js';



function createUser() {
    console.log("Teoricmente, usuŕio criado. Aguardando beckend")
}

export function register() {
    reloadTela('CADASTRO');
    const nomeInput = document.getElementById('complete-name-register');
    const cpfInput = document.getElementById('cpf-register');
    const emailInput = document.getElementById('email-register');
    const telephoneInput = document.getElementById('telephone-register');

    if (fullUserData.data.contact.name) nomeInput.value = fullUserData.data.contact.name;
    if (fullUserData.data.contact.identifier) cpfInput.value = fullUserData.data.contact.identifier;
    if (fullUserData.data.contact.email) emailInput.value = fullUserData.data.contact.email;
    if (fullUserData.data.contact.phone_number) telephoneInput.value = fullUserData.data.contact.phone_number;
}

export function registerFan() {
    console.log("Sem funcionalidade de register por enquanto")
    const message = `Pode confirmar seus dados para efetuarmos o seu registro como torcedor?\n
    Nome: ${contact.name}\nCPF: ${contact.identifier}\nEmail: ${contact.email}\nTelefone: ${contact.phone_number}`;
    checkInformations(message);
    createUser();
    return
}

export function checkInformations(message) {
    console.log("fullUserData: ", fullUserData)
    sendMessage(fullUserData.data.contact.id, fullUserData.data.conversation.id, message)
    return
}
