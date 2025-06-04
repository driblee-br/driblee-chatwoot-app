//Function to register a fan
import { fullUserData } from './checkFan.js';
import { reloadTela, sendMessage } from './utils.js';

export function register() {
    reloadTela('CADASTRO');
}

export function registerFan() {
    console.log("Sem funcionalidade de registro por enquanto")
    return
}

export function checkInformations(message) {
    console.log("fullUserData: ", fullUserData)
    sendMessage(fullUserData.contact.id, fullUserData.conversation.id, message)
    return
}
