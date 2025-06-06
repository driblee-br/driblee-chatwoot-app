import * as checkFan from './checkFan.js';

// Show just the screen relted as the atual status
export function reloadScreen(step_now) {
    const allSteps = ['CONSULTA', 'CADASTRO', 'ATUALIZACAO'];

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
 * @param {'consulta' | 'cadastro' | 'atualizacao'} screen - A tela onde a notificação será exibida.
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
    }, 5000);
}

// Send message to Fan
export async function sendMessage(message) {
    try {
        let fullUserDataChatwoot = checkFan.getfullUserDataChatwoot();
        const url = `https://e694-2804-14d-5c5b-82f8-4b6-985e-3fe3-f71d.ngrok-free.app/sendmessage/`;

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