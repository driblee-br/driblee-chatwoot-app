import { showNotification, formatPhone, formatCPF, isJSONValid, cleanAllInputs } from './utils.js';
import * as checkPayment from './checkPayment.js';
import * as colectData from './colectData.js';

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
export function showUserPopup(data) {
    const modal = document.getElementById('user-popup');
    const info = document.getElementById('user-info');
    const closeBtn = document.getElementById('close-user-popup');

    const name = data.name || '—';
    const email = data.email || '—';
    const mobile = data.mobile?.number || '—';
    const fanStatus = data.fanStatusView || '—';

    const latestPlan = data.affiliationPlans?.[data.affiliationPlans.length - 1];
    const planType = latestPlan?.plan?.planTypeView || '—';
    const planDescription = latestPlan?.plan?.description || '—';


    const html = `
        <strong>Nome:</strong> ${name}<br>
        <strong>Email:</strong> ${email}<br>
        <strong>telephone:</strong> ${mobile}<br>
        <strong>Status:</strong> ${fanStatus}<br>
        <strong>Tipo de Plano:</strong> ${planType}<br>
        <strong>Descrição do Plano:</strong> ${planDescription}
 <div style="margin-top: 15px; font-size: 0.9em; color: #555;">
            O que você quer fazer agora?
            <div style="margin-top: 8px;">
                <button class = "btn" style="margin-right: 10px; padding: 6px 12px; font-size: 0.85em;" onclick=checkPayment()>Analisar status de pagamento</button>
                <button class = "btn" style="padding: 6px 12px; font-size: 0.85em;" onclick=updateData()>Atualizar dados cadastrais</button>
            </div>
        </div>
    `;

    info.innerHTML = html;
    modal.classList.add('show');
    closeBtn.onclick = () => {
        modal.classList.remove('show');
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    };
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
    const url = `https://e694-2804-14d-5c5b-82f8-4b6-985e-3fe3-f71d.ngrok-free.app/verify_fan/?${queryString}`;

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
    return data;
}

// Function to preper data to search 
export async function fetchData() {
    const btnBuscar = document.getElementById('btnBuscar');
    const cpfInput = document.getElementById('busca-cpf').value.replace(/\D/g, '');
    const emailInput = document.getElementById('busca-email').value.trim();
    const telephoneInput = document.getElementById('busca-telephone').value.replace(/\D/g, '');
    console.log("telefone:", telephoneInput)
    btnBuscar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
    btnBuscar.disabled = true;

    const params = {};
    if (telephoneInput) params.telephone = telephoneInput;
    if (cpfInput) params.cpf = cpfInput;
    if (emailInput) params.email = emailInput;
    console.log("params", params)
    if (Object.keys(params).length === 0) {
        showNotification('Informe ao menos um dado para buscar.', 'warning');
        btnBuscar.innerHTML = '<i class="fas fa-search"></i> Buscar Torcedor';
        btnBuscar.disabled = false;
        return;
    }
    try {
        let data = await verifyFanBack(params);
        toggleMessages('cpf', data.results.cpf && data.results.cpf.message == '');
        toggleMessages('email', data.results.email && data.results.email.message == '');
        toggleMessages('telephone', data.results.telephone && data.results.telephone.message == '');
        return data;
    } catch (error) {
        console.error("Erro completo:", error);
        showNotification(`Erro na busca: ${error.message}`, 'error');
    } finally {
        btnBuscar.innerHTML = '<i class="fas fa-search"></i> Buscar Torcedor';
        btnBuscar.disabled = false;

    }
}


// Event to recieve user's data from chatwoot
export const searchUser = (event) => {
    const cpfInput = document.getElementById('busca-cpf');
    const emailInput = document.getElementById('busca-email');
    const telephoneInput = document.getElementById('busca-telephone');
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

    if (emailInput && userData.email) {
        emailInput.value = userData.email;
    }

    if (telephoneInput && userData.phone_number) {
        telephoneInput.value = formatPhone(userData.phone_number);
        telephoneInput.dispatchEvent(new Event('input'));
    }

    if (cpfInput && userData.identifier) {
        cpfInput.value = formatCPF(userData.identifier);
        cpfInput.dispatchEvent(new Event('cpf'));
    }

    console.log("Chatwoot passed data!", receivedData);
    console.log("Automatic filling done!");
};

//Function to verify if the data found are consistent
export function checkDataConsistency(results) {
    const values = [];

    for (const key in results) {
        const item = results[key];
        if (item?.resultObject) {
            values.push(JSON.stringify(item.resultObject));
        }
    }

    let allEqual;

    console.log("results", results)
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
    console.log("emptyMessages:", emptyMessages)
    if (values.length === 0) {
        showNotification("Nenhum usuário encontrado", 'info')
        const btnRegister = document.getElementById("btn-register");
        btnRegister.classList.remove("hidden");


        return null;
    }
    console.log("allEqual:", allEqual)
    console.log("Results:", results)

    let totalKeys = 0;
    for (const key in results) {
        if (results[key]?.resultObject != null) {
            totalKeys += 1;
        }
    }

    if (allEqual) {
        const entries = Object.entries(results);
        for (let i = 0; i < entries.length; i++) {
            const [key, value] = entries[i];
            console.log("In key", key);
            if (value && value.resultObject !== null) {
                showUserPopup(value.resultObject);
                return value.resultObject;
            }
        }
    } else {
        showNotification("Os dados são de usuários diferentes", 'warning')
        return 'Inconsistent data';
    }
}


