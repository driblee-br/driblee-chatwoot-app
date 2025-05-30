document.addEventListener('DOMContentLoaded', function () {
    // Elementos da interface
    const btnBuscar = document.getElementById('btnBuscar');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const closeNotification = document.getElementById('close-notification');

    // Máscaras para os campos
    document.getElementById('cpf').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{2})$/, '$1-$2');
        e.target.value = value;
    });

    document.getElementById('telefone').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
    });

    // Fechar notificação
    closeNotification.addEventListener('click', function () {
        notification.classList.remove('show');
    });

    // Função para mostrar notificação
    function showNotification(message, type = 'info') {
        notificationMessage.textContent = message;
        notification.className = 'notification show';

        // Reset após 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    // Função principal de busca
    async function fetchData() {
        const cpfInput = document.getElementById('cpf').value.replace(/\D/g, '');
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.replace(/\D/g, '');
        const nome = document.getElementById('nome').value.trim();

        // Validação - pelo menos um campo preenchido
        if (!cpfInput && !email && !telefone && !nome) {
            showNotification('Por favor, preencha pelo menos um campo para busca. Somente cpf por enquanto', 'error');
            return;
        }

        // Mostrar loading (opcional - você pode implementar)
        btnBuscar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
        btnBuscar.disabled = true;

        try {
            // Montar URL com parâmetros de busca
            const cpf = cpfInput.replace(/\D/g, '');


            const url = `https://df44-2804-14d-5c5b-82f8-9256-1668-c2de-7882.ngrok-free.app/verify_fan/?cpf=${cpf}`;
            console.log(url)
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
            console.log(response)
            const data = await response.json();
            console.log(data.message)
            if (data.message) {
                showNotification(data.message, 'success');
            } else {
                showNotification('Torcedor encontrado, mas sem mensagem específica.', 'info');
            }

        } catch (error) {
            console.error("Erro completo:", error);
            showNotification(`Erro na busca: ${error.message}`, 'error');
        } finally {
            // Restaurar botão
            btnBuscar.innerHTML = '<i class="fas fa-search"></i> Buscar Torcedor';
            btnBuscar.disabled = false;
        }
    }

    // Event listener para o botão
    btnBuscar.addEventListener('click', fetchData);

    // Permitir busca com Enter
    document.querySelectorAll('.input-field').forEach(input => {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                fetchData();
            }
        });
    });
});