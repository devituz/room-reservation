$(document).ready(function () {
    var calendarEl = document.getElementById('kt_calendar_app');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: function (info, successCallback, failureCallback) {
            $.ajax({
                url: 'http://172.24.25.252:8080/api/notifications', // Your API endpoint to get events
                method: 'GET',
                success: function (response) {
                    var events = response.events.map(function (event) {
                        return {
                            title: event.title,
                            start: event.start,
                            end: event.end,
                            description: event.description || 'No description',
                            location: event.location || 'No location',
                            color: event.color,
                            name: event.name,
                            phone_number: event.phone_number,
                            email: event.email,
                        };
                    });
                    successCallback(events);
                },
                error: function () {
                    failureCallback('Failed to load events.');
                }
            });
        },
        eventClick: function (info) {
            const modal = new bootstrap.Modal(document.getElementById('kt_modal_view_event'));
            modal.show();

            document.querySelector('[data-kt-calendar="event_name"]').textContent = info.event.title;
            document.querySelector('[data-kt-calendar="event_description"]').textContent = info.event.extendedProps.description || 'No description';
            document.querySelector('[data-kt-calendar="event_location"]').textContent = info.event.extendedProps.location || 'No location';
            document.querySelector('[data-kt-calendar="event_start_date"]').textContent = formatDate(info.event.start);
            document.querySelector('[data-kt-calendar="event_end_date"]').textContent = info.event.end
                ? formatDate(info.event.end)
                : 'Not specified';
            document.querySelector('[data-kt-calendar="all_day"]').textContent = info.event.allDay ? 'All Day' : '';
            document.querySelector('[data-kt-calendar="fullname"]').textContent = info.event.extendedProps.name || 'No name provided';
            document.querySelector('[data-kt-calendar="phone_number"]').textContent = info.event.extendedProps.phone_number || 'No phone number provided';
            document.querySelector('[data-kt-calendar="email"]').textContent = info.event.extendedProps.email || 'No email provided';
        },
        dateClick: function (info) {
            console.log('Clicked date:', info.dateStr);

            const modal = new bootstrap.Modal(document.getElementById('kt_modal_create_event'));
            modal.show();

            $('#event-date').val(info.dateStr);

            $.ajax({
                url: '/notifications-by-date',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    _token: $('meta[name="csrf-token"]').attr('content'),
                    date: info.dateStr,
                }),
                success: function (data) {
                    buildingData = data;
                    populateBuildings();
                },
                error: function (xhr, status, error) {
                    console.error('AJAX request failed:', error);
                }
            });
        }
    });

    calendar.render();

    function formatDate(date) {
        return new Intl.DateTimeFormat('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Tashkent'
        }).format(date);
    }

    $('.datetimepicker').datepicker({
        timepicker: true,
        language: 'en',
        range: true,
        multipleDates: true,
        multipleDatesSeparator: " - "
    });

    $("#add-event").submit(function (e) {
        e.preventDefault();

        var title = $('#event-title').val();
        var date = $('#event-date').val();

        calendar.addEvent({
            title: title,
            start: date,
            allDay: false,
        });

        $('#kt_modal_create_event').modal('hide');
        $('#add-event')[0].reset();
    });
});

// Global variable for building data
let buildingData = [];

// Function to populate the building dropdown
function populateBuildings() {
    const buildingSelect = document.getElementById("building-select");
    buildingSelect.innerHTML = '';

    buildingData.forEach(building => {
        const option = document.createElement("option");
        option.value = building.id;
        option.textContent = building.name;
        buildingSelect.appendChild(option);
    });

    if (buildingData.length > 0) {
        updateRoomTable(buildingData[0].id);
    }
}

// Function to update the room table
function updateRoomTable(buildingId) {
    const building = buildingData.find(b => b.id === parseInt(buildingId));
    const rooms = building ? building.rooms : [];
    const tableBody = document.querySelector("#room-table tbody");
    tableBody.innerHTML = '';

    rooms.forEach(room => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="room-cell">Select</td>
            <td>${room.room}</td>
            <td>${room.available}</td>
            <td>${room.unavailable}</td>
        `;
        row.querySelector(".room-cell").addEventListener("click", function () {
            openModal(building, room);
        });
        tableBody.appendChild(row);
    });
}

// Function to open the modal with room details
function openModal(building, room) {
    const modal = new bootstrap.Modal(document.getElementById('modal-view-event-final'));
    document.querySelector('#modal-building-name').value = building.name;
    document.querySelector('#modal-room-number').value = room.room;
    modal.show();
}

// Event listener for building selection change
document.getElementById("building-select").addEventListener("change", function () {
    const selectedBuilding = this.value;
    updateRoomTable(selectedBuilding);
});

// Populate buildings on page load
window.onload = populateBuildings;
