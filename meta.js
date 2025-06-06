import * as main from './main.js';

export async function meta() {
    const url = `${main.getHost()}/templatemeta/`;

    const response = await fetch(url, {
        method: 'POST',
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
    console.log("Response from backend (meta):", data)
    return data;
}