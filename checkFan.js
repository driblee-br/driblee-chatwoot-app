document.addEventListener('DOMContentLoaded', function () {
    // Elements from index page
    const btnBuscar = document.getElementById('btnBuscar');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const closeNotification = document.getElementById('close-notification');

    // Show notification
    function showNotification(message, type = 'info') {
        notificationMessage.textContent = message;
        notification.className = 'notification show';

        // Reset after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    // Function to search an user by CPF
    async function fetchData() {
        const cpfInput = document.getElementById('cpf').value.replace(/\D/g, '');
        const emailInput = document.getElementById('email').value.trim();
        const telefoneInput = document.getElementById('telefone').value.replace(/\D/g, '');
        const nomeInput = document.getElementById('nome').value.trim();


        // Validate the CPF
        if (!cpfInput && !emailInput && !telefoneInput && !nomeInput) {
            showNotification('Por favor, preencha pelo menos um campo para busca. Somente cpf por enquanto', 'error');
            return;
        }

        // Show loading in button
        btnBuscar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
        btnBuscar.disabled = true;

        try {
            const cpf = cpfInput.replace(/\D/g, '');
            const url = `https://2644-2804-14d-5c5b-82f8-4b6-985e-3fe3-f71d.ngrok-free.app/verify_fan/?cpf=${cpf}`;

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
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();

            // Notifiction
            if (data.success) {
                if (data.message) {
                    showNotification(data.message, 'success');
                } else if (data.resultObject && data.resultObject.guid) {
                    showNotification('Usuário encontrado!', 'success');
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

        if (!receivedData || !receivedData.meta || !receivedData.meta.sender) {
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

            const userData = receivedData.meta.sender;

            if (nomeInput && userData.sender) {
                nomeInput.value = userData.name;
            }

            if (emailInput && userData.email) {
                emailInput.value = userData.email;
            }

            if (telefoneInput && userData.phone_number) {
                telefoneInput.value = userData.phone_number.replace(/\D/g, '');
            }

            if (cpfInput && contactData.identifier) {
                cpfInput.value = userData.identifier.replace(/\D/g, '');
            }
        }
    };

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
        notification.classList.remove('show');
    });

    // Event listener to search user in 2morrow 
    btnBuscar.addEventListener('click', fetchData);



});