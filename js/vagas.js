(function () {
    const $ = q => document.querySelector(q);

    async function renderGarage() {
        const garageTable = $('#garage');
        const totalSpots = 12;
        let occupiedSpots = 0;

        // Limpa a tabela
        garageTable.innerHTML = '';

        // Busca os veículos no servidor
        const vehicles = await fetchVehiclesFromServer();

        // Preenche a tabela com os dados dos veículos
        vehicles.forEach((car, index) => {
            occupiedSpots++;
            addCarToGarage(car, garageTable, index + 1);
        });

        // Preenche as vagas restantes como 'Disponível'
        for (let i = occupiedSpots + 1; i <= totalSpots; i++) {
            addCarToGarage(null, garageTable, i);
        }

        // Atualiza as estatísticas
        const availableSpots = totalSpots - occupiedSpots;
        updateStatistics(totalSpots, availableSpots, occupiedSpots);
    }

    async function fetchVehiclesFromServer() {
        try {
            const response = await fetch('http://localhost:3000/api/vehicle');
            if (!response.ok) {
                throw new Error('Erro ao buscar veículos');
            }
            const vehicles = await response.json();
            return vehicles;
        } catch (err) {
            console.error('Erro ao buscar veículos:', err);
            return [];
        }
    }

    function updateStatistics(total, available, occupied) {
        $('#total-spots').textContent = total;
        $('#available-spots').textContent = available;
        $('#occupied-spots').textContent = occupied;
    }

    function addCarToGarage(car, table, vaga) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        if (car) {
            cell.innerHTML = `
                <div class="vaga-ocupada">Vaga ${vaga} Ocupada</div>
                <button class="details-btn">Detalhes</button>
            `;
        } else {
            cell.innerHTML = `
                <div class="vaga-disponivel">Vaga ${vaga} Disponível</div>
            `;
        }

        row.appendChild(cell);
        table.appendChild(row);

        if (car) {
            const detailsBtn = row.querySelector('.details-btn');

            detailsBtn.addEventListener('click', () => {
                showDetailsModal(car);
            });
        }
    }

    function showDetailsModal(car) {
        const modal = $("#details-modal");
        const content = $("#details-content");
        const finishBtn = $("#finish-btn");
        const editBtn = $("#edit-btn");
    
        content.innerHTML = `
            <div class="result-item">
                <p>Entrada: ${car.time}</p>
                <p>Veículo: ${car.name}</p>
                <p>Placa: ${car.licence}</p>
                <p>Ano: ${car.year}</p>
                <p>Tipo: ${car.type}</p>
            </div>
        `;
    
        modal.style.display = "block";
    
        configureModalListeners(modal, finishBtn, editBtn, car);
    }

    function configureModalListeners(modal, finishBtn, editBtn, car) {
        finishBtn.removeEventListener('click', handleFinishClick);
        finishBtn.addEventListener('click', handleFinishClick);
    
        editBtn.removeEventListener('click', handleEditClick);
        editBtn.addEventListener('click', handleEditClick);
    
        function handleFinishClick() {
            const exitTimeInput = $("#exit-time-input");
            const exitTime = exitTimeInput.value;
    
            if (!exitTime) {
                showAlert("Por favor, insira o horário de saída.");
                console.log("insira o horario de saida");
                return;
            }
    
            checkOut(car, exitTime);
            modal.style.display = "none";
        }
    
        function handleEditClick() {
            showEditModal(car);
            modal.style.display = "none";
        }
    
        $(".close-details").removeEventListener('click', handleCloseClick);
        $(".close-details").addEventListener('click', handleCloseClick);

        function handleCloseClick() {
            modal.style.display = "none";
        }
    }

    function showEditModal(car) {
        const modal = $("#edit-modal");
        const nameInput = $("#edit-name");
        const licenceInput = $("#edit-licence");
        const yearInput = $("#edit-year");
        const timeInput = $("#edit-time");
        const typeSelect = $("#edit-type");
    
        // Preenche os campos do formulário com os dados atuais do veículo
        nameInput.value = car.name;
        licenceInput.value = car.licence;
        yearInput.value = car.year;
        timeInput.value = car.time;
        typeSelect.value = car.type;
    
        modal.style.display = "block";
    
        // Ao submeter o formulário de edição
        $("#edit-form").onsubmit = async (e) => {
            e.preventDefault();
    
            // Atualiza os dados do veículo localmente
            car.name = nameInput.value;
            car.licence = licenceInput.value;
            car.year = yearInput.value;
            car.time = timeInput.value;
            car.type = typeSelect.value;
    
            try {
                // Envia a atualização do veículo para o servidor
                const response = await fetch('http://localhost:3000/api/vehicle', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: car.name,
                        licence: car.licence,
                        year: car.year,
                        time: car.time,
                        type: car.type,
                    }),
                });
    
                if (response.ok) {
                    // Atualiza a garagem e fecha o modal se a atualização for bem-sucedida
                    renderGarage();
                    modal.style.display = "none";
                    showAlert("Alterações salvas com sucesso.");
                } else {
                    const errorData = await response.json();
                    showAlert(`Erro ao atualizar veículo: ${errorData.error}`);
                }
            } catch (err) {
                console.error("Erro ao atualizar veículo:", err);
                showAlert("Erro ao atualizar veículo. Tente novamente.");
            }
        };
    }

    function checkOut(car, exitTime) {
        const period = convertPeriod(car.time, exitTime);
        car.exitTime = exitTime;

        // Use o custom alert para mostrar o resultado
        const message = `
            <div class="result-item">
                <p>Veículo: ${car.name}</p>
                <p>Placa: ${car.licence}</p>
                <p>Tipo: ${car.type}</p>
                <p>Ano: ${car.year}</p>
                <p>Entrada: ${car.time}</p>
                <p>Saída: ${car.exitTime}</p>
                <p>Valor: R$ ${period}</p>
            </div>
        `;
        showAlert(message);

        removeCar(car.licence);
        renderGarage();
    }

    function showAlert(message) {
        const alertDiv = $("#custom-alert");
        const alertMessage = $("#alert-message");
        const alertOk = $("#alert-ok");

        alertMessage.innerHTML = message;  // Permitir HTML dentro do alerta
        alertDiv.style.display = "block";

        alertOk.addEventListener("click", () => {
            alertDiv.style.display = "none";
        });
    }

    function removeCar(licence) {
        const garage = getFromLocalStorage('garage');
        const updatedGarage = garage.filter(c => c.licence !== licence);
        saveToLocalStorage('garage', updatedGarage);
    }

    function updateCarInStorage(car) {
        const garage = getFromLocalStorage('garage');
        const index = garage.findIndex(c => c.licence === car.licence);
        if (index !== -1) {
            garage[index] = car;
            saveToLocalStorage('garage', garage);
        }
    }

    function convertPeriod(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diff = end - start;

        const hours = Math.ceil(diff / (1000 * 60 * 60));
        const tarifaPorHora = 10;
        const valorTotal = Math.ceil(hours * tarifaPorHora);

        return valorTotal.toFixed(2);
    }

    window.addEventListener('message', (event) => {
        if (event.data === 'updateGarage') {
            renderGarage();
        }
    });

    function saveToLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function getFromLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    renderGarage();
})();
