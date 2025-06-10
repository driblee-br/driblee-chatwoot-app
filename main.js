import * as checkFan from './checkFan.js';
import * as registerFan from './registerFan.js';
import * as utils from './utils.js';
import * as checkPayment from './checkPayment.js';
import * as collectData from './collectData.js';
import * as resetPassword from './resetPassword.js';
import * as meta from './meta.js';

let fullUserDataTwomorrow;


export function getHost() {
    return "http://127.0.0.1:8086"
}


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
    //console.log("results in main", results)
    setfullUserDataTwomorrow(checkFan.checkDataConsistency(results.results));

});

//Botton to clean the inputs in screen Search Fan
document.getElementById('btn-clear-check').addEventListener('click', () => {
    checkFan.cleanAllInputsSearch();
    utils.cleanAllInputs();
});


//Botton to go to screen update user's data
document.getElementById('btn-update-data-user').addEventListener('click', () => {
    utils.reloadScreen('UPDATE');
    collectData.FielingFieldsUpdateData();
});

// Botton to go to screen payment status
document.getElementById('btn-see-status-payment').addEventListener('click', () => {
    checkPayment.checkPayment()
});

//Botton to reset the password
document.getElementById('btn-reset-password').addEventListener('click', () => {
    resetPassword.resetPassword();
});

//Botton to send template to META
document.getElementById('btn-meta').addEventListener('click', () => {
    meta.meta();
});

//REGISTER//
//Bottom to effect the update fan's data
document.getElementById('btn-effect-update').addEventListener('click', () => {
    collectData.updateData()
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
    collectData.checkInformations();
});

document.addEventListener('DOMContentLoaded', function () {
    // Elements from index page
    const closeNotification = document.getElementById('close-notification');

    // Recieving data from chatwoot
    window.addEventListener("message", checkFan.searchUser);
    window.parent.postMessage('chatwoot-dashboard-app:fetch-info', '*');

    document.getElementById('busca-cpf').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';

        if (value.length > 0) {
            formattedValue = value.substring(0, 3);
        }
        if (value.length > 3) {
            formattedValue += '.' + value.substring(3, 6);
        }
        if (value.length > 6) {
            formattedValue += '.' + value.substring(6, 9);
        }
        if (value.length > 9) {
            formattedValue += '-' + value.substring(9, 11);
        }

        e.target.value = formattedValue;
    });
    document.getElementById('busca-telephone').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = '';

        if (value.length > 0) {
            formattedValue = '(' + value.substring(0, 2);
        }
        if (value.length > 2) {
            formattedValue += ') ' + value.substring(2, 7);
        }
        if (value.length > 7) {
            formattedValue += '-' + value.substring(7, 11);
        }

        e.target.value = formattedValue;
    });

    // Close notification
    closeNotification.addEventListener('click', function () {
        document.getElementById('notification').classList.remove('show');
    });

});
