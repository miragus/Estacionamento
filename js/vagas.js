(function () {
    const $ = q => document.querySelector(q);

    function renderGarage() {
        const garage = getFromLocalStorage('garage');
        const garageTable = $('#garage');
        const totalSpots = 12;
        let occupiedSpots = 0;

        garageTable.innerHTML = '';

        let vaga = 1;

        garage.forEach(c => {
            addCarToGarage(c, garageTable, vaga);
            vaga++;
            occupiedSpots++;
        });

        for (let i = vaga; i <= totalSpots; i++) {
            addCarToGarage(null, garageTable, i);
        }

        // Atualizar as estatísticas
        updateStatistics(totalSpots, totalSpots - occupiedSpots, occupiedSpots);
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

        nameInput.value = car.name;
        licenceInput.value = car.licence;
        yearInput.value = car.year;
        timeInput.value = car.time;
        typeSelect.value = car.type;

        modal.style.display = "block";

        $("#edit-form").onsubmit = (e) => {
            e.preventDefault();
            car.name = nameInput.value;
            car.licence = licenceInput.value;
            car.year = yearInput.value;
            car.time = timeInput.value;
            car.type = typeSelect.value;

            updateCarInStorage(car);
            renderGarage();
            modal.style.display = "none";
            showAlert("Alterações salvas com sucesso.");
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
