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

    function convertPeriod(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diff = end - start;

        // Calcula o tempo em horas, arredondando para cima
        const hours = Math.ceil(diff / (1000 * 60 * 60));

        // Tarifa fixa por hora
        const tarifaPorHora = 10; // R$10,00 por hora

        // Calcula o valor total arredondando para duas casas decimais
        const valorTotal = Math.ceil(hours * tarifaPorHora).toFixed(2);

        return valorTotal;
    }

    function renderGarage() {
        const garage = getGarage();
        const garageTable = $('#garage');

        // Limpa o conteúdo da tabela antes de renderizar
        garageTable.innerHTML = '';

        // Número inicial da vaga
        let vaga = 1;

        garage.forEach(c => {
            addCarToGarage(c, garageTable, vaga);
            vaga++;
        });

        // Preencher vagas disponíveis até 10
        for (let i = vaga; i <= 10; i++) {
            addCarToGarage(null, garageTable, i);
        }
    }

    function addCarToGarage(car, table, vaga) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        if (car) {
            cell.innerHTML = `
                <div class="vaga-ocupada">Vaga Ocupada</div>
                <input type="time" class="exit-time" data-licence="${car.licence}">
                <button class="details-btn">Detalhes</button>
                <button class="edit">Editar</button>
                <button class="delete">X</button>
            `;
        } else {
            cell.innerHTML = `
                <div class="vaga-disponivel">Vaga Disponível</div>
            `;
        }

        row.appendChild(cell);
        table.appendChild(row);

        if (car) {
            const detailsBtn = row.querySelector('.details-btn');
            let detailsRow;

            // Adiciona o evento de clique no botão de detalhes
            detailsBtn.addEventListener('click', () => {
                if (detailsRow) {
                    // Remove a linha de detalhes se já existir
                    detailsRow.remove();
                    detailsRow = null;
                } else {
                    // Adiciona a linha de detalhes
                    detailsRow = document.createElement("tr");
                    detailsRow.innerHTML = `
                        <td colspan="1" class="details-row">
                            <div class="result-item">
                                <p>Veículo: ${car.name}</p>
                                <p>Placa: ${car.licence}</p>
                                <p>Tipo: ${car.type}</p>
                                <p>Entrada: ${car.time}</p>
                            </div>
                        </td>
                    `;
                    row.after(detailsRow);
                }
            });

            // Adiciona o evento de clique no botão de delete
            row.querySelector('.delete').addEventListener('click', () => {
                const carInfo = {
                    name: car.name,
                    licence: car.licence,
                    type: car.type,
                    time: car.time
                };
                checkOut(carInfo);
            });

            // Adiciona o evento de clique no botão de editar
            row.querySelector('.edit').addEventListener('click', () => {
                editCar(car);
            });
        }
    }

    

    function checkOut(info) {
        const exitTimeInput = $(`.exit-time[data-licence="${info.licence}"]`);
        const exitTime = exitTimeInput.value;

        if (!exitTime) {
            showAlert("Por favor, insira o horário de saída.");
            return;
        }

        const period = convertPeriod(info.time, exitTime);
        info.exitTime = exitTime;

        const resultDiv = $("#result");
        resultDiv.innerHTML = `
            <div class="result-item">
                <p>Veículo: ${info.name}</p>
                <p>Placa: ${info.licence}</p>
                <p>Tipo: ${info.type}</p>
                <p>Entrada: ${info.time}</p>
                <p>Saída: ${info.exitTime}</p>
                <p>Tarifa: R$${period}</p>
            </div>
        `;

        const garage = getGarage().filter(c => c.licence !== info.licence);
        saveToLocalStorage('garage', JSON.stringify(garage));

        renderGarage();
    }

    function editCar(info) {
        $("#name").value = info.name;
        $("#licence").value = info.licence;
        $("#vehicle-type").value = info.type;
        $("#time").value = info.time;

        // Remove o carro original da garagem
        const garage = getGarage().filter(c => c.licence !== info.licence);
        saveToLocalStorage('garage', JSON.stringify(garage));

        renderGarage();
    }

    function getGarage() {
        const garage = JSON.parse(localStorage.getItem('garage')) || [];
        return garage;
    }

    function saveToLocalStorage(key, value) {
        localStorage.setItem(key, value);
    }

    renderGarage();

    $("#send").addEventListener("click", () => {
        const name = $("#name").value;
        const licence = $("#licence").value;
        const type = $("#vehicle-type").value;
        const timeInput = $("#time").value;

        if (!name || !licence || !type || !timeInput) {
            showAlert("Todos os campos são obrigatórios.");
            return;
        }

        const garage = getGarage();

        // Verifica se todas as vagas estão preenchidas
        if (garage.length >= 10) {
            showAlert("Todas as vagas estão preenchidas.");
            return;
        }

        const car = { name, licence, type, time: timeInput };

        garage.push(car);

        saveToLocalStorage('garage', JSON.stringify(garage));

        renderGarage();

        $("#name").value = "";
        $("#licence").value = "";
        $("#vehicle-type").value = "";
        $("#time").value = "";
    });

})();
