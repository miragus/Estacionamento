(function () {
    const $ = q => document.querySelector(q);

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

    function renderGarage() {
        const garage = getGarage();
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
                <input type="time" class="exit-time" data-licence="${car.licence}">
                <button class="details-btn">Detalhes</button>
                <button class="edit">Editar</button>
                <button class="delete">X</button>
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
                            <div class="result-item">
                                <p>Veículo: ${car.name}</p>
                                <p>Placa: ${car.licence}</p>
                                <p>Ano: ${car.year}</p>
                                <p>Tipo: ${car.type}</p>
                                <p>Entrada: ${car.time}</p>
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
                editCar(car);
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

    function editCar(car) {
        const name = prompt("Editar Nome do Veículo:", car.name);
        const licence = prompt("Editar Placa do Veículo:", car.licence);
        const type = prompt("Editar Tipo do Veículo:", car.type);

        if (name && licence && type) {
            car.name = name;
            car.licence = licence;
            car.type = type;
            updateCar(car);
        }
    }

    function convertPeriod(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diff = end - start;

        const hours = Math.ceil(diff / (1000 * 60 * 60));
        const tarifaPorHora = 10;
        const valorTotal = Math.ceil(hours * tarifaPorHora).toFixed(2);

        return valorTotal;
    }

    function getGarage() {
        return localStorage.garage ? JSON.parse(localStorage.garage) : [];
    }

    function saveGarage(garage) {
        localStorage.garage = JSON.stringify(garage);
    }

    function removeCar(licence) {
        let garage = getGarage();
        garage = garage.filter(car => car.licence !== licence);
        saveGarage(garage);
    }

    function updateCar(car) {
        let garage = getGarage();
        const index = garage.findIndex(c => c.licence === car.licence);
        if (index !== -1) {
            garage[index] = car;
            saveGarage(garage);
            renderGarage();
        }
    }

    renderGarage();
})();
