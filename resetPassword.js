import * as main from './main.js';
import * as utils from './utils.js';

export async function resetPassword() {
    console.log("A funcionalidade de enviar email ainda não foi implementada")
    const userName = main.getfullUserDataTwomorrow().mainDocument
    console.log("Main document:", userName)
    const url = `${main.getHost()}/reset_password/`;
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
            body: JSON.stringify({
                userName: `${userName}`
            })
        });
        console.log("Response reset:", response)
        if (!response.ok) {
            if (response?.errorMessage) {
                utils.showNotification(response.errorMessage, 'error')
            } else {
                utils.showNotification("Erro ao enviar email", 'error')
            }
        } else {
            if (response?.message == "Email enviado") {
                utils.showNotification(response.message, 'success')
            } else {
                utils.showNotification(response.message, 'info')
            }
        }
    } catch {
        utils.showNotification("Erro inesperado.", 'error')
        return
    }
}