# Sistema de Gerenciamento de Sócios Torcedores

Este projeto é um sistema web para consulta, cadastro e atualização de dados de sócios torcedores, além de funcionalidades para checagem de pagamentos e comunicação. Para completa usabilidade, precisa ser acessado dentro da página do Chatwoot.

## Funcionalidades

O sistema oferece as seguintes funcionalidades principais:

-   **Consulta de Sócios:**
    * Pesquisa de sócios por CPF, e-mail ou telefone.
     - Para cada campo preenchido é realizada uma pesquisa. Se for encontrado um único torcedor, os dados resultantes são exibidos. Caso contrário
    * Exibição de informações detalhadas do sócio, incluindo nome, CPF, e-mail, telefone, status de torcedor, tipo e descrição do plano.
    * Indicação visual se o sócio foi encontrado ou não para cada campo de busca.
    * Verificação da consistência dos dados retornados para múltiplas buscas.
    * Possibilidade de autofill de dados de busca através de informações recebidas do Chatwoot.
-   **Cadastro de Novos Sócios:**
    * Formulário para registro de novos sócios com campos para nome completo, CPF, e-mail e telefone.
    * Opção para limpar todos os campos do formulário.
    * Integração com backend para persistência dos dados.
    * Envio de mensagem de confirmação de dados ao sócio.
-   **Atualização de Dados Cadastrais:**
    * Formulário pré-preenchido com os dados do sócio para edição.
    * Campos para atualização de nome, CPF, e-mail, telefone, gênero, data de nascimento e informações de endereço (CEP, estado, cidade, bairro, rua, número, complemento).
    * Preenchimento automático de campos de endereço a partir do CEP (integração com ViaCEP).
    * Envio de mensagem de confirmação dos dados atualizados ao sócio.
-   **Verificação de Status de Pagamento:**
    * Exibição de detalhes dos planos de afiliação do sócio, incluindo status, datas, forma de pagamento e valores pagos.
    * Indicação visual de planos ativos, inativos ou com pagamento pendente.
-   **Reset de Senha:**
    * Funcionalidade para iniciar o processo de reset de senha do sócio.
-   **Integração com Chatwoot:**
    * Recebimento de dados de contato do Chatwoot para preenchimento automático nos campos de busca e registro.
    * Envio de mensagens de confirmação de dados para o Chatwoot.
-   **Notificações:**
    * Sistema de notificação visual para informar o usuário sobre o status das operações (sucesso, erro, aviso, informação).
-   **Design Responsivo:**
    * Interface adaptável para diferentes tamanhos de tela.

## Estrutura do Projeto

O projeto é organizado nos seguintes arquivos JavaScript:

-   `main.js`: Lógica principal do sistema, manipulação de eventos de botões e coordenação entre os módulos.
-   `checkFan.js`: Funções relacionadas à busca e verificação de dados de sócios.
-   `registerFan.js`: Funções para o processo de cadastro de novos sócios.
-   `collectData.js`: Funções para preenchimento e atualização de dados cadastrais, incluindo integração com a API ViaCEP.
-   `checkPayment.js`: Funções para verificar e exibir o status de pagamento dos sócios.
-   `resetPassword.js`: Lógica para o reset de senha.
-   `meta.js`: Função para enviar um template para a API Meta.
-   `utils.js`: Funções utilitárias como formatação de CPF e telefone, validação de JSON, controle de exibição de telas e notificações.
-   `index.html`: Estrutura da página web.
-   `index.css`: Estilos para a interface do usuário.

## Como Executar

Para executar este projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    ```
2.  **Navegue até o diretório do projeto:**
    ```bash
    cd <nome_do_diretorio>
    ```
3.  **Abra o arquivo `index.html` em seu navegador.**

    * Alternativamente, você pode usar uma extensão de "Live Server" em seu editor de código (como o VS Code) para ter um ambiente de desenvolvimento com recarregamento automático.

**Observação:** Este projeto interage com um backend através da URL definida em `main.js` (`getHost()`). Para que todas as funcionalidades (busca, registro, atualização, pagamento, meta) funcionem corretamente, o backend correspondente precisa estar em execução e acessível. A URL atual (`https://9334-2804-14d-5c5b-82f8-aa47-b887-8c1d-b8aa.ngrok-free.app`) é um exemplo e provavelmente precisará ser atualizada para seu ambiente de teste ou produção.

## Dependências

-   Font Awesome (para ícones)
-   API ViaCEP (para preenchimento automático de endereço)

## Desenvolvimento

-   **HTML, CSS e JavaScript Puro:** O projeto foi desenvolvido utilizando tecnologias web padrão, sem o uso de frameworks complexos.
-   **Modularização:** O código JavaScript é modularizado para facilitar a manutenção e a compreensão.
-   **Interação com Backend:** Todas as operações que envolvem persistência ou consulta de dados são feitas através de requisições `fetch` para um serviço de backend.
-   **Tratamento de Erros:** As requisições ao backend incluem tratamento básico de erros para fornecer feedback ao usuário.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.