import * as checkFan from './checkFan.js';
import * as registerFan from './registerFan.js';
import * as utils from './utils.js';
import * as collectData from './collectData.js';
import * as resetPassword from './resetPassword.js';
let fullUserDataTwomorrow;
let fullUserDataChatwoot;

export function getHost() {
    return "https://api.driblee.com/chatwoot-app"
}

export function getfullUserDataTwomorrow() {
    console.log("fullTwomorrow:", fullUserDataTwomorrow)
    return fullUserDataTwomorrow
}

export function setfullUserDataTwomorrow(data) {
    console.log("Setting fullUserDataTwomorrow:", data)
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
    document.getElementById('search-cpf').addEventListener('input', function (e) {
        let value = e.target.value;
        e.target.value = utils.formatCPF(value);
    });

    // Phone field's format
    document.getElementById('search-phone').addEventListener('input', function (e) {
        let value = e.target.value;
        e.target.value = utils.formatPhone(value);
    });

    // Botton to search user in 2morrow 
    document.getElementById('btn-search').addEventListener('click', async () => {
        checkFan.cleanAllInputsSearch();
        const results = await checkFan.fetchData();
        setfullUserDataTwomorrow(checkFan.checkDataConsistency(results.results));
    });

    // Botton to register a fan
    document.getElementById("btn-register").addEventListener('click', () => {
        //Recarrega a página para a página de update dos dados
        utils.reloadScreen('UPDATE');

        // Habilita os dados básicos para serem editáveis
        document.getElementById('basic-informations').classList.remove('no-edit-update');

        // Habilita o campo de checar pagamento e reset de senha
        document.getElementById('finances-panel').classList.add('no-edit-update');
        document.getElementById('reset-password-panel').classList.add('no-edit-update');

        // Habilita o botão de efetivar registro
        document.getElementById("btn-register-fan").classList.remove('hidden');
        document.getElementById("btn-copy-basic-informations").classList.remove('hidden');

        // Desabilita botẽs de ação
        document.getElementById("btn-edit").disabled = true;



        //Preenche automaticamente os campos da tela de registro
        const cpf = document.getElementById('search-cpf').value;
        const email = document.getElementById('search-email').value;
        const phone = document.getElementById('search-phone').value;
        utils.fillFullInformations('chatwoot', null, cpf, phone, email);

    });

    // SCREEN CHOOSE //
    // Botton go back to search
    document.getElementById('btn-back-to-search-choose').addEventListener('click', function () {
        setfullUserDataTwomorrow(null);
        utils.reloadScreen('CONSULTATION');
        const basicInformations = document.getElementById('basic-informations');
        const additionalInformation = document.getElementById('additional-information');
        basicInformations.classList.add('no-edit-update');
        additionalInformation.classList.add('no-edit-update');

    });

    // SCREEN UPDATE
    // Botton to go to 2morrow fan's screen
    document.getElementById('btn-logo-basicos').addEventListener('click', function () {
        window.open(`https://ecb.2morrow.com.br/Fan`, '_blank');
    });

    // Botton to edit data
    document.getElementById('btn-edit').addEventListener('click', function () {
        const basicInformations = document.getElementById('basic-informations');
        const additionalInformation = document.getElementById('additional-information');
        basicInformations.classList.toggle('no-edit-update');
        additionalInformation.classList.toggle('no-edit-update');

    });


    //Botton to go to the search screen
    document.getElementById('btn-new-search').addEventListener('click', () => {
        setfullUserDataTwomorrow(null);
        utils.reloadScreen('CONSULTATION');
        document.getElementById('finances').innerHTML = '';
        const basicInformations = document.getElementById('basic-informations');
        const additionalInformation = document.getElementById('additional-information');
        basicInformations.classList.add('no-edit-update');
        additionalInformation.classList.add('no-edit-update');
        document.getElementById("btn-edit").disabled = false;
        document.getElementById("btn-twomorrow-payments").disabled = false;
        document.getElementById("btn-send-email").disabled = false;

        // Desabilita o campo de checar pagamento e reset de senha
        document.getElementById('finances-panel').classList.remove('no-edit-update');
        document.getElementById('reset-password-panel').classList.remove('no-edit-update');


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
        // Habilita o campo de checar pagamento e reset de senha
        document.getElementById('finances-panel').classList.remove('no-edit-update');
        document.getElementById('reset-password-panel').classList.remove('no-edit-update');

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

    document.getElementById('btn-copy-basic-informations').addEventListener('click', () => {
        console.log("Button copy pressed")
        registerFan.copyFullInformations();
    });

    //Bottom to effect the update fan's data
    document.getElementById('btn-effect-update').addEventListener('click', () => {
        console.log("Iniciando cadastro remoto")


        collectData.updateData()
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
