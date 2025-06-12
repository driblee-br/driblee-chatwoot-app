import * as main from './main.js';

export async function checkPayment() {
    const btnCheckPayment = document.getElementById('btn-check-payment');
    btnCheckPayment.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procurando planos...';
    btnCheckPayment.disabled = true;
    function stopLoadingBotton() {
        btnCheckPayment.innerHTML = 'Consultar pagamentos';
        btnCheckPayment.disabled = false;
    }
    const guid = main.getfullUserDataTwomorrow().guid;
    const url = `${main.getHost()}/checkpayment/${guid}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            mode: 'cors',
            credentials: 'omit',
        });
        const data = await response.json();

        if (!response.ok) {
            const errorData = await response.json();
            stopLoadingBotton()
            throw new Error(errorData.errorMessage || `Erro HTTP: ${response.status}`);
        }
        showPaymentAtributes(data)
        stopLoadingBotton()
        return data;
    } catch {
        stopLoadingBotton()
        return
    }
}
function showPaymentAtributes(data) {
    const info = document.getElementById('finances');
    const user = data.response.resultObject;
    console.log("Data:", data)
    console.log("user", user)
    const NOT_INFORMED = 'Não informado';
    const DIVIDER = '<hr style="border: none; height: 1px; background: #ccc; margin: 1em 0;">';
    const ACTIVE_PLAN_MESSAGE = '<p style="color:green;">✔ Plano Ativo</p>';
    const INACTIVE_PLAN_MESSAGE = '<p style="color:red;">✖ Plano Inativo</p>';
    const PENDING_PAYMENT_MESSAGE = '<p style="color:orange;">⚠ Pagamento Pendente</p>';
    const NO_PLAN_FOUND_MESSAGE = `<p>Nenhum plano afiliado encontrado.</p>`;

    const formatDate = (date) => date ? new Date(date).toLocaleDateString() : NOT_INFORMED;

    let plansHtml = '';

    try {
        if (user.affiliationPlans && user.affiliationPlans?.length > 0) {
            plansHtml = user.affiliationPlans.map(plan => {
                const isActive = plan.affiliationPlanStatus === "Active";
                const isPendingPayment = plan.payModeType === "None";
                const planData = plan.plan || {};
                const status = plan.affiliationPlanStatusView || plan.affiliationPlanStatus || NOT_INFORMED;
                const description = planData.description || 'Plano sem descrição';
                const planType = planData.planType || 'Tipo desconhecido';
                const payModeType = plan.payModeTypeView || NOT_INFORMED;
                const paymentCondition = plan.paymentCondition || NOT_INFORMED;
                const parcels = plan.parcels || 0;
                const totalPayedValue = plan.totalPayedValue?.toFixed(2) || '0,00';

                return `
                    ${DIVIDER}
                    <div class="plan-card">
                        <h5>${description} (${planType})</h5>
                        <p><strong>Status:</strong> ${status}</p>
                        <p><strong>Data de Afiliação:</strong> ${formatDate(plan.affiliationDate)}</p>
                        <p><strong>Validade até:</strong> ${formatDate(plan.expireDate)}</p>
                        <p><strong>Forma de Pagamento:</strong> ${payModeType}</p>
                        <p><strong>Condição de Pagamento:</strong> ${paymentCondition}</p>
                        <p><strong>Parcelas:</strong> ${parcels}</p>
                        <p><strong>Total Pago:</strong> R$ ${totalPayedValue}</p>
                        ${isActive ? ACTIVE_PLAN_MESSAGE : INACTIVE_PLAN_MESSAGE}
                        ${isPendingPayment ? PENDING_PAYMENT_MESSAGE : ''}
                    </div>
                `;
            }).join('');
        } else {
            plansHtml = NO_PLAN_FOUND_MESSAGE;
        }

        const html = `
            ${DIVIDER}
            <div id="panel-content">
                <h4>Planos e Pagamentos</h4>
                ${plansHtml}
            </div>

        `;

        info.innerHTML = html;

    } catch (error) {
        console.error('Erro ao exibir dados de pagamento:', error);
        info.innerHTML = `${DIVIDER}<p style="color:red;">Ocorreu um erro ao carregar as informações de pagamento. Por favor, tente novamente.</p>${DIVIDER}`;
    }
}
