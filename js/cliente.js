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
    clients.forEach((client, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td class="action-buttons">
                <button class="edit" onclick="editClient(${index})">Editar</button>
                <button class="delete" onclick="deleteClient(${index})">Deletar</button>
            </td>
        `;

        clientTableBody.appendChild(row);
    });
}

function deleteClient(index) {
    let clients = JSON.parse(localStorage.getItem('clients')) || [];
    clients.splice(index, 1);
    localStorage.setItem('clients', JSON.stringify(clients));
    updateClientTable();
    showAlert('Cliente deletado com sucesso!');
}

function editClient(index) {
    let clients = JSON.parse(localStorage.getItem('clients')) || [];
    const client = clients[index];

    // Preencher o formulário com os dados do cliente selecionado
    document.getElementById('client-name').value = client.name;
    document.getElementById('client-email').value = client.email;
    document.getElementById('client-phone').value = client.phone;

    // Atualizar o botão de submit para funcionar como "Atualizar"
    const form = document.getElementById('client-form');
    form.removeEventListener('submit', handleFormSubmit);
    form.addEventListener('submit', function updateClient(event) {
        event.preventDefault();
        
        const updatedName = document.getElementById('client-name').value;
        const updatedEmail = document.getElementById('client-email').value;
        const updatedPhone = document.getElementById('client-phone').value;

        clients[index] = {
            name: updatedName,
            email: updatedEmail,
            phone: updatedPhone
        };
        localStorage.setItem('clients', JSON.stringify(clients));
        updateClientTable();

        showAlert('Cliente atualizado com sucesso!');
        
        // Resetar formulário e adicionar o listener original
        form.reset();
        form.removeEventListener('submit', updateClient);
        form.addEventListener('submit', handleFormSubmit);
    });
}

function handleFormSubmit(event) {
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
