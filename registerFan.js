//Function to register a fan
import * as checkFan from './checkFan.js';
import * as utils from './utils.js';
import * as main from './main.js';



// Update the screen to register screen, doing the automatic fieling
export function register() {
    // Goes to the screen 'UPDATE'
    utils.reloadScreen('UPDATE');
    utils.editPanels(false);
    //Disaneble the botton "atualizar"
    document.getElementById("btn-effect-update").classList.add('hidden')

    //Enable botton update data
    document.getElementById("btn-register-fan").classList.remove('hidden')
    //Botton to effect the fan's register
    document.getElementById('btn-register-fan').addEventListener('click', () => {
        registerFan();
    });


}

export function fillRegister(name = null, cpf = null, phone_number = null, email = null) {
    // Do the automatic feeling
    const fullUserDataChatwoot = checkFan.getfullUserDataChatwoot();
    const nomeInput = document.getElementById('edit-name');
    const cpfInput = document.getElementById('edit-cpf');
    const emailInput = document.getElementById('edit-email');
    const telephoneInput = document.getElementById('edit-telephone');

    if (fullUserDataChatwoot && fullUserDataChatwoot.contact) {
        const contact = fullUserDataChatwoot.contact;
        if (nomeInput && contact.name) nomeInput.value = contact.name;
        if (cpfInput && contact.identifier) cpfInput.value = contact.identifier;
        if (emailInput && contact.email) emailInput.value = contact.email;
        if (telephoneInput && contact.phone_number) telephoneInput.value = contact.phone_number;
    }

    if (nomeInput && name !== null) nomeInput.value = name;
    if (cpfInput && cpf !== null) cpfInput.value = cpf;
    if (emailInput && email !== null) emailInput.value = email;
    if (telephoneInput && phone_number !== null) telephoneInput.value = phone_number;

}
// Do a request to register a fan
export async function registerFan() {
    const nomeInput = document.getElementById('edit-nome').value;
    const emailInput = document.getElementById('edit-email').value;
    const telephoneInput = '+55' + document.getElementById('edit-telephone').value.replace(/\D/g, '');
    const cpfInput = document.getElementById('edit-cpf').value.replace(/\D/g, '');

    if (!nomeInput || !emailInput || !telephoneInput || !cpfInput) {
        console.log("Dados não preenchidos");
        return
    }
    const url = `${main.getHost()}/createuser/`;

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
            //utils.showNotification("registration", data.response.errorMessage, 'error')
            return

        }
        else {
            //utils.showNotification("registration", "Usuário criado!", 'success')
            const results = await checkFan.fetchData();
            main.setfullUserDataTwomorrow(checkFan.checkDataConsistency(results.results));
            console.log("Fan registered, waiting to reload page")
            document.getElementById("btn-register-fan").classList.add('hidden')
            utils.reloadScreen('UPDATE')
            return data;

        }
    } catch (erro) {
        //utils.showNotification("registration", "Falha ao criar usuário", 'error')

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
