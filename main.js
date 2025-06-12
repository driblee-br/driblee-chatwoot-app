import * as checkFan from './checkFan.js';
import * as registerFan from './registerFan.js';
import * as utils from './utils.js';
import * as checkPayment from './checkPayment.js';
import * as collectData from './collectData.js';
import * as resetPassword from './resetPassword.js';
import * as meta from './meta.js';
let fullUserDataTwomorrow;
let fullUserDataChatwoot;

export function getHost() {
    return "https://8da6-2804-14c-5b8c-8153-fd49-ba0f-5871-f2d1.ngrok-free.app/"
}

export function getfullUserDataTwomorrow() {
    console.log("fullTwomorrow:", fullUserDataTwomorrow)
    return fullUserDataTwomorrow
}

export function setfullUserDataTwomorrow(data) {
    fullUserDataTwomorrow = data;
}

export function getfullUserDataChatwoot() {
    console.log("fullChatwoot:", fullUserDataChatwoot)
    return fullUserDataChatwoot
}

export function setfullUserDataChatwoot(data) {
    fullUserDataChatwoot = data;
}


document.addEventListener('DOMContentLoaded', function () {

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

    document.getElementById('btn-copy-informations').addEventListener('click', () => {
        collectData.copyInformations();
    });

    document.getElementById('btn-check-payment').addEventListener('click', () => {
        checkPayment.checkPayment();
    });

    document.getElementById('btn-copy-reset-key').addEventListener('click', () => {
        collectData.copyInformations('key');
    });

    //Bottom to effect the update fan's data
    document.getElementById('btn-effect-update').addEventListener('click', () => {
        collectData.updateData()
    });


    document.getElementById('btn-logo-basicos').addEventListener('click', function () {
        window.open(`https://ecb.2morrow.com.br/Fan/Details?Id=${fullUserDataTwomorrow.affiliationPlans[0].id}`, '_blank');
    });

    document.getElementById('btn-logo-financeiro').addEventListener('click', function () {
        window.open(`https://ecb.2morrow.com.br/AffiliationPlan/Details/${fullUserDataTwomorrow.affiliationPlans[0].id}`, '_blank');
    });

    document.getElementById('btn-send-email').addEventListener('click', function () {
        resetPassword.resetPassword();
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
    document.getElementById('btn-meta').addEventListener('click', () => {
        meta.meta();
    });

    //REGISTER//






});
