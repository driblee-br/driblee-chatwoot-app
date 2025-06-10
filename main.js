import * as checkFan from './checkFan.js';
import * as registerFan from './registerFan.js';
import * as utils from './utils.js';
import * as checkPayment from './checkPayment.js';
import * as collectData from './collectData.js';
import * as resetPassword from './resetPassword.js';
import * as meta from './meta.js';
console.log('main.js loaded');
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


document.addEventListener('DOMContentLoaded', function () {

    // Elements from index page
    const closeNotification = document.getElementById('close-notification');

    // Recieving data from chatwoot
    window.addEventListener("message", checkFan.searchUser);
    window.parent.postMessage('chatwoot-dashboard-app:fetch-info', '*');

    // SCREEN SEARCH //
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

    // Botton to search user in 2morrow 
    document.getElementById('btnBuscar').addEventListener('click', async () => {
        checkFan.cleanAllInputsSearch();
        const results = await checkFan.fetchData();
        setfullUserDataTwomorrow(checkFan.checkDataConsistency(results.results));

    });

    // SCREEN CHOOSE //
    document.getElementById('btn-back-to-search-choose').addEventListener('click', function () {
        utils.reloadScreen('CONSULTATION');
    });

    // SCREEN UPDATE
    //Botton to go to the search screen
    document.getElementById('btn-new-search').addEventListener('click', () => {
        utils.reloadScreen('CONSULTATION');
    });

    document.getElementById('edit-cpf').addEventListener('input', function (e) {
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

    document.getElementById('edit-telephone').addEventListener('input', function (e) {
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
        collectData.fillByCep(this.value);
    });

    /*     //Botton to reset the password
        document.getElementById('btn-reset-password').addEventListener('click', () => {
            resetPassword.resetPassword();
        }); */

    //Botton to send template to META
    /*     document.getElementById('btn-meta').addEventListener('click', () => {
            meta.meta();
        }); */

    //REGISTER//
    //Bottom to effect the update fan's data
    document.getElementById('btn-effect-update').addEventListener('click', () => {
        collectData.updateData()
    });

    //Botton to confirm the collected informations to effect the data's update
    document.getElementById('btn-confirm-info-update').addEventListener('click', () => {
        collectData.checkInformations();
    });





});
