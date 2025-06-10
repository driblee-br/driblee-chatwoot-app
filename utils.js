import * as checkFan from './checkFan.js';
import * as main from './main.js';

// Show just the screen relted as the atual status
export function reloadScreen(step_now) {
    const allSteps = ['CONSULTATION', 'REGISTRATION', 'UPDATE', 'CHOOSE'];

    for (const step of allSteps) {
        const element = document.getElementById(step);
        if (element) {
            element.classList.add("hidden");
        }
    }

    const currentElement = document.getElementById(step_now);
    if (currentElement) {
        currentElement.classList.remove("hidden");
    }

    //Botton to go to the search screen
    document.getElementById('btn-new-search').addEventListener('click', () => {
        reloadScreen('CONSULTATION');
    });
    addEventListeners();

}

// Function to clean all inputs in the register page
export function cleanAllInputs() {

    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = '';
    });
}

// Function to validate JSON
export function isJSONValid(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


// Format phone number to Brazilian format (for front)
export function formatPhone(phone) {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('55') && cleaned.length > 11) {
        cleaned = cleaned.slice(2);
    }
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
}

// Format CPF (for front)
export function formatCPF(cpf) {

    return cpf.replace(/\D/g, '')
        .replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
}

/**
 * Function to show a notification in front
 *
 * @param {'consultation' | 'registration' | 'update'} screen - A tela onde a notificação será exibida.
 * @param {string} message - A mensagem a ser exibida.
 * @param {'info' | 'warn' | 'error' | 'success'} [type='info'] - O tipo da notificação (opcional, padrão: 'info').
 */
export function showNotification(screen, message, type = 'info') {
    const notification = document.getElementById(`notification-${screen}`);
    const notificationMessage = document.getElementById(`notification-message-${screen}`);

    notificationMessage.textContent = message;
    notification.className = 'notification';
    notification.classList.add('show', type);
    // Reset after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Send message to Fan
export async function sendMessage(message) {
    try {
        let fullUserDataChatwoot = checkFan.getfullUserDataChatwoot();
        const url = `${main.getHost()}/sendmessage/`;

        const payload = {
            account_id: fullUserDataChatwoot.conversation.account_id,
            conversation_id: fullUserDataChatwoot.conversation.id,
            message: message
        };
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


        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errorMessage || `Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch {
        console.log("Dados do chatwoot indisponíveis para testes locais")
    }
}

function addEventListeners() {
    // Processing cpf-register data while typing
    document.getElementById('cpf-register').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, '$1.$2');
        if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
        if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');

        e.target.value = value;
    });

    // Processing telephone data while typing
    document.getElementById('busca-telephone').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        value = value.slice(0, 11);

        if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        if (value.length > 7) value = value.replace(/(\d{5})(\d)/, '$1-$2');

        e.target.value = value;
    });

    // Processing telephone-register data while typing
    document.getElementById('telephone-register').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        value = value.slice(0, 11);

        if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        if (value.length > 7) value = value.replace(/(\d{5})(\d)/, '$1-$2');

        e.target.value = value;
    });

    // Event to format CEP in real-time
    document.getElementById('edit-cep').addEventListener('input', function () {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5, 8);
        } else if (value.length > 8) {
            value = value.substring(0, 8);
        }
        this.value = value;
    });

    // Event listener for the CEP field
    document.getElementById('edit-cep').addEventListener('blur', function () {
        collectData.fillByCep(this.value);
    });
}

