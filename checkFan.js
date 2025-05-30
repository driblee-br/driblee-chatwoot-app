document.addEventListener('DOMContentLoaded', function () {
    // Elements from index page
    const btnBuscar = document.getElementById('btnBuscar');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const closeNotification = document.getElementById('close-notification');

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

    // Show notification
    function showNotification(message, type = 'info') {
        notificationMessage.textContent = message;
        notification.className = 'notification show';

        // Reset after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
    // Close notification
    closeNotification.addEventListener('click', function () {
        notification.classList.remove('show');
    });


    // Function to search an user by CPF
    async function fetchData() {
        const cpfInput = document.getElementById('cpf').value.replace(/\D/g, '');
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.replace(/\D/g, '');
        const nome = document.getElementById('nome').value.trim();

        // Validate the CPF
        if (!cpfInput && !email && !telefone && !nome) {
            showNotification('Por favor, preencha pelo menos um campo para busca. Somente cpf por enquanto', 'error');
            return;
        }

        // Show loading in button
        btnBuscar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
        btnBuscar.disabled = true;

        try {
            const cpf = cpfInput.replace(/\D/g, '');
            const url = `https://df44-2804-14d-5c5b-82f8-9256-1668-c2de-7882.ngrok-free.app/verify_fan/?cpf=${cpf}`;

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

    // Event listener to search
    btnBuscar.addEventListener('click', fetchData);

});