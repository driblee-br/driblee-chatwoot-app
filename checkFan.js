function isJSONValid(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        console.error("Erro na validação JSON:", e);
        return false;
    }
    return true;
}

// const eventListener = (event) => {
//     if (typeof event.data !== 'string' || !isJSONValid(event.data)) {
//         document.getElementById('loading').style.display = 'none';
//         document.getElementById('error').textContent = 'Erro: Dados inválidos recebidos. Verifique o formato JSON.';
//         document.getElementById('error').style.display = 'block';
//         return;
//     }

//     const receivedData = JSON.parse(event.data);

//     if (!receivedData || !receivedData.data || !receivedData.data.conversation || !receivedData.data.contact || !receivedData.data.currentAgent) {
//         document.getElementById('loading').style.display = 'none';
//         document.getElementById('error').textContent = 'Erro: Estrutura de dados do Chatwoot não corresponde ao esperado (faltando conversation, contact ou currentAgent).';
//         document.getElementById('error').style.display = 'block';
//         return;
//     }

//     const conversationData = receivedData.data.conversation;
//     const contactData = receivedData.data.contact;
//     const currentAgentData = receivedData.data.currentAgent;

//     document.getElementById('loading').style.display = 'none';
//     document.getElementById('profile-display').style.display = 'block';
//     document.getElementById('raw-json').textContent = JSON.stringify(receivedData, null, 2);
//     document.getElementById('conversation-data').textContent = JSON.stringify(conversationData, null, 2);
//     document.getElementById('contact-data').textContent = JSON.stringify(contactData, null, 2);
//     document.getElementById('current-agent-data').textContent = JSON.stringify(currentAgentData, null, 2);
// };


// window.addEventListener("message", eventListener);

// window.parent.postMessage('chatwoot-dashboard-app:fetch-info', '*');

async function fetchData() {
    try {
        const response = await fetch('https://df44-2804-14d-5c5b-82f8-9256-1668-c2de-7882.ngrok-free.app/list_fan/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            mode: 'cors',
            credentials: 'omit'
        });
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Resposta não é JSON: ${text.substring(0, 100)}...`);
        }
        const data = await response.json();
        return data.message

    } catch (error) {
        console.error("Erro completo:", error);
    }
}

document.getElementById('btnBuscar').addEventListener('click', fetchData)
