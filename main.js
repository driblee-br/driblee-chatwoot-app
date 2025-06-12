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
    return "https://be83-2804-14d-5c5b-82f8-c517-1910-75db-c4f6.ngrok-free.app"
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
    // CPF field's format
    document.getElementById('busca-cpf').addEventListener('input', function (e) {
        let value = e.target.value;
        e.target.value = utils.formatCPF(value);
    });

    // Phone field's format
    document.getElementById('busca-phone').addEventListener('input', function (e) {
        let value = e.target.value;
        e.target.value = utils.formatPhone(value);
    });

    // Botton to search user in 2morrow 
    document.getElementById('btnBuscar').addEventListener('click', async () => {
        checkFan.cleanAllInputsSearch();
        const results = await checkFan.fetchData();
        setfullUserDataTwomorrow(checkFan.checkDataConsistency(results.results));

    });

    //Botton to send template to META
    document.getElementById('btn-meta').addEventListener('click', () => {
        meta.meta();
    });

    // Botton to register a fan
    document.getElementById("btn-register").addEventListener('click', () => {
        registerFan.register()
        const cpf = document.getElementById('busca-cpf').value;
        const email = document.getElementById('busca-email').value;
        const phone = document.getElementById('busca-phone').value;

        utils.fillFullInformations('chatwoot', null, cpf, phone, email);
    });

    // SCREEN CHOOSE //
    // Botton go back to search
    document.getElementById('btn-back-to-search-choose').addEventListener('click', function () {
        utils.reloadScreen('CONSULTATION');
    });

    // SCREEN UPDATE
    // Botton to go to 2morrow fan's screen
    document.getElementById('btn-logo-basicos').addEventListener('click', function () {
        window.open(`https://ecb.2morrow.com.br/Fan`, '_blank');
    });

    //Botton to go to the search screen
    document.getElementById('btn-new-search').addEventListener('click', () => {
        utils.reloadScreen('CONSULTATION');
    });

    // CPF format
    document.getElementById('edit-cpf').addEventListener('input', function (e) {
        let value = e.target.value;
        e.target.value = utils.formatCPF(value);
    });

    // Phone format
    document.getElementById('edit-phone').addEventListener('input', function (e) {
        let value = e.target.value;
        e.target.value = utils.formatPhone(value);
    });

    document.getElementById("btn-register-fan").addEventListener('click', function () {
        registerFan.registerFan();
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

    // Botton to copy full informations
    document.getElementById('btn-copy-informations').addEventListener('click', () => {
        console.log("Button copy pressed")
        collectData.copyFullInformations();
    });

    //Bottom to effect the update fan's data
    document.getElementById('btn-effect-update').addEventListener('click', () => {
        console.log("Iniciando cadastro remoto")
        collectData.updateData()
    });


    // Bottom to check payments status
    document.getElementById('btn-check-payment').addEventListener('click', () => {
        checkPayment.checkPayment();
    });


    // Botton to go to 2morrow fan payment's screen
    document.getElementById('btn-twomorrow-payments').addEventListener('click', function () {
        if (fullUserDataTwomorrow.affiliationPlans?.length > 0) {
            window.open(`https://ecb.2morrow.com.br/AffiliationPlan/Details/${fullUserDataTwomorrow.affiliationPlans[0].id}`, '_blank');
        } else {
            window.open(`https://ecb.2morrow.com.br/NewAffiliation`, '_blank');
        }
    });

    // Bottom to copy reset-password informations
    document.getElementById('btn-copy-reset-key').addEventListener('click', () => {
        collectData.copyKeyInformations('key');
    });

    // Botton to send a email to user
    document.getElementById('btn-send-email').addEventListener('click', function () {
        resetPassword.resetPassword();
    });


});
