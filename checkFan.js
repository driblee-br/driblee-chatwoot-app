import { showNotification, formatPhone, formatCPF, isJSONValid, cleanAllInputs } from './utils.js';
import * as main from './main.js';
import * as utils from './utils.js';
import * as registerFan from './registerFan.js';
import * as collectData from './collectData.js';


// Function to clean all inputs in the search page
export function cleanAllInputsSearch() {
    function cleanResult(field) {
        const foundMsg = document.getElementById(`msg-${field}-found`);
        const notFoundMsg = document.getElementById(`msg-${field}-not-found`);
        notFoundMsg.style.display = 'none';
        foundMsg.style.display = 'none';
    }
    cleanResult('cpf');
    cleanResult('email');
    cleanResult('phone');


}

//Function to show a popup with user's datas found
export function showUserPopup(data, classe = null) {
    const cardsContainer = document.getElementById('user-popup');
    const card = document.createElement('div');
    card.classList.add('card');

    if (classe) {
        card.classList.add(`user-founded-by-${classe}`);
    }
    const content = document.createElement('div');

    const h3 = document.createElement('h3');
    if (classe === 'phone') {
        h3.textContent = 'Usuário encontrado por Telefone';
    } else if (classe === 'cpf') {
        h3.textContent = 'Usuário encontrado por CPF';
    } else {
        h3.textContent = 'Usuário encontrado por Email';
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

        console.log("Data to fill:", data)
        main.setfullUserDataTwomorrow(data);
        utils.reloadScreen('UPDATE');
        utils.fillFullInformations('twomorrow');
        card.classList.add('card-clicked');
        setTimeout(() => card.classList.remove('card-clicked'), 200);
    });

    cardsContainer.appendChild(card);
}

//Function to exhibit the status of the search for each parameter
export function toggleMessages(field, found) {
    const foundMsg = document.getElementById(`msg-${field}-found`);
    const notFoundMsg = document.getElementById(`msg-${field}-not-found`);

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

// Function to preper data to search 
export async function fetchData() {
    const btnSearch = document.getElementById('btn-search');
    const cpfInput = document.getElementById('search-cpf').value.replace(/\D/g, '');
    const emailInput = document.getElementById('search-email').value.trim();
    const phoneInput = document.getElementById('search-phone').value.replace(/\D/g, '');
    btnSearch.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    btnSearch.disabled = true;

    const params = {};
    if (phoneInput) params.phone = phoneInput;
    if (cpfInput) params.cpf = cpfInput;
    if (emailInput) params.email = emailInput;
    if (Object.keys(params).length === 0) {
        showNotification('Informe ao menos um dado para buscar.', 'warning');
        btnSearch.innerHTML = '<i class="fas fa-search"></i> Buscar Torcedor';
        btnSearch.disabled = false;
        return;
    }
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${main.getHost()}/verify-fan/?${queryString}`;

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

        console.log("Data recieved from search:", data)
        toggleMessages('cpf', data.results.cpf && data.results.cpf.message == '');
        toggleMessages('email', data.results.email && data.results.email.message == '');
        toggleMessages('phone', data.results.phone && data.results.phone.message == '');
        return data;
    } catch (error) {
        console.error("Erro completo:", error);
        showNotification(`Erro na busca: ${error.message}`, 'error');
    } finally {
        btnSearch.innerHTML = '<i class="fas fa-search"></i> Buscar Torcedor';
        btnSearch.disabled = false;

    }
}

//Function to automatic fill the input
export function refilSearch(cpf = null, email = null, phone_number = null) {
    const cpfInput = document.getElementById('search-cpf');
    const emailInput = document.getElementById('search-email');
    const phoneInput = document.getElementById('search-phone');
    if (emailInput && email) {
        emailInput.value = email;
    }

    if (phoneInput && phone_number) {
        phoneInput.value = formatPhone(phone_number);
        phoneInput.dispatchEvent(new Event('input'));
    }

    if (cpfInput && cpf) {
        cpfInput.value = formatCPF(cpf);
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
    main.setfullUserDataChatwoot(receivedData.data)

    const userData = receivedData.data.contact;

    if (loadingElement) loadingElement.style.display = 'none';
    if (errorElement) errorElement.style.display = 'none';
    refilSearch(userData.identifier, userData.email, userData.phone_number)
};

//Function to verify if the data found are consistent
export function checkDataConsistency(results) {
    const values = [];
    for (const key in results) {
        const item = results[key];
        if (item?.resultObject && results[key].message == "") {
            values.push(JSON.stringify(item.resultObject));
        }
    }
    let allEqual;
    console.log("Values", values)
    if (values.every(value => value === values[0])) {
        allEqual = true
    } else {
        allEqual = false
    }

    if (values.length === 0) {
        const btnRegister = document.getElementById("btn-register");
        btnRegister.classList.remove("hidden");
        return null;
    }

    if (allEqual) {
        for (const key in results) {
            const item = results[key];
            if (item.message == "") {
                console.log("resultObject", item.resultObject);
                main.setfullUserDataTwomorrow(item.resultObject);
                utils.reloadScreen('UPDATE');
                utils.fillFullInformations('twomorrow', null, null, null, null);
                return item.resultObject
            }

        }
    } else {
        const cardsContainer = document.getElementById('user-popup');
        cardsContainer.innerHTML = '';
        for (const key in results) {
            const item = results[key];
            if (item.message == "") {
                console.log("resultObject", item.resultObject)
                showUserPopup(item.resultObject, key);
            }

        }
        utils.reloadScreen('CHOOSE');
    }
}

