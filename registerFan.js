//Function to register a fan
import * as checkFan from './checkFan.js';
import * as utils from './utils.js';
import * as main from './main.js';



// Update the screen to register screen, doing the automatic fieling
export function register() {
    // Goes to the screen 'UPDATE'
    utils.reloadScreen('UPDATE');
    utils.editPanels(false);

    //Enable botton update data
    document.getElementById("btn-register-fan").classList.remove('hidden')
    //Botton to effect the fan's register
    document.getElementById('btn-register-fan').addEventListener('click', () => {
        registerFan();

    });


}
// Do a request to register a fan
export async function registerFan() {
    const nomeInput = document.getElementById('edit-nome').value;
    const emailInput = document.getElementById('edit-email').value;
    const phoneInput = '+55' + document.getElementById('edit-phone').value.replace(/\D/g, '');
    const cpfInput = document.getElementById('edit-cpf').value.replace(/\D/g, '');

    if (!nomeInput || !emailInput || !phoneInput || !cpfInput) {
        utils.showNotification("É necessário preencher todos os dados", "error")
        return
    }
    const url = `${main.getHost()}/createuser/`;

    const payload = {
        name: nomeInput,
        email: emailInput,
        cpf: cpfInput,
        phone: phoneInput,
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
        if (data.status_code === false) {
            utils.showNotification(data.response.errorMessage, 'error')
            return

        }
        else {
            utils.showNotification("Torcedor cadastrado com sucesso!", 'success')
            const results = await checkFan.fetchData();
            main.setfullUserDataTwomorrow(checkFan.checkDataConsistency(results.results));
            document.getElementById("btn-register-fan").classList.add('hidden')
            utils.reloadScreen('UPDATE')
            return data;

        }
    } catch (erro) {
        utils.showNotification("Falha ao criar usuário", 'error')

        return
    }

}
