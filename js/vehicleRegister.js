(function () {
    const $ = q => document.querySelector(q);
    const limiteVagas = 12; //limite de vagas

    function showAlert(message) {
        const alertDiv = $("#custom-alert");
        const alertMessage = $("#alert-message");
        const alertOk = $("#alert-ok");

        alertMessage.textContent = message;
        alertDiv.style.display = "block";

        alertOk.addEventListener("click", () => {
            alertDiv.style.display = "none";
        }, { once: true });
    }

    function saveToLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function getFromLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    async function saveVehicleToServer(vehicle) {
        try {
            const response = await fetch('http://localhost:3000/api/vehicle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vehicle)
            });
            if (!response.ok) {
                throw new Error('Erro ao salvar veículo no servidor');
            }
            const data = await response.json();
            console.log('Veículo salvo:', data);
        } catch (error) {
            console.error('Erro na solicitação:', error);
            showAlert('Erro ao salvar veículo no servidor.');
        }
    }

    $("#add").addEventListener("click", async () => {
        const garage = getFromLocalStorage('garage');
    
        // Verifica se o número de veículos já atingiu o limite máximo
        if (garage.length >= limiteVagas) {
            showAlert("O limite de vagas foi atingido. Não é possível adicionar mais veículos.");
            return; // Sai da função antes de adicionar o veículo
        }
    
        const name = $("#name").value;
        const licence = $("#licence").value;
        const year = $("#year").value;
        const time = $("#time").value;
        const type = $("#vehicle-type").value;
    
        if (!name || !licence || !type || !time) {
            showAlert("Todos os campos são obrigatórios.");
            return;
        }
    
        const vehicle = { name, licence, year, time, type };
        garage.push(vehicle);
        saveToLocalStorage('garage', garage);
        addVehicleToResult(vehicle);
        await saveVehicleToServer(vehicle);
    
        // Limpar os campos após adicionar o veículo
        $("#name").value = "";
        $("#licence").value = "";
        $("#year").value = "";
        $("#time").value = "";
        $("#vehicle-type").value = "";
    
        showAlert("Veículo adicionado com sucesso!");
    
        // Adiciona o link abaixo da tabela
        addVisualizarLink();
        // Atualiza as estatísticas
        calculateAndUpdateStatistics();
    });
    


    function updateStatistics(total, available, occupied) {
        $('#total-spots').textContent = total;
        $('#available-spots').textContent = available;
        $('#occupied-spots').textContent = occupied;
    }

    function calculateAndUpdateStatistics() {
        const totalSpots = limiteVagas; // Exemplo de total de vagas, ajuste conforme necessário
        const garage = getFromLocalStorage('garage');
        const occupiedSpots = garage.length;
        const availableSpots = totalSpots - occupiedSpots;
    
        updateStatistics(totalSpots, availableSpots, occupiedSpots);
    }
        

    

    function addVehicleToResult(vehicle) {
        const tableBody = $("#vehicle-table tbody");

        tableBody.innerHTML = "";

        // cria uma nova row para os dados do veiculo
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${vehicle.time}</td>
            <td>${vehicle.name}</td>
            <td>${vehicle.licence}</td>
            <td>${vehicle.year}</td>
            <td>${vehicle.type}</td>
        `;

        // add uma nova row na tabela
        tableBody.appendChild(row);

        // adciciona botao de edit
        const editRow = document.createElement("tr");
        const editCell = document.createElement("td");
        editCell.colSpan = 5;
        editCell.innerHTML = `<button class="edit-vehicle">Editar</button>`;
        editRow.appendChild(editCell);
        tableBody.appendChild(editRow);

        // evento do botao de edit
        editRow.querySelector(".edit-vehicle").addEventListener("click", () => {
            showEditModal(vehicle, row);
        });
    }

    function addVisualizarLink() {
        if (!document.querySelector(".visualizar-veiculos-link")) {
            const visualizarLink = document.createElement("a");
            visualizarLink.href = "vagas.html";
            visualizarLink.className = "visualizar-veiculos-link";
            visualizarLink.textContent = "Visualizar veículos";
            const resultado = document.querySelector("#vehicleResult");
        
            if (resultado) {
                resultado.appendChild(visualizarLink);
            } else {
                console.error("Elemento com o ID 'vehicleResult' não foi encontrado.");
            }
        }
    }

    function showEditModal(vehicle, row) {
        const modal = $("#edit-modal");
        const nameInput = $("#edit-name");
        const licenceInput = $("#edit-licence");
        const yearInput = $("#edit-year");
        const timeInput = $("#edit-time");
        const typeSelect = $("#edit-type");

        nameInput.value = vehicle.name;
        licenceInput.value = vehicle.licence;
        yearInput.value = vehicle.year;
        timeInput.value = vehicle.time;
        typeSelect.value = vehicle.type;

        modal.style.display = "block";

        $("#edit-form").onsubmit = (e) => {
            e.preventDefault();
            vehicle.name = nameInput.value;
            vehicle.licence = licenceInput.value;
            vehicle.year = yearInput.value;
            vehicle.time = timeInput.value;
            vehicle.type = typeSelect.value;

            updateVehicle(vehicle, row);
            modal.style.display = "none";
        };
    }

    function updateVehicle(vehicle, row) {
        row.innerHTML = `
            <td>${vehicle.time}</td>
            <td>${vehicle.name}</td>
            <td>${vehicle.licence}</td>
            <td>${vehicle.year}</td>
            <td>${vehicle.type}</td>
        `;

        const garage = getFromLocalStorage('garage');
        const index = garage.findIndex(v => v.licence === vehicle.licence);
        if (index !== -1) {
            garage[index] = vehicle;
            saveToLocalStorage('garage', garage);
        }

        showAlert("Veículo atualizado com sucesso!");

        // força a atualizar as vagas na pagina de html
        if (window.opener) {
            window.opener.postMessage('updateGarage', '*');
        }
        calculateAndUpdateStatistics();
    }

    // inicializa uma tabela vazia
    window.onload = () => {
        $("#vehicle-table tbody").innerHTML = "";
        calculateAndUpdateStatistics();
    };
})();
