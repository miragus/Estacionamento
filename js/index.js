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
        localStorage.setItem(key, JSON.stringify(value));
    }

    function getFromLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
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
        const garage = getFromLocalStorage('garage');
        garage.push(vehicle);
        saveToLocalStorage('garage', garage);
        addVehicleToResult(vehicle);

        // Limpar os campos após adicionar o veículo
        $("#name").value = "";
        $("#licence").value = "";
        $("#year").value = "";
        $("#time").value = "";
        $("#vehicle-type").value = "";

        showAlert("Veículo adicionado com sucesso!");

        // Adiciona o link abaixo da tabela
        addVisualizarLink();
    });

    function addVehicleToResult(vehicle) {
        const tableBody = $("#vehicle-table tbody");

        // Create a new row for the vehicle data
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${vehicle.time}</td>
            <td>${vehicle.name}</td>
            <td>${vehicle.licence}</td>
            <td>${vehicle.year}</td>
            <td>${vehicle.type}</td>
        `;

        // Add the new row to the table
        tableBody.appendChild(row);

        // Add edit button
        const editRow = document.createElement("tr");
        const editCell = document.createElement("td");
        editCell.colSpan = 5;
        editCell.innerHTML = `<button class="edit-vehicle">Editar</button>`;
        editRow.appendChild(editCell);
        tableBody.appendChild(editRow);

        // Edit button click event
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

            document.body.appendChild(visualizarLink); // Append to the body
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

        // Trigger update on the vagas.html page
        if (window.opener) {
            window.opener.postMessage('updateGarage', '*');
        }
    }

    // Initialize with empty table
    window.onload = () => {
        $("#vehicle-table tbody").innerHTML = "";
    };
})();
