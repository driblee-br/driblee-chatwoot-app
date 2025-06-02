function isJSONValid(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function formatPhone(phone) {
    let cleaned = phone.replace(/\D/g, '');

    if (cleaned.startsWith('55') && cleaned.length > 11) {
        cleaned = cleaned.slice(2);
    }

    return cleaned.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
}

function formatCPF(cpf) {
    return cpf.replace(/\D/g, '')
        .replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
}

function setFormattedValue(element, value, formatter) {
    // Remove temporariamente o listener
    const clone = element.cloneNode(true);
    element.parentNode.replaceChild(clone, element);

    // Define o valor formatado
    clone.value = formatter(value);

    // Reanexa o listener
    clone.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (clone.id === 'cpf') {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{2})$/, '$1-$2');
        } else if (clone.id === 'telefone') {
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
        }
        e.target.value = value;
    });
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    notificationMessage.textContent = message;
    notification.className = 'notification';
    notification.classList.add('show', type);

    // Reset after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

async function searchTwomorrow(type_parameter, parameter) {
    const url = `https://2644-2804-14d-5c5b-82f8-4b6-985e-3fe3-f71d.ngrok-free.app/verify_fan/?${type_parameter}=${parameter}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
        mode: 'cors',
        credentials: 'omit'
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errorMessage || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data
}

async function fetchData() {
    const btnBuscar = document.getElementById('btnBuscar');
    const cpfInput = document.getElementById('cpf').value.replace(/\D/g, '');
    const emailInput = document.getElementById('email').value.trim();
    const telefoneInput = document.getElementById('telefone').value.replace(/\D/g, '');
    const nomeInput = document.getElementById('nome').value.trim();

    // Show loading in button
    btnBuscar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    btnBuscar.disabled = true;

    let data;

    try {
        if (telefoneInput) {
            const data = await searchTwomorrow('telefone', telefoneInput);

        } else if (cpfInput) {
            const data = await searchTwomorrow('cpf', cpfInput);

        } else if (emailInput) {
            const data = await searchTwomorrow('email', emailInput);

        } else {
            console.error("Where is the parameters?")
            return
        }
        console.log(data);
        // Notifiction
        if (data.success) {
            if (data.message) {
                showNotification(data.message, 'success');
            } else if (data.resultObject && data.resultObject.guid) {
                showNotification('Dados do usuário encontrados na 2morrow!', 'success');
            } else {
                showNotification('Operação bem-sucedida, nenhum dado adicional', 'info');
            }
        } else {
            showNotification(data.errorMessage || 'Erro na consulta', 'error');
        }

    } catch (error) {
        console.error("Erro completo:", error);
        showNotification(`Erro na busca: ${error.message}`, 'error');
    } finally {
        // Reset button
        btnBuscar.innerHTML = '<i class="fas fa-search"></i> Buscar Torcedor';
        btnBuscar.disabled = false;
    }
}

// Event to recieve user's data from chatwoot
const searchUserByPhoneNumer = (event) => {
    const cpfInput = document.getElementById('cpf');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const nomeInput = document.getElementById('nome');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

    if (typeof event.data !== 'string' || !isJSONValid(event.data)) {
        console.warn("Data from chatwoot to autocomplete is not json:", event.data);
        return;
    }

    const receivedData = JSON.parse(event.data);
    console.log("Recieved data!");

    if (
        !receivedData ||
        receivedData.event !== 'appContext' ||
        !receivedData.data ||
        !receivedData.data.contact
    ) {
        console.error("Estrutura de dados inesperada:", receivedData);
        if (loadingElement) loadingElement.style.display = 'none';
        if (errorElement) {
            errorElement.textContent = 'Erro: Estrutura de dados do Chatwoot não corresponde ao esperado (faltando meta ou meta.sender).';
            errorElement.style.display = 'block';
        }
        return;
    }
    else {
        if (loadingElement) loadingElement.style.display = 'none';
        if (errorElement) errorElement.style.display = 'none';

        const userData = receivedData.data.contact;
        if (nomeInput && userData.name) {
            nomeInput.value = userData.name;
        }

        if (emailInput && userData.email) {
            emailInput.value = userData.email;
        }

        if (telefoneInput && userData.phone_number) {
            setFormattedValue(telefoneInput, userData.phone_number, formatPhone);
        }

        if (cpfInput && userData.identifier) {
            setFormattedValue(cpfInput, userData.identifier, formatCPF);
        }
    }
};


document.addEventListener('DOMContentLoaded', function () {
    // Elements from index page
    const btnBuscar = document.getElementById('btnBuscar');
    const closeNotification = document.getElementById('close-notification');

    // Recieving data from chatwoot
    window.addEventListener("message", searchUserByPhoneNumer);
    window.parent.postMessage('chatwoot-dashboard-app:fetch-info', '*');
    console.log("Automathic feeling done!")

    // Processing cpf data
    document.getElementById('cpf').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{2})$/, '$1-$2');
        e.target.value = value;
    });

    // Processing telephone data
    document.getElementById('telefone').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
    });

    // Close notification
    closeNotification.addEventListener('click', function () {
        document.getElementById('notification').classList.remove('show');
    });

    // Event listener to search user in 2morrow 
    btnBuscar.addEventListener('click', fetchData);
});
window.addEventListener('message', searchUserByPhoneNumer, false);
