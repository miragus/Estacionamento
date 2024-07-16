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
            const emptyCar = { name: '', licence: '', time: '' };
            addCarToGarage(emptyCar, garageTable, i);
        }
    }

    function addCarToGarage(car, table, vaga) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${vaga}</td>
            <td>${car.name}</td>
            <td>${car.licence}</td>
            <td>${car.time}</td>
            <td><input type="time" class="exit-time" data-licence="${car.licence}"></td>
            <td>
                <button class="delete">X</button>
            </td>
        `;
        table.appendChild(row);

        // Adiciona o evento de clique no botão de delete
        row.querySelector('.delete').addEventListener('click', () => {
            const carInfo = {
                name: car.name,
                licence: car.licence,
                time: car.time
            };
            checkOut(carInfo);
        });
    }

    function showResult(info, period) {
        const resultDiv = $("#result");
        resultDiv.innerHTML = `
            <p>Veículo: ${info.name}</p>
            <p>Placa: ${info.licence}</p>
            <p>Horário de Entrada: ${info.time}</p>
            <p>Horário de Saída: ${info.exitTime}</p>
            <p>Tarifa: R$${period}</p>
        `;
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

        showResult(info, period);

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
        const timeInput = $("#time").value;

        if (!name || !licence || !timeInput) {
            showAlert("Os campos são obrigatórios.");
            return;
        }

        const garage = getGarage();

        // Verifica se todas as vagas estão preenchidas
        if (garage.length >= 10) {
            showAlert("Todas as vagas estão preenchidas.");
            return;
        }

        const car = { name, licence, time: timeInput };

        garage.push(car);

        saveToLocalStorage('garage', JSON.stringify(garage));

        renderGarage();

        $("#name").value = "";
        $("#licence").value = "";
        $("#time").value = "";
    });

})();
