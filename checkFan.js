document.getElementById('btnCreate').style.display = 'none';


// Function to validate JSON
function isJSONValid(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// Format phone number to Brazilian format (for front)
function formatPhone(phone) {
    let cleaned = phone.replace(/\D/g, '');

    if (cleaned.startsWith('55') && cleaned.length > 11) {
        cleaned = cleaned.slice(2);
    }

    return cleaned.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
}

// Format CPF (for front)
function formatCPF(cpf) {

    return cpf.replace(/\D/g, '')
        .replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
}

//Function to show a notification in front
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

// Do request to the backend
async function searchTwomorrow(type_parameter, parameter) {
    const url = `https://e694-2804-14d-5c5b-82f8-4b6-985e-3fe3-f71d.ngrok-free.app/verify_fan/?${type_parameter}=${parameter}`;

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

// Search data inside 2morrow
async function fetchData() {
    const btnBuscar = document.getElementById('btnBuscar');
    const cpfInput = document.getElementById('cpf').value.replace(/\D/g, '');
    const emailInput = document.getElementById('email').value.trim();
    const telefoneInput = document.getElementById('telefone').value.replace(/\D/g, '');
    // Show loading in button
    btnBuscar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    btnBuscar.disabled = true;

    let data;
    try {
        if (!telefoneInput && !cpfInput && !emailInput) { console.log("Where is the input?") }
        if (!data && telefoneInput) {
            data = await searchTwomorrow('telefone', telefoneInput);
        }
        if (!data && cpfInput) {
            data = await searchTwomorrow('cpf', cpfInput);
        }
        if (!data && emailInput) {
            data = await searchTwomorrow('email', emailInput);
        }
        if (!data) {
            showNotification(`Nenhum usuário encontrado com estes dados.`);
            document.getElementById('btnCreate').style.display = 'inline-block';
            return
        } else {
            console.log(data);
            // Notification
            if (data.message) {
                showNotification(data.message, 'success');
            } else if (data.resultObject && data.resultObject.guid) {
                showNotification('Este torcedor já está cadastrado!', 'success');
            } else {
                showNotification('Operação bem-sucedida, nenhum dado adicional', 'info');
            }
        }


    } catch (error) {
        console.error("Erro completo:", error);
        showNotification(`Erro na busca: ${error.message}`, 'error');
    } finally {
        // Reset button
        btnBuscar.innerHTML = '<i class="fas fa-search"></i> Buscar Torcedor';
        btnBuscar.disabled = false;

        return data
    }
}

// Event to recieve user's data from chatwoot
const searchUser = (event) => {
    const cpfInput = document.getElementById('cpf');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

    if (typeof event.data !== 'string' || !isJSONValid(event.data)) {
        console.warn("Data from chatwoot to autocomplete is not json:", event.data);
        return;
    }

    const receivedData = JSON.parse(event.data);
    console.log("Chatwoot passed data!");

    if (
        !receivedData ||
        receivedData.event !== 'appContext' ||
        !receivedData.data ||
        !receivedData.data.contact
    ) {
        console.error("Estrutura de dados inesperada:", receivedData);
        if (loadingElement) loadingElement.style.display = 'none';
        if (errorElement) {
            errorElement.textContent = 'Erro: Estrutura de dados do Chatwoot não corresponde ao esperado';
            errorElement.style.display = 'block';
        }
        return;
    }
    else {
        if (loadingElement) loadingElement.style.display = 'none';
        if (errorElement) errorElement.style.display = 'none';

        const userData = receivedData.data.contact;
        if (emailInput && userData.email) {
            emailInput.value = userData.email;
        }

        if (telefoneInput && userData.phone_number) {
            telefoneInput.value = formatPhone(userData.phone_number);
            telefoneInput.dispatchEvent(new Event('input'));

        }

        if (cpfInput && userData.identifier) {
            cpfInput.value = formatCPF(userData.identifier);
            cpfInput.dispatchEvent(new Event('cpf'));
        }
        console.log("Automatic feeling done!")
    }
};


document.addEventListener('DOMContentLoaded', function () {
    // Elements from index page
    const btnBuscar = document.getElementById('btnBuscar');
    const closeNotification = document.getElementById('close-notification');

    // Recieving data from chatwoot
    window.addEventListener("message", searchUser);
    window.parent.postMessage('chatwoot-dashboard-app:fetch-info', '*');


    // Processing cpf data while typing
    document.getElementById('cpf').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{2})$/, '$1-$2');
        e.target.value = value;
    });

    // Processing telephone data while typing
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
    btnBuscar.addEventListener('click', async () => {
        const resultado = await fetchData();

        //SHOW BOTTON CREATE USER

    });
});

