//Function to register a fan
import * as checkFan from './checkFan.js';
import * as utils from './utils.js';
import * as main from './main.js';

// Do a request to register a fan
export async function registerFan() {
    const nomeInput = document.getElementById('edit-nome').value;
    const emailInput = document.getElementById('edit-email').value;
    const phoneInput = '+55' + document.getElementById('edit-phone').value.replace(/\D/g, '');
    const cpfInput = document.getElementById('edit-cpf').value.replace(/\D/g, '');
    const btneffectRegister = document.getElementById('btn-register-fan');
    btneffectRegister.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
    btneffectRegister.disabled = true;
    function stopLoadingBotton() {
        btneffectRegister.innerHTML = 'Registrar Torcedor';
        btneffectRegister.disabled = false;
    }
    if (!nomeInput || !emailInput || !phoneInput || !cpfInput) {
        utils.showNotification("É necessário preencher todos os dados", "error")
        stopLoadingBotton()
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
    console.log("Payload", payload)
    console.log("Header", header)
    console.log("url", url)

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
        if (data.response?.success === false) {
            if (data.response?.errorMessage) {
                utils.showNotification(data.response.errorMessage, 'error')

            } else if (data.response?.message) {
                utils.showNotification(data.response.message, 'error')
            } else {
                utils.showNotification("Erro inesperado", 'error')
            }
            stopLoadingBotton()
            return
        }
        else if (data.response?.success === true) {
            if (data.response?.message) {
                utils.showNotification(data.response.message, 'error')
                stopLoadingBotton()
                return
            }
            utils.showNotification("Torcedor cadastrado com sucesso!", 'success')
            const results = await checkFan.fetchData();
            main.setfullUserDataTwomorrow(checkFan.checkDataConsistency(results.results));
            btneffectRegister.classList.add('hidden')
            utils.reloadScreen('UPDATE')
            stopLoadingBotton()
            return data;

        } else {
            utils.showNotification(`Erro inesperado: ${data.response}`, 'error')
            stopLoadingBotton()
            return
        }
    } catch (erro) {
        utils.showNotification("Falha ao criar usuário", 'error')
        stopLoadingBotton()
        return
    } finally {
        btneffectRegister.innerHTML = '<i class="fas fa-search"></i> Registrar Torcedor';
        btneffectRegister.disabled = false;

    }

}
