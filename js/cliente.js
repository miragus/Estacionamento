document.getElementById('client-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const clientName = document.getElementById('client-name').value;
    const clientEmail = document.getElementById('client-email').value;
    const clientPhone = document.getElementById('client-phone').value;

    // Verificar se todos os campos foram preenchidos
    if (!clientName || !clientEmail || !clientPhone) {
        showAlert('Por favor, preencha todos os campos.');
        return;
    }

    // Salvando os dados do cliente no localStorage
    let clients = JSON.parse(localStorage.getItem('clients')) || [];
    clients.push({
        name: clientName,
        email: clientEmail,
        phone: clientPhone
    });
    localStorage.setItem('clients', JSON.stringify(clients));

    // Atualizando a tabela de clientes
    updateClientTable();

    // Exibindo alerta de sucesso
    showAlert('Cliente registrado com sucesso!');

    // Limpar os campos do formulário
    document.getElementById('client-form').reset();
});

function updateClientTable() {
    const clientTableBody = document.querySelector('#client-table tbody');
    clientTableBody.innerHTML = '';

    let clients = JSON.parse(localStorage.getItem('clients')) || [];
    clients.forEach((client) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
        `;

        clientTableBody.appendChild(row);
    });
}

// Função para exibir alertas personalizados
function showAlert(message) {
    const alertBox = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');

    alertMessage.textContent = message;
    alertBox.classList.add('show');

    // Fechar alerta após 3 segundos ou ao clicar no botão de fechar
    setTimeout(() => alertBox.classList.remove('show'), 3000);
    document.getElementById('close-alert').onclick = () => alertBox.classList.remove('show');
}

// Carregar a tabela de clientes ao iniciar a página
document.addEventListener('DOMContentLoaded', updateClientTable);
