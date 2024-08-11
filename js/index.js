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
        addVehicleToResult(vehicle);

        // Limpar os campos após adicionar o veículo
        $("#name").value = "";
        $("#licence").value = "";
        $("#year").value = "";
        $("#time").value = "";
        $("#vehicle-type").value = "";

        showAlert("Veículo adicionado com sucesso!");
    });

    function addVehicleToResult(vehicle) {
        const tableBody = $("#vehicle-table tbody");
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${vehicle.name}</td>
            <td>${vehicle.licence}</td>
            <td>${vehicle.type}</td>
            <td>${vehicle.time}</td>
            <td>${vehicle.year}</td>
            <td><button class="edit-vehicle">Editar</button></td>
        `;
        
        tableBody.appendChild(row);

        row.querySelector(".edit-vehicle").addEventListener("click", () => {
            showEditModal(vehicle);
        });
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
        const tableBody = $("#vehicle-table tbody");
        const rows = tableBody.querySelectorAll("tr");

        rows.forEach(row => {
            if (row.cells[1].textContent === vehicle.licence) {
                row.cells[0].textContent = vehicle.name;
                row.cells[2].textContent = vehicle.type;
                row.cells[3].textContent = vehicle.time;
                row.cells[4].textContent = vehicle.year;
            }
        });

        showAlert("Veículo atualizado com sucesso!");
    }

    // Limpa a tabela ao recarregar a página
    window.onload = () => {
        $("#vehicle-table tbody").innerHTML = "";
    };
})();
