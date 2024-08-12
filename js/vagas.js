(function () {
    const $ = q => document.querySelector(q);

    function renderGarage() {
        const garage = getFromLocalStorage('garage');
        const garageTable = $('#garage');
        garageTable.innerHTML = '';

        let vaga = 1;

        garage.forEach(c => {
            addCarToGarage(c, garageTable, vaga);
            vaga++;
        });

        for (let i = vaga; i <= 10; i++) {
            addCarToGarage(null, garageTable, i);
        }
    }

    function addCarToGarage(car, table, vaga) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        if (car) {
            cell.innerHTML = `
                <div class="vaga-ocupada">Vaga ${vaga} - Ocupada</div>
                <p class ="saida">Insira o horário de saída abaixo:</p>
                <input type="time" class="exit-time" required data-licence="${car.licence}">
                <div class="botoes">
                    <button class="details-btn">Detalhes</button>
                    <button class="edit">Editar</button>
                    <button class="delete">X</button>
                </div>
            `;
        } else {
            cell.innerHTML = `
                <div class="vaga-disponivel">Vaga ${vaga} - Disponível</div>
            `;
        }

        row.appendChild(cell);
        table.appendChild(row);

        if (car) {
            const detailsBtn = row.querySelector('.details-btn');
            let detailsRow;

            detailsBtn.addEventListener('click', () => {
                if (detailsRow) {
                    detailsRow.remove();
                    detailsRow = null;
                } else {
                    detailsRow = document.createElement("tr");
                    detailsRow.innerHTML = `
                        <td colspan="1" class="details-row">
                            <div class="result-item">Informações do veículo:
                                <p>Entrada: ${car.time}</p>
                                <p>Veículo: ${car.name}</p>
                                <p>Placa: ${car.licence}</p>
                                <p>Ano: ${car.year}</p>
                                <p>Tipo: ${car.type}</p>
                            </div>
                        </td>
                    `;
                    row.after(detailsRow);
                }
            });

            row.querySelector('.delete').addEventListener('click', () => {
                checkOut(car);
            });

            row.querySelector('.edit').addEventListener('click', () => {
                showEditModal(car);
            });
        }
    }

    function checkOut(car) {
        const exitTimeInput = $(`.exit-time[data-licence="${car.licence}"]`);
        const exitTime = exitTimeInput.value;

        if (!exitTime) {
            showAlert("Por favor, insira o horário de saída.");
            return;
        }

        const period = convertPeriod(car.time, exitTime);
        car.exitTime = exitTime;

        const resultDiv = $("#result");
        resultDiv.innerHTML = `
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

        removeCar(car.licence);
        renderGarage();
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

    function removeCar(licence) {
        const garage = getFromLocalStorage('garage');
        const updatedGarage = garage.filter(c => c.licence !== licence);
        saveToLocalStorage('garage', updatedGarage);
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
        };
    }

    function updateCarInStorage(car) {
        const garage = getFromLocalStorage('garage');
        const index = garage.findIndex(c => c.licence === car.licence);
        if (index !== -1) {
            garage[index] = car;
            saveToLocalStorage('garage', garage);
        }
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
