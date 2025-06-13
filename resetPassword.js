export async function resetPassword() {
    console.log("A funcionalidade de enviar email ainda não foi implementada")
    const userName = main.getfullUserDataTwomorrow().name
    try {
        const url = `${main.getHost()}/reset_password/`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            mode: 'cors',
            credentials: 'omit',
            body: {
                userName
            }
        });

        if (!response.ok) {
            if (response.errorMessage) {
                utils.showNotification(response.errorMessage, 'error')
            } else {
                utils.showNotification("Erro ao enviar email", 'error')
            }
        } else {
            if (response.message) {
                utils.showNotification(response.message, 'success')
            } else {
                utils.showNotification("Erro ao enviar email", 'success')
            }
        }
    } catch {
        utils.showNotification("Erro inesperado.", 'success')
        return
    }
}