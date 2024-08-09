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

    function saveToLocalStorage(key, value) {
        localStorage.setItem(key, value);
    }

    function showEditModal(vehicle) {
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

            updateVehicle(vehicle);
            modal.style.display = "none";
        };
    }

    function updateVehicle(vehicle) {
        let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
        vehicles = vehicles.map(v => v.licence === vehicle.licence ? vehicle : v);
        saveToLocalStorage('vehicles', JSON.stringify(vehicles));
        showAlert("Veículo atualizado com sucesso!");

        // Atualizar o resultado
        $("#result").innerHTML = `
            <div class="result-item">
                <p>Veículo: ${vehicle.name}</p>
                <p>Placa: ${vehicle.licence}</p>
                <p>Tipo: ${vehicle.type}</p>
                <p>Entrada: ${vehicle.time}</p>
                <p>Ano: ${vehicle.year}</p>
            </div>
        `;
    }

    $("#add").addEventListener("click", () => {
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
        const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
        vehicles.push(vehicle);

        saveToLocalStorage('vehicles', JSON.stringify(vehicles));
        addVehicleToResult(vehicle);

        // Enviar veículo para vagas
        const garage = JSON.parse(localStorage.getItem('garage')) || [];
        garage.push(vehicle);
        localStorage.setItem('garage', JSON.stringify(garage));

        // Limpar os campos após adicionar o veículo
        $("#name").value = "";
        $("#licence").value = "";
        $("#year").value = "";
        $("#time").value = "";
        $("#vehicle-type").value = "";

        showAlert("Veículo adicionado com sucesso!");
    });

    function addVehicleToResult(vehicle) {
        const resultDiv = $("#result");
        const resultItem = document.createElement("div");
        resultItem.className = "result-item";
        resultItem.innerHTML = `
            <p>Veículo: <span>${vehicle.name}</span></p>
            <p>Placa: <span>${vehicle.licence}</span></p>
            <p>Tipo: <span>${vehicle.type}</span></p>
            <p>Entrada: <span>${vehicle.time}</span></p>
            <p>Ano: <span>${vehicle.year}</span></p>
            <button class="edit-vehicle">Editar</button>
        `;
        resultDiv.appendChild(resultItem);

        resultItem.querySelector(".edit-vehicle").addEventListener("click", () => {
            showEditModal(vehicle);
        });
    }
})();
