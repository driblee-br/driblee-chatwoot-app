export async function meta() {
    const url = `https://9334-2804-14d-5c5b-82f8-aa47-b887-8c1d-b8aa.ngrok-free.app/templatemeta/`;

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
    console.log("Rsponse from backend (meta):", data.response)
    return data;
}