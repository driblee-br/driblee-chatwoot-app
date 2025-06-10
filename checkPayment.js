import * as main from './main.js';

export async function checkPayment() {
    const url = `${main.getHost()}/checkpayment/`;

    const payload = {
        guid: "generico"
    };
    try {
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
        const data = await response.json();

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errorMessage || `Erro HTTP: ${response.status}`);
        }
        showPaymentAtributes(data)
        return data;
    } catch { return }
}
function showPaymentAtributes(data) {
    const info = document.getElementById('finances');
    const user = data.resultObject;

    const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'Não informado';
    const divider = '<hr style="border: none; height: 1px; background: #ccc; margin: 1em 0;">';

    let plansHtml = '';

    if (user.affiliationPlans && user.affiliationPlans.length > 0) {
        plansHtml = user.affiliationPlans.map(plan => {
            const isActive = plan.affiliationPlanStatus === "Active";
            const isPendingPayment = plan.payModeType === "None";
            const planData = plan.plan || {};
            const status = plan.affiliationPlanStatusView || plan.affiliationPlanStatus;

            return `
                ${divider}
                <div class="plan-card">
                    <h4>${planData.description || 'Plano sem descrição'} (${planData.planType || 'Tipo desconhecido'})</h4>
                    <p><strong>Status:</strong> ${status}</p>
                    <p><strong>Data de Afiliação:</strong> ${formatDate(plan.affiliationDate)}</p>
                    <p><strong>Validade até:</strong> ${formatDate(plan.expireDate)}</p>
                    <p><strong>Forma de Pagamento:</strong> ${plan.payModeTypeView || 'Não informado'}</p>
                    <p><strong>Condição de Pagamento:</strong> ${plan.paymentCondition || 'Não informado'}</p>
                    <p><strong>Parcelas:</strong> ${plan.parcels || 0}</p>
                    <p><strong>Total Pago:</strong> R$ ${plan.totalPayedValue?.toFixed(2) || '0,00'}</p>
                    ${isActive ? '<p style="color:green;">✔ Plano Ativo</p>' : '<p style="color:red;">✖ Plano Inativo</p>'}
                    ${isPendingPayment ? '<p style="color:orange;">⚠ Pagamento Pendente</p>' : ''}
                </div>
                ${divider}
            `;
        }).join('');
    } else {
        plansHtml = `${divider}<p>Nenhum plano afiliado encontrado.</p>${divider}`;
    }

    const html = `
        ${divider}
        <div id="panel-content">
        <h4>Planos e Pagamentos</h4>
        ${plansHtml}
        <h4>Histórico de Pagamento</h4>
        <p>(Inserir detalhes do histórico aqui futuramente)</p>
        </div>
        ${divider}
    `;

    info.innerHTML = html;
}
