import * as checkFan from './checkFan.js';
import * as registerFan from './registerFan.js';
import * as utils from './utils.js';

document.getElementById('btn-clear-check').addEventListener('click', () => {
    checkFan.cleanAllInputsSearch();
    utils.cleanAllInputs();
});

document.getElementById('btn-clear-register').addEventListener('click', () => {
    event.preventDefault();
    checkFan.cleanAllInputsSearch();
    utils.cleanAllInputs();
});

document.getElementById('btn-register').addEventListener('click', () => {
    registerFan.register();
});

document.getElementById('btn-register-fan').addEventListener('click', () => {
    registerFan.registerFan();
});

document.getElementById('btn-confirm-template').addEventListener('click', () => {
    registerFan.checkInformtions();
});



document.addEventListener('DOMContentLoaded', function () {
    // Elements from index page
    const btnBuscar = document.getElementById('btnBuscar');
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

    // Processing cpf-registro data while typing
    document.getElementById('cpf-registro').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, '$1.$2');
        if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
        if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');

        e.target.value = value;
    });

    // Processing telephone data while typing
    document.getElementById('busca-telefone').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        value = value.slice(0, 11);

        if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        if (value.length > 7) value = value.replace(/(\d{5})(\d)/, '$1-$2');

        e.target.value = value;
    });

    // Processing telefone-registro data while typing
    document.getElementById('telefone-registro').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        value = value.slice(0, 11);

        if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        if (value.length > 7) value = value.replace(/(\d{5})(\d)/, '$1-$2');

        e.target.value = value;
    });

    // Close notification
    closeNotification.addEventListener('click', function () {
        document.getElementById('notification').classList.remove('show');
    });

    // Event listener to search user in 2morrow 
    btnBuscar.addEventListener('click', async () => {
        checkFan.cleanAllInputsSearch();
        const results = await checkFan.fetchData();
        console.log("results in main", results)
        const finalData = checkFan.checkDataConsistency(results.results)
        console.log(finalData)
    });

});
