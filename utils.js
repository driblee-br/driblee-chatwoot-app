import * as checkFan from './checkFan.js';
import * as main from './main.js';
import *  as registerFan from './registerFan.js';

// Show just the screen relted as the atual status
export function reloadScreen(step_now) {
    const allSteps = ['CONSULTATION', 'UPDATE', 'CHOOSE'];
    editPanels(true)
    for (const step of allSteps) {
        const element = document.getElementById(step);
        if (element) {
            element.classList.add("hidden");
        }
    }

    const currentElement = document.getElementById(step_now);
    if (currentElement) {
        currentElement.classList.remove("hidden");
    }

    if (step_now == 'CONSULTATION') {
        document.getElementById("btn-register").classList.add("hidden");
        document.getElementById("btn-register-fan").classList.add('hidden');
        document.getElementById('finances').inner = '';
    }

}

// Function to clean all inputs in the register page
export function cleanAllInputs() {
    const allFormFields = document.querySelectorAll('input, textarea, select');
    const consultationPanel = document.getElementById('CONSULTATION');
    const editSituationDiv = document.getElementById('edit-situation');
    allFormFields.forEach(field => {
        if (consultationPanel && !consultationPanel.contains(field)) {
            field.value = '';
        }
    });

    if (editSituationDiv) {
        editSituationDiv.innerText = '';
    }
}

// Function to validate JSON
export function isJSONValid(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


// Format phone number to Brazilian format (for front)
export function formatPhone(phone) {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('55') && cleaned.length > 11) {
        cleaned = cleaned.slice(2);
    }
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
}

// Format CPF (for front)
export function formatCPF(cpf) {

    return cpf.replace(/\D/g, '')
        .replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
}

/**
 * Function to show a notification in front
 *
 * @param {string} message - A mensagem a ser exibida.
 * @param {'info' | 'warn' | 'error' | 'success'} [type='info'] - O tipo da notificação (opcional, padrão: 'info').
 */
export function showNotification(message, type = 'info') {
    const notification = document.getElementById(`notification`);
    const notificationMessage = document.getElementById(`notification-message`);

    notificationMessage.textContent = message;
    notification.className = 'notification';
    notification.classList.add('show', type);
    // Reset after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Send message to Fan
export async function sendMessage(message) {
    try {
        let fullUserDataChatwoot = checkFan.getfullUserDataChatwoot();
        const url = `${main.getHost()}/sendmessage/`;

        const payload = {
            account_id: fullUserDataChatwoot.conversation.account_id,
            conversation_id: fullUserDataChatwoot.conversation.id,
            message: message
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify(payload)
        });


        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errorMessage || `Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch {
        console.log("Dados do chatwoot indisponíveis para testes locais")
    }
}

export function editPanels(boolean) {
    const panels = document.querySelectorAll('.panel');
    if (boolean === false) {
        panels.forEach(panel => {
            if (panel.id !== 'basic-data') {
                panel.classList.add('no-edit');

                const inputs = panel.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.disabled = true;
                    input.classList.add('disabled-field');
                });
            }
        });
        document.getElementById('btn-register-fan').classList.remove('hidden');
        //Botton to effect the fan's register
        document.getElementById('btn-register-fan').addEventListener('click', () => {
            registerFan.registerFan();

        })
    }
    else {
        panels.forEach(panel => {
            if (panel.id !== 'basic-data') {
                panel.classList.remove('no-edit');

                const inputs = panel.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.disabled = false;
                    input.classList.remove('disabled-field');
                });
            }
        });
        document.getElementById('btn-register-fan').classList.add('hidden');

    }
}

export function fillFullInformations(from, name = null, cpf = null, phone_number = null, email = null) {
    cleanAllInputs()
    const EditName = document.getElementById("edit-nome");
    const EditCpf = document.getElementById("edit-cpf");
    const EditEmail = document.getElementById("edit-email");
    const EditTelephone = document.getElementById("edit-telephone");
    const EditGender = document.getElementById("edit-gender");
    const EditBirth = document.getElementById("edit-birth");
    const EditCity = document.getElementById("edit-city");
    const EditNeigbor = document.getElementById("edit-neigbor");
    const EditStreet = document.getElementById("edit-street");
    const EditNumber = document.getElementById("edit-number");
    const EditCep = document.getElementById("edit-cep");
    const EditState = document.getElementById("edit-state");
    const EditComplement = document.getElementById("edit-complement");
    const EditSituation = document.getElementById("edit-situation");
    if (from == 'chatwoot') {
        const fullUserDataChatwoot = main.getfullUserDataChatwoot();

        if (EditName && fullUserDataChatwoot?.name) {
            EditName.value = fullUserDataChatwoot?.name;
        } else if (EditName && name) {
            EditName.value = name;
        }

        if (EditCpf && fullUserDataChatwoot?.cpf) {
            EditCpf.value = fullUserDataChatwoot?.cpf;
        } else if (EditCpf && cpf) {
            EditCpf.value = formatCPF(cpf);
            EditCpf.dispatchEvent(new Event('cpf'));
        }

        if (EditEmail && fullUserDataChatwoot?.email) {
            EditEmail.value = fullUserDataChatwoot?.email;
        } else if (EditEmail && email) {
            EditEmail.value = email;
        }

        if (EditTelephone && fullUserDataChatwoot?.mobile?.number) {
            EditTelephone.value = fullUserDataChatwoot?.mobile.number;
        } else if (EditTelephone && phone_number) {
            EditTelephone.value = formatPhone(phone_number);
            EditTelephone.dispatchEvent(new Event('input'));
        }

        if (EditGender && fullUserDataChatwoot?.gender) {
            EditGender.value = fullUserDataChatwoot?.gender;
        }

        if (EditBirth && fullUserDataChatwoot?.birthDate) {
            EditBirth.value = fullUserDataChatwoot?.birthDate;
        }

        if (EditCity && fullUserDataChatwoot?.address?.city) {
            EditCity.value = fullUserDataChatwoot?.address.city;
        }

        if (EditNeigbor && fullUserDataChatwoot?.address?.neighborhood) {
            EditNeigbor.value = fullUserDataChatwoot?.address.neighborhood;
        }

        if (EditStreet && fullUserDataChatwoot?.address?.street) {
            EditStreet.value = fullUserDataChatwoot?.address.street;
        }

        if (EditNumber && fullUserDataChatwoot?.address?.number) {
            EditNumber.value = fullUserDataChatwoot?.address.number;
        }

        if (EditCep && fullUserDataChatwoot?.address?.cep) {
            EditCep.value = fullUserDataChatwoot?.address.cep;
        }
    } else if (from == 'twomorrow') {
        const fullUserDataTwomorrow = main.getfullUserDataTwomorrow();
        if (EditSituation && fullUserDataTwomorrow?.fanStatusView) {
            EditSituation.textContent = fullUserDataTwomorrow?.fanStatusView;

        }

        if (EditName && fullUserDataTwomorrow?.name) {
            EditName.value = fullUserDataTwomorrow?.name;
        }

        if (EditCpf && fullUserDataTwomorrow?.mainDocument) {
            EditCpf.value = formatCPF(fullUserDataTwomorrow?.mainDocument);
            EditCpf.dispatchEvent(new Event('cpf'));
        }

        if (EditEmail && fullUserDataTwomorrow?.email) {
            EditEmail.value = fullUserDataTwomorrow?.email;
        }

        if (EditTelephone && fullUserDataTwomorrow?.mobile?.fullNumber) {
            EditTelephone.value = formatPhone(fullUserDataTwomorrow?.mobile?.fullNumber);
            EditTelephone.dispatchEvent(new Event('input'));
        }


        if (EditGender && fullUserDataTwomorrow?.personGenderView) {
            const genderValueFromTwomorrow = fullUserDataTwomorrow?.personGenderView.toLowerCase();

            let foundMatch = false;
            for (let i = 0; i < EditGender.options.length; i++) {
                if (EditGender.options[i].value === genderValueFromTwomorrow) {
                    EditGender.value = genderValueFromTwomorrow;
                    foundMatch = true;
                    break;
                }
            }
        }

        if (EditBirth && fullUserDataTwomorrow.birthDate) {
            try {
                const date = new Date(fullUserDataTwomorrow.birthDate);
                if (!isNaN(date.getTime())) { // Verifica se a data é válida
                    const year = date.getFullYear();
                    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mês é base 0, por isso +1
                    const day = date.getDate().toString().padStart(2, '0');
                    EditBirth.value = `${year}-${month}-${day}`;
                }
            } catch (error) {
            }
        }

        if (EditCity && fullUserDataTwomorrow.address?.city) {
            EditCity.value = fullUserDataTwomorrow.address.city;
        }

        if (EditNeigbor && fullUserDataTwomorrow.address?.district) {
            EditNeigbor.value = fullUserDataTwomorrow.address.district;
        }

        if (EditStreet && fullUserDataTwomorrow.address?.address) {
            EditStreet.value = fullUserDataTwomorrow.address.address;
        }

        if (EditNumber && fullUserDataTwomorrow.address?.number) {
            EditNumber.value = fullUserDataTwomorrow.address.number;
        }

        if (EditCep && fullUserDataTwomorrow.address?.postalCode) {
            EditCep.value = fullUserDataTwomorrow.address.postalCode;
        }

        if (EditState && fullUserDataTwomorrow.address?.state) {
            EditState.value = fullUserDataTwomorrow.address.state;
        }

        if (EditComplement && fullUserDataTwomorrow.address?.complement) {
            EditComplement.value = fullUserDataTwomorrow.address.complement;
        }
    }
}

export function legacyCopyText(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand("copy");
        showNotification("Dados copiados com sucesso!", 'success')
    } catch (err) {
        showNotification("Falha ao copiar os dados", 'error')
    }
    document.body.removeChild(textarea);
}