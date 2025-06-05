import * as checkFan from './checkFan.js';
import * as registerFan from './registerFan.js';
import * as utils from './utils.js';
import * as checkPayment from './checkPayment.js';
import * as colectData from './colectData.js';
import * as resetPassword from './resetPassword.js';

let fullUserDataTwomorrow;

export function getfullUserDataTwomorrow() {
    console.log(fullUserDataTwomorrow)
    return fullUserDataTwomorrow
}

export function setfullUserDataTwomorrow(data) {
    fullUserDataTwomorrow = data;
}

// SEARCH //
// Botton to search user in 2morrow 
document.getElementById('btnBuscar').addEventListener('click', async () => {
    checkFan.cleanAllInputsSearch();
    const results = await checkFan.fetchData();
    console.log("results in main", results)
    setfullUserDataTwomorrow(checkFan.checkDataConsistency(results.results));

});

//Botton to clean the inputs in screen Search Fan
document.getElementById('btn-clear-check').addEventListener('click', () => {
    checkFan.cleanAllInputsSearch();
    utils.cleanAllInputs();
});

//Botton to go to screen register fan
document.getElementById('btn-register').addEventListener('click', () => {
    registerFan.register();
});

//Botton to effect the fan's register
document.getElementById('btn-register-fan').addEventListener('click', () => {
    registerFan.registerFan();
});

//Botton to go to screen update user's data
document.getElementById('btn-update-data-user').addEventListener('click', () => {
    utils.reloadScreen('ATUALIZACAO');
    colectData.FielingFieldsUpdateData();
});

// Botton to go to screen payment status
document.getElementById('btn-see-status-payment').addEventListener('click', () => {
    checkPayment.checkPayment()
});

//Botton to reset the password
document.getElementById('btn-reset-password').addEventListener('click', () => {
    resetPassword.resetPassword();
});


//REGISTER//
//Bottom to effect the update fan's data
document.getElementById('btn-effect-update').addEventListener('click', () => {
    colectData.updateData()
});

//Botton to clean the inputs in screen Register Fan
document.getElementById('btn-clear-register').addEventListener('click', () => {
    event.preventDefault();
    utils.cleanAllInputs();
});

//Botton to confirm the collected informations to effect the register
document.getElementById('btn-confirm-info-register').addEventListener('click', () => {
    registerFan.checkInformations();
});

//UPDATE DATA//
//Botton to clean the inputs in screen Update Fan's data
document.getElementById('btn-clear-update').addEventListener('click', () => {
    utils.cleanAllInputs();
});

//Botton to confirm the collected informations to effect the data's update
document.getElementById('btn-confirm-info-update').addEventListener('click', () => {
    colectData.checkInformations();
});

document.addEventListener('DOMContentLoaded', function () {
    // Elements from index page
    const closeNotification = document.getElementById('close-notification');

    // Recieving data from chatwoot
    window.addEventListener("message", checkFan.searchUser);
    window.parent.postMessage('chatwoot-dashboard-app:fetch-info', '*');

    // Processing cpf data while typing
    document.getElementById('busca-cpf').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, '$1.$2');
        if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
        if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');

        e.target.value = value;
    });

    // Processing cpf-register data while typing
    document.getElementById('cpf-register').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, '$1.$2');
        if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
        if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');

        e.target.value = value;
    });

    // Processing telephone data while typing
    document.getElementById('busca-telephone').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        value = value.slice(0, 11);

        if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        if (value.length > 7) value = value.replace(/(\d{5})(\d)/, '$1-$2');

        e.target.value = value;
    });

    // Processing telephone-register data while typing
    document.getElementById('telephone-register').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        value = value.slice(0, 11);

        if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        if (value.length > 7) value = value.replace(/(\d{5})(\d)/, '$1-$2');

        e.target.value = value;
    });

    // Event to format CEP in real-time
    document.getElementById('edit-cep').addEventListener('input', function () {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5, 8);
        } else if (value.length > 8) {
            value = value.substring(0, 8);
        }
        this.value = value;
    });

    // Event listener for the CEP field
    document.getElementById('edit-cep').addEventListener('blur', function () {

        colectData.fillByCep(this.value);
    });


    // Close notification
    closeNotification.addEventListener('click', function () {
        document.getElementById('notification').classList.remove('show');
    });

});
