import * as utils from './utils.js';
import * as main from './main.js';

export function resetPassword() {
    const message = "São necessário dados do chatwoot para enviar mensagens";
    utils.sendMessage(message)
}