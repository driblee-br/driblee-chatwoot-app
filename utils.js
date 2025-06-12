import * as checkFan from './checkFan.js';
import * as main from './main.js';
import *  as registerFan from './registerFan.js';

// Show just the screen relted as the atual status
export function reloadScreen(step_now) {
    const allSteps = ['CONSULTATION', 'UPDATE', 'CHOOSE'];
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
        const basicInformations = document.getElementById('basic-informations');
        const complementarInformations = document.getElementById('complementar-informations');
        basicInformations.classList.add('no-edit-update');
        complementarInformations.classList.add('no-edit-update');
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


export function formatPhone(phone) {
    let cleaned = String(phone).replace(/\D/g, '');
    let formattedValue = '';

    if (cleaned.startsWith('55') && cleaned.length > 10) {
        cleaned = cleaned.slice(2);
    }

    if (cleaned.length > 0) {
        formattedValue = '(' + cleaned.substring(0, 2);
    }

    if (cleaned.length > 2) {
        if (cleaned.length >= 11) {
            formattedValue += ') ' + cleaned.substring(2, 7);
            if (cleaned.length > 7) {
                formattedValue += '-' + cleaned.substring(7, 11);
            }
        } else {
            formattedValue += ') ' + cleaned.substring(2, 6);
            if (cleaned.length > 6) {
                formattedValue += '-' + cleaned.substring(6, 10);
            }
        }
    }

    return formattedValue;
}

// Format CPF 
export function formatCPF(cpf) {
    let cleaned = String(cpf).replace(/\D/g, ''); // Remove tudo que não é dígito
    let formattedValue = '';

    // 000
    if (cleaned.length > 0) {
        formattedValue = cleaned.substring(0, 3);
    }
    // 000.000
    if (cleaned.length > 3) {
        formattedValue += '.' + cleaned.substring(3, 6);
    }
    // 000.000.000
    if (cleaned.length > 6) {
        formattedValue += '.' + cleaned.substring(6, 9);
    }
    // 000.000.000-00
    if (cleaned.length > 9) {
        formattedValue += '-' + cleaned.substring(9, 11);
    }

    return formattedValue;
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


export function fillFullInformations(from, name = null, cpf = null, phone_number = null, email = null) {
    console.log("Parameters to auto fill:", name, phone_number, email)
    cleanAllInputs()
    console.log("Parameters to auto fill:", name, phone_number, email)
    const EditName = document.getElementById("edit-nome");
    const EditCpf = document.getElementById("edit-cpf");
    const EditEmail = document.getElementById("edit-email");
    const EditTelephone = document.getElementById("edit-phone");
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

        if (EditTelephone && fullUserDataChatwoot?.contact?.phone_number) {
            EditTelephone.value = fullUserDataChatwoot?.contact.phone_number;
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