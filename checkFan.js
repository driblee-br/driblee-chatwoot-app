import { showNotification, formatPhone, formatCPF, isJSONValid, cleanAllInputs } from './utils.js';
import * as main from './main.js';
import * as utils from './utils.js';
import * as registerFan from './registerFan.js';
let fullUserDataChatwoot = {};

export function getfullUserDataChatwoot() {
    return fullUserDataChatwoot;
}

// Function to clean all inputs in the search page
export function cleanAllInputsSearch() {
    function cleanResult(field) {
        const foundMsg = document.getElementById(`msg-${field}-found`);
        const notFoundMsg = document.getElementById(`msg-${field}-non-found`);
        notFoundMsg.style.display = 'none';
        foundMsg.style.display = 'none';

    }
    cleanResult('cpf');
    cleanResult('email');
    cleanResult('telephone');


}

//Function to show a popup with user's data found
export function showUserPopup(data, classe = null) {
    console.log("Data received to show:", data);
    const cardsContainer = document.getElementById('user-popup');
    const card = document.createElement('div');
    card.classList.add('card');

    // Adiciona classe apenas se fornecida
    if (classe) {
        card.classList.add(`user-founded-by-${classe}`);
    }

    // Cria elementos de forma segura usando DOM API
    const content = document.createElement('div');

    const h3 = document.createElement('h3');
    // Define o título baseado no tipo de busca
    if (classe === 'telephone') {
        h3.textContent = 'Usuário encontrado por Telefone';
    } else if (classe === 'cpf') {
        h3.textContent = 'Usuário encontrado por CPF';
    } else {
        h3.textContent = 'Informações do Usuário';
    }

    const createInfoParagraph = (label, value) => {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = `${label}: `;
        p.appendChild(strong);
        p.appendChild(document.createTextNode(value));
        return p;
    };

    content.appendChild(h3);
    content.appendChild(createInfoParagraph('Nome', data.name || '_'));
    content.appendChild(createInfoParagraph('CPF', data.mainDocument || '_'));
    content.appendChild(createInfoParagraph('Email', data.email || '_'));
    content.appendChild(createInfoParagraph('Telefone', data.mobile?.fullNumber || '_'));
    content.appendChild(createInfoParagraph('Status', data.fanStatusView || '_'));

    card.appendChild(content);

    card.addEventListener('click', () => {
        main.setfullUserDataTwomorrow(data);
        utils.reloadScreen('UPDATE');
        card.classList.add('card-clicked');
        setTimeout(() => card.classList.remove('card-clicked'), 200);
    });

    cardsContainer.appendChild(card);
}

//Function to exhibit the status of the search for each parameter
export function toggleMessages(field, found) {
    const foundMsg = document.getElementById(`msg-${field}-found`);
    const notFoundMsg = document.getElementById(`msg-${field}-non-found`);

    if (foundMsg && notFoundMsg) {
        if (found) {
            foundMsg.style.display = 'inline';
            notFoundMsg.style.display = 'none';
        } else if (typeof found != 'undefined') {
            foundMsg.style.display = 'none';
            notFoundMsg.style.display = 'inline';
        }
    }
}

// Do request to the backend to search a fan
async function verifyFanBack(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${main.getHost()}/verify_fan/?${queryString}`;

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
    console.log("Data: ", data);
    return data;
}

// Function to preper data to search 
export async function fetchData() {
    const btnBuscar = document.getElementById('btnBuscar');
    const cpfInput = document.getElementById('busca-cpf').value.replace(/\D/g, '');
    const emailInput = document.getElementById('busca-email').value.trim();
    const telephoneInput = document.getElementById('busca-telephone').value.replace(/\D/g, '');
    btnBuscar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    btnBuscar.disabled = true;

    const params = {};
    if (telephoneInput) params.telephone = telephoneInput;
    if (cpfInput) params.cpf = cpfInput;
    if (emailInput) params.email = emailInput;
    if (Object.keys(params).length === 0) {
        showNotification("consultation", 'Informe ao menos um dado para buscar.', 'warning');
        btnBuscar.innerHTML = '<i class="fas fa-search"></i> Buscar Torcedor';
        btnBuscar.disabled = false;
        return;
    }
    try {
        let data = await verifyFanBack(params);
        console.log("Fetch data: ", data)
        toggleMessages('cpf', data.results.cpf && data.results.cpf.message == '');
        toggleMessages('email', data.results.email && data.results.email.message == '');
        toggleMessages('telephone', data.results.telephone && data.results.telephone.message == '');
        return data;
    } catch (error) {
        console.error("Erro completo:", error);
        showNotification("consultation", `Erro na busca: ${error.message}`, 'error');
    } finally {
        btnBuscar.innerHTML = '<i class="fas fa-search"></i> Buscar Torcedor';
        btnBuscar.disabled = false;

    }
}

export function refilSearch(cpf = "", email = "", phone_number = "") {
    const cpfInput = document.getElementById('busca-cpf');
    const emailInput = document.getElementById('busca-email');
    const telephoneInput = document.getElementById('busca-telephone');
    if (emailInput && email) {
        emailInput.value = email;
    }

    if (telephoneInput && phone_number) {
        telephoneInput.value = formatPhone(phone_number);
        telephoneInput.dispatchEvent(new Event('input'));
    }

    if (cpfInput && identifier) {
        cpfInput.value = formatCPF(identifier);
        cpfInput.dispatchEvent(new Event('cpf'));
    }
}

// Event to recieve user's data from chatwoot
export const searchUser = (event) => {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

    if (typeof event.data !== 'string' || !isJSONValid(event.data)) {
        console.warn("Data from chatwoot to autocomplete is not json:", event.data);
        return;
    }

    const receivedData = JSON.parse(event.data);

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

    fullUserDataChatwoot = receivedData.data;

    const userData = receivedData.data.contact;

    if (loadingElement) loadingElement.style.display = 'none';
    if (errorElement) errorElement.style.display = 'none';

    refilSearch(cpf = userData.identifier, email = userData.email, phone_number = userData.phone_number)

    //console.log("Chatwoot passed data!", receivedData);
    //console.log("Automatic filling done!");
};

//Function to verify if the data found are consistent
export function checkDataConsistency(results) {
    const values = [];
    console.log("Results in checkDataConsistency", results)
    for (const key in results) {
        const item = results[key];
        if (item?.resultObject) {
            values.push(JSON.stringify(item.resultObject));
        }
    }

    let allEqual;

    //console.log("results", results)
    function OneResult() {
        let emptyMessages = 0;
        if (values.every(value => value === values[0]) && values.length > 1) {
            allEqual = true
            emptyMessages = 1;

        } else {
            for (const key in results) {
                if (results[key].message == "") {
                    emptyMessages += 1
                }
            }
            if (emptyMessages == 1) {
                allEqual = true
            } else allEqual = false

        }
        return emptyMessages
    }

    const emptyMessages = OneResult(results.results);
    //console.log("emptyMessages:", emptyMessages)
    if (values.length === 0) {
        const btnRegister = document.getElementById("btn-register");
        btnRegister.classList.remove("hidden");
        const cpf = document.getElementById('busca-cpf').value;
        const email = document.getElementById('busca-email').value;
        const phone = document.getElementById('busca-telephone').value;
        console.log("Informações passadas")
        btnRegister.addEventListener('click', () => {
            registerFan.register()
            console.log("Aguardando preenchimento com: ", cpf, email, phone)
            registerFan.fillRegister(null, cpf, phone, email);
        });
        return null;
    }

    let totalKeys = 0;
    for (const key in results) {
        if (results[key]?.resultObject != null) {
            totalKeys += 1;
        }
    }

    if (allEqual) {
        const entries = Object.entries(results);
        for (const key in results) {
            const item = results[key];
            if (item.message == "") {
                console.log("resultObject", item.resultObject);
                utils.reloadScreen('UPDATE');
                return item.resultObject
            }

        }
    } else {
        const cardsContainer = document.getElementById('user-popup');
        cardsContainer.innerHTML = '';
        for (const key in results) {
            const item = results[key];
            console.log("Item for show popup:", item)
            if (item.message == "") {
                console.log("resultObject", item.resultObject)
                showUserPopup(item.resultObject, key);
            }

        } utils.reloadScreen('CHOOSE');
    }
}

