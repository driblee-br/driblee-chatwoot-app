import * as main from './main.js';
import * as utils from './utils.js';

export async function resetPassword() {
    console.log("A funcionalidade de enviar email ainda não foi implementada")
    const userName = main.getfullUserDataTwomorrow().mainDocument
    console.log("Main document:", userName)
    const url = `${main.getHost()}/reset-password`;
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
            body: JSON.stringify({ userName })
        });

        console.log("Raw response object:", response);  // só o metadata (não mostra o conteúdo)

        // Tenta forçar o parse como JSON, se der erro, tenta como texto
        let data;
        try {
            data = await response.json();
            console.log(" JSON recebido do backend:", data);
        } catch (jsonErr) {
            const text = await response.text();
            console.warn(" Resposta não era JSON. Conteúdo como texto:", text);
            throw new Error("Resposta inválida do servidor");
        }

        let parsedResponse = {};
        if (data?.response) {
            try {
                parsedResponse = JSON.parse(data.response);
            } catch (e) {
                console.warn("Falha ao parsear 'response' interno:", e);
            }
        }

        if (!response.ok) {
            utils.showNotification(parsedResponse?.errorMessage || "Erro ao enviar email", 'error');
        } else {
            utils.showNotification(parsedResponse?.message || "Sucesso", 'success');
        }
    } catch (e) {
        console.error(" Erro ao fazer requisição:", e);
        utils.showNotification("Erro inesperado: " + e.message, 'error');
    }
}